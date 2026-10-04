<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { nextTick, provide, onMounted, onUnmounted, watch, ref } from 'vue'

import Breadcrumb from 'vitepress-plugin-breadcrumb/Breadcrumb.vue'
import CDocInfo from "./components/CDocInfo.vue"
import CReturnToTopPlus from "./components/CReturnToTopPlus.vue"
import CJumpToCommentsPlus from "./components/CJumpToCommentsPlus.vue"
import CDialog from "./components/CDialog.vue"
import CGamepadHint from "./components/CGamepadHint.vue"
import { useCDialog } from './composables/useCDialog.ts'
import { useGamepadNavigation, GP } from './composables/useGamepadNavigation.ts'

const nav = useGamepadNavigation()
const dialog = useCDialog()
const showGamepadHint = ref(false)

onMounted(() => {
  nav.onConnected((index) => {
    dialog.open({
      title: "检测到游戏手柄连接喵！",
      content: `检测到手柄 ${nav.gamepads.value[index].id} 连接喵~<br/>本站已经（部分）适配了手柄操作喵，可以尝试使用手柄浏览喵~`,
      buttons: [{
        theme: "alt",
        text: "确定喵",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#59bf40" style="height: 1.8em;">
            <path d="M 12 2 C 17.52 2 22 6.48 22 12 C 22 17.52 17.52 22 12 22 C 6.48 22 2 17.52 2 12 C 2 6.48 6.48 2 12 2 Z M 11 4 L 6 18 H 8 L 9.0714 15 H 14.9286 L 16 18 H 18 L 13 4 Z M 12 6.8 L 9.7857 13 H 14.2143 Z"/>
          </svg>`
      }]
    })
    showGamepadHint.value = true
    nav.start()
  })

  const removeIntentHandler = nav.addButtonHandler(e => {
    if (e.type == 'down' && e.button == GP.A)  {
      dialog.close()
    }
  })
})

onUnmounted(() => {
  nav.dispose()
})

// 弹窗打开 → 压入作用域；关闭 → 弹出
watch(() => dialog.isVisible.value, async (visible) => {
  if (visible) {
    await nextTick()
    const el = document.querySelector('.CDialog') as HTMLElement
    if (el) nav.pushScope(el)
  } else {
    nav.popScope()
  }
})

const { site, theme, frontmatter, isDark } = useData()

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
        <Breadcrumb :breadcrumb="{ homeText: site.title, homeLink: '/' }" />
        <CDocInfo v-if="!((theme.CDocInfo?.placeDocInfoAtBottom === true && frontmatter.placeDocInfoAtBottom === undefined) || frontmatter.placeDocInfoAtBottom === true)" />
      </div>
    </template>
    <template #doc-after>
      <div class="doc-after">
        <CDocInfo v-if="(theme.CDocInfo?.placeDocInfoAtBottom === true && frontmatter.placeDocInfoAtBottom === undefined) || frontmatter.placeDocInfoAtBottom === true" />
        <Breadcrumb :breadcrumb="{ homeText: site.title, homeLink: '/' }" />
      </div>
    </template>
    <template #aside-outline-before>
      <CReturnToTopPlus class="aside-button"/>
    </template>
    <template #aside-outline-after>
      <CJumpToCommentsPlus class="aside-button"/>
    </template>
  </DefaultTheme.Layout>
  <CGamepadHint v-if="showGamepadHint" />
  <CDialog
    v-model:visible="dialog.isVisible.value"
    :options="dialog.options.value"
    @close="dialog.close"
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
.breadcrumb-item[href="/"] {
  display: none;
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
