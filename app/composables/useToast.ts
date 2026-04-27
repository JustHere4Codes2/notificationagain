import Toast from '~/utils/toasts'

export type { ToastOptions } from '~/utils/toasts' // 🔥 reuse single source of truth

export function useToast() {
  function show(options: ToastOptions = {}): Toast {
    return new Toast(options)
  }

  function info(text: string, options: ToastOptions = {}) {
    return show({ ...options, text, type: 'info' })
  }

  function success(text: string, options: ToastOptions = {}) {
    return show({ ...options, text, type: 'success' })
  }

  function warning(text: string, options: ToastOptions = {}) {
    return show({ ...options, text, type: 'warning' })
  }

  function error(text: string, options: ToastOptions = {}) {
    return show({ ...options, text, type: 'error' })
  }

  return {
    show,
    info,
    success,
    warning,
    error,
  }
}