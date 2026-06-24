import type { ElementSize } from "@vueuse/core";
import { computed, ref } from "vue";

import { defineStore } from "pinia";

export type MessageLevel = "error" | "info" | "success";

export interface Message {
  level: MessageLevel;
  text: string;
  timeout?: number;
  type?: string;
}

export interface ToastMessage extends Message {
  icon?: string | null;
}

export class PlacedMessage {
  id: number;
  level: MessageLevel;
  text: string;
  timeout: number;
  type?: string;

  constructor(id: number, message: Message) {
    this.id = id;
    this.level = message.level;
    this.text = message.text;
    this.timeout = message.timeout ?? 5000;
    this.type = message.type;
  }

  toString() {
    return `PlacedMessage(id=${this.id}, level=${this.level}, type=${this.type})`;
  }
}

export class PlacedToast extends PlacedMessage {
  bottomOffset: number = 0;
  icon?: string;
  size: ElementSize = { width: 0, height: 0 };

  constructor(id: number, message: ToastMessage, bottomOffset?: number) {
    super(id, { ...message, type: "toast" });
    if (bottomOffset != undefined) this.bottomOffset = bottomOffset;
    if (message.icon) this.icon = message.icon;
  }

  toString() {
    return `PlacedToast(id=${this.id}, bottomOffset=${this.bottomOffset}, size={ width: ${this.size.width}, height: ${this.size.height} })`;
  }
}

let currentMessageId: number = -1;
const messages = ref<PlacedMessage[]>([]);
const toasts = computed(() => messages.value.filter((m) => m instanceof PlacedToast));

const useMessageStore = defineStore("message", () => {
  function addMessage(message: Message) {
    messages.value.push(new PlacedMessage(++currentMessageId, message));
  }

  function addToast(message: ToastMessage) {
    messages.value.push(
      new PlacedToast(
        ++currentMessageId,
        message,
        toasts.value.reduce((acc, t) => acc + t.size.height + 10, 0),
      ),
    );
  }

  function clearMessages(type: string) {
    messages.value = messages.value.filter((m) => m.type !== type);
  }

  function onToastSizeChange(id: number, size: ElementSize) {
    const toast = toasts.value.find((t) => t.id === id);

    if (toast && (toast.size.height !== size.height || toast.size.width !== size.width)) {
      toast.size = size;
      updateToastBottomOffsets();
    }
  }

  function removeMessage(id: number): number {
    const idx = messages.value.findIndex((t) => t.id === id);

    if (idx > -1) messages.value.splice(idx, 1);
    return idx;
  }

  function removeToast(id: number) {
    if (removeMessage(id) > -1) updateToastBottomOffsets();
  }

  function updateToastBottomOffsets() {
    let acc = 0;

    for (const toast of toasts.value) {
      if (toast.bottomOffset !== acc) toast.bottomOffset = acc;
      acc += toast.size.height + 8;
    }
  }

  return {
    addMessage,
    addToast,
    clearMessages,
    messages,
    onToastSizeChange,
    removeMessage,
    removeToast,
    toasts,
  };
});

export default useMessageStore;
