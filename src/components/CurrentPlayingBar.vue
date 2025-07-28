<template>
  <v-card 
    class="current-playing-bar"
    color="rgba(255,255,255,0.1)"
    rounded="xl"
  >
    <div class="playing-content">
      <v-avatar size="40" class="mr-3">
        <v-img :src="currentSong.cover"></v-img>
      </v-avatar>
      <div class="playing-info">
        <div class="playing-title">{{ currentSong.artist }}</div>
      </div>
      <div class="playing-controls">
        <v-btn 
          icon 
          size="small" 
          color="yellow"
          @click="togglePlay"
        >
          <v-icon>{{ currentSong.isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
        </v-btn>
        <v-btn 
          icon 
          size="small" 
          class="ml-2"
          @click="showPlaylist"
        >
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup>
const props = defineProps({
  currentSong: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['toggle-play', 'show-playlist']);

const togglePlay = () => {
  emit('toggle-play');
};

const showPlaylist = () => {
  emit('show-playlist');
};
</script>

<style scoped>
.current-playing-bar {
  position: fixed;
  bottom: 80px;
  left: 16px;
  right: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
}

.playing-content {
  display: flex;
  align-items: center;
  padding: 8px 16px;
}

.playing-info {
  flex: 1;
  margin-left: 8px;
}

.playing-title {
  font-size: 14px;
  color: white;
  font-weight: 500;
}

.playing-controls {
  display: flex;
  align-items: center;
}
</style>