<template>
  <v-app theme="dark" class="lyrics-page">
    <!-- 状态栏 -->
    <StatusBar />

    <!-- 歌曲信息头部 -->
    <div class="song-header">
      <div class="song-info-card">
        <v-img
          :src="currentSong.cover"
          width="80"
          height="80"
          cover
          class="song-cover"
          rounded="lg"
        />
        <div class="song-details">
          <h2 class="song-title">{{ currentSong.title }}</h2>
          <p class="song-artist">{{ currentSong.artist }}</p>
        </div>
        <v-btn
          icon
          size="large"
          :color="currentSong.isPlaying ? 'yellow' : 'white'"
          @click="togglePlay"
          class="play-button"
        >
          <v-icon size="32">
            {{ currentSong.isPlaying ? 'mdi-pause' : 'mdi-play' }}
          </v-icon>
        </v-btn>
      </div>
    </div>

    <v-main class="main-content">
      <!-- 歌词滚动区域 -->
      <div class="lyrics-container" ref="lyricsContainer">
        <div class="lyrics-content" :style="{ transform: `translateY(${scrollOffset}px)` }">
          <!-- 歌词信息 -->
          <div v-if="lyricsInfo && Object.keys(lyricsInfo).length > 0" class="lyrics-info">
            <div v-if="lyricsInfo.ti" class="info-item">
              <span class="info-label">曲名：</span>
              <span class="info-value">{{ lyricsInfo.ti }}</span>
            </div>
            <div v-if="lyricsInfo.ar" class="info-item">
              <span class="info-label">编曲：</span>
              <span class="info-value">{{ lyricsInfo.ar }}</span>
            </div>
            <div v-if="lyricsInfo.al" class="info-item">
              <span class="info-label">吉他：</span>
              <span class="info-value highlight">{{ lyricsInfo.al }}</span>
            </div>
            <div v-if="lyricsInfo.by" class="info-item">
              <span class="info-label">和声：</span>
              <span class="info-value">{{ lyricsInfo.by }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">混音：</span>
              <span class="info-value">潘君明</span>
            </div>
            <div class="info-item">
              <span class="info-label">录制：</span>
              <span class="info-value">{{ lyricsInfo.by || '金志文' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">推广团队：</span>
              <span class="info-value">招财猫计划music</span>
            </div>
            <div class="info-item">
              <span class="info-label">制作团队：</span>
              <span class="info-value">浅芥音乐团队</span>
            </div>
            <div class="info-item">
              <span class="info-label">企划：</span>
              <span class="info-value">宁喆/牛梦/白渡/零壹</span>
            </div>
            <div class="info-item">
              <span class="info-label">监制：</span>
              <span class="info-value">筱毅</span>
            </div>
            <div class="info-item">
              <span class="info-label">统筹：</span>
              <span class="info-value">师霖/欧凌诚</span>
            </div>
            <div class="info-item">
              <span class="info-label">出品人：</span>
              <span class="info-value">欧凌诚</span>
            </div>
          </div>

          <!-- 歌词列表 -->
          <div v-if="lyrics.length > 0" class="lyrics-list">
            <div
              v-for="(lyric, index) in lyrics"
              :key="index"
              :ref="el => lyricRefs[index] = el"
              class="lyric-line"
              :class="{
                'current': index === currentLyricIndex,
                'passed': index < currentLyricIndex
              }"
              @click="seekToLyric(lyric.time)"
            >
              {{ lyric.text }}
            </div>
          </div>

          <!-- 无歌词提示 -->
          <div v-else class="no-lyrics">
            <v-icon size="64" color="rgba(255,255,255,0.3)" class="mb-4">
              mdi-music-note-outline
            </v-icon>
            <p class="text-body-1 text-grey">暂无歌词</p>
          </div>
        </div>
      </div>
    </v-main>

    <!-- 底部播放栏 -->
    <CurrentPlayingBar 
      :current-song="currentSong"
      @toggle-play="handleTogglePlay"
      @show-playlist="handleShowPlaylist"
    />

    <!-- 底部导航 -->
    <BottomNavigation 
      v-model="activeTab"
      @tab-change="handleTabChange"
    />
  </v-app>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import StatusBar from '../components/StatusBar.vue'
import CurrentPlayingBar from '../components/CurrentPlayingBar.vue'
import BottomNavigation from '../components/BottomNavigation.vue'
import { parseLrc, getCurrentLyricIndex, sampleLrcData } from '../utils/lrcParser.js'

const router = useRouter()

// 响应式数据
const currentSong = ref({
  title: '远走高飞',
  artist: '金志文',
  cover: 'https://picsum.photos/seed/lyrics/300/300',
  isPlaying: true
})

const activeTab = ref('music')
const lyrics = ref([])
const lyricsInfo = ref({})
const currentLyricIndex = ref(-1)
const currentTime = ref(0)
const scrollOffset = ref(0)

// DOM引用
const lyricsContainer = ref(null)
const lyricRefs = ref([])

// 定时器
let timeUpdateTimer = null

// 模拟播放时间更新
const updateCurrentTime = () => {
  if (currentSong.value.isPlaying) {
    currentTime.value += 0.1
    
    // 更新当前歌词索引
    const newIndex = getCurrentLyricIndex(lyrics.value, currentTime.value)
    if (newIndex !== currentLyricIndex.value) {
      currentLyricIndex.value = newIndex
      scrollToCurrentLyric()
    }
  }
}

// 滚动到当前歌词
const scrollToCurrentLyric = async () => {
  if (currentLyricIndex.value < 0 || !lyricsContainer.value) return
  
  await nextTick()
  
  const currentLyricEl = lyricRefs.value[currentLyricIndex.value]
  if (!currentLyricEl) return
  
  const containerHeight = lyricsContainer.value.clientHeight
  const lyricTop = currentLyricEl.offsetTop
  const lyricHeight = currentLyricEl.clientHeight
  
  // 计算滚动偏移，使当前歌词居中显示
  const targetOffset = containerHeight / 2 - lyricTop - lyricHeight / 2
  
  // 平滑滚动动画
  animateScroll(targetOffset)
}

// 平滑滚动动画
const animateScroll = (targetOffset) => {
  const startOffset = scrollOffset.value
  const distance = targetOffset - startOffset
  const duration = 500 // 动画持续时间
  const startTime = Date.now()
  
  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // 使用缓动函数
    const easeProgress = 1 - Math.pow(1 - progress, 3)
    scrollOffset.value = startOffset + distance * easeProgress
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  requestAnimationFrame(animate)
}

// 点击歌词跳转
const seekToLyric = (time) => {
  currentTime.value = time
  currentLyricIndex.value = getCurrentLyricIndex(lyrics.value, time)
  console.log('跳转到时间:', time)
  // 这里应该调用音频播放器的seek方法
}

// 加载歌词
const loadLyrics = async (songTitle) => {
  try {
    // 从示例数据中获取歌词
    const lrcText = sampleLrcData[songTitle]
    if (lrcText) {
      const parsed = parseLrc(lrcText)
      lyrics.value = parsed.lyrics
      lyricsInfo.value = parsed.info
      console.log('歌词加载成功:', parsed)
    } else {
      lyrics.value = []
      lyricsInfo.value = {}
      console.log('未找到歌词:', songTitle)
    }
  } catch (error) {
    console.error('歌词加载失败:', error)
    lyrics.value = []
    lyricsInfo.value = {}
  }
}

// 事件处理函数
const togglePlay = () => {
  currentSong.value.isPlaying = !currentSong.value.isPlaying
}

const handleTogglePlay = () => {
  togglePlay()
}

const handleShowPlaylist = () => {
  console.log('显示播放列表')
}

const handleTabChange = (tab) => {
  activeTab.value = tab
}

// 监听播放状态变化
watch(() => currentSong.value.isPlaying, (isPlaying) => {
  if (isPlaying) {
    if (!timeUpdateTimer) {
      timeUpdateTimer = setInterval(updateCurrentTime, 100)
    }
  } else {
    if (timeUpdateTimer) {
      clearInterval(timeUpdateTimer)
      timeUpdateTimer = null
    }
  }
})

// 组件挂载
onMounted(() => {
  // 加载当前歌曲的歌词
  loadLyrics(currentSong.value.title)
  
  // 开始时间更新
  if (currentSong.value.isPlaying) {
    timeUpdateTimer = setInterval(updateCurrentTime, 100)
  }
})

// 组件卸载
onUnmounted(() => {
  if (timeUpdateTimer) {
    clearInterval(timeUpdateTimer)
  }
})
</script>

<style scoped>
.lyrics-page {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  min-height: 100vh;
}

/* 歌曲信息头部 */
.song-header {
  position: sticky;
  top: 44px; /* 状态栏高度 */
  z-index: 10;
  background: rgba(74, 85, 104, 0.95);
  backdrop-filter: blur(10px);
  padding: 16px;
}

.song-info-card {
  display: flex;
  align-items: center;
  gap: 16px;
}

.song-cover {
  flex-shrink: 0;
  border-radius: 12px;
}

.song-details {
  flex: 1;
}

.song-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.song-artist {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.play-button {
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.1) !important;
}

/* 主要内容 */
.main-content {
  padding-top: 0 !important;
  padding-bottom: 160px !important;
}

/* 歌词容器 */
.lyrics-container {
  height: calc(100vh - 200px); /* 减去头部和底部的高度 */
  overflow: hidden;
  position: relative;
  padding: 20px;
}

.lyrics-content {
  transition: transform 0.3s ease;
  padding-top: 40vh; /* 初始偏移，使第一行歌词居中 */
  padding-bottom: 40vh;
}

/* 歌词信息 */
.lyrics-info {
  margin-bottom: 40px;
  padding: 0 20px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  line-height: 1.5;
}

.info-label {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  min-width: 80px;
  flex-shrink: 0;
}

.info-value {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  flex: 1;
}

.info-value.highlight {
  color: #FFD700;
  font-weight: 500;
}

/* 歌词列表 */
.lyrics-list {
  padding: 0 20px;
}

.lyric-line {
  font-size: 1.1rem;
  line-height: 2.5;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  padding: 8px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 4px 0;
}

.lyric-line:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
}

.lyric-line.current {
  color: #FFD700;
  font-weight: 600;
  font-size: 1.2rem;
  transform: scale(1.05);
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.lyric-line.passed {
  color: rgba(255, 255, 255, 0.4);
}

/* 无歌词提示 */
.no-lyrics {
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.6);
}

/* 响应式设计 */
@media (max-width: 600px) {
  .song-header {
    padding: 12px;
  }
  
  .song-info-card {
    gap: 12px;
  }
  
  .song-cover {
    width: 60px !important;
    height: 60px !important;
  }
  
  .song-title {
    font-size: 1.1rem;
  }
  
  .song-artist {
    font-size: 0.9rem;
  }
  
  .lyrics-container {
    padding: 16px;
  }
  
  .lyrics-info {
    padding: 0 10px;
  }
  
  .lyrics-list {
    padding: 0 10px;
  }
  
  .lyric-line {
    font-size: 1rem;
    line-height: 2.2;
  }
  
  .lyric-line.current {
    font-size: 1.1rem;
  }
}

/* 滚动条隐藏 */
.lyrics-container::-webkit-scrollbar {
  display: none;
}

.lyrics-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>