// https://vitepress.dev/guide/custom-theme
import { h, shallowRef } from 'vue'
import type { Theme } from 'vitepress'
import { useData, useRoute, inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import CustomLayout from './Layout.vue'
import giscusTalk from 'vitepress-plugin-comment-with-giscus';
import NProgress from 'nprogress'
import "nprogress/nprogress.css"
import {
  OverlayScrollbars,
  ScrollbarsHidingPlugin,
  SizeObserverPlugin,
  ClickScrollPlugin
} from 'overlayscrollbars'
import 'overlayscrollbars/overlayscrollbars.css'
import 'virtual:group-icons.css'
import './style.css'
import "./customStyle.scss"
import "./customElements.scss"
import "./customAnimations.scss"

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(CustomLayout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  setup() {
    const { frontmatter } = useData();
    const route = useRoute();
    giscusTalk(
      {
        repo: "Lukoning/lukoning.github.io",
        repoId: "R_kgDOMTFtmg",
        category: "Announcements",
        categoryId: "DIC_kwDOMTFtms4C6Eq6",
        mapping: "pathname",
        strict: "1",
        reactionsEnabled: "1",
        emitMetadata: "0",
        inputPosition: "top",
        lightTheme: "noborder_light",
        darkTheme: "catppuccin_mocha",
        lang: "zh-CN",
        loading: "lazy",
        crossorigin: "anonymous",
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