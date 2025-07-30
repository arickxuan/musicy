<template>
  <div class="status-bar">
    <div class="status-content">
      <!-- 时间显示 -->
      <div class="status-time">
        {{ currentTime }}
      </div>
      
      <!-- 状态图标 -->
      <div class="status-icons">
        <v-icon size="16" color="white" class="status-icon">mdi-signal</v-icon>
        <v-icon size="16" color="white" class="status-icon">mdi-wifi</v-icon>
        <v-icon size="16" color="white" class="status-icon">mdi-bluetooth</v-icon>
        <div class="battery-indicator">
          <span class="battery-percentage">{{ batteryLevel }}%</span>
          <v-icon size="16" color="white" class="status-icon">mdi-battery</v-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentTime = ref('')
const batteryLevel = ref(80)
let timeInterval = null

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })
}

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
.status-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(26, 26, 26, 0.9);
  backdrop-filter: blur(10px);
  height: 44px;
}

.status-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 100%;
}

.status-time {
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.status-icons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-icon {
  opacity: 0.8;
}

.battery-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
}

.battery-percentage {
  font-size: 12px;
  color: white;
  opacity: 0.8;
}
</style>