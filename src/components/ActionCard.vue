<template>
  <v-card 
    class="action-card pa-3 text-center"
    color="rgba(255,255,255,0.05)"
    rounded="xl"
    @click="handleClick"
    hover
  >
    <v-icon 
      :color="action.color" 
      size="24" 
      class="mb-2"
    >
      {{ action.icon }}
    </v-icon>
    <div class="action-text">{{ action.text }}</div>
  </v-card>
</template>

<script setup>
const props = defineProps({
  action: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click', props.action);
};
</script>

<style scoped>
.action-card {
  height: 80px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.action-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.2);
}

.action-text {
  font-size: 12px;
  color: white;
  font-weight: 500;
}
</style>