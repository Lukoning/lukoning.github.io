<script setup lang="ts">
import { computed } from 'vue'
import { data } from '../../data/archive.data.ts'

// 先按年份分组，再按月份分小组
const grouped = computed(() => {
    const yearMap = new Map<number, Map<number, typeof data>>()
    for (const item of data) {
        const d = new Date(item.date)
        const year = d.getFullYear()
        const month = d.getMonth() + 1
        if (!yearMap.has(year)) yearMap.set(year, new Map())
        const monthMap = yearMap.get(year)!
        if (!monthMap.has(month)) monthMap.set(month, [])
        monthMap.get(month)!.push(item)
    }
    return Array.from(yearMap.entries())
        .sort((a, b) => b[0] - a[0]) // 年份降序
        .map(([year, monthMap]) => ({
            year,
            total: Array.from(monthMap.values()).reduce((s, arr) => s + arr.length, 0),
            months: Array.from(monthMap.entries())
                .sort((a, b) => b[0] - a[0]) // 月份降序
                .map(([month, items]) => ({ month, items }))
        }))
})

function formatDate(iso: string): string {
    const d = new Date(iso)
    const day = String(d.getDate()).padStart(2, '0')
    return day
}
</script>

<template>
    <div class="CDocArchive">
        <p v-if="!data.length" class="archive-empty">暂无归档文章。</p>

        <section v-for="yearGroup in grouped" :key="yearGroup.year" class="archive-year-group">
            <h2 :id="`archive-${yearGroup.year}`" class="archive-year">
                {{ yearGroup.year }} 年
                <span class="archive-count">共 {{ yearGroup.total }} 篇</span>
            </h2>

            <section
                v-for="monthGroup in yearGroup.months"
                :key="`${yearGroup.year}-${monthGroup.month}`"
                class="archive-month-group"
            >
                <h3
                    :id="`archive-${yearGroup.year}-${monthGroup.month}`"
                    class="archive-month"
                >
                    {{ monthGroup.month }} 月
                    <span class="archive-count">{{ monthGroup.items.length }} 篇</span>
                </h3>
                <ul class="archive-list">
                    <li
                        v-for="item in monthGroup.items"
                        :key="item.link"
                        class="archive-item"
                    >
                        <a :href="item.link" class="archive-link">
                            <span class="archive-head">
                                <time class="archive-date" :datetime="item.date">
                                    {{ formatDate(item.date) }}
                                </time>
                                <span class="archive-title">{{ item.title }}</span>
                            </span>
                            <span class="archive-excerpt">{{ item.excerpt }}</span>
                        </a>
                    </li>
                </ul>
            </section>
        </section>
    </div>
</template>

<style scoped>
.CDocArchive {
    margin-block: 1.5rem;
}

.archive-empty {
    color: var(--vp-c-text-2);
}

.archive-year-group {
    margin-bottom: 2.5rem;
}

.archive-year {
    width: fit-content;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--vp-c-text-1);
    margin: 0 auto 1rem;
    padding: 1rem;
    border-block: none;
    border-inline: 2px solid var(--vp-c-divider);
}

.archive-month-group {
    margin-bottom: 1rem;
}

.archive-month {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--vp-c-text-1);
    margin: 0.5rem 0;
    padding: 0.5rem 0 0.25rem;
}

.archive-count {
    font-size: 0.9rem;
    font-weight: 400;
    color: var(--vp-c-text-2);
}

.archive-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.archive-item {
    display: block;
}

.archive-link {
    color: var(--vp-c-text-1);
    text-decoration: none;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    padding: 0.35rem 0.5rem;
    border-radius: 8px;
}

.archive-link:hover {
    color: var(--vp-c-brand);
    background-color: var(--vp-c-bg-alt);
}

.archive-head {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    min-width: 0;
}

.archive-date {
    color: var(--vp-c-text-2);
    font-size: 0.85rem;
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
}

.archive-title {
    font-weight: 500;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* 最多两行 */
    -webkit-box-orient: vertical;
}

.archive-excerpt {
    font-size: 0.85rem;
    font-weight: 400;
    color: var(--vp-c-text-2);
    line-height: 1.5;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* 最多两行 */
    -webkit-box-orient: vertical;
}
</style>