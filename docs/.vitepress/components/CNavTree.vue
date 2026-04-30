<script setup lang="ts">
import { ref } from 'vue'
import { useData, type DefaultTheme } from 'vitepress'

defineOptions({ name: 'CNavTree' })

const { site } = useData()

const props = defineProps<{
  items: DefaultTheme.SidebarItem[]
  depth?: number
}>()

const depth = props.depth ?? 0

// 生成唯一键：优先使用 text，否则使用 link 或 fallback
function getItemKey(item: DefaultTheme.SidebarItem): string {
  if (item.text) return item.text
  if (item.link) return item.link
  // 极少数情况两者都没有，使用索引（但这里在外部无法获取索引，改用一个随机数？不行）
  // 由于调用时传入的是数组，可以在初始化时动态生成，但为了简化，返回空字符串并跳过
  return ''
}

// 初始化折叠状态
const collapsedMap = ref<Record<string, boolean>>(
  (() => {
    const map: Record<string, boolean> = {}
    props.items.forEach(item => {
      const key = getItemKey(item)
      if (key && item.items?.length) {
        map[key] = item.collapsed ?? false
      }
    })
    return map
  })()
)

function toggle(item: DefaultTheme.SidebarItem) {
  const key = getItemKey(item)
  if (key && collapsedMap.value[key] !== undefined) {
    collapsedMap.value[key] = !collapsedMap.value[key]
  }
}

function normalizeLink(link?: string): string | undefined {
  if (!link) return undefined
  if (link.startsWith('http') || link.startsWith('#')) return link

  let normalized = link
  const cleanUrls = site.value.cleanUrls ?? false

  if (cleanUrls) {
    normalized = normalized.replace(/\.md$/, '')
    if (normalized.endsWith('/index')) {
      normalized = normalized.slice(0, -6) + '/'
    }
  } else {
    normalized = normalized.replace(/\.md$/, '.html')
  }
  return normalized
}
</script>

<template>
  <ul class="nav-tree" :class="`depth-${depth}`">
    <li v-for="item in items" :key="getItemKey(item)">
      <div class="nav-item">
        <a v-if="item.link" :href="normalizeLink(item.link)" class="nav-link">{{ item.text }}</a>
        <span v-else class="nav-text">{{ item.text }}</span>
        <div class="caret-container" v-if="item.items?.length && depth !== 0">
          <button
            class="caret"
            @click="toggle(item)"
            :aria-label="collapsedMap[getItemKey(item)] ? '展开' : '折叠'"
          >
            <span
              class="vpi-chevron-right caret-icon"
              :class="{ rotated: !collapsedMap[getItemKey(item)] }"
            ></span>
          </button>
        </div>
      </div>

      <!-- 递归渲染子项 -->
      <CNavTree
        v-if="item.items?.length && !collapsedMap[getItemKey(item)]"
        :items="item.items"
        :depth="depth + 1"
      />
    </li>
  </ul>
</template>

<style scoped>
.nav-tree {
  width: fit-content;
  text-align: left;
  list-style: none;
  padding-left: 0; /*与vp内置样式对抗*/
}
.nav-tree:not(.depth-0) {
  padding-left: 1.25rem;
  border-left: 1px solid var(--vp-c-divider);
}
.depth-0 > li {
  margin-top: 0.5rem;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.25rem 0;
}
.nav-link,
.nav-text {
  flex: 1;
  text-decoration: none;
}
.nav-link.nav-link {
  color: var(--vp-c-text-1);
}
.nav-link.nav-link:hover {
  opacity: 1;
  color: var(--vp-c-brand-1);
}
.nav-text {
  color: var(--vp-c-text-2);
}
.caret-container {
  background: none;
  border: none;
  padding: 0;
  width: 1rem;
  height: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-2);
}
.caret-container:hover {
  color: var(--vp-c-text-1);
}
.caret {
  width: inherit;
  height: inherit;
  cursor: pointer;
}
.caret-icon {
  font-size: 1rem;
  transition: transform 0.2s;
  display: inline-block;
}
.caret-icon.rotated {
  transform: rotate(90deg);
}
</style>