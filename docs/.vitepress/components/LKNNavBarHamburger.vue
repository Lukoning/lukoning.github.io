<script lang="ts" setup>
import VPButton from './LKNButton.vue'

defineProps<{
  active: boolean
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <VPButton
    tag="button"
    theme="alt-trans"
    class="VPNavBarHamburger"
    :class="{ active }"
    aria-label="mobile navigation"
    :aria-expanded="active"
    aria-controls="VPNavScreen"
    @click="$emit('click')"
  >
    <span class="container">
      <span class="top" />
      <span class="middle" />
      <span class="bottom" />
    </span>
  </VPButton>
</template>

<style scoped>
.VPButton.VPNavBarHamburger {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  margin-right: 8px;
  padding: 0;
}

@media (min-width: 768px) {
  .VPButton.VPNavBarHamburger {
    display: none;
  }
}

.container {
  position: relative;
  width: 16px;
  height: 14px;
  overflow: hidden;
}

.VPNavBarHamburger.active { color: var(--vp-c-brand-1) }

.VPNavBarHamburger:hover .top    { top: 0; left: 0; transform: translateX(4px); }
.VPNavBarHamburger:hover .middle { top: 6px; left: 0; transform: translateX(0); }
.VPNavBarHamburger:hover .bottom { top: 12px; left: 0; transform: translateX(8px); }

.VPNavBarHamburger.active .top    { top: 6px; transform: translateX(0) rotate(225deg); }
.VPNavBarHamburger.active .middle { top: 6px; transform: translateX(16px); }
.VPNavBarHamburger.active .bottom { top: 6px; transform: translateX(0) rotate(135deg); }

.VPNavBarHamburger.active:hover .top,
.VPNavBarHamburger.active:hover .middle,
.VPNavBarHamburger.active:hover .bottom {
  transition: top .25s, background-color .25s, transform .25s;
}

.top,
.middle,
.bottom {
  position: absolute;
  width: 16px;
  height: 2px;
  background-color: currentColor;
  transition: top .25s, background-color .5s, transform .25s;
}

.top    { top: 0; left: 0; transform: translateX(0); }
.middle { top: 6px; left: 0; transform: translateX(8px); }
.bottom { top: 12px; left: 0; transform: translateX(4px); }
</style>
