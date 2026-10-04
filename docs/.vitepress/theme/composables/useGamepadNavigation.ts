// .vitepress/theme/composables/useGamepadNavigation.ts
import { nextTick } from 'vue'
import { inBrowser } from 'vitepress'
import {
    useGamepadWatcher,
    GP,
    AXIS,
    type GPButtonEvent,
    type GamepadWatcherOptions,
} from './useGamepadWatcher'
export { GP, AXIS } from './useGamepadWatcher'

// ==================== 类型 ====================
export type NavDirection = 'up' | 'down' | 'left' | 'right'
export type NavIntent = NavDirection | 'confirm' | 'cancel' | 'toggle'

export interface GamepadNavigationOptions {
    /** 透传给 useGamepadWatcher 的配置 */
    watcher?: GamepadWatcherOptions
    /** 次轴偏移权重，默认 2。越小越倾向于“正前方”，越大越容忍“偏移” */
    crossAxisWeight?: number
    /** 聚焦后是否平滑滚动，默认 'auto' */
    scrollBehavior?: ScrollBehavior
    /** 右摇杆滚动的死区，默认 0.15 */
    scrollDeadzone?: number
    /** 右摇杆满推时的滚动速度（px/帧），默认 150 */
    scrollSpeed?: number
    /** 是否反转 Y 轴方向（部分手柄 Y 值方向相反），默认 false */
    scrollInvertY?: boolean
    /** 区域选择器（用于区域导航模式），默认见 DEFAULT_REGION_SELECTOR */
    regionSelector?: string
}

// ==================== 常量 ====================
// 可聚焦元素选择器
const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled]):not(.caret)',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '.VPButton',
].join(',')

// 上下方向的区域顺序（从上到下）。
// 只包含垂直堆叠的区域——侧边栏/大纲是并排的列，不参与上下导航。
const VERTICAL_REGION_SELECTORS = [
    '.VPNav', // 顶部导航栏
    '.VPLocalNav', // 移动端顶栏
    '.VPDoc .content-container > *:not(h1)', // 正文内容，展开应为 doc-before, main, VPDocFooter, doc-after
    '#giscus', // 评论区
    '.VPFooter', // 页脚
]

// 横向导航的列定义（从左到右）。侧边栏和右侧大纲是并排的列，
// 内容区用 <main> 作为整列的代表。
const HORIZONTAL_REGION_SELECTORS = [
    '.VPSidebar', // 左侧边栏
    '.VPDoc .content-container > main',
    '.VPDocAside', // 右侧大纲
]

// 路由跳转后希望聚焦的内容区（按优先级尝试）
const CONTENT_SELECTORS = [
    '.VPHero',  // 首页大头
    '.doc-before',  // 正文之前
    'main.main', //正文
]

// ==================== 模块级单例状态 ====================
let crossAxisWeight = 2
let scrollBehavior: ScrollBehavior = 'auto'
let scrollDeadzone = 0.15
let scrollSpeed = 150
let scrollInvertY = false

// 右摇杆滚动速度（归一化 -1~1）
const scrollVelocity = { x: 0, y: 0 }
// 作用域
interface ScopeFrame {
    el: HTMLElement
    prevFocus: HTMLElement | null
    prevMode: 'region' | 'element'
    prevRegion: HTMLElement | null
    onCancel?: () => void
}
const scopeStack: ScopeFrame[] = []

// 区域导航状态
let navMode: 'region' | 'element' = 'region'
let currentRegion: HTMLElement | null = null

// ==================== 内部工具 ====================
function isVisible(el: HTMLElement): boolean {
    // offsetParent 为 null 且不是 fixed 定位，视为不可见
    if (el.offsetParent === null && getComputedStyle(el).position !== 'fixed') return false
    const rect = el.getBoundingClientRect()
    return rect.width > 0 || rect.height > 0
}

/**
 * 查找焦点元素后面紧跟的 caret 按钮。
 * 支持两种 DOM 结构：
 *   <focused/><button class="caret"/>
 *   <focused/><div class="caret-container"><button class="caret"/></div>
 * 找不到返回 null。
 */
function findFollowingCaret(el: HTMLElement): HTMLElement | null {
    const sibling = el.nextElementSibling
    if (!(sibling instanceof HTMLElement)) return null

    // 直接跟着 button.caret
    if (sibling.matches('button.caret')) return sibling

    // 跟着 div.caret-container，内部有直接子元素 button.caret
    if (sibling.matches('div.caret-container')) {
        const btn = sibling.querySelector<HTMLElement>(':scope > button.caret')
        if (btn) return btn
    }
    return null
}

function getFocusable(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
        .filter(isVisible)
}

/**
 * 按选择器列表顺序收集区域元素。
 * 每个选择器展开为多个元素时，保留它们在 DOM 中的自然顺序。
 * 返回顺序 = 选择器数组顺序 × 每个选择器内部 DOM 顺序。
 */
function getOrders(regionSelectors: string[]): HTMLElement[] {
    const result: HTMLElement[] = []
    for (const sel of regionSelectors) {
        document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
            if (isVisible(el) && !result.includes(el)) result.push(el)
        })
    }
    return result
}

/** 把元素的矩形裁剪到视口内。元素完全在视口外时退化为一个零尺寸点（贴近最近的边缘）。 */
function clampInto(el: HTMLElement, out: { top: number; bottom: number; left: number; right: number }) {
    const r = el.getBoundingClientRect()
    const vw = window.innerWidth, vh = window.innerHeight
    out.top    = Math.max(0, Math.min(vh, r.top))
    out.bottom = Math.max(0, Math.min(vh, r.bottom))
    out.left   = Math.max(0, Math.min(vw, r.left))
    out.right  = Math.max(0, Math.min(vw, r.right))
}

// 复用对象，减少对象创建销毁操作
const _rA = { top: 0, bottom: 0, left: 0, right: 0 }
const _rB = { top: 0, bottom: 0, left: 0, right: 0 }

/** 几何最近邻：在候选数组里找离 current 最近的元素 */
function findNearest(
    current: HTMLElement,
    direction: NavDirection,
    candidates: HTMLElement[],
): HTMLElement | null {
    const list = candidates.filter(el => el !== current)
    if (!list.length) return null

    clampInto(current, _rA)
    const cCx = (_rA.left + _rA.right) / 2
    const cCy = (_rA.top + _rA.bottom) / 2

    let best: HTMLElement | null = null
    let bestScore = Infinity

    for (const cand of list) {
        clampInto(cand, _rB)
        const cx = (_rB.left + _rB.right) / 2
        const cy = (_rB.top + _rB.bottom) / 2
        const dx = cx - cCx
        const dy = cy - cCy

        let main: number
        let cross: number
        switch (direction) {
            case 'right':
                if (dx <= 0) continue
                main = dx; cross = Math.abs(dy); break
            case 'left':
                if (dx >= 0) continue
                main = -dx; cross = Math.abs(dy); break
            case 'down':
                if (dy <= 0) continue
                main = dy; cross = Math.abs(dx); break
            case 'up':
                if (dy >= 0) continue
                main = -dy; cross = Math.abs(dx); break
        }

        // 打分：主轴距离 + 次轴偏移 * 权重
        const score = main + cross * crossAxisWeight
        if (score < bestScore) {
            bestScore = score
            best = cand
        }
    }

    return best
}

function focusElement(el: HTMLElement) {
    document.documentElement.classList.add('gamepad-nav')
    el.focus({ preventScroll: true })
    el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: scrollBehavior })
}

/** 清除元素焦点与 gamepad-nav 类（进入区域模式时用） */
function clearElementFocus() {
    const active = document.activeElement as HTMLElement | null
    if (active && active !== document.body) active.blur()
    document.documentElement.classList.remove('gamepad-nav')
}

/** 固定在视口顶部的 header 所占的总高度（VPNav + VPLocalNav，未遮挡时返回 0） */
function getFixedHeaderHeight(): number {
    let bottom = 0
    for (const sel of ['.VPNav', '.VPLocalNav']) {
        const el = document.querySelector<HTMLElement>(sel)
        if (!el) continue
        const style = getComputedStyle(el)
        if (style.display === 'none' || style.visibility === 'hidden') continue
        if (style.position !== 'fixed' && style.position !== 'sticky') continue
        const r = el.getBoundingClientRect()
        // 元素确实覆盖在视口顶部时才算
        if (r.bottom > 0 && r.top < window.innerHeight) {
            bottom = Math.max(bottom, r.bottom)
        }
    }
    return bottom
}

/**
 * 让区域进入视口可见区（避开顶部固定导航栏）。
 * - direction='down'：对齐元素顶部（看开头）
 * - direction='up'：对齐元素底部（看结尾）
 * - null：默认按顶部对齐
 */
function scrollRegionIntoView(el: HTMLElement, direction: NavDirection | null) {
    const headerH = getFixedHeaderHeight()
    const rect = el.getBoundingClientRect()
    const viewTop = headerH
    const viewBottom = window.innerHeight

    // 元素已完整可见 → 不动
    if (rect.top >= viewTop && rect.bottom <= viewBottom) return

    // 横向导航：尽量保持纵向滚动，只在完全不可见时才滚
    if (direction === 'left' || direction === 'right') {
        if (rect.bottom < viewTop) {
            // 完全在视口上方 → 对齐底部
            window.scrollBy({ top: rect.bottom - viewTop, behavior: scrollBehavior })
        } else if (rect.top > viewBottom) {
            // 完全在视口下方 → 对齐顶部
            window.scrollBy({ top: rect.top - viewTop, behavior: scrollBehavior })
        }
        // 部分可见 → 保持当前位置，不滚动
        return
    }

    // 纵向导航
    const viewHeight = viewBottom - viewTop
    if (rect.height > viewHeight) {
        if (rect.bottom < viewTop) {
            // 完全在视口上方 → 对齐底部
            window.scrollBy({ top: rect.bottom - viewTop, behavior: scrollBehavior })
        } else if (rect.top > viewBottom) {
            // 完全在视口下方 → 对齐顶部
            window.scrollBy({ top: rect.top - viewTop, behavior: scrollBehavior })
        }
        // 部分可见 → 保持当前位置，不滚动
        return
    }

    if (rect.top < viewTop) {
        window.scrollBy({ top: rect.top - viewTop, behavior: scrollBehavior })
    } else if (rect.bottom > viewBottom) {
        window.scrollBy({ top: rect.bottom - viewBottom, behavior: scrollBehavior })
    }
}

// 缓存高亮元素
let _highlighted: HTMLElement | null = null

/** 区域高亮 */
function highlightRegion(el: HTMLElement, direction: NavDirection | null = null) {
    clearRegionHighlight()
    el.classList.add('gamepad-region-focus')
    _highlighted = el
    scrollRegionIntoView(el, direction)
}

/** 清除区域高亮 */
function clearRegionHighlight() {
    if (_highlighted) {
        _highlighted.classList.remove('gamepad-region-focus')
        _highlighted = null
    }
}

/** 区域模式：根据方向分派到垂直顺序或水平几何 */
function moveRegionFocus(direction: NavDirection) {
    if (direction === 'up' || direction === 'down') {
        moveRegionVertical(direction)
    } else {
        moveRegionHorizontal(direction)
    }
}

/** 上下：按预设顺序在垂直堆叠的区域之间移动 */
function moveRegionVertical(direction: 'up' | 'down') {
    const regions = getOrders(VERTICAL_REGION_SELECTORS)
    if (!regions.length) return

    if (!currentRegion || !regions.includes(currentRegion)) {
        currentRegion = regions[0]
        highlightRegion(currentRegion, direction)
        return
    }

    const idx = regions.indexOf(currentRegion)
    const nextIdx = direction === 'down'
        ? Math.min(idx + 1, regions.length - 1)
        : Math.max(idx - 1, 0)

    if (nextIdx !== idx) {
        currentRegion = regions[nextIdx]
        highlightRegion(currentRegion, direction)
    }
}

/** 左右：按预定义顺序在列之间移动 */
function moveRegionHorizontal(direction: 'left' | 'right') {
    const columns = getOrders(HORIZONTAL_REGION_SELECTORS)
    if (!columns.length) return

    if (!currentRegion || !document.contains(currentRegion)) {
        currentRegion = columns[0]
        highlightRegion(currentRegion, direction)
        return
    }

    // 找 currentRegion 属于哪个列
    let colIdx = columns.findIndex(col => col.contains(currentRegion!))
    if (colIdx === -1) {
        // 不在任何列里（如导航栏），用 x 位置匹配最近列
        const cr = currentRegion.getBoundingClientRect()
        const ccx = (cr.left + cr.right) / 2
        let bestDist = Infinity
        columns.forEach((col, i) => {
            const r = col.getBoundingClientRect()
            const cx = (r.left + r.right) / 2
            const d = Math.abs(cx - ccx)
            if (d < bestDist) { bestDist = d; colIdx = i }
        })
    }

    const targetIdx = direction === 'right'
        ? Math.min(colIdx + 1, columns.length - 1)
        : Math.max(colIdx - 1, 0)

    if (targetIdx === colIdx) return

    currentRegion = columns[targetIdx]
    highlightRegion(currentRegion, direction)
}

/** 进入区域：焦点限制在区域内 */
function enterRegion(region: HTMLElement) {
    const focusable = getFocusable(region)
    if (!focusable.length) return
    navMode = 'element'
    clearRegionHighlight()
    focusElement(focusable[0])
}

/** 退出区域：回到区域模式 */
function exitRegion() {
    if (navMode !== 'element') return
    navMode = 'region'
    clearElementFocus()
    if (currentRegion && document.contains(currentRegion)) {
        highlightRegion(currentRegion)
    } else {
        currentRegion = null
        moveRegionFocus('down')
    }
}

function moveFocus(direction: NavDirection) {
    // 1. 弹窗作用域（最高优先级）
    if (scopeStack.length > 0) {
        const container = scopeStack[scopeStack.length - 1].el
        const active = document.activeElement as HTMLElement | null
        if (!active || !container.contains(active)) {
            const first = getFocusable(container)[0]
            if (first) focusElement(first)
            return
        }
        const next = findNearest(active, direction, getFocusable(container))
        if (next) focusElement(next)
        return
    }

    // 2. 区域模式
    if (navMode === 'region') {
        moveRegionFocus(direction)
        return
    }

    // 3. 元素模式（在区域内）
    const container = currentRegion
    if (!container || !document.contains(container)) {
        navMode = 'region'
        moveRegionFocus(direction)
        return
    }
    const active = document.activeElement as HTMLElement | null
    if (!active || !container.contains(active)) {
        const first = getFocusable(container)[0]
        if (first) focusElement(first)
        return
    }
    
    const next = findNearest(active, direction, getFocusable(container))
    if (next) focusElement(next)
}

function triggerConfirm() {
    const el = document.activeElement as HTMLElement | null
    if (!el || el === document.body) return

    // 输入类元素派发 Enter 键（触发搜索、提交等）
    if (el.matches('input, textarea, select, [contenteditable="true"]')) {
        el.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter', bubbles: true, cancelable: true,
        }))
        return
    }
    // 其他元素直接 click
    el.click()
}

/** 摇杆值应用死区，返回归一化后的方向值（-1~1） */
function applyDeadzone(v: number, dz: number): number {
    if (Math.abs(v) < dz) return 0
    return Math.sign(v) * ((Math.abs(v) - dz) / (1 - dz))
}

/** 判断元素在指定轴上是否可滚动 */
function isScrollable(el: HTMLElement, axis: 'x' | 'y'): boolean {
    const style = getComputedStyle(el)
    const overflow = axis === 'x' ? style.overflowX : style.overflowY
    if (overflow !== 'auto' && overflow !== 'scroll' && overflow !== 'overlay') return false
    return axis === 'x'
        ? el.scrollWidth > el.clientWidth
        : el.scrollHeight > el.clientHeight
}

/**
 * 找 el 自己或它内部第一层可滚动的子元素。
 * 用于区域模式：区域本身可滚就滚它，否则看它内部有没有滚动容器。
 */
function findScrollableSelfOrChild(el: HTMLElement, axis: 'x' | 'y'): HTMLElement | null {
    if (isScrollable(el, axis)) return el
    for (const child of el.children) {
        if (child instanceof HTMLElement && isScrollable(child, axis)) return child
    }
    return null
}

/**
 * 从 el 开始向上查找最近的、指定轴上可滚动的祖先。
 * axis='x' 查横向，'y' 查纵向。找不到返回 null。
 */
function findScrollableAncestor(el: HTMLElement | null, axis: 'x' | 'y'): HTMLElement | null {
    let cur: HTMLElement | null = el
    while (cur && cur !== document.body && cur !== document.documentElement) {
        const style = getComputedStyle(cur)
        const overflow = axis === 'x' ? style.overflowX : style.overflowY
        const canScroll = overflow === 'auto' || overflow === 'scroll' || overflow === 'overlay'
        if (canScroll) {
            const hasOverflow = axis === 'x'
                ? cur.scrollWidth > cur.clientWidth
                : cur.scrollHeight > cur.clientHeight
            if (hasOverflow) return cur
        }
        cur = cur.parentElement
    }
    return null
}

let _scrollCacheKey: HTMLElement | null = null
let _scrollCacheX: HTMLElement | null = null
let _scrollCacheY: HTMLElement | null = null

/** 缓存滚动目标 */
function getScrollTargets() {
    // 区域模式：以 currentRegion 为锚点（滚区域本身或内部滚动容器）
    // 元素模式：以 activeElement 为锚点（原有逻辑）
    const anchor = navMode === 'region' && currentRegion
        ? currentRegion
        : (document.activeElement as HTMLElement | null)

    if (anchor !== _scrollCacheKey) {
        _scrollCacheKey = anchor
        if (!anchor) {
            _scrollCacheX = null
            _scrollCacheY = null
        } else if (navMode === 'region') {
            _scrollCacheX = findScrollableSelfOrChild(anchor, 'x')
            _scrollCacheY = findScrollableSelfOrChild(anchor, 'y')
        } else {
            _scrollCacheX = findScrollableAncestor(anchor, 'x')
            _scrollCacheY = findScrollableAncestor(anchor, 'y')
        }
    }
    return { x: _scrollCacheX, y: _scrollCacheY }
}

/** 每帧根据右摇杆速度滚动。
 *  优先滚动焦点元素所在的可滚动祖先；没有才滚整个页面。
 *  弹窗作用域内禁用。 */
function scrollTick() {
    if (scopeStack.length > 0) return
    const dx = scrollVelocity.x * scrollSpeed
    const dy = scrollVelocity.y * scrollSpeed
    if (dx === 0 && dy === 0) return

    const { x: tx, y: ty } = getScrollTargets()
    if (dx !== 0) tx ? (tx.scrollLeft += dx) : window.scrollBy(dx, 0)
    if (dy !== 0) ty ? (ty.scrollTop  += dy) : window.scrollBy(0, dy)
}

/** 手柄按钮事件 → 导航意图 */
function resolveIntent(e: GPButtonEvent): NavIntent | null {
    if (e.type !== 'down') return null
    switch (e.button) {
        case GP.Up: case GP.LSUp: return 'up'
        case GP.Down: case GP.LSDown: return 'down'
        case GP.Left: case GP.LSLeft: return 'left'
        case GP.Right: case GP.LSRight: return 'right'
        case GP.A: return 'confirm'
        case GP.B: return 'cancel'
        case GP.Y: return 'toggle'
        default: return null
    }
}

// ==================== 对外 API ====================
let _navSingleton: ReturnType<typeof _createGamepadNavigation> | null = null

/**
 * 手柄导航的单例入口。
 * 多次调用返回同一实例，避免重复注册按钮/模拟量 handler。
 */
export function useGamepadNavigation(options?: GamepadNavigationOptions) {
    if (!_navSingleton) {
        _navSingleton = _createGamepadNavigation(options)
    }
    return _navSingleton
}

function _createGamepadNavigation(options?: GamepadNavigationOptions) {
    const watcher = useGamepadWatcher(options?.watcher)

    if (options?.crossAxisWeight !== undefined) crossAxisWeight = options.crossAxisWeight
    if (options?.scrollBehavior !== undefined) scrollBehavior = options.scrollBehavior
    if (options?.scrollDeadzone !== undefined) scrollDeadzone = options.scrollDeadzone
    if (options?.scrollSpeed !== undefined) scrollSpeed = options.scrollSpeed
    if (options?.scrollInvertY !== undefined) scrollInvertY = options.scrollInvertY

    /** 鼠标/触摸一按下，退出“手柄模态” */
    function exitGamepadMode() {
        document.documentElement.classList.remove('gamepad-nav')
    }
    if (inBrowser) {
        window.addEventListener('pointerdown', exitGamepadMode, { passive: true })
    }

    /** 注册按钮 handler：区域模式 → 进入；元素模式 → 确认；B → 退出/关弹窗 */
    const offButton = watcher.addButtonHandler((e) => {
        const intent = resolveIntent(e)
        if (!intent) return

        switch (intent) {
            case 'up': case 'down': case 'left': case 'right':
                moveFocus(intent)
                break
            case 'confirm':
                if (scopeStack.length > 0) {
                    triggerConfirm()
                } else if (navMode === 'region' && currentRegion) {
                    enterRegion(currentRegion)
                } else {
                    triggerConfirm()
                }
                break
            case 'cancel':
                if (scopeStack.length > 0) {
                    popScope()
                } else if (navMode === 'element') {
                    exitRegion()
                }
                break
            case 'toggle': {
                const el = document.activeElement as HTMLElement | null
                if (el && el !== document.body) {
                    const caret = findFollowingCaret(el)
                    if (caret) caret.click()
                }
                break
            }
        }
    })

    /** 注册模拟值 handler */
    const offAnalog = watcher.addAnalogHandler((e) => {
        if (e.source !== 'axis') return
        if (e.index === AXIS.RX) {
            scrollVelocity.x = applyDeadzone(e.value, scrollDeadzone)
        } else if (e.index === AXIS.RY) {
            const v = applyDeadzone(e.value, scrollDeadzone)
            scrollVelocity.y = scrollInvertY ? -v : v
        }
    })

    /**
     * 压入一个作用域（如弹窗）：焦点被限制在其内，
     * 并自动聚焦作用域内第一个可聚焦元素。
     * 会自动保存压入前的模式与区域。
     */
    function pushScope(container: HTMLElement, opts?: { onCancel?: () => void }) {
        scopeStack.push({
            el: container,
            prevFocus: document.activeElement as HTMLElement | null,
            prevMode: navMode,
            prevRegion: currentRegion,
            onCancel: opts?.onCancel,
        })
        navMode = 'element'
        clearRegionHighlight()
        nextTick(() => {
            const first = getFocusable(container)[0]
            if (first) focusElement(first)
        })
    }

    /** 弹出作用域：恢复压入前的焦点、模式和区域 */
    function popScope() {
        const frame = scopeStack.pop()
        if (!frame) return
        frame.onCancel?.()
        navMode = frame.prevMode
        currentRegion = frame.prevRegion
        if (navMode === 'region') {
            clearElementFocus()
            if (currentRegion && document.contains(currentRegion)) {
                highlightRegion(currentRegion)
            }
        } else if (frame.prevFocus && document.contains(frame.prevFocus)) {
            frame.prevFocus.focus({ preventScroll: true })
        }
    }

    /** 路由跳转后调用：关闭弹窗、切到区域模式、把当前区域设为内容区并高亮 */
    function focusContent() {
        // 弹窗还开着时先全部关闭
        while (scopeStack.length > 0) popScope()

        // 找第一个存在且可见的内容区
        let content: HTMLElement | null = null
        for (const sel of CONTENT_SELECTORS) {
            const el = document.querySelector<HTMLElement>(sel)
            if (el && isVisible(el)) { content = el; break }
        }
        if (!content) return

        navMode = 'region'
        currentRegion = content
        clearElementFocus()
        highlightRegion(content)
    }

    let scrollRafId: number | null = null

    function start() {
        watcher.start()
        if (scrollRafId === null) {
            const loop = () => {
                scrollTick()
                scrollRafId = requestAnimationFrame(loop)
            }
            scrollRafId = requestAnimationFrame(loop)
        }
        // 首次启动时高亮内容区域
        if (navMode === 'region' && !currentRegion) {
            focusContent()
        }
    }

    /** 停止手柄导航 */
    function stop() {
        watcher.stop()
        if (scrollRafId !== null) {
            cancelAnimationFrame(scrollRafId)
            scrollRafId = null
        }
        scrollVelocity.x = 0
        scrollVelocity.y = 0
        if (inBrowser) {
            window.removeEventListener('pointerdown', exitGamepadMode)
        }
        clearRegionHighlight()
        navMode = 'region'
        currentRegion = null
    }

    /** 注销 handler 并停止手柄导航 */
    function dispose() {
        offButton()
        offAnalog()
        stop()
    }

    return {
        ...watcher,
        start,
        stop,
        focusContent,
        pushScope,
        popScope,
        dispose,
    }
}