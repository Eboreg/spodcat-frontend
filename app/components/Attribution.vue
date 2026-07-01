<script setup lang="ts">
import { Cookie } from "@lucide/vue";
import useMessageStore from "~/composables/useMessageStore";

const { t } = useI18n();
const { addToast } = useMessageStore();

function onCookiesClick() {
  addToast({
    icon: Cookie,
    level: "info",
    text: t("cookies.answer"),
    timeout: 10000,
  });
}
</script>

<template>
  <div class="column gap-half align-center">
    <div class="text-xs">
      {{ t("site-made-by") }}
      <a
        class="font-weight-bold"
        href="https://robert.huseli.us/"
        rel="noopener noreferrer"
        target="_blank"
      >
        Robert
      </a>
    </div>
    <button class="text-xs font-weight-bold" @click="onCookiesClick">
      {{ t("cookies.question") }}
    </button>
  </div>
</template>
