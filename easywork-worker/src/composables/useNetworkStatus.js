import { ref, onMounted, onUnmounted } from 'vue'

export function useNetworkStatus() {
  const isOnline = ref(navigator.onLine)
  const quality = ref('good') // good | weak | offline

  let pingInterval = null

  async function checkConnection() {
    if (!navigator.onLine) {
      quality.value = 'offline'
      return
    }

    try {
      const start = Date.now()
      await fetch('/api/auth/health', { method: 'HEAD', cache: 'no-cache' })
      const latency = Date.now() - start

      quality.value = latency < 500 ? 'good' : 'weak'
    } catch {
      quality.value = 'offline'
    }
  }

  function handleOnline() {
    isOnline.value = true
    checkConnection()
  }

  function handleOffline() {
    isOnline.value = false
    quality.value = 'offline'
  }

  onMounted(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    checkConnection()
    pingInterval = setInterval(checkConnection, 30000)
  })

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
    if (pingInterval) clearInterval(pingInterval)
  })

  return { isOnline, quality }
}
