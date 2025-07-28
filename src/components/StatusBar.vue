<template>
  <div class="status-bar">
    <div class="status-left">
      <span class="time">{{ currentTime }}</span>
      <div class="status-icons">
        <v-icon size="16" color="green">mdi-wifi</v-icon>
        <v-icon size="16">mdi-signal-cellular-3</v-icon>
        <v-icon size="16">mdi-battery-80</v-icon>
      </div>
    </div>
    <div class="status-right">
      <v-icon size="20">mdi-bell</v-icon>
      <v-avatar size="24" class="ml-2">
        <v-img :src="avatarUrl"></v-img>
      </v-avatar>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  avatarUrl: {
    type: String,
    default: 'https://picsum.photos/seed/avatar/100/100'
  }
});

const currentTime = ref('21:14');

let timeInterval;

onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
};
</script>

<style scoped>
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.status-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time {
  font-weight: bold;
  font-size: 14px;
}

.status-icons {
  display: flex;
  gap: 4px;
}

.status-right {
  display: flex;
  align-items: center;
}
</style>