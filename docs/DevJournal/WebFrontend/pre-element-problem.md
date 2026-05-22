---
createdDate: 2026-02-10T21:24:04+08:00
lastUpdated: 2026-02-10T22:58:28+08:00
title: pre 元素溢出导致网页背景错位
order: 1
---

# pre元素溢出导致网页背景错位

第一次用 VitePress 做博客，虽然没有用过静态网页生成器，但按官方文档和网络教程，加上自己的一点点前端基础，一天下来基本上搞定了。

不过在手机上浏览 GPL 许可证页面时，遇到了两个问题：

1. 网页滚动时背景图片跟着一起动了
2. 右上角导航菜单异常地宽

大概是这个效果：

<img title="" src="./images/PixPin截图%202026-02-10%20213234.png" alt="PixPin截图 2026-02-10 213234" style="zoom:50%;" data-align="inline"><img title="" src="./images/PixPin截图%202026-02-10%20213110.png" alt="PixPin截图 2026-02-10 213110" style="zoom:50%;" data-align="inline">

这是在Win上用火狐浏览器模拟的

一开始我以为是 CSS background 属性的问题，问了 DeepSeek，DS 说“在移动端和一些较窄的视口中，浏览器对fixed背景的处理方式不同…”巴拉巴拉，然后建议在手机上移除 `background-attachment: fixed`？

不听不信不传，自己找找原因，于是发现这么一个现象：

<img title="" src="./images/PixPin截图%202026-02-10%20214316.png" alt="PixPin截图 2026-02-10 214316" style="zoom:50%;">

这个两个元素怎么溢出了？

开发工具里看到溢出的两个元素都是\<pre\>元素，想着是不是这里导致的问题

给这两个元素加上`overflow: scroll`，诶，bug居然消失了



看来连 AI 也没见过这种情况，实属罕见，就当作本站更新后第一篇博文的内容吧~~
