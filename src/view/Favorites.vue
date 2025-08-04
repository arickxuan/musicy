<template>
  <v-app theme="dark" class="favorites-page">

    <!-- 返回按钮 -->
    <div class="back-button-container">
      <v-btn
        icon
        size="small"
        variant="text"
        color="white"
        @click="handleBack"
        class="back-button"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </div>

    <!-- 头部区域 -->
    <div class="header-section">
      <!-- 心形图标 -->
      <div class="heart-icon">
        <v-icon size="120" color="white">mdi-heart</v-icon>
      </div>
    </div>

    <v-main class="main-content">
      <!-- 播放控制栏 -->
      <div class="play-control-bar">
        <v-btn
          icon
          size="large"
          color="primary"
          class="play-all-button"
          @click="playAll"
        >
          <v-icon size="24">mdi-play</v-icon>
        </v-btn>
        <div class="play-info">
          <span class="play-text">全部播放({{ songCount }})</span>
        </div>
        <v-btn
          icon
          size="small"
          variant="text"
          color="white"
          class="menu-button"
        >
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-btn>
      </div>

      <!-- 歌曲列表 -->
      <div class="song-list">
        <div
          v-for="(song, index) in favoritesSongs"
          :key="song.id"
          class="song-item"
          @click="playSong(song, index)"
        >
          <v-btn
            icon
            size="small"
            variant="text"
            color="white"
            class="add-button"
            @click.stop="addToCurrentPlaylist(song)"
          >
          <!-- 添加到单前播放列表 -->
            <v-icon size="16">mdi-plus</v-icon>
          </v-btn>
          
          <div class="song-info">
            <div class="song-title">{{ song.title }}</div>
            <div class="song-artist">{{ song.artist }}</div>
          </div>

          <div class="song-actions">
            <v-btn
              v-if="song.hasVideo"
              icon
              size="small"
              variant="text"
              color="white"
              class="video-button"
              @click.stop="playVideo(song)"
            >
              <v-icon size="16">mdi-play-box-outline</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              variant="text"
              color="white"
              class="more-button"
              @click.stop="showSongMenuFun(song)"
            >
              <v-icon size="16">mdi-dots-vertical</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
    </v-main>

    <!-- 底部播放栏 -->
    <div class="bottom-player">
      <div class="player-content">
        <v-avatar size="40" class="player-avatar">
          <v-img :src="currentSong.cover" cover></v-img>
        </v-avatar>
        <div class="player-info">
          <div class="player-title">{{ currentSong.artist }} - {{ currentSong.title }}</div>
        </div>
        <div class="player-controls">
          <v-btn
            icon
            size="small"
            color="primary"
            @click="togglePlay"
          >
            <v-icon>{{ currentSong.isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
          </v-btn>
          <v-btn
            icon
            size="small"
            variant="text"
            color="white"
            class="ml-2"
          >
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <BottomNavigation 
      v-model="activeTab"
      @tab-change="handleTabChange"
    />

    <!-- 歌曲操作菜单 -->
    <v-bottom-sheet
      v-model="showSongMenu"
      max-height="60vh"
      class="song-menu-sheet"
    >
      <v-card class="song-menu-card" color="surface">
        <!-- 歌曲信息头部 -->
        <div class="menu-header" v-if="selectedSong">
          <v-avatar size="48" class="song-avatar">
            <v-img :src="selectedSong.cover" cover></v-img>
          </v-avatar>
          <div class="song-details">
            <div class="menu-song-title">{{ selectedSong.title }}</div>
            <div class="menu-song-artist">{{ selectedSong.artist }}</div>
          </div>
          <v-btn
            icon
            size="small"
            variant="text"
            color="white"
            @click="closeSongMenu"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <v-divider color="rgba(255,255,255,0.1)"></v-divider>

        <!-- 操作选项 -->
        <v-list class="menu-list" color="transparent">
          <v-list-item
            class="menu-item"
            @click="downloadSong"
          >
            <template v-slot:prepend>
              <v-icon color="white" size="24">mdi-download</v-icon>
            </template>
            <v-list-item-title class="menu-item-title">下载</v-list-item-title>
          </v-list-item>

          <v-list-item
            class="menu-item"
            @click="toggleFavorite"
          >
            <template v-slot:prepend>
              <v-icon color="white" size="24">
                {{ selectedSong?.isFavorited ? 'mdi-heart' : 'mdi-heart-outline' }}
              </v-icon>
            </template>
            <v-list-item-title class="menu-item-title">
              {{ selectedSong?.isFavorited ? '取消收藏' : '收藏' }}
            </v-list-item-title>
          </v-list-item>

          <v-list-item
            class="menu-item"
            @click="shareSong"
          >
            <template v-slot:prepend>
              <v-icon color="white" size="24">mdi-share</v-icon>
            </template>
            <v-list-item-title class="menu-item-title">分享</v-list-item-title>
          </v-list-item>

          <v-list-item
            class="menu-item"
            @click="addToPlaylist"
          >
            <template v-slot:prepend>
              <v-icon color="white" size="24">mdi-playlist-plus</v-icon>
            </template>
            <v-list-item-title class="menu-item-title">添加到歌单</v-list-item-title>
          </v-list-item>

          <v-divider color="rgba(255,255,255,0.1)" class="my-2"></v-divider>

          <v-list-item
            class="menu-item"
            @click="viewSongInfo"
          >
            <template v-slot:prepend>
              <v-icon color="white" size="24">mdi-information-outline</v-icon>
            </template>
            <v-list-item-title class="menu-item-title">歌曲信息</v-list-item-title>
          </v-list-item>

          <v-list-item
            class="menu-item"
            @click="removeFavorite"
          >
            <template v-slot:prepend>
              <v-icon color="red" size="24">mdi-delete</v-icon>
            </template>
            <v-list-item-title class="menu-item-title text-red">从我喜欢中移除</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-bottom-sheet>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BottomNavigation from '../components/BottomNavigation.vue'

const router = useRouter()

// 响应式数据
const activeTab = ref('profile')
const songCount = ref(296)
const showSongMenu = ref(false)
const selectedSong = ref(null)

// 我喜欢的歌曲列表
const favoritesSongs = ref([
  {
    id: '1',
    title: '等你下课',
    artist: '周杰伦',
    cover: 'https://picsum.photos/seed/song1/200/200',
    hasVideo: false
  },
  {
    id: '2',
    title: '远走高飞',
    artist: '金志文',
    cover: 'https://picsum.photos/seed/song2/200/200',
    hasVideo: false
  },
  {
    id: '3',
    title: '答案',
    artist: '杨坤 郭采洁',
    cover: 'https://picsum.photos/seed/song3/200/200',
    hasVideo: false
  },
  {
    id: '4',
    title: '陷阱',
    artist: '王北车',
    cover: 'https://picsum.photos/seed/song4/200/200',
    hasVideo: false
  },
  {
    id: '5',
    title: '说散就散',
    artist: '袁娅维TIA RAY',
    cover: 'https://picsum.photos/seed/song5/200/200',
    hasVideo: true
  }
])

// 当前播放歌曲
const currentSong = ref({
  title: '病变',
  artist: '韩文娟',
  cover: 'https://picsum.photos/seed/current/200/200',
  isPlaying: true
})

// 事件处理函数
const handleBack = () => {
  router.back()
}

const playAll = () => {
  console.log('播放全部歌曲')
  // 播放所有我喜欢的歌曲
}

const playSong = (song, index) => {
  console.log('播放歌曲:', song.title, index)
  currentSong.value = {
    title: song.title,
    artist: song.artist,
    cover: song.cover,
    isPlaying: true
  }
}

const addToCurrentPlaylist = (song) => {
  console.log('添加到歌单:', song.title)
  // 添加歌曲到其他歌单
}

const playVideo = (song) => {
  console.log('播放MV:', song.title)
  // 播放歌曲MV
}

const showSongMenuFun = (song) => {
  console.log('显示歌曲菜单:', song.title)
  selectedSong.value = { ...song, isFavorited: true } // 在我喜欢页面中，所有歌曲都是已收藏的
  showSongMenu.value = true
}

const togglePlay = () => {
  currentSong.value.isPlaying = !currentSong.value.isPlaying
}

const handleTabChange = (tab) => {
  activeTab.value = tab
}

// 歌曲菜单操作方法
const closeSongMenu = () => {
  showSongMenu.value = false
  selectedSong.value = null
}

const downloadSong = () => {
  console.log('下载歌曲:', selectedSong.value?.title)
  // 实现下载功能
  closeSongMenu()
}

const toggleFavorite = () => {
  if (selectedSong.value) {
    selectedSong.value.isFavorited = !selectedSong.value.isFavorited
    console.log('切换收藏状态:', selectedSong.value.title, selectedSong.value.isFavorited)
    // 实现收藏/取消收藏功能
  }
  closeSongMenu()
}

const shareSong = () => {
  console.log('分享歌曲:', selectedSong.value?.title)
  // 实现分享功能
  closeSongMenu()
}

const addToPlaylist = () => {
  console.log('添加到歌单:', selectedSong.value?.title)
  // 实现添加到歌单功能
  closeSongMenu()
}

const viewSongInfo = () => {
  console.log('查看歌曲信息:', selectedSong.value?.title)
  // 实现查看歌曲信息功能
  closeSongMenu()
}

const removeFavorite = () => {
  if (selectedSong.value) {
    console.log('从我喜欢中移除:', selectedSong.value.title)
    // 从我喜欢列表中移除歌曲
    const index = favoritesSongs.value.findIndex(song => song.id === selectedSong.value.id)
    if (index > -1) {
      favoritesSongs.value.splice(index, 1)
      songCount.value = favoritesSongs.value.length
    }
  }
  closeSongMenu()
}
</script>

<style scoped>
.favorites-page {
  background: linear-gradient(135deg, #FF6B6B 0%, #FFB6C1 30%, #2d2d2d 70%, #1a1a1a 100%);
  min-height: 100vh;
}

/* 状态栏 */
.status-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 107, 107, 0.3);
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
  background: rgba(0, 0, 0, 0.2) !important;
  backdrop-filter: blur(10px);
}

/* 头部区域 */
.header-section {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 60px;
}

.heart-icon {
  opacity: 0.9;
  filter: drop-shadow(0 4px 20px rgba(255, 255, 255, 0.3));
}

/* 主要内容 */
.main-content {
  background: linear-gradient(to bottom, transparent 0%, rgba(45, 45, 45, 0.9) 20%, #2d2d2d 100%);
  padding-top: 0 !important;
  padding-bottom: 160px !important;
  min-height: calc(100vh - 300px);
}

/* 播放控制栏 */
.play-control-bar {
  display: flex;
  align-items: center;
  padding: 20px 16px;
  gap: 16px;
  background: rgba(45, 45, 45, 0.8);
  backdrop-filter: blur(10px);
  margin: 0 16px 20px;
  border-radius: 12px;
}

.play-all-button {
  background: #FFD700 !important;
  color: black !important;
}

.play-info {
  flex: 1;
}

.play-text {
  color: white;
  font-size: 1rem;
  font-weight: 500;
}

.menu-button {
  opacity: 0.8;
}

/* 歌曲列表 */
.song-list {
  padding: 0 16px;
}

.song-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  gap: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 8px;
  margin-bottom: 8px;
}

.song-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.add-button {
  flex-shrink: 0;
  opacity: 0.6;
}

.song-info {
  flex: 1;
  min-width: 0;
}

.song-title {
  font-size: 1rem;
  font-weight: 500;
  color: white;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.song-artist {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.song-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.video-button,
.more-button {
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.song-item:hover .video-button,
.song-item:hover .more-button {
  opacity: 1;
}

/* 底部播放栏 */
.bottom-player {
  position: fixed;
  bottom: 80px;
  left: 16px;
  right: 16px;
  z-index: 10;
  background: rgba(45, 45, 45, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.player-content {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 12px;
}

.player-avatar {
  flex-shrink: 0;
}

.player-info {
  flex: 1;
  min-width: 0;
}

.player-title {
  font-size: 14px;
  color: white;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.player-controls {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

/* 歌曲操作菜单 */
.song-menu-sheet {
  z-index: 2000;
}

.song-menu-card {
  background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
  border-top-left-radius: 20px !important;
  border-top-right-radius: 20px !important;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.menu-header {
  display: flex;
  align-items: center;
  padding: 20px 24px 16px;
  gap: 16px;
}

.song-avatar {
  flex-shrink: 0;
}

.song-details {
  flex: 1;
  min-width: 0;
}

.menu-song-title {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-song-artist {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-list {
  padding: 0;
}

.menu-item {
  padding: 16px 24px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.menu-item-title {
  color: white;
  font-size: 1rem;
  margin-left: 16px;
}

.menu-item-title.text-red {
  color: #ff5252;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .header-section {
    height: 250px;
  }
  
  .heart-icon .v-icon {
    font-size: 100px !important;
  }
  
  .play-control-bar {
    margin: 0 12px 16px;
    padding: 16px 12px;
  }
  
  .song-list {
    padding: 0 12px;
  }
  
  .song-item {
    padding: 10px 0;
    gap: 12px;
  }
  
  .menu-header {
    padding: 16px 20px 12px;
    gap: 12px;
  }
  
  .menu-item {
    padding: 14px 20px;
  }
  
  .menu-item-title {
    font-size: 0.95rem;
  }
}
</style>