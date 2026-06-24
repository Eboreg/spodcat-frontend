<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";
import { Modal, ModalMessage } from "@/components/modal";
import { timeFromString, timeToString } from "@/utils";
import { Button, MaterialSymbol } from "@/components";

import useMessageStore from "@/composables/useMessageStore";
import { useI18n } from "vue-i18n";

async function onCopyClick() {
  try {
    await navigator.clipboard.writeText(contentUrl.value);
    addMessage({ level: "info", text: t("share.link-copied"), type: "shareModal" });
  } catch (error) {
    console.error(error);
    addMessage({ level: "error", text: String(error), type: "shareModal" });
  }
}

function onContentUrlClick(event: Event) {
  if (event.target instanceof HTMLInputElement) event.target.select();
}

function onCurrentTimestampStringChange() {
  const time = timeFromString(currentTimestampString.value.replace(/[^0-9:]/g, ""));
  if (time !== null) currentTimestamp.value = time;
}

const { t } = useI18n();
const props = defineProps<{ url: string | URL; currentTimestamp?: number }>();
const emit = defineEmits<{ close: [] }>();
const attachTimeCode = ref<boolean>(false);
const currentTimestamp = ref<number | undefined>(props.currentTimestamp);
const contentUrl = computed(() => {
  const url = props.url instanceof URL ? props.url.toString() : props.url;

  if (attachTimeCode.value && currentTimestamp.value)
    return `${url}?start=${currentTimestamp.value}`;
  return url;
});
const currentTimestampString = ref<string>(timeToString(props.currentTimestamp ?? 0));
const messageStore = useMessageStore();
const { addMessage, clearMessages } = messageStore;
const messages = computed(() => messageStore.messages.filter((m) => m.type === "shareModal"));

onUnmounted(() => clearMessages("shareModal"));
</script>

<template>
  <Modal open @close="$emit('close')">
    <template #header>
      <h3 class="m-0 pl-single">{{ t("share.share") }}</h3>
    </template>
    <template #default>
      <div class="column gap-single p-single">
        <div class="row gap-half">
          <input type="text" :value="contentUrl" readonly class="fill" @click="onContentUrlClick" />
          <MaterialSymbol icon="content_copy" @click="onCopyClick" :title="t('share.copy-link')" />
        </div>
        <div class="row gap-half wrap">
          <Button
            :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(contentUrl)}`"
            new-tab
            class="small border-boring"
          >
            <font-awesome-icon icon="fa-brands fa-facebook" class="icon share-icon" />
            <span class="nowrap">{{ t("share.the-facebook") }}</span>
          </Button>
          <Button
            :href="`https://x.com/intent/tweet?url=${encodeURIComponent(contentUrl)}`"
            new-tab
            class="small border-boring"
          >
            <font-awesome-icon icon="fa-brands fa-square-x-twitter" class="icon share-icon" />
            <span class="nowrap">{{ t("share.eggs") }}</span>
          </Button>
          <Button
            :href="`https://t.me/share/url?url=${encodeURIComponent(contentUrl)}`"
            new-tab
            class="small border-boring"
          >
            <font-awesome-icon icon="fa-brands fa-telegram" class="icon share-icon" />
            <span class="nowrap">{{ t("share.telegram") }}</span>
          </Button>
          <Button
            :href="`https://api.whatsapp.com/send?text=${encodeURIComponent(contentUrl)}`"
            new-tab
            class="small border-boring"
          >
            <font-awesome-icon icon="fa-brands fa-whatsapp" class="icon share-icon" />
            <span class="nowrap">{{ t("share.whatsapp") }}</span>
          </Button>
        </div>
        <div v-if="currentTimestamp !== undefined" class="row gap-half align-center">
          <input type="checkbox" v-model="attachTimeCode" id="attach-time-code" class="m-0" />
          <div class="row gap-quarter align-baseline">
            <label for="attach-time-code" class="text-small">{{ t("share.start-at") }}</label>
            <input
              type="text"
              :value="currentTimestampString"
              :disabled="!attachTimeCode"
              @change="onCurrentTimestampStringChange"
              class="current-time-string"
            />
          </div>
        </div>
      </div>
      <ModalMessage v-for="message in messages" :key="message.id" :message="message" />
    </template>
  </Modal>
</template>

<style scoped lang="scss">
.current-time-string {
  background-color: inherit;
  border-color: var(--spod-text-color-dark);
  border-width: 0 0 1px 0;
  color: inherit;
  width: 70px;

  &:disabled {
    opacity: 0.7;
  }
}

.share-icon {
  color: var(--spod-text-color-dark);
}
</style>
