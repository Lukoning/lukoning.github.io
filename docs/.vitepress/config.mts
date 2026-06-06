import { defineConfig } from 'vitepress'
import { generateSidebar } from "vitepress-sidebar"
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { pagefindPlugin, /* chineseSearchOptimize /*至少Pagefind ^1.5.2不再需要这个*/ } from 'vitepress-plugin-pagefind'
import { withWordCountAndReadingTime } from "vitepress-plugin-word-count"
import { fileURLToPath, URL } from 'node:url'

const componentAliases = {
  'NotFound': 'LKN404',
  'VPButton': 'LKNButton',
  'VPDocFooterLastUpdated': 'Empty',
  'VPLocalNav': 'LKNLocalNav',
  'VPSidebar': 'LKNSidebar',
}

const sidebar = generateSidebar({ // see: https://vitepress-sidebar.cdget.com/zhHans/guide/options
  documentRootPath: "./docs", //指定文档根目录
  includeRootIndexFile: true, //包含首页
  useTitleFromFrontmatter: true, //侧边栏标题显示文件元数据中的标题，否则回退
  useTitleFromFileHeading: true, //回退为显示h1标题，否则显示为文件名
  useFolderLinkFromIndexFile: true, //如果文件夹有自己的index.md，则可以导航到这个文件
  useFolderTitleFromIndexFile: true, //如果文件夹有自己的index.md，使用这个文件的标题作为文件夹名
  excludeFilesByFrontmatterFieldName: "exclude", //不显示元数据包含exclude的文件
  sortMenusByFrontmatterOrder: true, //按文件元数据中指定的数字order自定义排序
  sortMenusOrderByDescending: false, //降序排序（order越小越靠前）
  sortFolderTo: undefined, //没放到文件夹里的，也按照上述方法排序
  collapsed: false, //默认不折叠
});

if (Array.isArray(sidebar)) sidebar.forEach(item => {
  item.collapsed = true;
  /* if (item.text === "蔬菜罐罐汤") {
    item.items?.forEach(item => {
      if (item.text === "个中诗文独白") {
        item.collapsed = true;
      }
    });
  } 似乎没多大必要，对吧 */
})

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "白河豚的站",
  description: "Lukoning（白河豚🌻）的个人网站喵⭐",
  head: [
    ["link", { rel: "icon", type: "image/webp", href: "/favicon.webp" }],
    ["link", { rel: "icon", type: "image/png", href: "/favicon.png" }],
    ["link", { rel: "icon", href: "/favicon.ico" }],
  ],
  lang: "zh-CN",
  locales: {
    root: {
      label: "中文（简体）",
      lang: "zh-CN"
    },
  },
  cleanUrls: true,
  ignoreDeadLinks: true,
  lastUpdated: true, //保留这个用来获取更新时间，原有显示组件在alias处替换为空组件
  metaChunk: true,
  appearance: "dark", //默认深色

  sitemap: { hostname: "https://lukoning.github.io" },

  vite: {
    plugins: [
      groupIconVitePlugin(),
      pagefindPlugin({
        locales: {
          root: {
            closeButtonTitle: '返回去喵',
            displayDetailsButtonTitle: '显示更大点喵',
            resetButtonTitle: '清掉输入喵',
            btnPlaceholder: '搜索本站…',
            placeholder: '在这里输入关键词搜索喵~',
            emptyText: '找不到结果哦喵…\n试试别的表达呜喵？或者用空格分割关键词喵⭐',
            heading: '搜到了 {{searchResult}} 条结果喵！',
            toSelect: '是选择喵',
            toNavigate: '是切换喵',
            toClose: '是关闭喵',
            searchBy: '非常感谢喵~本站使用搜索引擎：',
          },
        },
      })
    ],
    build: {
      target: "es2015",
    },
    resolve: {
      alias: Object.entries(componentAliases).map(([origin, newC]) => ({ //组件替换
        find: new RegExp(`.*/${origin}\\.vue$`),
        replacement: fileURLToPath(new URL(`./components/${newC}.vue`, import.meta.url))
      })),
    }
  },

  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag: string) => tag === "lkn" //将lkn元素视为自定义元素
      }
    }
  },

  markdown: {
    config(md) {
      md.use(groupIconMdPlugin);
      md.use(tabsMarkdownPlugin);
      md.render = withWordCountAndReadingTime(md.render);
    },
    lineNumbers: true,
    image: {
      lazyLoading: true //仅在滚动到图片位置时加载图片
    },
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    }
  },

  themeConfig: {
    CDocInfo: {
      authorText: "👤",
      defaultAuthor: "白河豚🌻",
      wordCountText: "🔤",
      wordCountUnitText: "字/单词",
      readingTimeText: "⌛",
      readingTimeUnitText: "分钟",
      licenseText: "📃 版权协议",
      defaultLicense: "CC BY-NC-SA 4.0",
      copyrightText: "📃 版权声明",
      lastUpdated: {
        text: "🕒 最后更新",
        createdText: "📝 创建时间",
        formatOptions: {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          timeZone: "Asia/Shanghai",
          timeZoneName: "shortGeneric"
        },
      },
    },
    LKNLocalNav: { autoTitleThreshold: true },
    // https://vitepress.dev/reference/default-theme-config
    logo: "/avatar.jpg",

    darkModeSwitchLabel: "切换浅色/深色模式 ->",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
    docFooter: {
      // Inter字体会自动合并为一个箭头
      prev: "<- 上一篇",
      next: "下一篇 ->",
    },
    outlineTitle: "跳转至",
    returnToTopLabel: "↑ 页面顶部",
    jumpToCommentsLabel: "↓ 评论区",
    sidebarMenuLabel: "目录",
    skipToContentLabel: "跳转到正文",
    externalLinkIcon: true,

    search: undefined, //不使用内置搜索，改用pagefind
  
    nav: [
      { text: '提瓦特大陆', link: '/' },
      { text: '饭能市', link: '/ACG/', activeMatch: '/ACG/' },
      { text: '虚空网络', link: '/DevJournal/', activeMatch: '/DevJournal/' },
      { text: '蔬菜罐罐汤', link: '/Murmurs/', activeMatch: '/Murmurs/' },
    ],

    sidebar,

    socialLinks: [
      {
        icon: {svg:` <!-- from Remix Icon: https://remixicon.com/icon/github-fill -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
<path d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z" />
</svg>`},
        link: "https://github.com/Lukoning",
        ariaLabel: "GitHub主页"
      }, {
        icon: {svg:` <!-- from Remix Icon: https://remixicon.com/icon/bilibili-fill -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
<path d="M18.223 3.08609C18.7112 3.57424 18.7112 4.3657 18.223 4.85385L17.08 5.99622L18.25 5.99662C20.3211 5.99662 22 7.67555 22 9.74662V17.2466C22 19.3177 20.3211 20.9966 18.25 20.9966H5.75C3.67893 20.9966 2 19.3177 2 17.2466V9.74662C2 7.67555 3.67893 5.99662 5.75 5.99662L6.91625 5.99622L5.77466 4.85481C5.28651 4.36665 5.28651 3.5752 5.77466 3.08704C6.26282 2.59889 7.05427 2.59889 7.54243 3.08704L10.1941 5.73869C10.2729 5.81753 10.339 5.90428 10.3924 5.99638L13.6046 5.99661C13.6581 5.90407 13.7244 5.81691 13.8036 5.73774L16.4553 3.08609C16.9434 2.59793 17.7349 2.59793 18.223 3.08609ZM18.25 8.50662H5.75C5.09102 8.50662 4.55115 9.01654 4.50343 9.66333L4.5 9.75662V17.2566C4.5 17.9156 5.00992 18.4555 5.65671 18.5032L5.75 18.5066H18.25C18.909 18.5066 19.4489 17.9967 19.4966 17.3499L19.5 17.2566V9.75662C19.5 9.06626 18.9404 8.50662 18.25 8.50662ZM8.25 11.0066C8.94036 11.0066 9.5 11.5663 9.5 12.2566V13.5066C9.5 14.197 8.94036 14.7566 8.25 14.7566C7.55964 14.7566 7 14.197 7 13.5066V12.2566C7 11.5663 7.55964 11.0066 8.25 11.0066ZM15.75 11.0066C16.4404 11.0066 17 11.5663 17 12.2566V13.5066C17 14.197 16.4404 14.7566 15.75 14.7566C15.0596 14.7566 14.5 14.197 14.5 13.5066V12.2566C14.5 11.5663 15.0596 11.0066 15.75 11.0066Z" />
</svg>`},
        link: "https://space.bilibili.com/1922780115",
        ariaLabel: "哔哩哔哩主页"
      }, {
        icon: {svg:` <!-- from Remix Icon: https://remixicon.com/icon/netease-cloud-music-line -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
<path d="M10.4222 11.375C10.1278 12.4026 10.4341 13.4395 11.2058 14.0282C12.267 14.8376 13.7712 14.3289 14.0796 13.0331C14.1599 12.6958 14.1833 12.311 14.1067 11.9767C13.8775 10.9756 13.586 9.98862 13.3147 8.98094C11.9843 9.13543 10.7722 10.1533 10.4222 11.375ZM15.9698 11.0879C16.2427 12.1002 16.2553 13.1053 15.8435 14.0875C14.7148 16.7784 11.1215 17.2286 9.26951 14.9136C7.96829 13.2869 7.99065 10.953 9.32982 9.18031C10.1096 8.14796 11.1339 7.47322 12.3776 7.12595C12.5007 7.09159 12.6241 7.058 12.7566 7.02157C12.6731 6.60736 12.569 6.20612 12.5143 5.79828C12.3375 4.48137 13.026 3.29477 14.2582 2.7574C15.4836 2.22294 16.9661 2.54204 17.7889 3.51738C18.1936 3.99703 18.183 4.59854 17.7631 4.98218C17.3507 5.359 16.7665 5.32761 16.3276 4.89118C16.0809 4.64585 15.8185 4.45112 15.451 4.45569C14.9264 4.46223 14.4642 4.87382 14.5058 5.39329C14.5432 5.86105 14.6785 6.32376 14.8058 6.77892C14.8276 6.85679 15.0218 6.91415 15.1436 6.9321C16.4775 7.12862 17.6476 7.66332 18.6165 8.60769C21.1739 11.1006 21.4772 15.1394 19.2882 18.0482C17.7593 20.0797 15.6785 21.2165 13.1609 21.4567C8.53953 21.8977 4.49683 18.9278 3.46188 14.3992C2.5147 10.2551 4.8397 5.83074 8.79509 4.25032C9.38067 4.01635 9.93787 4.21869 10.1664 4.74827C10.3982 5.28546 10.147 5.83389 9.55552 6.09847C7.18759 7.15787 5.73935 8.9527 5.34076 11.5215C4.80806 14.9546 6.99662 18.2982 10.3416 19.2428C13.0644 20.0117 15.9994 19.0758 17.6494 16.9123C19.2354 14.8328 19.0484 11.8131 17.2221 10.0389C16.7172 9.54838 16.1246 9.21455 15.3988 9.02564C15.5974 9.74151 15.7879 10.4136 15.9698 11.0879Z" />
</svg>`},
        link: "https://music.163.com/user?id=1674431999",
        ariaLabel: "网易云音乐资料页"
      }, {
        icon: {svg:`<!-- from Remix Icon: https://remixicon.com/icon/steam-fill -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
<path d="M12.0052 2C6.75435 2 2.44852 6.05 2.04102 11.1975L7.40102 13.4125C7.85518 13.1033 8.40352 12.9208 8.99435 12.9208C9.04685 12.9208 9.09852 12.9242 9.15102 12.9258L11.5352 9.47417V9.425C11.5352 7.34583 13.2252 5.655 15.3052 5.655C17.3835 5.655 19.0752 7.3475 19.0752 9.4275C19.0752 11.5075 17.3835 13.1983 15.3052 13.1983H15.2177L11.821 15.6242C11.821 15.6675 11.8243 15.7117 11.8243 15.7567C11.8243 17.3192 10.5618 18.5867 8.99935 18.5867C7.63685 18.5867 6.48602 17.6092 6.22352 16.3142L2.38602 14.725C3.57435 18.9225 7.42768 22 12.0052 22C17.5277 22 22.0043 17.5225 22.0043 12C22.0043 6.4775 17.5268 2 12.0052 2ZM7.07852 16.6667C7.29685 17.1192 7.67352 17.4992 8.17352 17.7083C9.25435 18.1575 10.501 17.645 10.9502 16.5625C11.1693 16.0375 11.1702 15.4633 10.9543 14.9383C10.7385 14.4133 10.3293 14.0042 9.80685 13.7858C9.28685 13.5692 8.73185 13.5783 8.24185 13.7608L9.51102 14.2858C10.3077 14.6192 10.6852 15.5358 10.3518 16.3317C10.021 17.1292 9.10435 17.5067 8.30685 17.175L7.07852 16.6667ZM17.8185 9.4225C17.8185 8.0375 16.691 6.91 15.306 6.91C13.9185 6.91 12.7935 8.0375 12.7935 9.4225C12.7935 10.81 13.9185 11.935 15.306 11.935C16.6918 11.935 17.8185 10.81 17.8185 9.4225ZM15.3118 7.53C16.3527 7.53 17.2002 8.375 17.2002 9.41833C17.2002 10.4608 16.3527 11.3058 15.3118 11.3058C14.2677 11.3058 13.4243 10.4608 13.4243 9.41833C13.4243 8.375 14.2685 7.53 15.3118 7.53Z" />
</svg>`},
        link: "https://steamcommunity.com/id/Lukoning",
        ariaLabel: "Steam资料页"
      }, {
        icon: {svg:` <!-- from Heroicons: https://heroicons.com/solid (envelope) -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
<path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
<path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
</svg>`},
        link: "mailto:lukoning08@qq.com",
        ariaLabel: "邮箱"
      },
    ],

    footer: {
      message: `
网站访问总数：
<img style="margin: auto" id="visitorCounter!" alt="[图片]网站访问总数"/>
使用Firefox 145+或Chromium 140+访问本站效果最佳`,
      copyright: `
<a target="_blank" href="https://vitepress.dev">VitePress</a> 提供技术支持
· 当前背景图像源：
<lkn intext hide-light><a target="_blank" href="https://www.pixiv.net/artworks/131044765">進擊的复读机 - 可莉</a></lkn>
<lkn intext hide-dark><a target="_blank" href="https://www.bilibili.com/video/BV1PP4y1U7qA/?share_source=copy_web&t=102">《原神》角色演示-「纳西妲：无垠无忧」</a></lkn>
（侵权请联系删除）
· 原创内容 <a href="/LICENSE-ALLIN#lkn个人小站-cc-by-nc-sa-4-0">CC BY-NC-SA 4.0 协议</a>
· 源码 <a href="/LICENSE-ALLIN#lkn个人小站-mpl-2-0">MPL 2.0 协议</a>
· © 2025-2026 <a target="_blank" href="https://github.com/Lukoning">Lukoning</a>`,
    },

    notFound: {
      code: ":( HTTP 404",
      title: "URL输错了喵？资源不存在哦喵。",
      quote: "VitePress",
      linkText: "返回提瓦特大陆",
      linkLabel: "返回主页",
    },
  },
})
