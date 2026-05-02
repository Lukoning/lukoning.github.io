import 'vitepress'

declare module 'vitepress' {
    namespace DefaultTheme {
        interface Config {
            CDocInfo?: CDocInfoOptions
            LKNLocalNav?: LKNLocalNavOptions
        }
    }
}

interface CDocInfoOptions {
    authorText?: string
    defaultAuthor?: string
    licenseText?: string
    defaultLicense?: string
    copyrightText?: string
    defaultCopyright?: string
    lastUpdated?: {
        text?: string
        createdText?: string
        formatOptions?: Intl.DateTimeFormatOptions & { forceLocale?: boolean }
    }
}

interface LKNLocalNavOptions {
    titleThreshold?: number
    autoTitleThreshold?: boolean
}