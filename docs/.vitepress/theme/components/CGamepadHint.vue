<!-- docs/.vitepress/theme/components/GamepadHint.vue -->
<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { useGamepadNavigation, GP } from '../composables/useGamepadNavigation'

export interface HintItem {
    /** 显示在 kbd 里的按键名，如 'LS'、'A'、'方向键' */
    key: string
    /** 按键颜色，默认透明 */
    color?: string
    /** 按键功能描述 */
    label: string
}

const props = withDefaults(defineProps<{
    hints?: HintItem[]
    /** 触发折叠/展开的手柄按键索引，默认 LS */
    toggleKey?: number
}>(), {
    hints: () => [
        { key: '方向键/左摇杆', label: '移动焦点' },
        { key: 'A', color: '#59bf40', label: '确认 / 进入区域' },
        { key: 'B', color: '#d94126', label: '返回 / 退出区域' },
        { key: 'Y', color: '#ffc82c', label: '展开 / 折叠' },
        { key: '右摇杆', label: '滚动页面' },
        { key: 'LS', label: '折叠按键提示' },
    ],
    toggleKey: GP.LS,
})

const collapsed = ref(false)

/** 注入样式。会校验颜色字符串是否合法，不合法返回 undefined（避免注入垃圾样式） */
function keyStyle(color?: string) {
    if (!color) return undefined
    // CSS.supports 兼容性没问题，Edge 105+ / 其他早就支持
    if (typeof CSS === 'undefined' || !CSS.supports('color', color)) return undefined
    return {
        '--hint-key-color': color,
        '--hint-key-text': 'black'
    }
}

// 独立订阅：只关心 LS 一个按键，不感知导航状态
const nav = useGamepadNavigation()
const off = nav.addButtonHandler((e) => {
    if (e.type === 'down' && e.button === props.toggleKey) {
        collapsed.value = !collapsed.value
    }
})
onUnmounted(() => off())
</script>

<template>
    <div class="gamepad-hint" :class="{ 'is-collapsed': collapsed }">
        <!-- 折叠态：只留一个 LS 展开提示 -->
        <button v-if="collapsed" type="button" class="gamepad-hint__toggle" aria-label="展开手柄按键提示"
            @click="collapsed = false">
            <kbd class="gamepad-hint__key">LS</kbd>
            <span class="gamepad-hint__toggle-label">展开</span>
        </button>

        <!-- 展开态：完整按键列表 -->
        <section v-else class="gamepad-hint__panel" role="region" aria-label="手柄按键提示">
            <header class="gamepad-hint__header">
                <span class="gamepad-hint__title">手柄操作</span>
                <button type="button" class="gamepad-hint__close" aria-label="折叠手柄按键提示" @click="collapsed = true">
                    ×
                </button>
            </header>
            <ul class="gamepad-hint__list">
                <li v-for="item in hints" :key="item.key" class="gamepad-hint__item">
                    <kbd class="gamepad-hint__key" :style="keyStyle(item.color)">{{ item.key }}</kbd>
                    <span class="gamepad-hint__label">{{ item.label }}</span>
                </li>
            </ul>
        </section>
    </div>
</template>

<style scoped>
.gamepad-hint {
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 900;
    font-size: 12px;
    line-height: 1.5;
    color: var(--vp-c-text-1);
    user-select: none;
}

/* ---------- 折叠态 ---------- */
.gamepad-hint__toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    background: var(--vp-c-bg-elv);
    border: 1px solid var(--vp-c-divider);
    border-radius: 999px;
    color: var(--vp-c-text-2);
    cursor: pointer;
    box-shadow: var(--vp-shadow-2);
    backdrop-filter: blur(8px);
    transition: color 0.2s, border-color 0.2s;
}

.gamepad-hint__toggle:hover {
    color: var(--vp-c-text-1);
    border-color: var(--vp-c-brand-1);
}

.gamepad-hint__toggle-label {
    font-weight: 500;
}

/* ---------- 展开态 ---------- */
.gamepad-hint__panel {
    width: 220px;
    background: var(--vp-c-bg-elv);
    border: 1px solid var(--vp-c-divider);
    border-radius: 10px;
    box-shadow: var(--vp-shadow-3);
    backdrop-filter: blur(10px);
    overflow: hidden;
}

.gamepad-hint__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
    border-bottom: 1px solid var(--vp-c-divider);
    font-weight: 600;
    color: var(--vp-c-text-2);
}

.gamepad-hint__title {
    font-size: 12px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
}

.gamepad-hint__close {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    color: var(--vp-c-text-3);
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
}

.gamepad-hint__close:hover {
    background-color: var(--vp-c-default-soft);
    color: var(--vp-c-text-1);
}

.gamepad-hint__list {
    margin: 0;
    padding: 6px 10px 8px;
    list-style: none;
}

.gamepad-hint__item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 3px 0;
}

/* ---------- 按键 kbd ---------- */
.gamepad-hint__key {
    flex-shrink: 0;
    min-width: 20px;
    padding: 0 6px;
    text-align: center;
    font-family: var(--vp-font-family-mono);
    font-size: 12px;
    font-weight: 600;
    color: var(--hint-key-text, var(--vp-c-text-1));
    background: var(--hint-key-color, var(--vp-c-default-soft));
    border: 1px solid var(--hint-key-color, var(--vp-c-divider));
    border-radius: 16px;
}

.gamepad-hint__label {
    color: var(--vp-c-text-2);
}

/* 小屏时缩小/隐藏 */
@media (max-width: 640px) {
    .gamepad-hint {
        right: 12px;
        bottom: 12px;
    }

    .gamepad-hint__panel {
        width: 180px;
    }
}
</style>