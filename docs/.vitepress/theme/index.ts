// https://vitepress.dev/guide/custom-theme
/// <reference types="vite/client" />
import type { Theme } from 'vitepress'
import { useData, useRoute, inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import giscusTalk from 'vitepress-plugin-comment-with-giscus';
import imageViewer from 'vitepress-plugin-image-viewer';
// import vImageViewer from 'vitepress-plugin-image-viewer/lib/vImageViewer.vue';
import 'viewerjs/dist/viewer.min.css';
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

import NProgress from 'nprogress'
import "nprogress/nprogress.css"
import { OverlayScrollbars, OverflowBehavior, ClickScrollPlugin } from 'overlayscrollbars'
import 'overlayscrollbars/overlayscrollbars.css'
import 'virtual:group-icons.css'

import CustomLayout from './Layout.vue'
import CNavTree from "../components/CNavTree.vue"

import './style.css'
import "./customCollection.scss"

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  setup() {
    const { frontmatter } = useData();
    const route = useRoute();
    imageViewer(route); //图片查看器
    giscusTalk( //评论区组件 https://github.com/T-miracle/vitepress-plugin-comment-with-giscus
      {
        repo: "Lukoning/lukoning.github.io",
        repoId: "R_kgDOMTFtmg",
        category: "Comments",
        categoryId: "DIC_kwDOMTFtms4C7EL8",
        mapping: "pathname",
        strict: "1",
        reactionsEnabled: "1",
        emitMetadata: "0",
        inputPosition: "top",
        lightTheme: "noborder_light",
        darkTheme: "catppuccin_mocha",
        lang: "zh-CN",
        loading: "lazy",
        originsRegex: ["https?://localhost:[0-9]+", "https?://lukoning.github.io"],
        homePageShowComment: false, // 首页是否显示评论区，默认为否
      }, {
        frontmatter, route
      },
      //默认值为true，表示为全部页面启用评论，此参数可以忽略；
      //如果为false，则表示不启用
      //可以使用“comment:true”序言在页面上单独启用它
      true
    );
  },
  enhanceApp({ app, router, siteData }) {
    enhanceAppWithTabs(app); //vitepress-plugin-tabs
    app.component('CNavTree', CNavTree);

    if (!inBrowser) return;//非浏览器环境下返回，否则构建时报错

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

    router.onBeforePageLoad = () => {
      // 页面加载前开始进度条（会在路由切换结束时顺便结束）
      NProgress.start();
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
      startOverflowSync(osInstance); //开始观察并同步body上的overflow修改
      initVisitorCount();
    }
  }
} satisfies Theme

function startOverflowSync(osInstance: OverlayScrollbars) {
  new MutationObserver(() => {
    const currentOverflowY = window.getComputedStyle(document.body).overflowY as OverflowBehavior; // 获取当前 overflow-y 状态
    if (osInstance.options().overflow.y !== currentOverflowY) { // 获取插件当前的溢出配置，读取overflow.y，然后比较
      // 更新插件
      osInstance.options({ overflow: {
        y: currentOverflowY==="visible"?"scroll":currentOverflowY // 解决边缘情况下<body>无法滚动问题
      }});
    }
  }).observe(document.body, { attributes: true, attributeFilter: ["style"] });
}

function initVisitorCount() {
  if (import.meta.env.PROD/*如果是生产环境*/&&!location.href.includes("localhost:4173/")/*并且不是本地构建预览*/) new MutationObserver((_, obs) => { //加载图像访问者计数器
    const img = document.querySelector("img[id='visitorCounter!']") as HTMLImageElement | undefined;
    if (img) { //替换src为计数器URL
      img.src = "https://count.getloli.com/@LukoningPersonalWebsite?name=LukoningPersonalWebsite&theme=love-and-deepspace&scale=0.5&pixelated=1&darkmode=0";
      obs.disconnect();
    }
  }).observe(document.body, { childList: true, subtree: true });
}