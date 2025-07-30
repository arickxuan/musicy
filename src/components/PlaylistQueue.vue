<template>
  <v-bottom-sheet
    v-model="isVisible"
    max-height="80vh"
    class="playlist-queue-sheet"
  >
    <v-card class="playlist-queue-card" color="surface">
      <!-- 拖拽指示器 -->
      <div class="drag-indicator">
        <div class="drag-handle"></div>
      </div>

      <!-- 头部信息 -->
      <div class="queue-header">
        <div class="header-info">
          <h3 class="queue-title">播放队列</h3>
          <div class="queue-actions">
            <v-btn
              icon
              size="small"
              variant="text"
              color="white"
              @click="handleShuffle"
              :class="{ 'active': isShuffled }"
            >
              <v-icon>mdi-shuffle</v-icon>
            </v-btn>
            <span class="shuffle-text">顺序播放</span>
          </div>
        </div>
      </div>

      <v-divider color="rgba(255,255,255,0.1)"></v-divider>

      <!-- 歌曲列表 -->
      <div class="queue-content">
        <v-list class="song-list" color="transparent">
          <v-list-item
            v-for="(song, index) in playlist"
            :key="song.id"
            class="song-item"
            :class="{ 'current-song': index === currentIndex }"
            @click="handleSongClick(song, index)"
          >
            <template v-slot:prepend>
              <div class="song-cover">
                <v-img
                  :src="song.cover"
                  width="48"
                  height="48"
                  cover
                  rounded="lg"
                />
                <!-- 当前播放指示器 -->
                <div v-if="index === currentIndex" class="playing-indicator">
                  <v-icon color="primary" size="16">
                    {{ song.isPlaying ? 'mdi-volume-high' : 'mdi-pause' }}
                  </v-icon>
                </div>
              </div>
            </template>

            <div class="song-info">
              <div class="song-title">
                {{ song.title }}
              </div>
              <div class="song-artist">
                {{ song.artist }}
              </div>
            </div>

            <template v-slot:append>
              <v-btn
                icon
                size="small"
                variant="text"
                color="white"
                @click.stop="handleSongMore(song, index)"
                class="song-more"
              >
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </v-card>
  </v-bottom-sheet>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  playlist: {
    type: Array,
    default: () => []
  },
  currentIndex: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close', 'song-click', 'song-more', 'shuffle-toggle'])

const isVisible = ref(false)
const isShuffled = ref(false)

// 监听visible属性变化
watch(() => props.visible, (newVal) => {
  isVisible.value = newVal
})

// 监听isVisible变化
watch(isVisible, (newVal) => {
  if (!newVal) {
    emit('close')
  }
})

const handleSongClick = (song, index) => {
  emit('song-click', song, index)
}

const handleSongMore = (song, index) => {
  emit('song-more', song, index)
}

const handleShuffle = () => {
  isShuffled.value = !isShuffled.value
  emit('shuffle-toggle', isShuffled.value)
}
</script>

<style scoped>
.playlist-queue-sheet {
  z-index: 2000;
}

.playlist-queue-card {
  background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
  border-top-left-radius: 20px !important;
  border-top-right-radius: 20px !important;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

/* 拖拽指示器 */
.drag-indicator {
  display: flex;
  justify-content: center;
  padding: 12px 0 8px;
}

.drag-handle {
  width: 40px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

/* 头部 */
.queue-header {
  padding: 16px 24px;
}

.header-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.queue-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.queue-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.shuffle-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.v-btn.active {
  background-color: rgba(255, 215, 0, 0.2);
}

.v-btn.active .v-icon {
  color: rgb(var(--v-theme-primary));
}

/* 内容区域 */
.queue-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}

.song-list {
  padding: 0;
}

.song-item {
  padding: 12px 24px;
  transition: background-color 0.2s ease;
  border-radius: 0;
}

.song-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.song-item.current-song {
  background-color: rgba(255, 215, 0, 0.1);
}

.song-cover {
  position: relative;
  margin-right: 16px;
}

.playing-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 8px;
}

.song-info {
  flex: 1;
  min-width: 0;
}

.song-title {
  font-size: 1rem;
  font-weight: 500;
  color: white;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.song-item.current-song .song-title {
  color: rgb(var(--v-theme-primary));
}

.song-artist {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 2px;
}

.song-more {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.song-item:hover .song-more {
  opacity: 1;
}

/* 滚动条样式 */
.queue-content::-webkit-scrollbar {
  width: 4px;
}

.queue-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.queue-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.queue-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 响应式设计 */
@media (max-width: 600px) {
  .queue-header {
    padding: 12px 16px;
  }
  
  .song-item {
    padding: 10px 16px;
  }
  
  .song-cover {
    margin-right: 12px;
  }
  
  .song-cover .v-img {
    width: 40px !important;
    height: 40px !important;
  }
  
  .song-title {
    font-size: 0.95rem;
  }
  
  .song-artist {
    font-size: 0.85rem;
  }
}
</style>