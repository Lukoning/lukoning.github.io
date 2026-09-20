import { createContentLoader } from 'vitepress'

export interface ArchiveItem {
    title: string
    link: string
    date: string // ISO 8601
    excerpt: string
}

declare const data: ArchiveItem[]
export { data }

const RE_SCRIPT_STYLE_H1 = /<(script|style|h1)[\s>][\s\S]*?<\/\1>/gi
const RE_COMMENT = /<!--[\s\S]*?-->/g
const RE_TAG = /<[^>]+>/g
const RE_INVISIBLE = /[\u200B-\u200D\uFEFF]/g

const ENTITIES: Record<string, string> = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#8203;': '',
}

const EXCERPT_MAX_CHARS = 120 // 应约等于中文两行的字符数，可按需调整

// 简易 HTML 实体解码，避免额外依赖
function decodeEntities(s: string): string {
    return s.replace(/&[a-z]+;|&#\d+;|&#x[0-9a-f]+;/gi, m => {
        if (m in ENTITIES) return ENTITIES[m]
        const dec = m.match(/^&#(\d+);$/)
        if (dec) return String.fromCodePoint(Number(dec[1]))
        const hex = m.match(/^&#x([0-9a-f]+);$/i)
        if (hex) return String.fromCodePoint(parseInt(hex[1], 16))
        return m
    })
}

// 从渲染后的 HTML 中去掉标题、抽取纯文本，取前两行

function extractExcerpt(html: string, title?: string): string {
    const text = (html || '')
        .replace(RE_SCRIPT_STYLE_H1, '')
        .replace(RE_COMMENT, '')
        .replace(RE_TAG, '')

    const clean = (s: string) => (s ?? '').replace(RE_INVISIBLE, '').trim()
    const lines = decodeEntities(text).split('\n').map(clean).filter(Boolean)

    const t = clean(title ?? '')
    if (t && lines[0] === t) lines.shift()

    // 合并为单一字符串，按字符数截断
    const merged = lines.join(' ').replace(/\s+/g, ' ').trim()
    if (merged.length <= EXCERPT_MAX_CHARS) return merged
    return merged.slice(0, EXCERPT_MAX_CHARS).trimEnd() + '…'
}

// 与 CDocInfo 完全相同的创建日期优先级链
function resolveCreatedDate(fm: any): Date | null {
    if (!fm) return null
    const raw = fm.createdTime || fm.date || fm.createdDate
    return raw ? new Date(raw) : null
}

// 使用VitePress提供的内容加载器来扫描文档
export default createContentLoader('**/*.md', {
    render: true,          // 关键：让 page 带上 html
    transform(rawData) {
        return rawData
            .map(page => {
                const date = resolveCreatedDate(page.frontmatter)
                if (!date) return null
                return {
                    title: page.frontmatter.title || page.url,
                    link: page.url,
                    date: date.toISOString(),
                    excerpt: extractExcerpt(page.html || '')
                } as ArchiveItem
            })
            .filter((item): item is ArchiveItem => item !== null)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
})