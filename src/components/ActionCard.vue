<template>
  <v-card
    class="action-card"
    color="rgba(255,255,255,0.05)"
    rounded="xl"
    @click="handleClick"
    hover
  >
    <div class="action-content">
      <v-icon
        :color="action.color"
        size="24"
        class="action-icon"
      >
        {{ action.icon }}
      </v-icon>
      <div class="action-text">{{ action.text }}</div>
    </div>
  </v-card>
</template>

<script setup>
const props = defineProps({
  action: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click', props.action)
}
</script>

<style scoped>
.action-card {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  height: 80px;
}

.action-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.2);
}

.action-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 12px 8px;
  gap: 8px;
}

.action-icon {
  flex-shrink: 0;
}

.action-text {
  font-size: 12px;
  font-weight: 500;
  color: white;
  text-align: center;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .action-card {
    height: 70px;
  }
  
  .action-content {
    padding: 8px 6px;
    gap: 6px;
  }
  
  .action-icon {
    font-size: 20px !important;
  }
  
  .action-text {
    font-size: 11px;
  }
}
</style>