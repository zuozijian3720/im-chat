import { computed, inject, provide, reactive, Ref, ref } from "vue";
import { nanoid } from "nanoid";
import { GlobalConfig, useConfig } from "./utils/config";
import { askGPT, Message, UserRole } from "./utils/chatApi";
import { useStorageAsync } from "@vueuse/core";
import { GPTModel } from "./Enums";

type GPTInfo = {
  model: GPTModel;
  temperature: number;
  totalTime?: number;
};
export type MessageNode = {
  id: string;
  isNew: boolean;
  shareId?: string;
  parent?: string;
  current?: number;
  children: string[];
  message: Message;
  abort?: AbortController;
  gptInfo?: GPTInfo;
  workMode: boolean;
  setting: {
    model: GPTModel;
    temperature: number;
  };
};
export type TreeChat = Record<string, MessageNode>;
export type Chat = {
  messages: MessageNode[];
  lastFork?: MessageNode;
  forkCount: number;
};
export type ChatList = Chat[];

export const provideTreeChat = () => {
  const chat = useTreeChat();
  provide("treeChat", chat);
  return chat;
};
export const injectTreeChat = () => {
  return inject("treeChat") as ReturnType<typeof provideTreeChat>;
};
const useTreeChat = () => {
  const current = ref<string>();
  const roots = useStorageAsync<string[]>("treeRoots", [], localStorage, {
    deep: true,
  });
  const treeChat = useStorageAsync<TreeChat>("treeChat", {}, localStorage, {
    deep: true,
  });
  const config: Ref<GlobalConfig> = useConfig();
  const newMessage = (
    role: UserRole,
    message: string,
    ops?: {
      parent?: string;
      loading?: boolean;
    }
  ): MessageNode => {
    const id = nanoid();
    const parent = ops?.parent != null ? treeChat.value[ops.parent] : undefined;
    const node: MessageNode = reactive({
      id,
      isNew: true,
      children: [],
      workMode: false,
      message: {
        role,
        content: message,
      },
      parent: ops?.parent,
      setting: parent
        ? { ...parent.setting }
        : {
            model: config.value.model,
            temperature: config.value.temperature,
          },
    });
    if (parent) {
      parent.children.push(id);
    } else {
      roots.value.unshift(id);
    }
    treeChat.value[id] = node;
    return node;
  };
  const getBeforeChat = (id: string): MessageNode[] => {
    const messages: MessageNode[] = [];
    let node: MessageNode | undefined = treeChat.value[id];
    while (node) {
      messages.push(node);
      node = node.parent ? treeChat.value[node.parent] : undefined;
    }
    return messages.reverse();
  };
  const getAnswer = (id: string, setting?: GPTInfo): MessageNode => {
    const messageNode = newMessage("assistant", "", {
      parent: id,
    });
    messageNode.abort = new AbortController();
    const genInfo: GPTInfo = reactive(
      setting
        ? {
            model: setting.model,
            temperature: setting.temperature,
          }
        : {
            model: config.value.model,
            temperature: config.value.temperature,
          }
    );
    messageNode.gptInfo = genInfo;
    messageNode.setting = {
      model: genInfo.model,
      temperature: genInfo.temperature,
    };
    const totalTime = Date.now();
    askGPT(
      getBeforeChat(id).map((v) => v.message),
      {
        model: genInfo.model,
        temperature: genInfo.temperature,
        apiKey: config.value.apiKey,
      },
      {
        signal: messageNode.abort.signal,
        onMessage: (msg) => {
          messageNode.message.content += msg;
        },
        onFinished() {
          messageNode.abort = undefined;
          genInfo.totalTime = Date.now() - totalTime;
        },
        onError(err) {
          console.error(err);
        },
      }
    );
    return messageNode;
  };

  const getAfterChatList = (id?: string): ChatList => {
    const ids = id == null ? roots.value : treeChat.value[id].children;
    const getList = (id: string): Chat => {
      const chat: Chat = {
        messages: [],
        forkCount: 0,
      };
      let node: MessageNode | undefined = treeChat.value[id];
      while (node) {
        chat.messages.push(node);
        if (node.children.length > 1) {
          const lastId = node.children[node.children.length - 1];
          chat.lastFork = treeChat.value[lastId];
          chat.forkCount = node.children.length;
        }
        node =
          node.children.length === 1
            ? treeChat.value[node.children[0]]
            : undefined;
      }
      return chat;
    };
    return ids.map(getList);
  };
  const findFirstForkedNode = (id: string): string | undefined => {
    let node: MessageNode | undefined = treeChat.value[id];
    while (node) {
      if (node.children.length === 1) {
        node = treeChat.value[node.children[0]];
      } else {
        return node.id;
      }
    }
  };
  const getCurrentMessage = () => {
    if (!current.value) {
      return;
    }
    return treeChat.value[current.value];
  };
  const deleteMessage = (id: string) => {
    const node = treeChat.value[id];
    const parentId = node.parent;
    if (node.parent) {
      const parent = treeChat.value[node.parent];
      parent.children = parent.children.filter((v) => v !== id);
    } else {
      roots.value = roots.value.filter((v) => v !== id);
    }
    const deleteChildren = (id: string) => {
      if (id === current.value) {
        current.value = parentId;
      }
      const node = treeChat.value[id];
      node.children.forEach(deleteChildren);
      delete treeChat.value[id];
    };
    deleteChildren(id);
  };
  const getSetting = (id: string) => {
    const node = treeChat.value[id];
    return node.setting;
  };
  const currentPrompt = computed(() => {
    if (!current.value) {
      return [];
    }
    return getBeforeChat(current.value);
  });
  const currentChats = computed(() =>
    current.value ? getAfterChatList(current.value) : []
  );
  const historyList = computed(() => getAfterChatList());
  const isRoot = computed(() => current.value == null);
  const currentMessage = computed(() =>
    current.value ? treeChat.value[current.value] : undefined
  );
  return {
    newMessage,
    getAnswer,
    getAfterChatList,
    getBeforeChat,
    current,
    findFirstForkedNode,
    getCurrentMessage,
    config,
    deleteMessage,
    getSetting,
    isRoot,
    historyList,
    currentChats,
    currentPrompt,
    currentMessage,
    messageChain: computed((): MessageNode[] => {
      let root = currentMessage.value;
      while (root?.parent) {
        root = treeChat.value[root.parent];
      }
      if (!root) {
        return [];
      }
      const messages: MessageNode[] = [];
      while (root) {
        messages.push(root);
        root =
          treeChat.value[
            root.children[root.current ?? root.children.length - 1]
          ];
      }
      return messages;
    }),
    isExist(id: string) {
      return !!treeChat.value[id];
    },
    load(data: MessageNode[]) {
      data.forEach((msg) => {
        treeChat.value[msg.id] = msg;
      });
    },
  };
};
