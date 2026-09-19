<script setup lang="ts">
import VPButton from './LKNButton.vue'

interface DialogButton {
    theme?: 'brand' | 'alt' | 'alt-trans' | 'sponsor'
    text: string
    icon?: string
    callback?: () => void | Promise<void>    // 点击回调，支持异步
    closeAfter?: boolean    // 点击后是否自动关闭，默认 true
}

const props = defineProps<{
    visible: boolean
    options: {
        title?: string
        content?: string
        closeOnMaskClick?: boolean
        buttons?: DialogButton[] | readonly DialogButton[]// 新增动态按钮数组
    }
}>()

const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'close'): void
}>()

const close = () => {
    emit('update:visible', false)
    emit('close')
}

const handleMaskClick = () => {
    if (props.options.closeOnMaskClick !== false) {
        close()
    }
}

const handleButtonClick = async (btn: DialogButton) => {
    // 执行回调（若有）
    if (btn.callback) {
        await btn.callback()    // 支持异步，等待完成再决定是否关闭
    }
    // 根据 closeAfter 决定是否关闭（默认为 true）
    if (btn.closeAfter !== false) {
        close()
    }
}
</script>

<template>
    <!-- 完全复制搜索对话框的结构 -->
    <Transition
        enter-active-class="command-dialog-enter-active"
        enter-from-class="command-dialog-enter-from"
        leave-active-class="command-dialog-leave-active"
        leave-to-class="command-dialog-leave-to"
        appear
    >
        <div v-if="visible" class="CDialog" command-root>
            <div command-dialog>
                <!-- 遮罩 -->
                <div command-dialog-mask @click.self="handleMaskClick">
                    <!-- 对话框容器 -->
                    <div command-dialog-wrapper>
                        <!-- 头部 -->
                        <div command-dialog-header>
                            <h1>
                                {{ options.title }}
                            </h1>
                        </div>

                        <!-- 主体 -->
                        <div command-dialog-body>
                            <!-- 在这里放自定义内容 -->
                            <slot>
                                <div class="des" v-html="options.content"></div>
                            </slot>
                        </div>

                        <!-- 底部 -->
                        <div command-dialog-footer>
                            <VPButton
                                v-for="(btn, index) in options.buttons"
                                :key="index"
                                size="medium"
                                :theme="btn.theme || 'alt'"
                                @click="handleButtonClick(btn)"
                                :aria-label=btn.text
                            >
                                <span v-if="btn.icon" v-html="btn.icon"></span>
                                {{ btn.text }}
                            </VPButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
[command-dialog-header] {
    padding: 20px 20px 0;
}
[command-dialog-header] h1 {
    font-weight: bold;
    font-size: 24px;
}
[command-dialog-body] {
    padding: 20px;
    font-size: 16px;
    overflow: auto;
}
[command-dialog-footer] {
    height: auto;
    padding: 2px 12px;
    flex-direction: row;
    justify-content: right;
}
.VPButton {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 4px;
}
.VPButton span {
    display: inline-flex;
    transform: translateX(-8px);
}
.VPButton span * {
    display: inline;
    vertical-align: middle;
}
</style>