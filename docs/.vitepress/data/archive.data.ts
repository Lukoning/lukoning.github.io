import { generateSidebar } from 'vitepress-sidebar'

export interface ArchiveItem {
    title: string
    link: string
    date: string // ISO 8601
}

declare const data: ArchiveItem[]
export { data }

// 与 CDocInfo 完全相同的创建日期优先级链
function resolveCreatedDate(fm: any): Date | null {
    if (!fm) return null
    const raw = fm.createdTime || fm.date || fm.createdDate
    return raw ? new Date(raw) : null
}

// 递归展开侧边栏树，收集所有带 link 的叶子项
function flattenSidebar(sidebar: any[], result: any[]) {
    for (const item of sidebar) {
        if (item.link) result.push(item)
        if (Array.isArray(item.items)) flattenSidebar(item.items, result)
    }
}

export default {
    async load(): Promise<ArchiveItem[]> {
        // 用 link → frontmatter 的 Map，承接排序函数的副作用
        const fmMap = new Map<string, any>()

        const sidebar = generateSidebar({
            // ⚠️ 这里必须和站点 config 里的排除规则保持一致，
            // 否则归档页和侧边栏收录的文章会不一致
            documentRootPath: "./docs", //指定文档根目录
            includeRootIndexFile: true, //包含站点首页
            includeFolderIndexFile: true, //包含文件夹首页
            useTitleFromFrontmatter: true, //侧边栏标题显示文件元数据中的标题，否则回退
            useTitleFromFileHeading: true, //回退为显示h1标题，否则显示为文件名

            // 专门用于数据收集：在比较过程中把 frontmatter 存进 Map
            // 降序需要自己写，因为 sortMenusByCustomFunction 不能配合 sortMenusOrderByDescending
            sortMenusByCustomFunction: (a, b) => {
                if (a.link) fmMap.set(a.link, a.frontmatter)
                if (b.link) fmMap.set(b.link, b.frontmatter)

                const da = resolveCreatedDate(a.frontmatter)?.getTime() ?? 0
                const db = resolveCreatedDate(b.frontmatter)?.getTime() ?? 0
                return db - da // 降序
            }
        })

        // generateSidebar 可能返回数组（单侧边栏）或对象（多侧边栏）
        const flat: any[] = []
        if (Array.isArray(sidebar)) {
            flattenSidebar(sidebar, flat)
        } else if (sidebar && typeof sidebar === 'object') {
            for (const value of Object.values(sidebar)) {
                if (Array.isArray(value)) flattenSidebar(value, flat)
            }
        }

        // 用 Map 里的 frontmatter 给每个叶子项补日期
        const items: ArchiveItem[] = []
        for (const item of flat) {
            if (!item.link) continue
            const date = resolveCreatedDate(fmMap.get(item.link))
            if (!date) continue
            items.push({
                title: item.text || item.link,
                link: item.link,
                date: date.toISOString()
            })
        }

        // 最终再按日期降序排一次，保证顺序稳定
        items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        return items
    }
}