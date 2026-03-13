import { ref, onMounted, onUnmounted } from 'vue'

export function useBatteryStatus() {
  const level = ref(100)
  const charging = ref(false)
  const supported = ref(false)

  async function updateBattery() {
    if (!('getBattery' in navigator)) return

    try {
      const battery = await navigator.getBattery()
      supported.value = true
      level.value = Math.round(battery.level * 100)
      charging.value = battery.charging

      battery.addEventListener('levelchange', () => {
        level.value = Math.round(battery.level * 100)
      })
      battery.addEventListener('chargingchange', () => {
        charging.value = battery.charging
      })
    } catch {
      supported.value = false
    }
  }

  onMounted(() => {
    updateBattery()
  })

  return { level, charging, supported }
}
