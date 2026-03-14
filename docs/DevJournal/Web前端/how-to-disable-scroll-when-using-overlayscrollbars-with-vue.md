---
createdDate: 2026-03-14T22:47:37+08:00
title: 使用OverlayScrollbars+Vue时如何禁用滚动
order: 3
---

# 使用OverlayScrollbars+Vue时如何禁用滚动

使用OverlayScrollbars接管`<body>`的滚动后，出现了打开右上角导航菜单时`<body>`仍能被滚动的bug。似乎`style="overflow: hidden;"`并不会被正确应用。

事实上，要禁用滚动，一般只能通过配置OverlayScrollbars选项的方式禁用。

一般页面中，理论上只需要：

```js
//假设上文已经拿到了osInstance
//只禁用垂直滚动
osInstance.options({overflow:{y:"hidden"}});
```

询问了DeepSeek，在VitePress中，需要创建响应式ref来存储`osInstance`。

## AI解法

::: warning 注意
勿用此法，后有反转
:::

为了方便调试，也可以把`osInstance`挂载到`app.config.globalProperties`（Vue全局属性）上。

```ts{9-12,29-30}
//docs/.vitepress/theme/index.ts
import { h, shallowRef } from 'vue'
import { inBrowser } from 'vitepress'
import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars'
…
export default {
  enhanceApp({ app, router, siteData }) {
    if (!inBrowser) return;
    //创建一个响应式ref来存储OverlayScrollbars实例
    const osInstance_body = shallowRef(null);
    //提供给所有子组件
    app.provide('osInstance_body', osInstance_body);
    …
    router.onAfterPageLoad = () => {
      //初始化自定义叠加滚动条
      OverlayScrollbars.plugin([ClickScrollPlugin]);
      const osInstance = OverlayScrollbars(document.body, {
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
      //将osInstance赋值给ref，触发provide更新（关键步骤）
      osInstance_body.value = osInstance;
      //调试用
      app.config.globalProperties.$osInstance_body = osInstance;
    }
  }
} satisfies Theme
```

通过浏览器调试的时候，先在Vue DevTools选中任意Vue元素，然后在控制台执行以下命令，返回以下值就说明挂载成功了：

```js
>>  $vm0.root.appContext.app.config.globalProperties.$osInstance_body
<-  Object
    destroy: BoundFunctionObject { … }
    elements: function elements()
    off: function off(t3, n3)
    on: function addEvent(t3, o2)
    options: function options(t3, n3)
    plugin: function plugin(t3)
    state: function state()
    update: function update(t3)
    <prototype>: Object { … }
```

继续开改：

```ts
//docs/.vitepress/config.ts
export default defineConfig({
  …
  vite: {
    resolve: {
      alias: [
        …
        {
          find: /^.*\/VPNavScreen\.vue$/,
          replacement: fileURLToPath(new URL('./components/LKNNavScreen.vue', import.meta.url))
        },
        …
      ]
    }
  },
  …
})
```

::: code-group
```html[修改后]
<!-- docs/.vitepress/components/LKNNavScreen.vue -->
<script setup lang="ts">
import { useBodyScrollLock } from '../composables/useBodyScrollLock'
import VPNavScreenAppearance from 'vitepress/dist/client/theme-default/components/VPNavScreenAppearance.vue'
import VPNavScreenMenu from 'vitepress/dist/client/theme-default/components/VPNavScreenMenu.vue'
import VPNavScreenSocialLinks from 'vitepress/dist/client/theme-default/components/VPNavScreenSocialLinks.vue'
import VPNavScreenTranslations from 'vitepress/dist/client/theme-default/components/VPNavScreenTranslations.vue'

const props = defineProps<{
  open: boolean
}>()

useBodyScrollLock(() => props.open)
</script>

<template>
  <transition name="fade"> <!-- 删除不需要的属性 -->
    <div v-if="open" class="VPNavScreen" id="VPNavScreen">
      <div class="container">
        <slot name="nav-screen-content-before" />
        <VPNavScreenMenu class="menu" />
        <VPNavScreenTranslations class="translations" />
        <VPNavScreenAppearance class="appearance" />
        <VPNavScreenSocialLinks class="social-links" />
        <slot name="nav-screen-content-after" />
      </div>
    </div>
  </transition>
</template>
…
```
```html[修改前]
<!-- node_modules/vitepress/dist/client/theme-default/components/VPNavScreen.vue -->
<script setup lang="ts">
import { useScrollLock } from '@vueuse/core'
import { inBrowser } from 'vitepress'
import VPNavScreenAppearance from './VPNavScreenAppearance.vue'
import VPNavScreenMenu from './VPNavScreenMenu.vue'
import VPNavScreenSocialLinks from './VPNavScreenSocialLinks.vue'
import VPNavScreenTranslations from './VPNavScreenTranslations.vue'

defineProps<{
  open: boolean
}>()

const isLocked = useScrollLock(inBrowser ? document.body : null)
</script>

<template>
  <transition
    name="fade"
    @enter="isLocked = true"
    @after-leave="isLocked = false"
  >
    <div v-if="open" class="VPNavScreen" id="VPNavScreen">
      <div class="container">
        <slot name="nav-screen-content-before" />
        <VPNavScreenMenu class="menu" />
        <VPNavScreenTranslations class="translations" />
        <VPNavScreenAppearance class="appearance" />
        <VPNavScreenSocialLinks class="social-links" />
        <slot name="nav-screen-content-after" />
      </div>
    </div>
  </transition>
</template>
```
:::

这样就能够正常禁用滚动了。

## 新的解法

又发现了一个新的问题：本来搜索界面打开时应该是要禁用`<body>`滚动的，现在却发生了与菜单相同的禁用失败问题

嘶……

我有预感，这是一个Endless的修改——总不能所有涉及禁用`<body>`滚动的组件全换一遍吧？

既然禁用`<body>`滚动是通过加`style="overflow: hidden;"`实现的，是否可以通过`MutationObserver()`监听style属性，然后自动同步到OverlayScrollbars选项？

在尝试一些其他办法后，我最终选择了这个优雅的办法。

复原之前config.ts和theme/index.ts中的修改，删除LKNNavScreen.vue。

重新修改index.ts：

```ts
//docs/.vitepress/theme/index.ts
…
export default {
  enhanceApp({ app, router, siteData }) {
    …
    router.onAfterPageLoad = () => {
      …
      const osInstance = OverlayScrollbars(document.body, {
        …
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
    if (osInstance.options().overflow?.y !== currentOverflowY) {
      // 更新插件
      osInstance.options({ overflow: { y: currentOverflowY } });
    }
  };

  // 创建MutationObserver并开始观察
  new MutationObserver(() => {
    syncOverflow()
  }).observe(document.body, { attributes: true, attributeFilter: ["style"] });
}
```

这才是最不大费周章的办法，哼哼。