<!--- 原文件：VPSidebar.vue -->

<script lang="ts" setup>
import { useScrollLock } from '@vueuse/core'
import { inBrowser } from 'vitepress'
import { ref, watch } from 'vue'
import { useLayout } from 'vitepress/dist/client/theme-default/composables/layout'
import VPSidebarGroup from 'vitepress/dist/client/theme-default/components/VPSidebarGroup.vue'
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue';

const { sidebarGroups, hasSidebar } = useLayout()

const props = defineProps<{
  open: boolean
}>()

// a11y: focus Nav element when menu has opened
const navEl = ref<HTMLElement | null>(null)
const isLocked = useScrollLock(inBrowser ? document.body : null)

watch(
  [props, navEl],
  () => {
    if (props.open) {
      isLocked.value = true
      navEl.value?.focus()
    } else isLocked.value = false
  },
  { immediate: true, flush: 'post' }
)

const key = ref(0)

watch(
  sidebarGroups,
  () => {
    key.value += 1
  },
  { deep: true }
)
</script>

<template>
  <aside
    v-if="hasSidebar"
    class="VPSidebar"
    :class="{ open }"
    ref="navEl"
    @click.stop
  >
    <OverlayScrollbarsComponent
      defer
      element="span"
      :options='{
        overflow: {
          x: "hidden",
        },
        scrollbars: {
          theme: "os-theme-light",
          autoHide: "leave",
          autoHideDelay: 800,
          dragScroll: true,
          clickScroll: true,
        },
      }'
    >
      <div class="curtain" />

      <nav
        class="nav"
        id="VPSidebarNav"
        aria-labelledby="sidebar-aria-label"
        tabindex="-1"
      >
        <span class="visually-hidden" id="sidebar-aria-label">
          网站目录
        </span>

        <slot name="sidebar-nav-before" />
        <VPSidebarGroup :items="sidebarGroups" :key />
        <slot name="sidebar-nav-after" />
      </nav>
    </OverlayScrollbarsComponent>
  </aside>
</template>

<style scoped>
.VPSidebar {
  position: fixed;
  top: var(--vp-layout-top-height, 0px);
  bottom: 0;
  left: 0;
  z-index: var(--vp-z-index-sidebar);
  width: calc(100vw - 64px);
  max-width: 320px;
  background-color: var(--vp-sidebar-bg-color);
  opacity: 0;
  box-shadow: var(--vp-c-shadow-3);
  overflow: hidden;
  transform: translateX(-100%);
  transition: opacity 0.5s, transform 0.25s ease;
  overscroll-behavior: contain;
}

.VPSidebar > span {
  padding: 32px 32px 96px;
  height: 100%;
}

.VPSidebar.open {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
  transition: opacity 0.25s,
    transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.dark .VPSidebar {
  box-shadow: var(--vp-shadow-1);
}

@media (min-width: 960px) {
  .VPSidebar {
    width: var(--vp-sidebar-width);
    max-width: 100%;
    background-color: var(--vp-sidebar-bg-color);
    opacity: 1;
    visibility: visible;
    box-shadow: none;
    transform: translateX(0);
  }
}

@media (min-width: 1440px) {
  .VPSidebar {
    padding-left: max(0px, calc((100% - (var(--vp-layout-max-width) - 64px)) / 2 - 32px));
    width: calc((100% - (var(--vp-layout-max-width) - 64px)) / 2 + var(--vp-sidebar-width) - 32px);
  }
}

@media (min-width: 960px) {
  .curtain {
    position: sticky;
    top: calc(var(--vp-nav-height) * -1);
    left: 0;
    z-index: 1;
    margin-top: calc(var(--vp-nav-height) * -1);
    margin-right: -32px;
    margin-left: -32px;
    height: var(--vp-nav-height);
    background-color: var(--vp-sidebar-bg-color);
  }
}

.nav {
  outline: 0;
}
</style>

<style>
@media (min-width: 960px) {
  .VPSidebar.VPSidebar > span, .VPSidebar .os-scrollbar-vertical {
    padding-top: var(--vp-nav-height);
  }
}
</style>