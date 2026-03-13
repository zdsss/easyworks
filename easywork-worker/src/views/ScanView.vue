<template>
  <div class="scan-view">
    <van-nav-bar title="扫码操作" />

    <div class="scan-content">
      <van-cell-group inset title="输入工单条码">
        <van-field
          v-model="barcode"
          label="条码"
          placeholder="请输入或扫描工单号"
          clearable
          autofocus
          @keyup.enter="handleScanStart"
        />
      </van-cell-group>

      <div class="action-buttons">
        <van-button
          type="primary"
          block
          :loading="startLoading"
          :disabled="!barcode"
          @click="handleScanStart"
        >
          扫码开工
        </van-button>
        <van-button
          type="success"
          block
          :loading="reportLoading"
          :disabled="!barcode"
          @click="handleScanReport"
          class="report-button"
        >
          扫码报工
        </van-button>
      </div>

      <van-divider v-if="result">操作结果</van-divider>

      <van-cell-group v-if="result" inset>
        <van-cell title="工单号" :value="result.orderNumber" />
        <van-cell title="产品" :value="result.productName" />
        <van-cell title="当前工序" :value="`${result.processNumber || '-'} - ${result.processName || '-'}`" />
        <van-cell title="工序状态" :value="statusLabel(result.status)" />
        <van-cell title="完成数量" :value="`${result.completedQuantity} / ${result.plannedQuantity}`" />
      </van-cell-group>
    </div>

    <van-tabbar route>
      <van-tabbar-item icon="todo-list-o" to="/workorders">工单</van-tabbar-item>
      <van-tabbar-item icon="scan" to="/scan">扫码</van-tabbar-item>
      <van-tabbar-item icon="phone-o" to="/call">呼叫</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showSuccessToast, showFailToast } from 'vant'
import { scanStart, scanReport } from '@/api/scan'
import { useScanStore } from '@/stores/scan'

const scanStore = useScanStore()

const barcode = ref('')
const startLoading = ref(false)
const reportLoading = ref(false)
const result = ref(null)

const statusLabel = (status) => {
  const map = {
    NOT_STARTED: '未开工',
    STARTED: '进行中',
    REPORTED: '已报工',
    INSPECT_PASSED: '质检通过',
    INSPECT_FAILED: '质检失败',
    COMPLETED: '已完成',
  }
  return map[status] || status
}

function playFeedback(success) {
  if (success) {
    if ('vibrate' in navigator) navigator.vibrate(200)
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGi77eeeTRAMUKfj8LZjHAY4ktfyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUrgs7y2Ik2CBhpvO3nnk0QDFA=')
    audio.play().catch(() => {})
  } else {
    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100])
  }
}

const handleScanStart = async () => {
  if (!barcode.value) return
  startLoading.value = true
  result.value = null
  scanStore.setScanning()
  try {
    result.value = await scanStart(barcode.value.trim())
    scanStore.setSuccess()
    playFeedback(true)
    showSuccessToast('开工成功')
  } catch (e) {
    scanStore.setError()
    playFeedback(false)
  } finally {
    startLoading.value = false
  }
}

const handleScanReport = async () => {
  if (!barcode.value) return
  reportLoading.value = true
  result.value = null
  scanStore.setScanning()
  try {
    result.value = await scanReport(barcode.value.trim())
    scanStore.setSuccess()
    playFeedback(true)
    showSuccessToast('报工成功')
  } catch (e) {
    scanStore.setError()
    playFeedback(false)
  } finally {
    reportLoading.value = false
  }
}
</script>

<style scoped>
.scan-view {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50px;
}
.scan-content {
  padding: 16px;
}
.action-buttons {
  margin-top: 24px;
}
.report-button {
  margin-top: 12px;
}
</style>
