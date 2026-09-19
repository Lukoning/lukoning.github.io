<script setup lang="ts">
import { useData } from 'vitepress'
import VPButton from './LKNButton.vue'

defineOptions({ name: "CJumpToCommentsPlus" })

const { theme } = useData()

</script>

<template>
    <div class="CJumpToCommentsPlus">
        <VPButton
            tag="a"
            size="small"
            theme="alt"
            :text="theme.jumpToCommentsLabel ?? 'Jump to comments'"
            href="#comments-section"
            :aria-label="theme.jumpToCommentsLabel ?? 'Jump to comments'"
        />
    </div>
</template>