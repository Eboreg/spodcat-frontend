<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { getLocaleDateString } from "@/utils";
import { Modal } from "@/components/modal";
import type { PartialEpisodePolymorphicModel, PartialPostPolymorphicModel } from "@/types/api";
import { searchPodcastContents } from "@/api";
import { useRouter } from "vue-router";
import { MaterialSymbol } from "@/components";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const emit = defineEmits<{ close: [] }>();
const term = ref<string>("");
const results = ref<(PartialEpisodePolymorphicModel | PartialPostPolymorphicModel)[]>([]);
const _activeIdx = ref<number>(0);
const activeIdx = computed(() => Math.min(_activeIdx.value, results.value.length - 1));
const showMinCharsText = computed(() => term.value.length > 0 && term.value.length < 3);
const showEmptyResultText = computed(() => term.value.length >= 3 && results.value.length === 0);

watchEffect(async (onCleanup) => {
  const controller = new AbortController();

  if (term.value.length >= 3) {
    results.value = await searchPodcastContents(term.value, controller.signal);
  } else {
    results.value = [];
  }
  onCleanup(() => controller.abort());
});

function onKeyDown(event: KeyboardEvent) {
  let shouldScroll = false;

  if (event.key === "ArrowUp") {
    event.preventDefault();
    if (_activeIdx.value === 0) _activeIdx.value = Math.max(results.value.length - 1, 0);
    else _activeIdx.value = activeIdx.value - 1;
    shouldScroll = true;
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    if (_activeIdx.value >= results.value.length - 1) _activeIdx.value = 0;
    else _activeIdx.value = activeIdx.value + 1;
    shouldScroll = true;
  } else if (event.key === "Enter") {
    const result = results.value[activeIdx.value];

    event.preventDefault();
    if (result) {
      router.push(`/${result.podcast}/${result.resourcetype}/${result.slug}`);
      emit("close");
    }
  } else if (event.key === "Escape") {
    event.preventDefault();
    emit("close");
  }

  if (event.currentTarget instanceof HTMLElement && shouldScroll) {
    event.currentTarget
      .querySelector(`.search-results .search-result:nth-child(${activeIdx.value + 1})`)
      ?.scrollIntoView({ block: "nearest" });
  }
}
</script>

<template>
  <Modal open @keydown="onKeyDown" @close="$emit('close')">
    <template #header>
      <div class="search-input-container">
        <MaterialSymbol icon="search" />
        <input type="search" v-model="term" autofocus class="search-input" />
      </div>
    </template>

    <template #default>
      <div v-if="showMinCharsText" class="px-single pb-half text-small text-boring-light">
        {{ t("enter-min-3-chars") }}
      </div>
      <div v-if="showEmptyResultText" class="px-single pb-half text-small text-boring-light">
        {{ t("no-search-results") }}
      </div>
      <div class="search-results">
        <RouterLink
          v-for="(result, index) in results"
          :key="index"
          :to="`/${result.podcast}/${result.resourcetype}/${result.slug}`"
          @click="$emit('close')"
          class="search-result"
          :class="{ active: index === activeIdx }"
        >
          <div class="breadcrumbs">
            {{ getLocaleDateString(new Date(result.published)) }}
            /
            {{ result.podcast_name }}
          </div>
          <div>{{ result.name }}</div>
        </RouterLink>
      </div>
    </template>
  </Modal>
</template>

<style scoped lang="scss">
.breadcrumbs {
  color: var(--spod-text-color-dark);
  font-size: 13px;
}

.modal {
  width: min(600px, 90%);
}

.search-input {
  background-color: transparent;
  border: none;
  color: var(--spod-text-color);
  font-size: 16px;
  height: 44px;
  outline: none;
  padding-left: 44px;
  width: 100%;
}

.search-input-container .icon {
  color: var(--spod-text-color-dark);
  left: 10px;
  position: absolute;
  top: 10px;
}

.search-result {
  display: block;
  padding: 0.5rem 1rem;

  &.active {
    background-color: var(--spod-theme-primary-dark);
  }

  &:last-child {
    margin-bottom: 0.5rem;
  }

  &:hover:not(.active) {
    background-color: var(--spod-theme-boring-dark);
  }
}

.search-results {
  height: 100%;
  overflow-y: scroll;
}
</style>
