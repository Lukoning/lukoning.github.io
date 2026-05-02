<script lang="ts" setup>
import { useWindowScroll } from '@vueuse/core'
import { watch, computed, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import { useLayout } from 'vitepress/dist/client/theme-default/composables/layout'
import VPLocalNavOutlineDropdown from './LKNLocalNavOutlineDropdown.vue'

defineProps<{
  open: boolean
}>()

defineEmits<{
  (e: 'open-menu'): void
}>()

const { page, theme } = useData()
const { isHome, hasSidebar, headers, hasLocalNav } = useLayout()
const { y } = useWindowScroll()

const config = theme.value.LKNLocalNav
const localNav = ref<HTMLDivElement>()
const navHeight = ref(0)
const showTitle = ref(false)

// 滚动事件处理
watch(y, (newY) => {
  const docTitle = document.querySelector(".VPContent h1")
  showTitle.value = config?.autoTitleThreshold
  ? (
    docTitle?.getBoundingClientRect().top
    ?? document.querySelector(".VPContent")?.getBoundingClientRect().top
    ?? 0
  ) + (docTitle?.clientHeight ?? 0) <= (localNav.value?.clientHeight ?? 0)
  : newY > (config?.titleThreshold ?? 350) //默认滚动阈值350px
})

onMounted(() => {
  navHeight.value = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      '--vp-nav-height'
    )
  )
})

const classes = computed(() => {
  return {
    VPLocalNav: true,
    'has-sidebar': hasSidebar.value,
    empty: !hasLocalNav.value,
    fixed: !hasLocalNav.value && !hasSidebar.value
  }
})
</script>

<template>
  <div
    ref="localNav"
    v-if="!isHome && (hasLocalNav || hasSidebar || y >= navHeight)"
    :class="classes"
  >
    <div class="container">
      <button
        v-if="hasSidebar"
        class="menu"
        :aria-expanded="open"
        aria-controls="VPSidebarNav"
        @click="$emit('open-menu')"
      >
        <span class="vpi-align-left menu-icon"></span>
        <span class="menu-text">
          {{ theme.sidebarMenuLabel || 'Menu' }}
        </span>
      </button>
      <Transition name="title">
        <span v-if="showTitle" class="title">
          {{ page.title || '' }}
        </span>
      </Transition>

      <VPLocalNavOutlineDropdown :headers :navHeight />
    </div>
  </div>
</template>

<style scoped>
.VPLocalNav {
  position: sticky;
  top: 0;
  /*rtl:ignore*/
  left: 0;
  z-index: var(--vp-z-index-local-nav);
  border-bottom: 1px solid var(--vp-c-gutter);
  padding-top: var(--vp-layout-top-height, 0px);
  width: 100%;
  background-color: var(--vp-local-nav-bg-color);
}

.VPLocalNav.fixed {
  position: fixed;
}

@media (min-width: 960px) {
  .VPLocalNav {
    top: var(--vp-nav-height);
  }

  .VPLocalNav.has-sidebar {
    padding-left: var(--vp-sidebar-width);
  }

  .VPLocalNav.empty {
    display: none;
  }
}

@media (min-width: 1280px) {
  .VPLocalNav {
    display: none;
  }
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu {
  display: flex;
  align-items: center;
  line-height: 24px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: color 0.5s;
}

.menu:hover {
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

@media (min-width: 960px) {
  .menu {
    display: none;
  }
}

.menu-icon {
  margin-right: 8px;
  font-size: 14px;
}

.menu,
:deep(.VPLocalNavOutlineDropdown > button) {
  padding: 12px 24px 11px;
}

@media (min-width: 768px) {
  .menu,
  :deep(.VPLocalNavOutlineDropdown > button) {
    padding: 12px 32px 11px;
  }
}

.title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /*还有这种解法？*/
  padding-top: 2px;
  text-align: center;
  letter-spacing: -0.02em;
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
}

@media (min-width: 960px) {
  .title {
    display: none;
  }
}

.title-enter-active,
.title-leave-active {
  transition: opacity .2s, transform .3s;
}

.title-enter-from {
  opacity: 0;
  transform: translate(-50%, calc(-50% + 10px));
}
.title-leave-to {
  opacity: 0;
  transform: translate(-50%, calc(-50% - 10px));
}
</style>
