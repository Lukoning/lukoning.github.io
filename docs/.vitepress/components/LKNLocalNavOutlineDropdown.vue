<!-- 原文件：VPLocalNavOutlineDropdown.vue -->
<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import { onContentUpdated, useData } from 'vitepress'
import type { DefaultTheme } from 'vitepress/theme'
import { nextTick, ref, watch } from 'vue'
// @ts-expect-error
import { resolveTitle } from 'vitepress/dist/client/theme-default/composables/outline'
import VPDocOutlineItem from 'vitepress/dist/client/theme-default/components/VPDocOutlineItem.vue'
import VPButton from './LKNButton.vue'

import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue';

const props = defineProps<{
  headers: DefaultTheme.OutlineItem[]
  navHeight: number
}>()

const { theme } = useData()
const open = ref(false)
const vh = ref(0)
const main = ref<HTMLDivElement>()
const items = ref<HTMLDivElement>()

function closeOnClickOutside(e: Event) {
  if (!main.value?.contains(e.target as Node)) {
    open.value = false
  }
}

watch(open, (value) => {
  if (value) {
    document.addEventListener('click', closeOnClickOutside)
    return
  }
  document.removeEventListener('click', closeOnClickOutside)
})

onKeyStroke('Escape', () => {
  open.value = false
})

onContentUpdated(() => {
  open.value = false
})

function toggle() {
  open.value = !open.value
  vh.value = window.innerHeight + Math.min(window.scrollY - props.navHeight, 0)
}

function onItemClick(e: Event) {
  // 判断：是a元素或a元素的子元素吗？
  if (
    (e.target as HTMLElement).closest("a")
  ) nextTick(() => {
    open.value = false
  })
}
</script>

<template>
  <div
    class="VPLocalNavOutlineDropdown"
    :style="{ '--vp-vh': vh + 'px' }"
    ref="main"
  >
    <VPButton
      tag="button"
      size="small"
      @click="toggle"
      :class="{ open }"
      :theme="'alt'"
    >
      <span class="menu-text">{{ resolveTitle(theme) }}</span>
      <span class="vpi-chevron-right icon" />
    </VPButton>
    

    <Transition name="flyout">
      <div v-if="open" ref="items" class="items" @click="onItemClick">
        <OverlayScrollbarsComponent
          element="span"
          :options='{
            overflow: {
              x: "hidden",
            },
            scrollbars: {
              theme: "os-theme-light",
              autoHide: "never",
              dragScroll: true,
              clickScroll: true,
            },
          }'
        >
          <div class="header">
            <a class="top-link" href="#">
              {{ theme.returnToTopLabel || 'Return to top' }}
            </a>
          </div>
          <div class="outline" v-if="headers.length > 0">
            <VPDocOutlineItem :headers />
          </div>
          <div class="footer">
            <a class="comments-link" href="#comment">
              {{ theme.jumpToCommentsLabel || 'Jump to comments' }}
            </a>
          </div>
        </OverlayScrollbarsComponent>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
button.VPButton:not(#ABC) {
  padding-right: 9px; /*视觉居中*/
  backdrop-filter: blur(var(--lkn-navbar-button-blur-radius));
}
button.VPButton.open {
  color: var(--vp-c-brand-1);
}

.icon {
  display: inline-block;
  vertical-align: middle;
  margin-left: 2px;
  font-size: 14px;
  transform: rotate(0) /*rtl:rotate(180deg)*/;
  transition: transform 0.25s;
}

@media (min-width: 960px) {
  button {
    font-size: 14px;
  }
  .icon {
    font-size: 16px;
  }
}

.open > .icon {
  /*rtl:ignore*/
  transform: rotate(90deg);
}

.items {
  position: absolute;
  top: 40px;
  right: 16px;
  left: 16px;
  display: grid;
  gap: 1px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background-color: var(--vp-c-gutter);
  overflow: hidden;
  box-shadow: var(--vp-shadow-3);
}

.items > span {
  max-height: calc(var(--vp-vh, 100vh) - 134px);
  overflow: hidden auto;
}

@media (min-width: 960px) {
  .items {
    right: auto;
    left: calc(var(--vp-sidebar-width) + 32px);
    width: 320px;
  }
}

.header, .footer {
  background-color: var(--vp-c-bg-soft);
}

.top-link, .comments-link {
  display: block;
  padding: 0 14px;
  line-height: 44px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.outline {
  margin: 1px 0;
  padding: 6px 0;
  background-color: var(--vp-c-bg-soft);
}

.flyout-enter-active {
  transition: all 0.2s ease-out;
}

.flyout-leave-active {
  transition: all 0.15s ease-in;
}

.flyout-enter-from,
.flyout-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}
</style>
