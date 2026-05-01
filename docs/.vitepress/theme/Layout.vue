<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { nextTick, provide } from 'vue'

import Breadcrumb from 'vitepress-plugin-breadcrumb/Breadcrumb.vue'
import CDocInfo from "../components/CDocInfo.vue"
import CReturnToTopPlus from "../components/CReturnToTopPlus.vue"

const { isDark } = useData()

const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`
  ]

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 400,
      easing: 'ease-in',
      fill: 'forwards',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`
    }
  )
})
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-before>
      <div class="doc-before">
        <CDocInfo />
        <Breadcrumb :breadcrumb="{ homeText: '提瓦特大陆', homeLink: '/' }" />
      </div>
      
    </template>
    <template #aside-outline-before>
      <CReturnToTopPlus />
    </template>
  </DefaultTheme.Layout>
</template>

<style>
.doc-before {
  margin-bottom: 16px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.doc-before > * {
  margin: 0 0 4px;
}
</style>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}
</style>
