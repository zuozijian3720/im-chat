import { RemovableRef, useStorageAsync } from "@vueuse/core";
import { GPTModel } from "./chatApi";

export type GlobalConfig = {
  model: GPTModel;
  temperature: number;
  apiKey: string;
};
export const defaultGlobalConfig: GlobalConfig = {
  model: "gpt-3.5-turbo",
  temperature: 0,
  apiKey: "",
};
export const useConfig = (): RemovableRef<GlobalConfig> => {
  return useStorageAsync<GlobalConfig>(
    "global-config",
    defaultGlobalConfig,
    localStorage,
    {
      deep: true,
      mergeDefaults: true,
    }
  );
};
