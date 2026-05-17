<script setup lang="ts">
import { useData } from 'vitepress'

defineOptions({ name: "CReturnToTopPlus" })

const { theme } = useData()

</script>

<template>
    <div class="CReturnToTopPlus">
        <a href="#">
            {{ theme.returnToTopLabel || 'Return to top' }}
        </a>
    </div>
</template>

<style lang="scss" scoped>
.CReturnToTopPlus a {
    display: block;
    margin: 0 0 4px 8px;
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
    .CReturnToTopPlus a {
        font-size: 14px;
    }
}
</style>