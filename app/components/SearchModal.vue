<script setup lang="ts">
import { FileText, Podcast, Search } from "@lucide/vue";
import { getLocaleDateString, modulo } from "@/utils";
import type { PartialEpisodePolymorphicModel, PartialPostPolymorphicModel } from "@/types/api";
import { podcastSlugKey } from "~/symbols";

const isOpen = defineModel<boolean>();
const { t } = useI18n();
const router = useRouter();
const term = ref<string>("");
const results = ref<(PartialEpisodePolymorphicModel | PartialPostPolymorphicModel)[]>([]);
const activeIdx = ref<number>(0);
const showMinCharsText = computed(() => term.value.length > 0 && term.value.length < 3);
const showEmptyResultText = computed(() => term.value.length >= 3 && results.value.length === 0);
const podcastSlug = inject(podcastSlugKey);

watchEffect(async (onCleanup) => {
  const controller = new AbortController();

  if (term.value.length >= 3 && podcastSlug) {
    const r = await $fetch(`/api/podcasts/${podcastSlug}/search/${term.value}`, {
      signal: controller.signal,
    });
    results.value = r;
  } else {
    results.value = [];
  }
  onCleanup(() => controller.abort());
});

function onKeyDown(event: KeyboardEvent) {
  const pos = Math.min(Math.max(results.value.length - 1, 0), activeIdx.value);

  if (["ArrowUp", "ArrowDown", "Enter", "Escape"].includes(event.key)) {
    event.preventDefault();
  }

  if (["ArrowUp", "ArrowDown"].includes(event.key)) {
    if (event.key === "ArrowUp") activeIdx.value = modulo(pos - 1, results.value.length);
    else activeIdx.value = modulo(pos + 1, results.value.length);

    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget
        .querySelector(`.search-results .search-result:nth-child(${activeIdx.value + 1})`)
        ?.scrollIntoView({ block: "nearest" });
    }
  } else if (event.key === "Enter") {
    const result = results.value[pos];

    if (result) {
      router.push(`/${result.podcast}/${result.resourcetype}/${result.slug}`);
      isOpen.value = false;
    }
  } else if (event.key === "Escape") {
    isOpen.value = false;
  }
}
</script>

<template>
  <Modal @keydown="onKeyDown" v-model="isOpen">
    <template #header>
      <div class="row align-center">
        <SpodcatIcon :icon="Search" :size="25" class="p-half" theme="boring-inverse" />
        <input type="search" v-model="term" autofocus class="search-input" />
      </div>
    </template>

    <template #default>
      <div v-if="showMinCharsText" class="px-single pb-half text-small text-boring-inverse">
        {{ t("enter-min-3-chars") }}
      </div>
      <div v-if="showEmptyResultText" class="px-single pb-half text-small text-boring-inverse">
        {{ t("no-search-results") }}
      </div>
      <div class="search-results">
        <NuxtLink
          v-for="(result, index) in results"
          :key="index"
          :to="`/${result.podcast}/${result.resourcetype}/${result.slug}`"
          @click="isOpen = false"
          class="search-result d-block py-half px-single"
          :class="{ active: index === activeIdx }"
        >
          <div class="row align-center gap-single">
            <SpodcatIcon v-if="result.resourcetype === 'episode'" :icon="Podcast" :size="24" />
            <SpodcatIcon v-else-if="result.resourcetype === 'post'" :icon="FileText" :size="24" />
            <div class="column">
              <div class="breadcrumbs mb-quarter">
                {{ getLocaleDateString(new Date(result.published)) }}
              </div>
              <div>{{ result.name }}</div>
            </div>
          </div>
        </NuxtLink>
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
  width: 100%;
}

.search-result {
  border-radius: var(--spod-border-radius);

  &.active {
    background-color: var(--spod-theme-primary-dark);
  }

  &:last-child {
    margin-bottom: 0.5rem;
  }

  &:hover:not(.active) {
    background-color: var(--spod-theme-boring-normal-dark);
  }
}

.search-results {
  height: 100%;
  overflow-y: scroll;
}
</style>
