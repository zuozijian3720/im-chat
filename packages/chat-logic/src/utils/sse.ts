import { createParser } from "eventsource-parser";

interface FetchSSEOptions extends RequestInit {
  onMessage(data: string): void;

  onError(error: unknown): void;
}

export const streamToAsyncIterable = async function* (
  stream: ReadableStream<Uint8Array> | null
) {
  if (!stream) {
    return;
  }
  const decoder = new TextDecoder();
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield decoder.decode(value);
    }
  } finally {
    reader.releaseLock();
  }
};

export const sse = async (input: string, options: FetchSSEOptions) => {
  const { onMessage, onError, ...fetchOptions } = options;
  try {
    const resp = await fetch(input, fetchOptions);
    if (resp.status !== 200) {
      onError(await resp.json());
      return;
    }
    const parser = createParser((event) => {
      if (event.type === "event") {
        onMessage(event.data);
      }
    });
    if (!resp.body) {
      return;
    }
    for await (const chunk of streamToAsyncIterable(resp.body)) {
      parser.feed(chunk);
    }
  } catch (e) {
    onError(e);
  }
};
