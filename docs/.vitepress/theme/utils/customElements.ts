import { inBrowser } from 'vitepress'

// 触发器处理器接口
type TriggerHandler = {
    init: (el: Element) => void;
};

// 模块级变量（确保单例）
let initialized = false;
let triggeredSet = new WeakSet<Element>();
let observedSet = new WeakSet<Element>();
let lknObserver: MutationObserver|null = null;
// 动画元素的选择器
const SELECTOR = "lkn[animated][script-init]";
// 动画触发器注册表
const triggerRegistry = new Map<string, TriggerHandler>();
// 进入视口触发器
triggerRegistry.set("enter-viewport", {
    init(el) {
        //使用监视器监视元素
        const observer = new IntersectionObserver( entries => {
            entries.forEach( entry => {
                const el = entry.target as HTMLElement;
                // 如果元素已经触发过动画，不再处理
                if (triggeredSet.has(el)) return;
                if (entry.isIntersecting) {
                    // 元素进入视口，开始计时
                    // 不过在此之前先解析一下配置
                    let config = { delay: 2000 }; // 默认值
                    const configAttr = el.getAttribute("trigger-config");
                    if (configAttr) {
                        try {
                            config = { ...config, ...JSON.parse(configAttr) }; // 合并配置
                        } catch (e) {}
                    }
                    let timerId: number|null = window.setTimeout(() => {
                        // 简单起见，我们信任计时器没有被清除就表示元素一直可见
                        el.classList.add("animation-play"); // 添加动画类名
                        triggeredSet.add(el);
                        // 触发后停止观察该元素
                        observer.unobserve(el);
                        timerId = null;
                    }, config.delay);
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
        }, {
            threshold: .9 //元素露出90%算进入视口
        })
        observer.observe(el);
    }
});

/**
 * 一个入口函数，初始化所有\<lkn\>元素动画逻辑，并自动监视动态添加的元素。
 * 如果此函数是在单个文档中调用的，请使用onMounted()调用此函数。
 */
export function initLknAnimation() {
    //防止重复初始化&在浏览器环境下才执行初始化
    if (initialized || !inBrowser) return;
    //开始观察
    lknObserver = startObserve();
    initialized = true;
}

/**
 * 一个卸载函数，作用是消灭元素监视器。
 * 如果入口函数是在单个文档中调用的，请在目标文档组件卸载时调用此函数。
 */
export function destoryObserver() {
    lknObserver?.disconnect();
    lknObserver = null;
    triggeredSet = new WeakSet<Element>();
    observedSet = new WeakSet<Element>();
    initialized = false;
}

/**
 *  遍历已有\<lkn\>元素并初始化，然后监视动态添加的元素。
 */
function startObserve() {
    //遍历已有元素
    document.querySelectorAll(SELECTOR).forEach(el => { checkElement(el) });

    //看看有没有新来的lkn元素
    const observer = new MutationObserver(mutations => {
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
    });//监视整个文档子树变化
    observer.observe(document.body, { childList: true, subtree: true });
    return observer;


    /**
     *  检查\<lkn\>元素script-init属性并初始化对应动画的函数
     */
    function checkElement(el: Element) {
        const type = el.getAttribute("script-init")!;
        const handler = triggerRegistry.get(type);
        if (handler) handler.init(el);
        observedSet.add(el);
    }
}