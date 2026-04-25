---
createdDate: 2026-04-17T22:15:08+08:00
title: 开放源代码许可
order: 1
---

<script setup lang="ts">
function License(licenseName: string, copyright: string) {
    const license = {
MIT: `<p>MIT License</p>
<p>Copyright © ${copyright}</p>
<p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
<p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
<p>THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
`,
ISC: `<p>ISC License</p>
<p>Copyright © ${copyright}</p>
<p>Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.</p>
<p>THE SOFTWARE IS PROVIDED “AS IS” AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL ISC BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.</p>
`,
    };
    return license[licenseName as keyof typeof license] || "<p>未知许可证</p>";
}
</script>

# 开放源代码许可

*本页仅列出本站、直接依赖项（也就是[package.json](https://github.com/Lukoning/lukoning.github.io/blob/VitePress/package.json)中写明的依赖）和直接使用的其他项目（尤其是包含在最终构建产物中的项目）的许可，TS类型包除外。更多依赖项的信息请见[package-lock.json](https://github.com/Lukoning/lukoning.github.io/blob/VitePress/package-lock.json)。*

## LKN个人小站 - CC BY-NC-SA 4.0

知识共享(Creative Commons)署名—非商业性使用—相同方式共享4.0国际公共许可协议

***应用于站内原创作品****（许可证标识：🅭🅯🄏🄎）*

除特别声明外，本站所有原创作品（不包括转载作品）均采用此协议进行许可。

完整协议原文参见：[Legal Code - Attribution-NonCommercial-ShareAlike 4.0 International - Creative Commons](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode)

::: tip
以下文本仅仅强调部分核心特征和真正许可协议的部分条款，不是许可协议，也没有法律意义。
:::

### 您可以自由地：

- **共享** — 在任何媒介以任何形式复制、发行本作品

- **演绎** — 修改、转换或以本作品为基础进行创作

- 只要你遵守许可协议条款，许可人就无法收回你的这些权利。


### 惟须遵守下列条件：

- 🅯 **署名** — 您必须给出适当的署名，提供指向本许可协议的链接，同时标明是否（对原始作品）作了修改。您可以用任何合理的方式来署名，但是不得以任何方式暗示许可人为您或您的使用背书。

- 🄏 **非商业性使用** — 您不得将本作品用于商业目的。

- 🄎 **相同方式共享** — 如果您再混合、转换或者基于本作品进行创作，您必须基于与原先许可协议相同的许可协议分发您贡献的作品。

-   **没有附加限制** — 您不得适用法律术语或者技术措施从而限制其他人做许可协议允许的事情。


### 声明：

您不必因为公共领域的作品要素而遵守许可协议，或者您的使用被可适用的例外或限制所允许。

不提供担保。许可协议可能不会给与您意图使用的所必须的所有许可。例如，其他权利比如形象权、隐私权或人格权可能限制您如何使用作品。

## LKN个人小站 - MPL 2.0

Mozilla 公共许可协议，版本 2.0

***应用于站点源代码***

除特别声明外，本站所有源代码均采用此协议进行许可。

完整协议原文参见：[Mozilla Public License, version 2.0](https://mozilla.org/MPL/2.0/)

::: tip
以下文本由AI辅助生成，是仅为方便理解协议而作的说明，不是许可协议，也没有法律意义。
:::

### 您可以自由地
- 使用、复制、修改、分发MPL代码。
- 将MPL代码与私有代码组合，形成整体作品，前提是MPL部分保持MPL许可。
- 对**整个作品**附加其他声明（如商标须知、免责声明、额外的专利限制），前提是不与MPL条款冲突。

### 您必须做到
- **公开修改**：若修改了MPL覆盖的**任何文件**，该文件必须以MPL许可证发布源代码。
- **保留原文**：不得删除或篡改已有版权、许可证及免责声明。
- **说明修改**：若分发修改版，必须标明修改内容及日期。
- **提供源码**：以可执行形式分发时，必须同时提供MPL部分的源代码（或书面承诺提供）。

### 您不能
- 使用贡献者姓名或商标进行市场推广（除非获得单独许可）。
- 免除已有的专利授权或限制用户行使MPL权利。

### 许可证兼容声明
允许将MPL代码**整体再许可**为 GPL 2.0+ 或 LGPL 2.1+（仅限整个作品以此类许可证发布时）。

## Vue.js

[项目仓库](https://github.com/vuejs/core)

<p v-html="License('MIT', '2018-present, Yuxi (Evan) You and Vue contributors')"></p>

## VitePress

[项目仓库](https://github.com/vuejs/vitepress)

<p v-html="License('MIT', '2019-present, Yuxi (Evan) You')"></p>

## VitePress Sidebar

[项目仓库](https://github.com/jooy2/vitepress-sidebar)

<p v-html="License('MIT', '2022-2026 CDGet <jooy2.contact@gmail.com> (https://cdget.com).')"></p>

## vitepress-plugin-image-viewer

[项目仓库](https://github.com/T-miracle/vitepress-plugin-image-viewer)

<p v-html="License('MIT', 'T-miracle')"></p>

## Viewer.js

[项目仓库](https://github.com/fengyuanchen/viewerjs)

<p v-html="License('MIT', '2015-present Chen Fengyuan')"></p>

## vitepress-plugin-group-icons

[项目仓库](https://github.com/yuyinws/vitepress-plugin-group-icons)

<p v-html="License('MIT', '2024-PRESENT Leo <https://github.com/yuyinws>')"></p>

## vitepress-plugin-comment-with-giscus

[项目仓库](https://github.com/T-miracle/vitepress-plugin-comment-with-giscus)

<p v-html="License('ISC', 'T-miracle')"></p>

## Vitepress Plugins

*使用的插件：vitepress-plugin-tabs*

[项目仓库](https://github.com/sapphi-red/vitepress-plugins)

<p v-html="License('MIT', '2022 sapphi-red')"></p>

## Pagefind

[项目仓库](https://github.com/pagefind/pagefind)

<p v-html="License('MIT', '2022 Pagefind')"></p>

## sugar-blog

*使用的插件：vitepress-plugin-pagefind*

[项目仓库](https://github.com/ATQQ/sugar-blog)

<p v-html="License('MIT', '2020 sugar')"></p>

## Embedded Sass

[项目仓库](https://github.com/sass/embedded-host-node)

<p v-html="License('MIT', '2019, Google LLC')"></p>

## NProgress {#nprogress-heading}
<!-- VitePress会自动生成id="nprogress"，与nprogress加载条冲突。这里手动指定别的ID来避免。 -->

[项目仓库](https://github.com/rstacruz/nprogress)

<p v-html="License('MIT', '2013-2014 Rico Sta. Cruz')"></p>

## OverlayScrollbars

[项目仓库](https://github.com/KingSora/OverlayScrollbars)

<p v-html="License('MIT', '2022 Rene Haas')"></p>

## OverlayScrollbars for Vue

[项目仓库](https://github.com/KingSora/OverlayScrollbars/tree/master/packages/overlayscrollbars-vue)

<p v-html="License('MIT', '2022 Rene Haas')"></p>

## Remix Icon

[项目仓库](https://github.com/Remix-Design/remixicon)

[Original License Agreement](https://remixicon.com/license)

All Remix Icons are free to use for personal and commercial projects.

For full terms, please refer to the [Remix Icon License v1.0](https://github.com/Remix-Design/remixicon/blob/master/License).

#### Permissions
- Free for personal and commercial projects
- Use in websites, apps, software, templates, UI kits, and presentations
- Modify, adapt, and integrate icons into your own designs
- Distribute icons as part of a larger product (where icons are not the main value)
- Credit Remix Icon (optional, but appreciated)

#### Prohibitions
- Sell Remix Icons as standalone products or icon packs.
- Use Remix Icons as the primary value of a commercial product.
- Use brand icons for purposes unrelated to the represented brand.
- Use Remix Icons as logos, trademarks, or brand identities.
- Using Remix Icons (brand icons excepted) as a logo compromises its semantic neutrality as a functional symbol.

## Heroicons

[项目仓库](https://github.com/tailwindlabs/heroicons)

<p v-html="License('MIT', 'Tailwind Labs, Inc.')"></p>