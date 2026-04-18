<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData } from 'vitepress'
const { site } = useData()

defineOptions({ name: 'NavTree' })

interface NavItem {
  text: string
  link?: string
  items?: NavItem[]
  collapsed?: boolean
}

const props = defineProps<{
  items: NavItem[]
  depth?: number
}>()

const depth = props.depth ?? 0

function normalizeLink(link?: string): string | undefined {
  if (!link) return undefined
  // 外部链接或锚点保持不变
  if (link.startsWith('http') || link.startsWith('#')) return link

  let normalized = link

  if (computed(() => site.value.cleanUrls ?? false).value) {
    // cleanUrls: true → 去掉 .md 扩展名
    normalized = normalized.replace(/\.md$/, '')
    // 可选：将 /index 转换为 /（更符合目录风格）
    if (normalized.endsWith('/index')) {
      normalized = normalized.slice(0, -6) + '/'
    }
  } else {
    // cleanUrls: false → 将 .md 替换为 .html
    normalized = normalized.replace(/\.md$/, '.html')
    // 注意：/index.md → /index.html，VitePress 能正确路由
  }

  return normalized
}

// 为每个 item 维护独立的折叠状态（优先使用配置中的 collapsed）
const collapsedMap = ref<Record<string, boolean>>(
  (() => {
    const map: Record<string, boolean> = {}
    props.items.forEach(item => {
      if (item.items?.length) {
        map[item.text] = item.collapsed ?? false
      }
    })
    return map
  })()
)

function toggle(text: string) {
  collapsedMap.value[text] = !collapsedMap.value[text]
}
</script>

<template>
  <ul class="nav-tree" :class="`depth-${depth}`">
    <li v-for="item in items" :key="item.text">
      <div class="nav-item">
        <div class="caret-container">
          <button
            v-if="item.items?.length"
            class="caret"
            @click="toggle(item.text)"
            :aria-label="collapsedMap[item.text] ? '展开' : '折叠'"
          >
            <span class="vpi-chevron-right caret-icon" :class="{ rotated: !collapsedMap[item.text] }"></span>
          </button>
        </div>

        <a v-if="item.link" :href="normalizeLink(item.link)" class="nav-link">{{ item.text }}</a>
        <span v-else class="nav-text">{{ item.text }}</span>
      </div>

      <!-- 递归渲染子项 -->
      <NavTree
        v-if="item.items?.length && !collapsedMap[item.text]"
        :items="item.items"
        :depth="depth + 1"
      />
    </li>
  </ul>
</template>

<style scoped>
.nav-tree {
  list-style: none;
  padding-left: 0;
}
.depth-0 {
  padding-left: 0;
}
.depth-0 > li {
  margin-top: 0.5rem;
}
.nav-tree .nav-tree {
  padding-left: 1.5rem;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.25rem 0;
}
.nav-link, .nav-text {
  flex: 1;
  text-decoration: none;
}
.nav-link:hover {
  color: var(--vp-c-brand-1);
}
.caret-container {
  background: none;
  border: none;
  padding: 0;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-3);
}
.caret {
  cursor: pointer;
}
.caret-icon {
  font-size: 20px;
  transition: transform 0.2s;
  display: inline-block;
}
.caret-icon.rotated {
  transform: rotate(90deg);
}
</style>