import { onMounted, onUnmounted } from 'vue'

export function usePhysicalKeys(handlers = {}) {
  const keyMap = {
    '48': '0', '49': '1', '50': '2', '51': '3', '52': '4',
    '53': '5', '54': '6', '55': '7', '56': '8', '57': '9',
    '13': 'ENTER',
    '8': 'BACKSPACE',
    '27': 'ESC',
    '37': 'LEFT',
    '38': 'UP',
    '39': 'RIGHT',
    '40': 'DOWN',
  }

  let keyDownTime = {}

  function handleKeyDown(e) {
    const key = keyMap[e.keyCode]
    if (!key) return

    keyDownTime[key] = Date.now()

    if (handlers.onKeyDown) {
      handlers.onKeyDown(key, e)
    }
  }

  function handleKeyUp(e) {
    const key = keyMap[e.keyCode]
    if (!key) return

    const duration = Date.now() - (keyDownTime[key] || 0)
    const isLongPress = duration > 500

    if (isLongPress && handlers.onLongPress) {
      handlers.onLongPress(key, e)
    } else if (handlers.onKeyPress) {
      handlers.onKeyPress(key, e)
    }

    delete keyDownTime[key]
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
  })

  return { keyMap }
}
