<template>
  <v-card 
    class="playlist-card"
    color="rgba(255,255,255,0.05)"
    rounded="xl"
    @click="handleClick"
    hover
  >
    <div class="playlist-content">
      <v-img
        :src="playlist.image"
        width="80"
        height="80"
        cover
        class="playlist-image"
        rounded="lg"
      ></v-img>
      <div class="playlist-info">
        <div class="playlist-title">{{ playlist.title }}</div>
        <div class="playlist-desc text-grey">{{ playlist.description }}</div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
const props = defineProps({
  playlist: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click', props.playlist);
};
</script>

<style scoped>
.playlist-card {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.playlist-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.2);
}

.playlist-content {
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 12px;
}

.playlist-info {
  flex: 1;
}

.playlist-title {
  font-size: 14px;
  font-weight: bold;
  color: white;
  margin-bottom: 4px;
  line-height: 1.2;
}

.playlist-desc {
  font-size: 12px;
}
</style>