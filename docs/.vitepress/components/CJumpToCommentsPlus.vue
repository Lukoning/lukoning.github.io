<script setup lang="ts">
import { useData } from 'vitepress'

defineOptions({ name: "CJumpToCommentsPlus" })

const { theme } = useData()

</script>

<template>
    <div class="CJumpToCommentsPlus">
        <a href="#comment">
            {{ theme.jumpToCommentsLabel || 'Jump to comments' }}
        </a>
    </div>
</template>

<style lang="scss" scoped>
.CJumpToCommentsPlus a {
    display: block;
    margin: 4px 0 0 8px;
    padding: 8px;
    font-size: 12px;
    font-weight: 500;
    line-height: 24px;
    color: var(--vp-c-text-2);
    transition: color 0.5s;
    position: relative;
    cursor: pointer;
    &:hover {
        color: var(--vp-c-text-1);
        transition: color 0.25s;
    }
}
@media (min-width: 960px) {
    .CJumpToCommentsPlus a {
        font-size: 14px;
    }
}
</style>