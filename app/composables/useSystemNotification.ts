import { ref } from 'vue'

export function useSystemNotification() {
  const supported = ref<boolean>(
    typeof window !== 'undefined' && 'Notification' in window
  )

  const permission = ref<NotificationPermission>(
    supported.value ? Notification.permission : 'denied'
  )

  async function requestPermission(): Promise<NotificationPermission> {
    if (!supported.value) {
      permission.value = 'denied'
      return permission.value
    }

    try {
      const result = await Notification.requestPermission()
      permission.value = result
      return result
    } catch {
      permission.value = 'denied'
      return permission.value
    }
  }

  function notify(
    title: string,
    options?: NotificationOptions
  ): boolean {
    if (!supported.value) return false
    if (permission.value !== 'granted') return false

    new Notification(title, options)
    return true
  }

  return {
    supported,
    permission,
    requestPermission,
    notify,
  }
}