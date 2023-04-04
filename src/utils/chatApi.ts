import { sse } from "./sse";

export type UserRole = "user" | "assistant" | "system";
export type Message = {
  role: UserRole;
  content: string;
};
export const models = ["gpt-3.5-turbo", "gpt-3.5-turbo-0301", "gpt-4"] as const;
export type GPTModel = (typeof models)[number];
export type GPTResponse = {
  choices: {
    delta: Message;
    finish_reason: string;
  }[];
};
export const askGPT = (
  messages: Message[],
  chatConfig: {
    model: GPTModel;
    temperature: number;
    apiKey: string;
  },
  fetchConfig: {
    onMessage: (text: string) => void;
    onFinished?: () => void;
    onError?: (e: unknown) => void;
    signal?: AbortSignal;
  }
) => {
  try {
    sse("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${chatConfig.apiKey}`,
      },
      signal: fetchConfig.signal,
      body: JSON.stringify({
        max_tokens: 2048,
        temperature: chatConfig.temperature,
        model: chatConfig.model,
        messages: messages,
        stream: true,
      }),
      onMessage: (data: string) => {
        try {
          if (data === "[DONE]") {
            return;
          }
          const resp = JSON.parse(data);
          const { choices } = resp as GPTResponse;
          if (!choices || choices.length === 0) {
            return;
          }
          const { delta, finish_reason } = choices[0];
          const content = delta.content;
          if (finish_reason) {
            fetchConfig.onMessage(content ?? "");
            fetchConfig.onFinished?.();
            return;
          } else {
            fetchConfig.onMessage(content ?? "");
          }
        } catch (e) {
          fetchConfig.onError?.(e);
          fetchConfig.onFinished?.();
        }
      },
      onError(error: any) {
        fetchConfig.onError?.(error);
        fetchConfig.onFinished?.();
      },
    });
  } catch (e) {
    fetchConfig.onError?.(e);
    fetchConfig.onFinished?.();
  }
};
