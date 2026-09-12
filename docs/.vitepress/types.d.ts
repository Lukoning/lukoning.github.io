import 'vitepress'

declare module 'vitepress' {
    namespace DefaultTheme {
        interface Config {
            CDocInfo?: CDocInfoOptions
            LKNLocalNav?: LKNLocalNavOptions
            jumpToCommentsLabel?: string
        }
    }
}

interface CDocInfoOptions {
    author?: {
        icon?: boolean
        text?: string | boolean
        default?: string
    }
    wordCount?: {
        icon?: boolean
        text?: string | boolean
        unitText?: string
    }
    readingTime?: {
        icon?: boolean
        text?: string | boolean
        unitText?: string
    }
    license?: {
        icon?: boolean
        text?: string | boolean
        default?: string
    }
    copyright?: {
        icon?: boolean
        text?: string | boolean
        default?: string
    }
    placeDocInfoAtBottom?: boolean
    lastUpdated?: {
        icon?: boolean
        text?: string | boolean
        createdIcon?: boolean
        createdText?: string | boolean
        formatOptions?: Intl.DateTimeFormatOptions & { forceLocale?: boolean }
    }
}

interface LKNLocalNavOptions {
    titleThreshold?: number
    autoTitleThreshold?: boolean
}