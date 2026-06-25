<script setup lang="ts">
const props = defineProps<{ height?: string }>();
const outer = useTemplateRef("outer");
const { height: actualHeight } = useElementSize(outer);
const actualHeightString = computed(() => `${actualHeight.value}px`);
const { t } = useI18n();
</script>

<template>
  <div ref="outer" class="loading outer">
    <div class="inner-frame"><div class="inner-colors"></div></div>
    <div class="text">{{ t("loading") }}</div>
  </div>
</template>

<style scoped lang="scss">
@keyframes inner-frame {
  0% {
    left: -110%;
  }
  100% {
    left: 10%;
  }
}

@keyframes inner-colors {
  0% {
    width: 0%;
  }
  50% {
    width: 100%;
  }
  100% {
    width: 0%;
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

.outer {
  align-items: center;
  border-radius: var(--spod-length-quarter);
  display: flex;
  height: v-bind(height);
  justify-content: center;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.text {
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-name: text;
  animation-timing-function: ease-in-out;
  font-size: 0px;
  left: -50%;
  position: relative;
  text-transform: uppercase;
}

.inner-frame {
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-name: inner-frame;
  animation-timing-function: ease-in-out;
  display: flex;
  height: 100%;
  justify-content: center;
  position: absolute;
  width: 200%;
}

.inner-colors {
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-name: inner-colors;
  animation-timing-function: ease-in-out;
  background-image: linear-gradient(
    90deg,
    #{$spodcat-yellow}00,
    #f33 25%,
    #33d 50%,
    #f33 75%,
    #{$spodcat-yellow}00 100%
  );
  height: 100%;
}
</style>
