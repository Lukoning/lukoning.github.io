// https://vitepress.dev/guide/custom-theme
import { h, shallowRef } from 'vue'
import type { Theme } from 'vitepress'
import { inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import CustomLayout from './Layout.vue'
import './style.css'
import NProgress from 'nprogress'
import "nprogress/nprogress.css"
import "./customStyle.scss"
import "./customElements.scss"
import "./customAnimations.scss"
import 'overlayscrollbars/overlayscrollbars.css'
import {
  OverlayScrollbars,
  ScrollbarsHidingPlugin,
  SizeObserverPlugin,
  ClickScrollPlugin
} from 'overlayscrollbars'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(CustomLayout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    if (!inBrowser) return;//否则构建时报错
    //https://www.npmjs.com/package/nprogress
    NProgress.configure({
      easing: 'ease-out', //动画曲线
      showSpinner: true, //显示加载圈
      trickleSpeed: 200, //自动递增间隔
      minimum: 0.2, //启动时使用的最小百分比
    })
    router.onBeforeRouteChange = () => {
      // 每次路由切换前开始进度条或重置状态
      if (NProgress.isStarted()) NProgress.set(0.2); else NProgress.start();
    }
    router.onAfterRouteChange = () => {
      NProgress.done(); // 路由切换完成后结束进度条
    }

    router.onAfterPageLoad = () => {
      //初始化自定义叠加滚动条
      OverlayScrollbars.plugin([ClickScrollPlugin]);
      const osInstance = OverlayScrollbars(document.body, {
        overflow: {
          x: "scroll",
          y: "scroll",
        },
        scrollbars: {
          theme: "os-theme-light",
          autoHide: "leave",
          autoHideDelay: 800,
          dragScroll: true,
          clickScroll: true,
        },
      });
      //开始观察并同步body上的overflow修改
      startOverflowSync(osInstance);
    }
  }
} satisfies Theme

function startOverflowSync(osInstance: OverlayScrollbars) {
  // 同步函数：当修改 overflow 时，更新插件
  function syncOverflow() {
    // 获取当前 overflow-y 状态
    const currentOverflowY: OverflowBehavior = window.getComputedStyle(document.body).overflowY;
    // 获取插件当前的溢出配置，读取overflow.y，然后比较
    if (osInstance.options().overflow.y !== currentOverflowY) {
      // 更新插件
      osInstance.options({ overflow: {
        y: currentOverflowY==="visible"?"scroll":currentOverflowY // 解决边缘情况下<body>无法滚动问题
      }});
    }
  };

  // 创建MutationObserver并开始观察
  new MutationObserver(() => {
    syncOverflow()
  }).observe(document.body, { attributes: true, attributeFilter: ["style"] });
}