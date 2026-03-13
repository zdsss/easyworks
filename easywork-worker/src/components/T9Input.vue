<template>
  <div class="t9-input">
    <van-field :model-value="value" label="输入" readonly />
    <div class="t9-keyboard">
      <van-button v-for="key in ['1','2','3','4','5','6','7','8','9','0']" :key="key" @click="press(key)">
        {{ key }}
      </van-button>
      <van-button @click="toggleCase">{{ uppercase ? 'ABC' : 'abc' }}</van-button>
      <van-button @click="backspace">删除</van-button>
      <van-button @click="clear" @touchstart="startLongPress" @touchend="cancelLongPress">清空</van-button>
    </div>
  </div>
</template>

<script setup>
import { useT9Input } from '@/composables/useT9Input'

const { value, press, backspace, clear, toggleCase, uppercase } = useT9Input()

let longPressTimer = null

function startLongPress() {
  longPressTimer = setTimeout(clear, 500)
}

function cancelLongPress() {
  if (longPressTimer) clearTimeout(longPressTimer)
}
</script>

<style scoped>
.t9-keyboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 12px;
}
</style>
