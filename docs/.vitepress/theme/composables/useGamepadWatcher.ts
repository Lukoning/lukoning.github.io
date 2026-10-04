// .vitepress/theme/composables/useGamepadWatcher.ts
import { readonly } from 'vue'
import { useGamepad, useRafFn } from '@vueuse/core'

// ==================== 常量 ====================
// 标准 Gamepad API 按钮索引
export const GP = {
    A: 0, B: 1, X: 2, Y: 3,
    LB: 4, RB: 5, LT: 6, RT: 7,
    Select: 8, Start: 9,
    LS: 10, RS: 11,
    Up: 12, Down: 13, Left: 14, Right: 15,
    Home: 16, Touchpad: 17,
    // 虚拟按钮：左右摇杆的四个推动方向
    LSRight: 100, LSLeft: 101, LSDown: 102, LSUp: 103,
    RSRight: 104, RSLeft: 105, RSDown: 106, RSUp: 107,
} as const

// 标准轴索引：0=左摇杆X, 1=左摇杆Y, 2=右摇杆X, 3=右摇杆Y
export const AXIS = { LX: 0, LY: 1, RX: 2, RY: 3 } as const
export const AXIS_INDICES = [AXIS.LX, AXIS.LY, AXIS.RX, AXIS.RY] as const

// ==================== 事件类型 ====================
export interface GPButtonEvent {
    type: 'down' | 'up'
    button: number       // GP 中的按钮索引（含虚拟摇杆按钮）
    value: number        // 数字按钮为 0/1；扳机为其原始模拟值；摇杆方向为其轴值
    gamepadIndex: number
}

export interface GPAnalogEvent {
    source: 'axis' | 'trigger'
    index: number        // 摇杆: 0~3；扳机: 6(LT)/7(RT)
    value: number        // 摇杆: -1~1；扳机: 0~1
    gamepadIndex: number
}

export type GPButtonHandler = (event: GPButtonEvent) => void
export type GPAnalogHandler = (event: GPAnalogEvent) => void

export interface GamepadWatcherOptions {
    /** 摇杆推动阈值（0~1），默认 0.5 */
    stickThreshold?: number
    /** 扳机按下阈值（0~1），默认 0.5 */
    triggerThreshold?: number
    /** 模拟值变化的最小差值，默认 0.02 */
    analogDelta?: number
}

// ==================== 模块级单例状态 ====================
const buttonHandlers = new Set<GPButtonHandler>()
const analogHandlers = new Set<GPAnalogHandler>()
const pressedLastFrame = new Set<string>()   // `${gpIndex}-${btnIndex}`
const prevAnalog = new Map<string, number>() // `${gpIndex}-axis-${i}` / `${gpIndex}-trigger-${i}`

let stickThreshold = 0.5
let triggerThreshold = 0.5
let analogDelta = 0.02
let started = false

// ==================== 内部工具 ====================
function emitButton(event: GPButtonEvent) {
    buttonHandlers.forEach(h => h(event))
}
function emitAnalog(event: GPAnalogEvent) {
    analogHandlers.forEach(h => h(event))
}

/** 按钮边沿检测：返回 'down' | 'up' | null */
function detectButtonEdge(gp: Gamepad, index: number, isDown: boolean, value: number): 'down' | 'up' | null {
    const key = `${gp.index}-${index}`
    const was = pressedLastFrame.has(key)

    if (isDown && !was) {
        pressedLastFrame.add(key)
        return 'down'
    }
    if (!isDown && was) {
        pressedLastFrame.delete(key)
        return 'up'
    }
    return null
}

/** 摇杆轴 + 方向 → 虚拟按钮索引 */
function stickVirtualButton(axis: number, sign: 'positive' | 'negative'): number {
    if (axis === AXIS.LX) return sign === 'positive' ? GP.LSRight : GP.LSLeft
    if (axis === AXIS.LY) return sign === 'positive' ? GP.LSDown : GP.LSUp
    if (axis === AXIS.RX) return sign === 'positive' ? GP.RSRight : GP.RSLeft
    if (axis === AXIS.RY) return sign === 'positive' ? GP.RSDown : GP.RSUp
    return -1
}

/** 将单个手柄的当前状态解析为事件并派发 */
function resolveEvents(gp: Gamepad) {
    // 1. 数字按钮：0~5, 8~17（跳过 6/7 的扳机）
    for (let i = 0; i < gp.buttons.length; i++) {
        if (i === GP.LT || i === GP.RT) continue
        const btn = gp.buttons[i]
        const edge = detectButtonEdge(gp, i, btn.pressed, btn.value)
        if (edge) {
            emitButton({
                type: edge,
                button: i,
                value: btn.value,
                gamepadIndex: gp.index,
            })
        }
    }

    // 2. 扳机（LT/RT）：用 value 与可配阈值模拟按钮边沿
    for (const i of [GP.LT, GP.RT]) {
        const btn = gp.buttons[i]
        if (!btn) continue
        const isDown = btn.value > triggerThreshold
        const edge = detectButtonEdge(gp, i, isDown, btn.value)
        if (edge) {
            emitButton({
                type: edge,
                button: i,
                value: btn.value,
                gamepadIndex: gp.index,
            })
        }
    }

    // 3. 左右摇杆方向：超过阈值视为“虚拟按钮按下”
    for (const axis of AXIS_INDICES) {
        const value = gp.axes[axis] ?? 0
        const abs = Math.abs(value)
        if (abs < 0.001) continue // 完全回中，不产生虚拟按钮事件
        const sign: 'positive' | 'negative' = value > 0 ? 'positive' : 'negative'
        const vBtn = stickVirtualButton(axis, sign)
        if (vBtn < 0) continue

        const isDown = abs > stickThreshold
        const edge = detectButtonEdge(gp, vBtn, isDown, value)
        if (edge) {
            emitButton({
                type: edge,
                button: vBtn,
                value,
                gamepadIndex: gp.index,
            })
        }
    }

    // 4. 模拟值：摇杆轴 + 扳机
    for (const axis of AXIS_INDICES) {
        const value = gp.axes[axis] ?? 0
        const key = `${gp.index}-axis-${axis}`
        const prev = prevAnalog.get(key)
        if (prev === undefined || Math.abs(prev - value) > analogDelta) {
            prevAnalog.set(key, value)
            emitAnalog({ source: 'axis', index: axis, value, gamepadIndex: gp.index })
        }
    }
    for (const i of [GP.LT, GP.RT]) {
        const btn = gp.buttons[i]
        if (!btn) continue
        const value = btn.value
        const key = `${gp.index}-trigger-${i}`
        const prev = prevAnalog.get(key)
        if (prev === undefined || Math.abs(prev - value) > analogDelta) {
            prevAnalog.set(key, value)
            emitAnalog({ source: 'trigger', index: i, value, gamepadIndex: gp.index })
        }
    }
}

/** 手柄断开时清理该手柄的所有状态 */
function resetGamepad(index: number) {
    const prefix = `${index}-`
    for (const key of [...pressedLastFrame]) {
        if (key.startsWith(prefix)) pressedLastFrame.delete(key)
    }
    for (const key of [...prevAnalog.keys()]) {
        if (key.startsWith(prefix)) prevAnalog.delete(key)
    }
}

// ==================== 对外 API ====================
export function useGamepadWatcher(options?: GamepadWatcherOptions) {
    const { gamepads, isSupported, onConnected, onDisconnected, pause, resume } = useGamepad()

    // 仅在未启动时接受配置覆盖，避免多组件调用冲突
    if (!started) {
        if (options?.stickThreshold !== undefined) stickThreshold = options.stickThreshold
        if (options?.triggerThreshold !== undefined) triggerThreshold = options.triggerThreshold
        if (options?.analogDelta !== undefined) analogDelta = options.analogDelta
    }

    // 每帧采样
    function tick() {
        for (const gp of gamepads.value) {
            if (gp) resolveEvents(gp)
        }
    }

    const { pause: pauseRaf, resume: resumeRaf } = useRafFn(tick, { immediate: false })

    function start() {
        if (started || !isSupported.value) return
        started = true
        resume()       // 让 useGamepad 恢复轮询
        resumeRaf()    // 启动我们的采样循环
    }

    function stop() {
        if (!started) return
        started = false
        pauseRaf()
        pause()
        pressedLastFrame.clear()
        prevAnalog.clear()
    }

    /** 注册按钮事件处理器，返回取消注册函数 */
    function addButtonHandler(handler: GPButtonHandler): () => void {
        buttonHandlers.add(handler)
        return () => buttonHandlers.delete(handler)
    }

    /** 注册模拟值变化事件处理器，返回取消注册函数 */
    function addAnalogHandler(handler: GPAnalogHandler): () => void {
        analogHandlers.add(handler)
        return () => analogHandlers.delete(handler)
    }

    /** 动态调整阈值 */
    function setThresholds(opts: { stick?: number; trigger?: number; analogDelta?: number }) {
        if (opts.stick !== undefined) stickThreshold = opts.stick
        if (opts.trigger !== undefined) triggerThreshold = opts.trigger
        if (opts.analogDelta !== undefined) analogDelta = opts.analogDelta
    }

    // 手柄断开自动清理
    onDisconnected((index) => resetGamepad(index))

    return {
        isSupported,
        isStarted: () => started,
        gamepads: readonly(gamepads),
        start,
        stop,
        addButtonHandler,
        addAnalogHandler,
        setThresholds,
        onConnected,
        onDisconnected,
    }
}