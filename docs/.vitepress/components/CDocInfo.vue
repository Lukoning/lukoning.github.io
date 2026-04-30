<!-- 部分代码来自文件 VPDocFooterLastUpdated.vue -->

<script setup lang="ts">
import { useNavigatorLanguage } from '@vueuse/core'
import { computed, onMounted, shallowRef, useTemplateRef, watchEffect } from 'vue'
import { useData } from 'vitepress'

defineOptions({ name: "CDocInfo" })

const { theme, page, lang: pageLang } = useData()
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
    const lang = theme.value.lastUpdated?.formatOptions?.forceLocale
      ? pageLang.value
      : browserLang.value

    const option = theme.value.lastUpdated?.formatOptions ?? {
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
    <p class="doc-info created-time">
      {{ theme.lastUpdated?.createdText || 'Created time' }}:
      <time ref="createdTimeRef" :datetime="createdIsoDatetime">{{ createdDatetime }}</time>
    </p>
    <p class="doc-info last-updated">
      {{ theme.lastUpdated?.text || theme.lastUpdatedText || 'Last updated' }}:
      <time ref="timeRef" :datetime="updatedIsoDatetime">{{ updatedDatetime }}</time>
    </p>
  </div>

</template>

<style scoped>
.CDocInfo {
  margin-bottom: 16px;
}
.doc-info {
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}
</style>