import { gradientColors } from "./utils/color";

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
