<template>
  <v-app theme="dark" class="lyrics-page" @click="handlePageClick">


    <!-- 返回按钮 -->
    <div class="back-button-container">
      <v-btn icon size="small" variant="text" color="white" @click.stop="handleBack" class="back-button">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </div>

    <v-main class="main-content">
      <!-- 专辑封面 -->
      <div class="album-cover-container">
        <v-card class="album-card" rounded="xl">
          <v-img :src="currentSong.cover" aspect-ratio="1" cover class="album-image" />
        </v-card>
      </div>

      <!-- 歌词信息区域 -->
      <div v-show="showLyricsInfo" class="lyrics-info-section">
        <div class="production-info">
          <div class="info-item">
            <span class="info-label">制作团队：</span>
          </div>
        </div>
      </div>

      <!-- 歌曲信息和控制 -->
      <div class="song-control-section">
        <div class="song-info">
          <h2 class="song-title">{{ currentSong.title }}</h2>
          <p class="song-artist">{{ currentSong.artist }}</p>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <div class="action-group-left">
            <v-btn icon size="large" variant="text" color="white">
              <v-icon>mdi-heart-outline</v-icon>
            </v-btn>
            <v-btn icon size="large" variant="text" color="white">
              <v-icon>mdi-download</v-icon>
            </v-btn>
            <v-btn icon size="large" variant="text" color="white">
              <v-icon>mdi-share</v-icon>
            </v-btn>
          </div>
          <div class="action-group-right">
            <v-btn icon size="large" variant="text" color="white">
              <v-icon>mdi-playlist-music</v-icon>
            </v-btn>
            <v-btn icon size="large" variant="text" color="white">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </div>
        </div>

        <!-- 进度条和播放控制 -->
        <div class="progress-section">
          <div class="progress-control-row">
            <v-slider v-model="currentProgress" :max="100" color="white" track-color="rgba(255,255,255,0.3)"
              thumb-color="white" hide-details class="progress-slider" />
            <v-btn icon size="x-large" variant="text" color="white" @click.stop="togglePlay" class="play-pause-button">
              <v-icon size="40">
                {{ currentSong.isPlaying ? 'mdi-pause' : 'mdi-play' }}
              </v-icon>
            </v-btn>
          </div>
        </div>
      </div>
    </v-main>

    <!-- 底部导航 -->
    <BottomNavigation v-model="activeTab" @tab-change="handleTabChange" />
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BottomNavigation from '../components/BottomNavigation.vue'

const router = useRouter()

// 响应式数据
const currentSong = ref({
  title: '远走高飞',
  artist: '金志文',
  cover: 'https://picsum.photos/seed/lyrics/400/400',
  isPlaying: false
})

const activeTab = ref('music')
const showLyricsInfo = ref(true)
const currentProgress = ref(30)

// 事件处理函数
const handleBack = () => {
  router.back()
}

const handlePageClick = () => {
  // 点击空白处切换歌词信息显示状态
  showLyricsInfo.value = !showLyricsInfo.value
}

const togglePlay = () => {
  currentSong.value.isPlaying = !currentSong.value.isPlaying
}

const handleTabChange = (tab) => {
  activeTab.value = tab
}
</script>

<style scoped>
.lyrics-page {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  min-height: 100vh;
}

/* 状态栏 */
.status-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(26, 26, 26, 0.9);
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

.battery-text {
  font-size: 12px;
  color: white;
  opacity: 0.8;
}

/* 返回按钮 */
.back-button-container {
  position: fixed;
  top: 60px;
  left: 16px;
  z-index: 100;
}

.back-button {
  background: rgba(0, 0, 0, 0.3) !important;
  backdrop-filter: blur(10px);
}

/* 主要内容 */
.main-content {
  padding-top: 100px !important;
  padding-bottom: 100px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}

/* 专辑封面 */
.album-cover-container {
  width: 100%;
  max-width: 350px;
  padding: 0 20px;
  margin-bottom: 40px;
}

.album-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.album-image {
  border-radius: 20px;
}

/* 歌词信息区域 */
.lyrics-info-section {
  width: 100%;
  max-width: 350px;
  padding: 0 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.production-info {
  text-align: center;
}

.info-item {
  margin-bottom: 8px;
}

.info-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.info-value {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

/* 歌曲控制区域 */
.song-control-section {
  width: 100%;
  max-width: 350px;
  padding: 0 20px;
  margin-top: auto;
}

.song-info {
  text-align: left;
  margin-bottom: 30px;
}

.song-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin: 0 0 8px 0;
}

.song-artist {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 10px;
}

.action-group-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-group-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-buttons .v-btn {
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.action-buttons .v-btn:hover {
  opacity: 1;
}

/* 进度条和播放控制 */
.progress-section {
  margin-bottom: 20px;
}

.progress-control-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.progress-slider {
  flex: 1;
}

.progress-slider :deep(.v-slider__track) {
  height: 4px;
}

.progress-slider :deep(.v-slider__thumb) {
  width: 16px;
  height: 16px;
}

.play-pause-button {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .album-cover-container {
    max-width: 300px;
  }

  .song-control-section {
    max-width: 300px;
  }

  .lyrics-info-section {
    max-width: 300px;
  }

  .song-title {
    font-size: 1.3rem;
  }

  .action-buttons {
    padding: 0 5px;
  }
}

/* 动画效果 */
.lyrics-info-section {
  opacity: 1;
  transform: translateY(0);
}

.lyrics-info-section[style*="display: none"] {
  opacity: 0;
  transform: translateY(-20px);
}
</style>