<template>
  <v-card 
    class="player-card pa-4" 
    color="rgba(255,255,255,0.05)"
    rounded="xl"
  >
    <div class="player-content">
      <div class="album-cover mb-3">
        <v-avatar size="120" class="album-avatar">
          <v-img :src="song.cover" cover>
            <div class="play-overlay">
              <v-btn 
                icon 
                size="large" 
                color="white"
                class="play-btn"
                @click="togglePlay"
              >
                <v-icon size="32">{{ song.isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
              </v-btn>
            </div>
          </v-img>
        </v-avatar>
      </div>
      <div class="now-playing-badge mb-2">
        <span class="badge-text">正在播放</span>
      </div>
      <div class="song-title">{{ song.title }}</div>
    </div>
  </v-card>
</template>

<script setup>
const props = defineProps({
  song: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['toggle-play']);

const togglePlay = () => {
  emit('toggle-play', props.song);
};
</script>

<style scoped>
.player-card {
  height: 100%;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.player-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.album-cover {
  position: relative;
}

.album-avatar {
  border: 3px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s;
}

.album-avatar:hover .play-overlay {
  opacity: 1;
}

.play-btn {
  background: rgba(255, 255, 255, 0.9) !important;
}

.now-playing-badge {
  background: #FFD700;
  color: black;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.song-title {
  font-size: 16px;
  font-weight: bold;
  color: white;
  text-align: center;
}
</style>