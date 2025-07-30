<template>
  <v-card class="player-card" color="rgba(255,255,255,0.05)" rounded="xl">
    <div class="player-content">
      <!-- 专辑封面 -->
      <div class="album-cover">
        <v-img
          :src="song.cover"
          width="80"
          height="80"
          cover
          class="cover-image"
          rounded="lg"
        />
        <div class="play-overlay" @click="handleTogglePlay">
          <v-btn
            icon
            size="large"
            color="primary"
            class="play-button"
          >
            <v-icon size="32">
              {{ song.isPlaying ? 'mdi-pause' : 'mdi-play' }}
            </v-icon>
          </v-btn>
        </div>
      </div>

      <!-- 歌曲信息 -->
      <div class="song-info">
        <div class="song-title">{{ song.title }}</div>
        <div class="song-artist">{{ song.artist }}</div>
        
        <!-- 进度条 -->
        <div class="progress-section">
          <v-progress-linear
            v-model="progress"
            color="primary"
            height="4"
            rounded
            class="progress-bar"
          />
          <div class="time-info">
            <span class="current-time">{{ formatTime(currentTime) }}</span>
            <span class="total-time">{{ formatTime(totalTime) }}</span>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  song: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle-play'])

const currentTime = ref(0)
const totalTime = ref(180) // 3分钟示例

const progress = computed(() => {
  return totalTime.value > 0 ? (currentTime.value / totalTime.value) * 100 : 0
})

const handleTogglePlay = () => {
  emit('toggle-play', props.song)
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.player-card {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 100%;
}

.player-content {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.album-cover {
  position: relative;
  align-self: center;
}

.cover-image {
  border-radius: 12px;
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
  border-radius: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.album-cover:hover .play-overlay {
  opacity: 1;
}

.play-button {
  background: rgba(255, 215, 0, 0.9) !important;
}

.song-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.song-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.song-artist {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.progress-section {
  margin-top: auto;
}

.progress-bar {
  margin-bottom: 8px;
}

.time-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}
</style>