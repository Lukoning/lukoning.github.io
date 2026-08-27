<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { nextTick, provide, watch, ref, computed } from 'vue'

import Breadcrumb from 'vitepress-plugin-breadcrumb/Breadcrumb.vue'
import CDocInfo from "../components/CDocInfo.vue"
import CReturnToTopPlus from "../components/CReturnToTopPlus.vue"
import CJumpToCommentsPlus from "../components/CJumpToCommentsPlus.vue"
import CDialog from "../components/CDialog.vue"
import { useCDialog } from '../composables/useCDialog.ts'
import { useGamepad } from "@vueuse/core"

const dialog = useCDialog()
const { pause, gamepads, onConnected } = useGamepad()
onConnected((index) => {
  dialog.open({
    title: "检测到游戏手柄连接喵！",
    content: `检测到手柄 ${gamepads.value[index].id} 连接喵~<br/>不过很遗憾的是，本站还没有学会使用游戏手柄进行导航喵，也不会区分手柄类型喵……`,
    buttons: [{
      theme: "alt",
      text: "确定喵",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#59bf40" style="height: 1.8em;">
          <path d="M 12 2 C 17.52 2 22 6.48 22 12 C 22 17.52 17.52 22 12 22 C 6.48 22 2 17.52 2 12 C 2 6.48 6.48 2 12 2 Z M 11 4 L 6 18 H 8 L 9.0714 15 H 14.9286 L 16 18 H 18 L 13 4 Z M 12 6.8 L 9.7857 13 H 14.2143 Z"/>
        </svg>`
    }]
  })
  const gamepad = computed(() => gamepads.value[0])
  // 记录上一次的按键状态（用于检测上升沿）
  const previousAState = ref(false)
  // 监听器：一旦 A 键被按下（由释放变为按下），触发回调
  const stopWatch = watch(
    () => gamepad.value?.buttons[0]?.pressed ?? false,
    (newVal, oldVal) => {
      if (newVal === true && oldVal === false) {
        dialog.close();
        pause();
        stopWatch();
      }
      previousAState.value = newVal
    }
  )
})

const { theme, frontmatter, isDark } = useData()
const { isVisible, options, close } = useCDialog()

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
    <!-- https://vitepress.dev/guide/extending-default-theme#layout-slots -->
    <template #doc-before>
      <div class="doc-before">
        <Breadcrumb :breadcrumb="{ homeText: '提瓦特大陆', homeLink: '/' }" />
        <CDocInfo v-if="!((theme.CDocInfo?.placeDocInfoAtBottom === true && frontmatter.placeDocInfoAtBottom === undefined) || frontmatter.placeDocInfoAtBottom === true)" />
      </div>
    </template>
    <template #doc-after>
      <div class="doc-after">
        <CDocInfo v-if="(theme.CDocInfo?.placeDocInfoAtBottom === true && frontmatter.placeDocInfoAtBottom === undefined) || frontmatter.placeDocInfoAtBottom === true" />
        <Breadcrumb :breadcrumb="{ homeText: '提瓦特大陆', homeLink: '/' }" />
      </div>
    </template>
    <template #aside-outline-before>
      <CReturnToTopPlus class="aside-button"/>
    </template>
    <template #aside-outline-after>
      <CJumpToCommentsPlus class="aside-button"/>
    </template>
  </DefaultTheme.Layout>
  <CDialog
    v-model:visible="isVisible"
    :options="options"
    @close="close"
  />
</template>

<style>
.doc-before {
  margin-block: 2px 10px;
  padding-block: 4px;
}
.doc-after {
  margin-top: 12px;
  padding-top: 4px;
}
.doc-before > *, .doc-after > * {
  margin: 0 0 4px;
}
.aside-button {
  margin-block: 6px;
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
