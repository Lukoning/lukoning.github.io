import { inBrowser } from 'vitepress'

// 模块级变量（确保单例）
let initialized = false;
let triggeredSet = new WeakSet<Element>();
let observedSet = new WeakSet<Element>();
const SELECTOR = "lkn[animated][script-init]";

// 监听元素进入视口的监听器
const enterViewportObserver = !inBrowser ? null : new IntersectionObserver( entries => {
    entries.forEach( entry => {
        const el = entry.target as HTMLElement;
        // 如果元素已经触发过动画，不再处理
        if (triggeredSet.has(el)) return;
        if (entry.isIntersecting) {
            // 元素进入视口，开始计时
            let timerId: number|null = window.setTimeout(() => {
                // 简单起见，我们信任计时器没有被清除就表示元素一直可见
                el.classList.add("animation-play"); // 添加动画类名
                triggeredSet.add(el);
                // 触发后停止观察该元素
                enterViewportObserver.unobserve(el);
                timerId = null;
            }, Number(
                // 读取延迟属性，没有则使用默认值2000ms
                el.hasAttribute("script-delay") ?
                el.getAttribute("script-delay") :
                2000
            ));
            // 存储 timerId 到元素的自定义属性上，以便在离开时清除
            (el as any).__animationTimer = timerId;
        } else {
            // 元素离开视口，清除计时器
            const timerId = (el as any).__animationTimer;
            if (timerId) {
                clearTimeout(timerId);
                (el as any).__animationTimer = null;
            }
        }
    });
}, { threshold: .9 }); //元素露出90%算进入视口

/**
 *  初始化所有\<lkn\>元素的动画逻辑，并自动监听动态添加的元素。
 */
export function initLknAnimation() {
    //防止重复初始化&在浏览器环境下才执行初始化
    if (initialized || !inBrowser) return;
    //遍历已有元素
    document.querySelectorAll(SELECTOR).forEach(el => { checkElement(el) });
    initialized = true;

    //监听有没有新来的lkn元素
    new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== Node.ELEMENT_NODE) return;
                // 类型转换
                const el = node as Element;
                // 检查节点本身是否为目标元素
                if (el.matches(SELECTOR) && !observedSet!.has(el)) checkElement(el);
                // 检查后代节点中是否包含目标元素
                el.querySelectorAll?.(SELECTOR).forEach(desc => {
                    if (!observedSet!.has(desc)) checkElement(desc);
                });
            });
        });
    }).observe(document.body, { childList: true, subtree: true }); //监听整个文档子树变化
}

/**
 *  检查\<lkn\>元素script-init属性并初始化对应动画的函数
 */
function checkElement(el: Element) {
    if (el.getAttribute("script-init") === "enter-viewport") enterViewportObserver!.observe(el);
    observedSet!.add(el);
}