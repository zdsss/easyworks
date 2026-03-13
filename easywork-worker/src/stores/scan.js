import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useScanStore = defineStore('scan', () => {
  const status = ref('idle') // idle | scanning | success | error

  function setScanning() {
    status.value = 'scanning'
  }

  function setSuccess() {
    status.value = 'success'
    setTimeout(() => { status.value = 'idle' }, 2000)
  }

  function setError() {
    status.value = 'error'
    setTimeout(() => { status.value = 'idle' }, 2000)
  }

  function reset() {
    status.value = 'idle'
  }

  return { status, setScanning, setSuccess, setError, reset }
})
