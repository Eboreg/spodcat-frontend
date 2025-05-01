import type { NativeArray } from "@ember/array";
import { A } from "@ember/array";
import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";
import type { Size } from "global";

export interface Message {
    level: "error" | "info" | "success";
    text: string;
    timeout?: number;
    icon?: string | null;
}

export class PlacedToast {
    id: number;
    message: Message;
    timeout: number;
    @tracked bottomOffset: number = 0;
    @tracked size: Size = { width: 0, height: 0 };

    constructor(id: number, message: Message, bottomOffset?: number) {
        this.id = id;
        this.message = message;
        this.timeout = message.timeout || 5000;
        if (bottomOffset != undefined) this.bottomOffset = bottomOffset;
    }
}

export default class MessageService extends Service {
    currentToastId: number = -1;
    @tracked toasts: NativeArray<PlacedToast> = A();

    addToast(message: Message) {
        this.toasts.pushObject(
            new PlacedToast(
                ++this.currentToastId,
                message,
                this.toasts.reduce((acc, t) => acc + t.size.height + 10, 0),
            ),
        );
    }

    onToastHidden(id: number) {
        const idx = this.toasts.findIndex((t) => t.id == id);

        if (idx > -1) {
            this.toasts.removeAt(idx);
            this.updateBottomOffsets();
        }
    }

    onToastSizeChange(id: number, size: Size) {
        const toast = this.toasts.findBy("id", id);

        if (toast) {
            toast.size = size;
            this.updateBottomOffsets();
        }
    }

    updateBottomOffsets() {
        let acc = 0;

        for (const toast of this.toasts) {
            if (toast.bottomOffset != acc) toast.bottomOffset = acc;
            acc += toast.size.height + 8;
        }
    }
}

declare module "@ember/service" {
    interface Registry {
        message: MessageService;
    }
}
