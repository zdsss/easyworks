<template>
  <div class="status-bar">
    <span class="status-item network" :class="networkClass">
      {{ networkIcon }}
    </span>
    <span v-if="batterySupported" class="status-item battery">
      {{ batteryLevel }}% {{ chargingIcon }}
    </span>
    <span class="status-item scan" :class="scanStatus">
      {{ scanIcon }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNetworkStatus } from '@/composables/useNetworkStatus'
import { useBatteryStatus } from '@/composables/useBatteryStatus'
import { useScanStore } from '@/stores/scan'

const { quality } = useNetworkStatus()
const { level: batteryLevel, charging, supported: batterySupported } = useBatteryStatus()
const scanStore = useScanStore()

const networkIcon = computed(() => {
  if (quality.value === 'offline') return '📡'
  if (quality.value === 'weak') return '📶'
  return '📶'
})

const networkClass = computed(() => quality.value)

const chargingIcon = computed(() => charging.value ? '⚡' : '')

const scanIcon = computed(() => {
  if (scanStore.status === 'scanning') return '🔍'
  if (scanStore.status === 'success') return '✓'
  if (scanStore.status === 'error') return '✗'
  return '📷'
})

const scanStatus = computed(() => scanStore.status)
</script>

<style scoped>
.status-bar {
  position: fixed;
  top: 56px;
  right: 10px;
  display: flex;
  gap: 12px;
  background: rgba(0, 0, 0, 0.6);
  padding: 8px 12px;
  border-radius: 8px;
  z-index: 9999;
  font-size: 16px;
}

.status-item {
  display: flex;
  align-items: center;
  color: #fff;
}

.network.offline {
  color: #f56c6c;
}

.network.weak {
  color: #e6a23c;
}

.network.good {
  color: #67c23a;
}

.scan.scanning {
  color: #409eff;
}

.scan.success {
  color: #67c23a;
}

.scan.error {
  color: #f56c6c;
}
</style>
