<!-- 部分代码来自文件 VPDocFooterLastUpdated.vue -->

<script setup lang="ts">
import { useNavigatorLanguage } from '@vueuse/core'
import { computed, onMounted, shallowRef, useTemplateRef, watchEffect } from 'vue'
import { useData } from 'vitepress'
import VPBadge from 'vitepress/dist/client/theme-default/components/VPBadge.vue'

defineOptions({ name: "CDocInfo" })

const { theme, page, lang: pageLang, frontmatter } = useData()
const { language: browserLang } = useNavigatorLanguage()

const timeRef = useTemplateRef('timeRef')

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
    const lang = theme.value.CDocInfo?.lastUpdated?.formatOptions?.forceLocale
      ? pageLang.value
      : browserLang.value

    const option = theme.value.CDocInfo?.lastUpdated?.formatOptions ?? {
      dateStyle: 'medium',
      timeStyle: 'medium'
    }

    createdDatetime.value = new Intl.DateTimeFormat(lang, option).format(createdDate.value)
    updatedDatetime.value = new Intl.DateTimeFormat(lang, option).format(updatedDate.value)

    if (lang && pageLang.value !== lang) {
      timeRef.value?.setAttribute('lang', lang)
    } else {
      timeRef.value?.removeAttribute('lang')
    }
  })
})
</script>

<template>
  <div class="CDocInfo">
      <VPBadge :type="'info'" class="doc-info author" v-if="frontmatter.author !== false">
        {{ theme.CDocInfo?.authorText || 'Author' }}
        {{ frontmatter.author || theme.CDocInfo?.defaultAuthor || 'Unknown' }}
      </VPBadge>
      <VPBadge :type="'info'" class="doc-info word-count" v-if="frontmatter.wordCount !== undefined">
        {{ theme.CDocInfo?.wordCountText || 'Word Count' }}
        {{ frontmatter.wordCount }}
        {{ theme.CDocInfo?.wordCountUnitText || 'word(s)' }}
      </VPBadge>
      <VPBadge :type="'info'" class="doc-info reading-time" v-if="frontmatter.readingTime !== undefined">
        {{ theme.CDocInfo?.readingTimeText || 'Reading Time' }}
        {{ frontmatter.readingTime }}
        {{ theme.CDocInfo?.readingTimeUnitText || 'minute(s)' }}
      </VPBadge>
      <VPBadge :type="'info'" class="doc-info created-time" v-if="frontmatter.createdDate !== false">
        {{ theme.CDocInfo?.lastUpdated?.createdText || 'Created time' }}
        <time ref="createdTimeRef" :datetime="createdIsoDatetime">{{ createdDatetime }}</time>
      </VPBadge>
      <VPBadge :type="'info'" class="doc-info last-updated" v-if="frontmatter.lastUpdated !== false">
        {{ theme.CDocInfo?.lastUpdated?.text || theme.lastUpdatedText || 'Last updated' }}
        <time ref="timeRef" :datetime="updatedIsoDatetime">{{ updatedDatetime }}</time>
      </VPBadge>
      <VPBadge :type="'info'" class="doc-info license" v-if="frontmatter.license !== false && (frontmatter.license || theme.CDocInfo?.defaultLicense)">
        {{ theme.CDocInfo?.licenseText || 'License' }}
        {{ frontmatter.license || theme.CDocInfo?.defaultLicense }}
      </VPBadge>
      <VPBadge :type="'info'" class="doc-info copyright" v-if="frontmatter.copyright !== false && (frontmatter.copyright || theme.CDocInfo?.defaultCopyright)">
        {{ theme.CDocInfo?.copyrightText || 'Copyright Notice' }}
        {{ frontmatter.copyright || theme.CDocInfo?.defaultCopyright }}
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
</style>