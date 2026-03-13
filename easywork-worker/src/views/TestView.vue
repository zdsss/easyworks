<template>
  <div class="test-page">
    <van-nav-bar title="功能测试" fixed />

    <div class="content">
      <van-cell-group title="1. 状态栏测试">
        <van-cell title="状态栏显示" value="检查右上角状态栏" />
        <van-cell title="网络状态" :value="networkQuality" />
        <van-cell title="电池状态" :value="batterySupported ? `${batteryLevel}%` : '不支持'" />
        <van-cell title="扫码状态" :value="scanStore.status" />
      </van-cell-group>

      <van-cell-group title="2. T9输入测试">
        <T9Input />
      </van-cell-group>

      <van-cell-group title="3. 物理按键测试">
        <van-field v-model="keyLog" label="按键记录" type="textarea" readonly rows="3" />
      </van-cell-group>

      <van-cell-group title="4. 扫码反馈测试">
        <van-button type="primary" block @click="testScanSuccess">模拟扫码成功</van-button>
        <van-button type="danger" block @click="testScanError">模拟扫码失败</van-button>
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import T9Input from '@/components/T9Input.vue'
import { useNetworkStatus } from '@/composables/useNetworkStatus'
import { useBatteryStatus } from '@/composables/useBatteryStatus'
import { usePhysicalKeys } from '@/composables/usePhysicalKeys'
import { useScanStore } from '@/stores/scan'

const { quality: networkQuality } = useNetworkStatus()
const { level: batteryLevel, supported: batterySupported } = useBatteryStatus()
const scanStore = useScanStore()
const keyLog = ref('')

usePhysicalKeys({
  onKeyPress: (key) => {
    keyLog.value += `${key} `
  }
})

function testScanSuccess() {
  scanStore.setScanning()
  setTimeout(() => {
    scanStore.setSuccess()
    if ('vibrate' in navigator) navigator.vibrate(200)
  }, 500)
}

function testScanError() {
  scanStore.setScanning()
  setTimeout(() => {
    scanStore.setError()
    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100])
  }, 500)
}
</script>

<style scoped>
.test-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 20px;
}

.content {
  padding-top: 46px;
}

.van-cell-group {
  margin-bottom: 16px;
}

.van-button {
  margin: 8px 12px;
}
</style>
