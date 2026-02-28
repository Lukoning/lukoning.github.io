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
//import layout from "./layout.vue";

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
  }
} satisfies Theme
