<script setup lang="ts">
const props = defineProps<{ opacity?: number; height?: string }>();
const outer = useTemplateRef("outer");
const { height: actualHeight } = useElementSize(outer);
const actualHeightString = computed(() => `${actualHeight.value}px`);
const { t } = useI18n();
</script>

<template>
  <div ref="outer" class="loading outer">
    <div class="inner"></div>
    <div class="text">{{ t("loading") }}</div>
  </div>
</template>

<style scoped lang="scss">
@keyframes inner {
  0% {
    width: 100%;
    left: -100%;
  }
  50% {
    width: 200%;
  }
  100% {
    width: 0%;
    left: 100%;
  }
}

@keyframes text {
  0% {
    font-size: 0px;
    left: -50%;
  }
  50% {
    font-size: v-bind(actualHeightString);
  }
  100% {
    font-size: 0px;
    left: 50%;
  }
}

.outer,
.inner {
  width: 100%;
}

.outer {
  align-items: center;
  background-color: $spodcat-yellow;
  border-radius: var(--spod-length-quarter);
  display: flex;
  height: v-bind(height);
  justify-content: center;
  opacity: v-bind(opacity);
  overflow: hidden;
  position: relative;
}

.text {
  animation-delay: 0.5s;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-name: text;
  animation-timing-function: ease-in-out;
  font-size: 0px;
  left: -50%;
  position: relative;
  text-transform: uppercase;
}

.inner {
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-name: inner;
  animation-timing-function: linear;
  background-image: linear-gradient(
    90deg,
    #{$spodcat-yellow}00,
    #f33 25%,
    #33d 50%,
    #f33 75%,
    #{$spodcat-yellow}00 100%
  );
  height: 100%;
  position: absolute;
}
</style>
