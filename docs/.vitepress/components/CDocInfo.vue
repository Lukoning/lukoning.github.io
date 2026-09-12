<!-- 部分代码来自文件 VPDocFooterLastUpdated.vue -->

<script setup lang="ts">
import { useNavigatorLanguage } from '@vueuse/core'
import { computed, onMounted, shallowRef, useTemplateRef, watchEffect } from 'vue'
import { useData } from 'vitepress'
import VPBadge from 'vitepress/dist/client/theme-default/components/VPBadge.vue'
import VPIcon from 'vitepress/dist/client/theme-default/components/VPIcon.vue'

defineOptions({ name: "CDocInfo" })

const { theme, page, lang: pageLang, frontmatter } = useData()
const { language: browserLang } = useNavigatorLanguage()
const config = theme.value.CDocInfo

// 根据 text 配置返回要显示的文本
function resolveText(value: string | boolean | undefined, defaultText: string): string {
  if (value === false) return ''
  if (typeof value === 'string') return value
  return defaultText // true 或 undefined 时使用默认文本
}

const authorText = computed(() => resolveText(config.author?.text, 'Author'))
const wordCountText = computed(() => resolveText(config.wordCount?.text, 'Word Count'))
const readingTimeText = computed(() => resolveText(config.readingTime?.text, 'Reading Time'))
const licenseText = computed(() => resolveText(config.license?.text, 'License'))
const copyrightText = computed(() => resolveText(config.copyright?.text, 'Copyright Notice'))
const createdText = computed(() => resolveText(config.lastUpdated?.createdText, 'Created time'))
const updatedText = computed(() => resolveText(config.lastUpdated?.text, 'Last updated'))

const timeRef = useTemplateRef('timeRef')
const createdTimeRef = useTemplateRef('createdTimeRef')

const createdDate = computed(() => {
  const frontmatterDate = page.value.frontmatter?.createdTime || page.value.frontmatter?.date || page.value.frontmatter?.createdDate
  return frontmatterDate ? new Date(frontmatterDate) : new Date(0) //未定义“创建时间”则回退到1970（）
})

const updatedDate = computed(() => new Date(page.value.lastUpdated!)) //这里会读取文档元数据中的lastUpdated字段，没有则用git提交时间
const createdIsoDatetime = computed(() => createdDate.value.toISOString())
const updatedIsoDatetime = computed(() => updatedDate.value.toISOString())

const createdDatetime = shallowRef('')
const updatedDatetime = shallowRef('')

// set time on mounted hook to avoid hydration mismatch due to
// potential differences in timezones of the server and clients
onMounted(() => {
  watchEffect(() => {
    const lang = config.lastUpdated?.formatOptions?.forceLocale
      ? pageLang.value
      : browserLang.value

    const option = config.lastUpdated?.formatOptions ?? {
      dateStyle: 'medium',
      timeStyle: 'medium'
    }

    createdDatetime.value = new Intl.DateTimeFormat(lang, option).format(createdDate.value)
    updatedDatetime.value = new Intl.DateTimeFormat(lang, option).format(updatedDate.value)

    if (lang && pageLang.value !== lang) {
      timeRef.value?.setAttribute('lang', lang)
      createdTimeRef.value?.setAttribute('lang', lang)
    } else {
      timeRef.value?.removeAttribute('lang')
      createdTimeRef.value?.removeAttribute('lang')
    }
  })
})
</script>

<template>
  <div v-if="frontmatter.showDocInfo !== false" class="CDocInfo">
      <VPBadge type="info" class="doc-info author" v-if="frontmatter.author !== false">
        <VPIcon v-if="config.author?.icon" :icon='{ svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
<path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
</svg>`}' />
        <span v-if="authorText">{{ authorText }}</span>
        {{ frontmatter.author || config.author?.default || 'Unknown' }}
      </VPBadge>
      <VPBadge type="info" class="doc-info word-count" v-if="frontmatter.wordCount !== undefined">
        <VPIcon v-if="config.wordCount?.icon" :icon='{ svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
<path fill-rule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clip-rule="evenodd" />
<path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
</svg>`}' />
        <span v-if="wordCountText">{{ wordCountText }}</span>
        {{ frontmatter.wordCount }}
        {{ config.wordCount?.unitText || 'word(s)' }}
      </VPBadge>
      <VPBadge type="info" class="doc-info reading-time" v-if="frontmatter.readingTime !== undefined">
        <VPIcon v-if="config.readingTime?.icon" :icon='{ svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
<path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clip-rule="evenodd" />
</svg>`}' />
        <span v-if="readingTimeText">{{ readingTimeText }}</span>
        {{ frontmatter.readingTime }}
        {{ config.readingTime?.unitText || 'minute(s)' }}
      </VPBadge>
      <VPBadge type="info" class="doc-info created-time" v-if="frontmatter.createdDate !== false">
        <VPIcon v-if="config.lastUpdated?.createdIcon" :icon='{ svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
<path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clip-rule="evenodd" />
</svg>`}' />
        <span v-if="createdText">{{ createdText }}</span>
        <time ref="createdTimeRef" :datetime="createdIsoDatetime">{{ " " + createdDatetime }}</time>
      </VPBadge>
      <VPBadge type="info" class="doc-info last-updated" v-if="frontmatter.lastUpdated !== false">
        <VPIcon v-if="config.lastUpdated?.icon" :icon='{ svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
<path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
</svg>`}' />
        <span v-if="updatedText">{{ updatedText }}</span>
        <time ref="timeRef" :datetime="updatedIsoDatetime">{{ " " + updatedDatetime }}</time>
      </VPBadge>
      <VPBadge type="info" class="doc-info license" v-if="frontmatter.license !== false && (frontmatter.license || config.license?.default)">
        <VPIcon v-if="config.license?.icon" :icon='{ svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
<path fill-rule="evenodd" d="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-3.873 8.703a4.126 4.126 0 0 1 7.746 0 .75.75 0 0 1-.351.92 7.47 7.47 0 0 1-3.522.877 7.47 7.47 0 0 1-3.522-.877.75.75 0 0 1-.351-.92ZM15 8.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15ZM14.25 12a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15Z" clip-rule="evenodd" />
</svg>`}' />
        <span v-if="licenseText">{{ licenseText }}</span>
        {{ frontmatter.license || config.license?.default }}
      </VPBadge>
      <VPBadge type="info" class="doc-info copyright" v-if="frontmatter.copyright !== false && (frontmatter.copyright || config.copyright?.default)">
        <VPIcon v-if="config.copyright?.icon" :icon='{ svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
<path fill-rule="evenodd" d="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-3.873 8.703a4.126 4.126 0 0 1 7.746 0 .75.75 0 0 1-.351.92 7.47 7.47 0 0 1-3.522.877 7.47 7.47 0 0 1-3.522-.877.75.75 0 0 1-.351-.92ZM15 8.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15ZM14.25 12a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15Z" clip-rule="evenodd" />
</svg>`}' />
        <span v-if="copyrightText">{{ copyrightText }}</span>
        {{ frontmatter.copyright || config.copyright?.default }}
      </VPBadge>
  </div>
</template>

<style scoped>
.CDocInfo {
  margin-block: 4px;
}
.doc-info {
  white-space: pre-line;
  margin: 2px 4px 2px 0;
}
.VPIcon {
  transform: translate(-2px, 2px);
}
</style>