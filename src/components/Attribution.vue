<script setup lang="ts">
import useMessageStore from "@/composables/useMessageStore";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { addToast } = useMessageStore();

function onCookiesClick() {
  addToast({
    level: "info",
    text: t("cookies.answer"),
    timeout: 10000,
    icon: "cookie",
  });
}
</script>

<template>
  <div class="attribution column gap-half align-center">
    <div class="text-xs">
      {{ t("site-made-by") }}
      <a
        href="https://robert.huseli.us/"
        class="font-weight-bold"
        target="_blank"
        rel="noopener noreferrer"
      >
        Robert
      </a>
    </div>
    <div class="text-xs font-weight-bold cursor-pointer" @click="onCookiesClick">
      {{ t("cookies.question") }}
    </div>
  </div>
</template>
