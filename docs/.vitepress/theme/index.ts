// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import { inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import NProgress from 'nprogress'
import "nprogress/nprogress.css"
import "./customStyle.scss"
import "./customElements.scss"
import "./customAnimations.scss"
import 'overlayscrollbars/overlayscrollbars.css';
import {
  OverlayScrollbars,
  ScrollbarsHidingPlugin,
  SizeObserverPlugin,
  ClickScrollPlugin
} from 'overlayscrollbars';

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout/*layout*/, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    if (!inBrowser) { return } //否则构建时报错
    NProgress.configure({
      easing: 'ease-out', //动画曲线
      showSpinner: true, //显示加载圈
      trickleSpeed: 200, //自动递增间隔
      minimum: 0.2, //启动时使用的最小百分比
    })
    router.onBeforeRouteChange = () => {
      NProgress.start(); // 每次路由切换前开始进度条
    }
    router.onAfterRouteChange = () => {
      NProgress.done(); // 路由切换完成后结束进度条
    }

    router.onAfterPageLoad = () => { //忽略此处报错
      //初始化自定义叠加滚动条
      OverlayScrollbars.plugin([ClickScrollPlugin]);
      OverlayScrollbars(document.querySelector("body"), {
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
      });
      function createSidebarScrollbar(element: Element) {
        OverlayScrollbars(element, {
          scrollbars: {
            theme: "os-theme-light",
            autoHide: "leave",
            autoHideDelay: 800,
            dragScroll: true,
            clickScroll: true,
          },
        });
      }
      const sidebarSelector = "aside.VPSidebar";
      const existingSidebar = document.querySelector(sidebarSelector);
      if (existingSidebar) {
        // 如果侧边栏存在，直接初始化
        createSidebarScrollbar(existingSidebar);
        return;
      }

      // 否则创建 MutationObserver 监听 DOM 变化
      new MutationObserver((_, obs) => {
        const sidebar = document.querySelector(sidebarSelector);
        if (sidebar) {
          // 找到目标元素，初始化并停止观察
          createSidebarScrollbar(sidebar);
          obs.disconnect();
        }
      }).observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }
} satisfies Theme
