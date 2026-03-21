---
createdDate: 2026-03-08T10:16:34+08:00
lastUpdated: 2026-03-14T19:00:59+08:00
title: 关于OverlayScrollbars如何应用到Vue元素上的问题
order: 2
---

# 关于OverlayScrollbars如何应用到Vue元素上的问题

这个例子告诉我们，用框架时最好用框架的方式修改，而不是用原生方式……

## bug产生

按照OverlayScrollbars的文档和自己的理解，在`router.onAfterPageLoad`初始化`<body>`的自定义滚动条，小获成功。

```ts [docs/.vitepress/theme/index.ts ~vscode-icons:file-type-typescript~]
export default {
  …
  enhanceApp({ app, router, siteData }) {
    if (!inBrowser) { return } //否则构建时报错
    …
    router.onAfterPageLoad = () => {
      //初始化自定义叠加滚动条
      OverlayScrollbars.plugin([ClickScrollPlugin]);
      OverlayScrollbars({
        target: document.querySelector("body"),
        cancel: {
        //nativeScrollbarsOverlaid: true, 当原生滚动条已经是叠加样式时，终止初始化
        }
      }, {
        scrollbars: {
          theme: "os-theme-light",
          autoHide: "leave",
          autoHideDelay: 800,
          dragScroll: true,
          clickScroll: true,
        },
      });
    }
    …
  }
}
```

尔后尝试对侧边栏应用自定义滚动条，却发现直接用与`<body>`相同的方式会404，并且控制台报错：

```
Uncaught (in promise) TypeError: can't access property "ownerDocument", v2 is null
  createStructureSetupElements structureSetup.elements.ts:101
  createStructureSetup structureSetup.ts:77
  createSetups setups.ts:93
  OverlayScrollbars overlayscrollbars.ts:350
  onAfterRouteChange index.ts:40
  go router.js:27
  async* index.js:133
  promise callback* index.js:131
```

询问DeepSeek，回复说建议使用`new MutationObserver()`监视DOM，当侧边栏元素出现时再初始化滚动条：

```ts [docs/.vitepress/theme/index.ts ~vscode-icons:file-type-typescript~]
// export default -> enhanceApp() -> router.onAfterPageLoad()
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
```

最终可以正常初始化，测试无异常，效果不错，然后就commit了这段代码。

问题就出在这段代码里。

## bug发现

更新自定义滚动条（OverlayScrollbars）的那个夜晚，尝试在手机上使用Firefox访问自己的网站，没成想却看到侧边栏成双成对

侧边栏的位置挤了两个一模一样的侧边栏

左侧边栏可以上下滚动，而右侧边栏被定死（不知道是不是因为略窄一点所以溢出了）

---

一开始以为是安卓版Firefox 143的问题，因为换用Via没法复现问题，这之前在电脑上用Firefox测试也没有问题。

第二天打开电脑访问网站，想找找有没有什么线索。

欸？为什么侧边栏无法滚动

缩小窗口…出现双侧边栏…双侧边栏？欸？？

<img src="./images/PixPin截图%202026-03-08%20122336.png" alt="PixPin截图 2026-03-08 122336" style="zoom:70%;">

*在电脑Edge上复现*

## bug解决

使用devtool看到错误的结构如下：

```html [HTML 5 ~vscode-icons:file-type-html~]
<aside class="VPSidebar open" data-v-1df9f90f data-v-af661f50 data-overlayscrollbars="host">
  <div class data-overlayscrollbars-viewport="scrollbarHidden overflowXHidden overflowYScroll" tabindex="-1" style=" … ">
    <div data-v-345c25f7="" class="curtain"></div>
    <nav class="nav" id="VPSidebarNav" aria-labelledby="sidebar-aria-label" tabindex="-1" data-v-af661f50> … </nav>
  </div>
  <nav data-v-af661f50 class="nav" id="VPSidebarNav" aria-labelledby="sidebar-aria-label" tabindex="-1"> … </nav>
</aside>
```

出现了两个`#VPSidebarNav`，前一个被`div[data-overlayscrollbars-viewport]`，后一个则否，且自定义滚动条本身不翼而飞。

经过测试，只有通过链接直接访问带侧边栏的页面时，才会触发这个bug；通过主页访问带侧边栏的页面则没有问题

当宽度小于960px时，两者在折叠侧边栏同时出现；当宽度大于等于960px时，前者被挤到页面外，只留后者可见。这就是为什么一开始浏览器窗口较大时，侧边栏无法滚动。

::: danger 并且最坑的是，这个bug只在构建产物中出现，在开发服务器中无法以任何方式复现！！
（怪不得一开始没把bug试出来）
:::

询问DeepSeek，表示这是因为初始化没有与Vue生命周期同步，需要自定义初始化组件balabala……

有点繁琐。

我记得好像有个东西叫OverlayScrollbars-Vue对吧？

翻看它的文档，其核心原理是把`<OverlayScrollbarsComponent>`组件放到Vue的组件模板里，将需要自定义滚动条的元素作为它的子元素，这样就可以使OverlayScrollbars与Vue无缝集成了。

最终实现里，使用自定义LKNSidebar.vue组件替换掉VPSidebar.vue

```ts [docs/.vitepress/config.ts ~vscode-icons:file-type-typescript~]
export default defineConfig({
  …
  vite: {
    resolve: {
      alias: [
        …
        {
          find: /^.*\/VPSidebar\.vue$/,
          replacement: fileURLToPath(new URL('./components/LKNSidebar.vue', import.meta.url))
        },
        …
      ]
    }
  },
  …
})
```

```html [docs/.vitepress/components/LKNSidebar.vue ~vscode-icons:file-type-vue~]
<script lang="ts" setup>
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue';
…
</script>

<template>
  <aside
    v-if="hasSidebar"
    class="VPSidebar"
    :class="{ open }"
    ref="navEl"
    @click.stop
  >
    <OverlayScrollbarsComponent
      defer
      element="span"
      :options='{
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
      }'
    >
      <div class="curtain" />

      <nav
        class="nav"
        id="VPSidebarNav"
        aria-labelledby="sidebar-aria-label"
        tabindex="-1"
      >
        <span class="visually-hidden" id="sidebar-aria-label">
          网站目录
        </span>

        <slot name="sidebar-nav-before" />
        <VPSidebarGroup :items="sidebarGroups" :key />
        <slot name="sidebar-nav-after" />
      </nav>
    </OverlayScrollbarsComponent>
  </aside>
</template>
…
```

另外这种方式还需要改overflow、padding和height才能正常生效，具体不细说了。

详情可以看我在2026年3月8号对本站的commits：
<br/>
[Commits · Lukoning/lukoning.github.io](https://github.com/Lukoning/lukoning.github.io/commits/VitePress/?since=2026-03-08&until=2026-03-08)