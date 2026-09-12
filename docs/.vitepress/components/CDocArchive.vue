<script setup lang="ts">
import { computed } from 'vue'
import { data } from '../data/archive.data.ts'

// 按年月分组
const grouped = computed(() => {
    const map = new Map<string, { year: number; month: number; items: typeof data }>()
    for (const item of data) {
        const d = new Date(item.date)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (!map.has(key)) {
            map.set(key, { year: d.getFullYear(), month: d.getMonth() + 1, items: [] })
        }
        map.get(key)!.items.push(item)
    }
    return Array.from(map.values())
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

        <section v-for="group in grouped" :key="`${group.year}-${group.month}`" class="archive-group">
            <h3 class="archive-month">
                {{ group.year }} 年 {{ group.month }} 月
                <span class="archive-count">（{{ group.items.length }}）</span>
            </h3>
            <ul class="archive-list">
                <li v-for="item in group.items" :key="item.link" class="archive-item">
                    <a :href="item.link" class="archive-link">
                        <time class="archive-date" :datetime="item.date">
                            {{ formatDate(item.date) }}
                        </time>
                        {{ item.title }}
                    </a>
                </li>
            </ul>
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

.archive-group {
    margin-bottom: 1.75rem;
}

.archive-month {
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--vp-c-text-1);
    margin: 0 0 0.5rem;
    padding-bottom: 0.35rem;
    border-bottom: 1px solid var(--vp-c-divider);
}

.archive-count {
    font-size: 0.85rem;
    font-weight: 400;
    color: var(--vp-c-text-2);
}

.archive-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.archive-item {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    border-radius: 36px;
    transition: background-color 0.2s ease;
}

.archive-item:hover {
    background-color: var(--vp-c-bg-soft);
}

.archive-link {
    color: var(--vp-c-text-1);
    text-decoration: none;
    font-weight: 500;
    flex: 1;
    min-width: 0;
    padding: 0.35rem 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.archive-link:hover {
    color: var(--vp-c-brand);
}

.archive-date {
    color: var(--vp-c-text-2);
    font-size: 0.85rem;
    margin: 0 0.5rem;
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
}
</style>