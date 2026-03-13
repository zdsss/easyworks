import { ref } from 'vue'

export function useT9Input() {
  const value = ref('')
  const currentKey = ref('')
  const currentIndex = ref(0)
  const timer = ref(null)
  const uppercase = ref(false)

  const keyMap = {
    '1': ['1', '.', ',', '?', '!'],
    '2': ['2', 'a', 'b', 'c'],
    '3': ['3', 'd', 'e', 'f'],
    '4': ['4', 'g', 'h', 'i'],
    '5': ['5', 'j', 'k', 'l'],
    '6': ['6', 'm', 'n', 'o'],
    '7': ['7', 'p', 'q', 'r', 's'],
    '8': ['8', 't', 'u', 'v'],
    '9': ['9', 'w', 'x', 'y', 'z'],
    '0': ['0', ' ']
  }

  function press(key) {
    if (timer.value) clearTimeout(timer.value)

    if (key === currentKey.value) {
      currentIndex.value = (currentIndex.value + 1) % keyMap[key].length
      value.value = value.value.slice(0, -1) + getChar(key, currentIndex.value)
    } else {
      currentKey.value = key
      currentIndex.value = 0
      value.value += getChar(key, 0)
    }

    timer.value = setTimeout(() => {
      currentKey.value = ''
      currentIndex.value = 0
    }, 300)
  }

  function getChar(key, index) {
    const char = keyMap[key][index]
    return uppercase.value && char.match(/[a-z]/) ? char.toUpperCase() : char
  }

  function backspace() {
    value.value = value.value.slice(0, -1)
  }

  function clear() {
    value.value = ''
  }

  function toggleCase() {
    uppercase.value = !uppercase.value
  }

  return { value, press, backspace, clear, toggleCase, uppercase }
}
