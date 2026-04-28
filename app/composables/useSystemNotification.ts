import { ref, onScopeDispose } from 'vue'

export function useSystemNotification() {
  const supported = ref<boolean>(
    typeof window !== 'undefined' && 'Notification' in window
  )

  const permission = ref<NotificationPermission>(
    supported.value ? Notification.permission : 'denied'
  )

  // Keep permission in sync if the user changes it in browser settings
  if (supported.value) {
    const status = Notification.permission

    navigator.permissions
      .query({ name: 'notifications' })
      .then((status) => {
        const sync = () => {
          permission.value = Notification.permission
        }

        status.addEventListener('change', sync)

        onScopeDispose(() => {
          status.removeEventListener('change', sync)
        })
      })
      .catch(() => {
        // navigator.permissions not available in all browsers — silent fallback
      })
  }

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
  ): Notification | null {
    if (!supported.value) return null
    if (permission.value !== 'granted') return null

    return new Notification(title, options)
  }

  return {
    supported,
    permission,
    requestPermission,
    notify,
  }
}