import { sse } from "./sse";
import { gradientColors } from "./color";

export type UserRole = "user" | "assistant" | "system";
export type Message = {
  role: UserRole;
  content: string;
};
export const models = ["gpt-4", "gpt-3.5-turbo", "gpt-3.5-turbo-0301"] as const;
export const colors = ["#f5a623", "#212121", "#9d9d9d"] as const;
export const modelsColor = Object.fromEntries(
  models.map((v, i) => [v, colors[i] ?? colors[colors.length - 1]])
);
export const temperatureMarks: Record<number, string> = {
  0: "稳定",
  0.7: "聊天",
  2: "瞎扯淡",
};
export const temperatureColors = gradientColors("#2860da", "#fe0106", 21);
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
