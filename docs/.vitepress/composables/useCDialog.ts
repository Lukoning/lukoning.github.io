import { ref, readonly } from 'vue'

interface DialogButton {
  theme?: 'brand' | 'alt' | 'alt-trans' | 'sponsor'
  text: string
  icon?: string
  callback?: () => void | Promise<void>    // 点击回调，支持异步
  closeAfter?: boolean    // 点击后是否自动关闭，默认 true
}

type DialogOptions = {
  title?: string
  content?: string
  closeOnMaskClick?: boolean
  buttons?: DialogButton[] // 新增动态按钮数组
}

const isVisible = ref(false)
const options = ref<DialogOptions>({})

export function useCDialog() {
  const open = (opts: DialogOptions) => {
    options.value = opts
    isVisible.value = true
    document.body.style.overflow = "hidden"
  }

  const close = () => {
    isVisible.value = false
    document.body.style.overflow = ""
  }

  return {
    isVisible: readonly(isVisible),
    options: readonly(options),
    open,
    close,
  }
}