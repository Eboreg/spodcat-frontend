<script setup lang="ts">
import { Copy } from "@lucide/vue";
import { timeFromString, timeToString } from "@/utils";
import useMessageStore from "~/composables/useMessageStore";

const props = defineProps<{ url: string | URL; currentTimestamp?: number }>();

function onContentUrlClick(event: Event) {
  if (event.target instanceof HTMLInputElement) event.target.select();
}

async function onCopyClick() {
  try {
    await navigator.clipboard.writeText(contentUrl.value);
    addMessage({ level: "info", text: t("share.address-copied"), type: "shareModal" });
  } catch (error) {
    addMessage({ level: "error", text: String(error), type: "shareModal" });
  }
}

function onCurrentTimestampStringChange() {
  const time = timeFromString(currentTimestampString.value.replace(/[^0-9:]/g, ""));
  if (time !== null) currentTimestamp.value = time;
}

const isOpen = defineModel<boolean>();
const { t } = useI18n();
const attachTimeCode = shallowRef<boolean>(false);
const currentTimestamp = shallowRef<number | undefined>(props.currentTimestamp);
const contentUrl = computed(() => {
  const url = props.url instanceof URL ? props.url.toString() : props.url;

  if (attachTimeCode.value && currentTimestamp.value) return `${url}?start=${currentTimestamp.value}`;
  return url;
});
const currentTimestampString = shallowRef<string>(timeToString(props.currentTimestamp ?? 0));
const messageStore = useMessageStore();
const { addMessage, clearMessages } = messageStore;
const messages = computed(() => messageStore.messages.filter((m) => m.type === "shareModal"));

onUnmounted(() => clearMessages("shareModal"));
</script>

<template>
  <Modal v-model="isOpen">
    <template #header>
      <h3 class="m-0 pl-single mt-single">{{ t("share.share") }}</h3>
    </template>
    <template #default>
      <div class="column gap-single p-single">
        <div class="row gap-half align-center">
          <input type="text" :value="contentUrl" readonly class="fill" @click="onContentUrlClick">
          <SpodcatIcon
            :icon="Copy"
            :size="20"
            :title="t('share.copy-address')"
            class="cursor-pointer on-press-translate"
            element="button"
            theme="boring"
            theme-variant="light"
            lighten-on-hover
            @click="onCopyClick"
          />
        </div>
        <div class="row gap-half wrap">
          <Button
            :to="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(contentUrl)}`"
            class="small"
            theme="boring"
            theme-variant="dark"
            new-tab
          >
            <Icon name="mdi:facebook" class="share-icon" />
            <span class="nowrap">{{ t("share.the-facebook") }}</span>
          </Button>
          <Button
            :to="`https://x.com/intent/tweet?url=${encodeURIComponent(contentUrl)}`"
            class="small"
            theme="boring"
            theme-variant="dark"
            new-tab
          >
            <Icon name="mdi:twitter" class="share-icon" />
            <span class="nowrap">{{ t("share.eggs") }}</span>
          </Button>
          <Button
            :to="`https://t.me/share/url?url=${encodeURIComponent(contentUrl)}`"
            class="small"
            theme="boring"
            theme-variant="dark"
            new-tab
          >
            <Icon name="mdi:telegram" class="share-icon" />
            <span class="nowrap">{{ t("share.telegram") }}</span>
          </Button>
          <Button
            :to="`https://api.whatsapp.com/send?text=${encodeURIComponent(contentUrl)}`"
            class="small"
            theme="boring"
            theme-variant="dark"
            new-tab
          >
            <Icon name="mdi:whatsapp" class="share-icon" />
            <span class="nowrap">{{ t("share.whatsapp") }}</span>
          </Button>
        </div>
        <div v-if="currentTimestamp !== undefined" class="row gap-half align-center">
          <input id="attach-time-code" v-model="attachTimeCode" type="checkbox" class="m-0">
          <div class="row gap-quarter align-baseline">
            <label for="attach-time-code" class="font-size-sm">{{ t("share.start-at") }}</label>
            <input
              :disabled="!attachTimeCode"
              :value="currentTimestampString"
              class="current-time-string"
              type="text"
              @change="onCurrentTimestampStringChange"
            >
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
  border-color: var(--spod-text-color-on-dark-variant);
  border-width: 0 0 1px 0;
  color: inherit;
  width: 70px;

  &:disabled {
    opacity: 0.7;
  }
}

.share-icon {
  font-size: var(--spod-font-size-md);
}
</style>
