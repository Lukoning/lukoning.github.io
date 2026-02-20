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
    NProgress.configure({ showSpinner: true })
    router.onBeforeRouteChange = () => {
      NProgress.start(); // 每次路由切换前开始进度条
    }
    router.onAfterRouteChange = () => {
      NProgress.done(); // 路由切换完成后结束进度条
    }
  }
} satisfies Theme
