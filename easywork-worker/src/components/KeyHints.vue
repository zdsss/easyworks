<template>
  <div v-if="hints && hints.length" class="key-hints">
    <span
      v-for="hint in hints"
      :key="hint.key"
      class="key-hint-item"
    >
      <span class="key-badge">{{ hint.key }}</span>
      <span class="key-label">{{ hint.label }}</span>
    </span>
  </div>
</template>

<script setup>
defineProps({
  hints: {
    type: Array,
    default: () => [],
    // Each item: { key: string, label: string }
  },
})
</script>

<style scoped>
.key-hints {
  position: fixed;
  bottom: 50px; /* sit just above the 50px tabbar */
  left: 0;
  right: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 12px;
  padding: 5px 12px;
  backdrop-filter: blur(2px);
}

.key-hint-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.key-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  padding: 1px 5px;
  min-width: 20px;
  text-align: center;
  font-family: monospace;
}

.key-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
}
</style>
