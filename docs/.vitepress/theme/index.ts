// https://vitepress.dev/guide/custom-theme
/// <reference types="vite/client" />
import type { Theme } from 'vitepress'
import { useData, useRoute, inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'

import giscusTalk from 'vitepress-plugin-comment-with-giscus';

import ImageViewerP from '@miletorix/vitepress-image-viewer'
import '@miletorix/vitepress-image-viewer/style.css'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

import NProgress from 'nprogress'
import "nprogress/nprogress.css"
import { OverlayScrollbars, OverflowBehavior, ClickScrollPlugin } from 'overlayscrollbars'
import 'overlayscrollbars/overlayscrollbars.css'
import 'virtual:group-icons.css'

import CustomLayout from './Layout.vue'
import CNavTree from "../components/CNavTree.vue"
import CDocArchive from "../components/CDocArchive.vue"

import './style.css'
import "./customCollection.scss"

//https://www.npmjs.com/package/nprogress
NProgress.configure({
  easing: 'ease-out', //动画曲线
  showSpinner: true, //显示加载圈
  trickleSpeed: 300, //自动递增间隔
  minimum: 0.2, //启动时使用的最小百分比
})

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  setup() {
    const { frontmatter } = useData();
    const route = useRoute();
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
        //自修改版本：
        title: true,
        titleText: "评论区",
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
    enhanceAppWithTabs(app); // vitepress-plugin-tabs
    ImageViewerP(app, {
      transparentBg: true,
      autoShowThumbnails: false
    }); // @miletorix/vitepress-image-viewer
    app.component("CNavTree", CNavTree);
    app.component("CDocArchive", CDocArchive);

    if (!inBrowser) return;//非浏览器环境下返回，否则构建时报错

    initVisitorCount();

    // 页面加载时（何时？）开始进度条（会在路由切换结束时顺便结束）
    NProgress.start();

    router.onBeforeRouteChange = () => {
      // 每次路由切换前开始进度条或重置状态
      if (NProgress.isStarted()) NProgress.set(0.2); else NProgress.start();
    }
    router.onAfterRouteChange = () => {
      NProgress.done(); // 路由切换完成后结束进度条
    }

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

    //加载字体
    Object.entries({
      'R': '400',
      'M': '500',
      'B': '700'
    }).forEach(([key, weight]) => {
      const font = new FontFace(
        "GenSenRounded2 TW Subset",
        `url("/fonts/GenSenRounded2TW/GenSenRounded2TW-${key}-subset.woff2")`,
        {
          style: "normal",
          weight,
          display: "swap"
        }
      );
      font.load().then(
        () => document.fonts.add(font),
        (err) => console.error(err)
      );
    });
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
  if (
    import.meta.env.PROD/*如果是生产环境*/
    && !location.href.includes("://localhost")/*并且不是本地预览*/
  ) new MutationObserver((_, obs) => { //加载图像访问者计数器
    const img = document.querySelector("img[id='visitorCounter!']") as HTMLImageElement | undefined;
    if (img) {
      const url = "https://count.getloli.com/@LukoningPersonalWebsite?name=LukoningPersonalWebsite&theme=love-and-deepspace&scale=0.5&pixelated=1&darkmode=0";
      //替换src为计数器URL
      img.src =
        /*先用本地sessionStorage存储的图片，防止每次刷新都计数+1*/
        sessionStorage.getItem("image.visitorCounter") ?? url;
      img.loading = "eager"; //立即加载
      img.crossOrigin = "Anonymous"; //解决跨域问题
      img.addEventListener("load", () => {
        if (img.src !== url) return;
        // 用canvas转图片为Base64
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        // 绘制图像（包括透明度）
        ctx.drawImage(img, 0, 0);
        // 转为Base64（PNG格式保留透明度）然后存储在sessionStorage
        sessionStorage.setItem("image.visitorCounter", canvas.toDataURL("image/png"));
      })
      obs.disconnect();
    }
  }).observe(document.body, { childList: true, subtree: true });
}