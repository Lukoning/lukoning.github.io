<script setup lang="ts">
import { useData } from 'vitepress'
import VPButton from './LKNButton.vue'

defineOptions({ name: "CReturnToTopPlus" })

const { theme } = useData()

</script>

<template>
    <div class="CReturnToTopPlus">
        <VPButton
            tag="a"
            size="small"
            :theme="'alt'"
            :text="theme.returnToTopLabel ?? 'Return to top'"
            :href="'#'"
            :aria-label="theme.returnToTopLabel ?? 'Return to top'"
        />
    </div>
</template>