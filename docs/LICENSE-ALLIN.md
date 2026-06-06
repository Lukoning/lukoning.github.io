---
createdDate: 2026-04-17T22:15:08+08:00
title: 开放源代码许可
author: false
order: .Inf
license: false
---

<script setup lang="ts">
function License(licenseName: string, copyright: string) {
    const license = {
MIT: `<details>
<summary>MIT License</summary>
<p>Copyright © ${copyright}</p>
<p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
<p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
<p>THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
</details>`,
ISC: `<details>
<summary>ISC License</summary>
<p>Copyright © ${copyright}</p>
<p>Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.</p>
<p>THE SOFTWARE IS PROVIDED “AS IS” AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL ISC BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.</p>
</details>`,
'SIL1.1': `<details>
<summary>SIL License 1.1</summary>
${copyright}
<h2 tabindex="-1">SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007</h3>
<h3 tabindex="-1">PREAMBLE</h4>
<p>The goals of the Open Font License (OFL) are to stimulate worldwide development of collaborative font projects, to support the font creation efforts of academic and linguistic communities, and to provide a free and open framework in which fonts may be shared and improved in partnership with others.</p>
<p>The OFL allows the licensed fonts to be used, studied, modified and redistributed freely as long as they are not sold by themselves. The fonts, including any derivative works, can be bundled, embedded, redistributed and/or sold with any software provided that any reserved names are not used by derivative works. The fonts and derivatives, however, cannot be released under any other type of license. The requirement for fonts to remain under this license does not apply to any document created using the fonts or their derivatives.</p>
<h3 tabindex="-1">DEFINITIONS</h4>
<p>"Font Software" refers to the set of files released by the Copyright Holder(s) under this license and clearly marked as such. This may include source files, build scripts and documentation.</p>
<p>"Reserved Font Name" refers to any names specified as such after the copyright statement(s).</p>
<p>"Original Version" refers to the collection of Font Software components as distributed by the Copyright Holder(s).</p>
<p>"Modified Version" refers to any derivative made by adding to, deleting, or substituting -- in part or in whole -- any of the components of the Original Version, by changing formats or by porting the Font Software to a new environment.</p>
<p>"Author" refers to any designer, engineer, programmer, technical writer or other person who contributed to the Font Software.</p>
<h3 tabindex="-1">PERMISSION &amp; CONDITIONS</h4>
<p>Permission is hereby granted, free of charge, to any person obtaining a copy of the Font Software, to use, study, copy, merge, embed, modify, redistribute, and sell modified and unmodified copies of the Font Software, subject to the following conditions:</p><ol><li>
<p>Neither the Font Software nor any of its individual components, in Original or Modified Versions, may be sold by itself.</p>
</li><li>
<p>Original or Modified Versions of the Font Software may be bundled, redistributed and/or sold with any software, provided that each copy contains the above copyright notice and this license. These can be included either as stand-alone text files, human-readable headers or in the appropriate machine-readable metadata fields within text or binary files as long as those fields can be easily viewed by the user.</p></li><li>
<p>No Modified Version of the Font Software may use the Reserved Font Name(s) unless explicit written permission is granted by the corresponding Copyright Holder. This restriction only applies to the primary font name as presented to the users.</p></li><li>
<p>The name(s) of the Copyright Holder(s) or the Author(s) of the Font Software shall not be used to promote, endorse or advertise any Modified Version, except to acknowledge the contribution(s) of the Copyright Holder(s) and the Author(s) or with their explicit written permission.</p></li><li>
<p>The Font Software, modified or unmodified, in part or in whole, must be distributed entirely under this license, and must not be distributed under any other license. The requirement for fonts to remain under this license does not apply to any document created using the Font Software.</p></li></ol>
<h3 tabindex="-1">TERMINATION</h4>
<p>This license becomes null and void if any of the above conditions are not met.</p>
<h3 tabindex="-1">DISCLAIMER</h4>
<p>THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM OTHER DEALINGS IN THE FONT SOFTWARE.</p>
`
    };
    return license[licenseName as keyof typeof license] || "<p>未知许可证</p>";
}
</script>

<style>
#VPContent h2 {
    margin-top: 0;
}
lkn[nobr] summary {
    margin-block: 0;
}
</style>

# 开放源代码许可

*本页仅列出本站、直接依赖项（也就是[package.json](https://github.com/Lukoning/lukoning.github.io/blob/VitePress/package.json)中写明的依赖）和直接使用的其他项目（尤其是包含在最终构建产物中的项目）的许可，TS类型包除外。更多依赖包的信息请见[pnpm-lock.yaml](https://github.com/Lukoning/lukoning.github.io/blob/VitePress/pnpm-lock.yaml)。*

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

[项目仓库](https://github.com/vuejs/core) <lkn layout nobr v-html="License('MIT', '2018-present, Yuxi (Evan) You and Vue contributors')"></lkn>

## VueUse

[项目仓库](https://github.com/vueuse/vueuse) <lkn layout nobr v-html="License('MIT', '2019-PRESENT Anthony Fu<https://github.com/antfu>')"></lkn>

## Vite

[项目仓库](https://github.com/vitejs/vite) <lkn layout nobr v-html="License('MIT', '2019-present, VoidZero Inc. and Vite contributors')"></lkn>

## VitePress

[项目仓库](https://github.com/vuejs/vitepress) <lkn layout nobr v-html="License('MIT', '2019-present, Yuxi (Evan) You')"></lkn>

## VitePress Sidebar

[项目仓库](https://github.com/jooy2/vitepress-sidebar) <lkn layout nobr v-html="License('MIT', '2022-2026 CDGet <jooy2.contact@gmail.com> (https://cdget.com).')"></lkn>

## Viewer.js

[项目仓库](https://github.com/fengyuanchen/viewerjs) <lkn layout nobr v-html="License('MIT', '2015-present Chen Fengyuan')"></lkn>

## vitepress-plugin-image-viewer

[项目仓库](https://github.com/T-miracle/vitepress-plugin-image-viewer) <lkn layout nobr v-html="License('MIT', 'T-miracle')"></lkn>

## vitepress-plugin-group-icons

[项目仓库](https://github.com/yuyinws/vitepress-plugin-group-icons) <lkn layout nobr v-html="License('MIT', '2024-PRESENT Leo <https://github.com/yuyinws>')"></lkn>

## vitepress-plugin-comment-with-giscus

[项目仓库](https://github.com/T-miracle/vitepress-plugin-comment-with-giscus) <lkn layout nobr v-html="License('ISC', 'T-miracle')"></lkn>

## vitepress-plugin-breadcrumb

[项目仓库](https://github.com/yanranxiaoxi/vitepress-plugin-breadcrumb) <lkn layout nobr v-html="License('MIT', '2025 XiaoXi <admin@soraharu.com>')"></lkn>

## vitepress-plugin-word-count

[项目仓库](https://github.com/Lukoning/vitepress-plugin-word-count) <lkn layout nobr v-html="License('MIT', '2026 Lukoning')"></lkn>

## Vitepress Plugins

*使用的插件：vitepress-plugin-tabs*

[项目仓库](https://github.com/sapphi-red/vitepress-plugins) <lkn layout nobr v-html="License('MIT', '2022 sapphi-red')"></lkn>

## Pagefind

[项目仓库](https://github.com/pagefind/pagefind) <lkn layout nobr v-html="License('MIT', '2022 Pagefind')"></lkn>

## sugar-blog

*使用的插件：vitepress-plugin-pagefind*

[项目仓库](https://github.com/ATQQ/sugar-blog) <lkn layout nobr v-html="License('MIT', '2020 sugar')"></lkn>

## patch-package

[项目仓库](https://github.com/ds300/patch-package) <lkn layout nobr v-html="License('MIT', '2017-Present David Sheldrick')"></lkn>

## Embedded Sass

[项目仓库](https://github.com/sass/embedded-host-node) <lkn layout nobr v-html="License('MIT', '2019, Google LLC')"></lkn>

## NProgress {#nprogress-heading}
<!-- VitePress会自动生成id="nprogress"，与nprogress加载条冲突。这里手动指定别的ID来避免。 -->

[项目仓库](https://github.com/rstacruz/nprogress) <lkn layout nobr v-html="License('MIT', '2013-2014 Rico Sta. Cruz')"></lkn>

## OverlayScrollbars

[项目仓库](https://github.com/KingSora/OverlayScrollbars) <lkn layout nobr v-html="License('MIT', '2022 Rene Haas')"></lkn>

## OverlayScrollbars for Vue

[项目仓库](https://github.com/KingSora/OverlayScrollbars/tree/master/packages/overlayscrollbars-vue) <lkn layout nobr v-html="License('MIT', '2022 Rene Haas')"></lkn>

## 源泉圓體 | 源泉丸ゴシック | GenSen Rounded

[项目仓库](https://github.com/ButTaiwan/gensen-font) <lkn layout nobr v-html="License('SIL1.1', `Copyright 2014-2019 Adobe (http://www.adobe.com/),<br> with Reserved Font Name 'Source'.<br> Source is a trademark of Adobe in the United States and/or other countries.<p>This Font Software is licensed under the SIL Open Font License, Version 1.1.<br> This license is copied below, and is also available with a FAQ at:<br> http://scripts.sil.org/OFL</p>`)"></lkn>

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

[项目仓库](https://github.com/tailwindlabs/heroicons) <lkn layout nobr v-html="License('MIT', 'Tailwind Labs, Inc.')"></lkn>