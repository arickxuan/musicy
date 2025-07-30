<template>
  <v-app theme="dark" class="search-page">
    <!-- 搜索头部 -->
    <div class="search-header">
      <div class="search-bar">
        <!-- 返回按钮 -->
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

        <!-- 搜索输入框 -->
        <div class="search-input-container">
          <v-text-field
            v-model="searchQuery"
            placeholder="歌手/歌名/专辑/歌词"
            variant="solo"
            color="primary"
            hide-details
            single-line
            class="search-input"
            @keyup.enter="handleSearch"
            @input="handleInput"
          >
            <template v-slot:prepend-inner>
              <v-icon color="primary" size="20">mdi-magnify</v-icon>
            </template>
            <template v-slot:append-inner>
              <v-btn
                v-if="searchQuery"
                icon
                size="small"
                variant="text"
                @click="clearSearch"
              >
                <v-icon size="16">mdi-close</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </div>

        <!-- 搜索按钮 -->
        <v-btn
          variant="text"
          color="primary"
          @click="handleSearch"
          class="search-button"
        >
          搜索
        </v-btn>
      </div>
    </div>

    <v-main class="main-content">
      <v-container fluid class="pa-4">
        <!-- 搜索历史 -->
        <div v-if="!searchQuery && searchHistory.length > 0" class="search-history">
          <div class="history-header">
            <h3 class="history-title">搜索历史</h3>
          </div>

          <div class="history-list">
            <div
              v-for="(item, index) in searchHistory"
              :key="index"
              class="history-item"
              @click="handleHistoryClick(item)"
            >
              <v-icon color="rgba(255,255,255,0.6)" size="20" class="history-icon">
                mdi-magnify
              </v-icon>
              <span class="history-text">{{ item }}</span>
            </div>
          </div>

          <!-- 清空历史记录 -->
          <div class="clear-history">
            <v-btn
              variant="text"
              color="rgba(255,255,255,0.6)"
              @click="clearHistory"
              class="clear-button"
            >
              清空历史记录
            </v-btn>
          </div>
        </div>

        <!-- 搜索结果 -->
        <div v-if="searchQuery && searchResults.length > 0" class="search-results">
          <h3 class="results-title">搜索结果</h3>
          
          <div class="results-list">
            <v-card
              v-for="(result, index) in searchResults"
              :key="index"
              class="result-item"
              color="rgba(255,255,255,0.05)"
              rounded="xl"
              @click="handleResultClick(result)"
              hover
            >
              <div class="result-content">
                <v-avatar size="48" class="result-cover" rounded="lg">
                  <v-img :src="result.cover" cover></v-img>
                </v-avatar>
                <div class="result-info">
                  <div class="result-title">{{ result.title }}</div>
                  <div class="result-artist">{{ result.artist }}</div>
                </div>
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="white"
                  @click.stop="handleResultMore(result)"
                  class="result-more"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </div>
            </v-card>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="searchQuery && searchResults.length === 0 && !isSearching" class="empty-state">
          <v-icon size="64" color="rgba(255,255,255,0.3)" class="mb-4">
            mdi-music-note-off
          </v-icon>
          <p class="text-body-1 text-grey">未找到相关结果</p>
          <p class="text-body-2 text-grey">试试其他关键词吧</p>
        </div>

        <!-- 加载状态 -->
        <div v-if="isSearching" class="loading-state">
          <v-progress-circular
            indeterminate
            color="primary"
            size="48"
            class="mb-4"
          />
          <p class="text-body-1 text-white">搜索中...</p>
        </div>
      </v-container>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CurrentPlayingBar from '../components/CurrentPlayingBar.vue'
import BottomNavigation from '../components/BottomNavigation.vue'

const router = useRouter()

// 搜索状态
const searchQuery = ref('')
const isSearching = ref(false)
const searchHistory = ref(['等你下课', '陈奕迅'])
const searchResults = ref([])

// 当前播放歌曲
const currentSong = ref({
  title: '周杰伦 - 等你下课',
  artist: '周杰伦',
  isPlaying: false,
  cover: 'https://picsum.photos/seed/current/200/200'
})

// 底部导航状态
const activeTab = ref('search')

// 模拟搜索结果数据
const mockSearchResults = [
  {
    id: '1',
    title: '等你下课',
    artist: '周杰伦',
    cover: 'https://picsum.photos/seed/search1/200/200',
    type: 'song'
  },
  {
    id: '2',
    title: '说好不哭',
    artist: '周杰伦',
    cover: 'https://picsum.photos/seed/search2/200/200',
    type: 'song'
  },
  {
    id: '3',
    title: '青花瓷',
    artist: '周杰伦',
    cover: 'https://picsum.photos/seed/search3/200/200',
    type: 'song'
  }
]

// 事件处理函数
const handleBack = () => {
  router.back()
}

const handleInput = () => {
  // 实时搜索建议可以在这里实现
}

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return

  isSearching.value = true
  
  // 添加到搜索历史
  if (!searchHistory.value.includes(searchQuery.value)) {
    searchHistory.value.unshift(searchQuery.value)
    // 限制历史记录数量
    if (searchHistory.value.length > 10) {
      searchHistory.value = searchHistory.value.slice(0, 10)
    }
    // 保存到本地存储
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
  }

  try {
    // 模拟搜索API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟搜索结果
    searchResults.value = mockSearchResults.filter(item => 
      item.title.includes(searchQuery.value) || 
      item.artist.includes(searchQuery.value)
    )
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    isSearching.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
}

const handleHistoryClick = (historyItem) => {
  searchQuery.value = historyItem
  handleSearch()
}

const clearHistory = () => {
  searchHistory.value = []
  localStorage.removeItem('searchHistory')
}

const handleResultClick = (result) => {
  console.log('点击搜索结果:', result.title)
  // 播放选中的歌曲
}

const handleResultMore = (result) => {
  console.log('更多操作:', result.title)
  // 显示更多操作菜单
}

const handleTogglePlay = () => {
  currentSong.value.isPlaying = !currentSong.value.isPlaying
}

const handleShowPlaylist = () => {
  console.log('显示播放列表')
}

const handleTabChange = (tab) => {
  activeTab.value = tab
}

// 组件挂载时加载搜索历史
onMounted(() => {
  const savedHistory = localStorage.getItem('searchHistory')
  if (savedHistory) {
    try {
      searchHistory.value = JSON.parse(savedHistory)
    } catch (error) {
      console.error('加载搜索历史失败:', error)
    }
  }
})
</script>

<style scoped>
.search-page {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  min-height: 100vh;
}

/* 搜索头部 */
.search-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-button {
  flex-shrink: 0;
}

.search-input-container {
  flex: 1;
}

.search-input :deep(.v-field) {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  min-height: 40px;
}

.search-input :deep(.v-field__outline) {
  border: none;
}

.search-input :deep(.v-field__input) {
  color: white;
  padding: 0 16px;
  font-size: 14px;
}

.search-input :deep(.v-field__input::placeholder) {
  color: rgba(255, 255, 255, 0.6);
}

.search-button {
  flex-shrink: 0;
  font-size: 14px;
}

/* 主要内容 */
.main-content {
  padding-top: 0 !important;
  padding-bottom: 160px !important;
}

/* 搜索历史 */
.search-history {
  margin-top: 20px;
}

.history-header {
  margin-bottom: 16px;
}

.history-title {
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 8px;
}

.history-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.history-icon {
  margin-right: 16px;
  flex-shrink: 0;
}

.history-text {
  font-size: 16px;
  color: white;
  flex: 1;
}

.clear-history {
  margin-top: 20px;
  text-align: center;
}

.clear-button {
  font-size: 14px;
}

/* 搜索结果 */
.search-results {
  margin-top: 20px;
}

.results-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin: 0 0 16px 0;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-item {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.result-item:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.2);
}

.result-content {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 16px;
}

.result-cover {
  flex-shrink: 0;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: 16px;
  font-weight: 500;
  color: white;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-artist {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-more {
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.result-item:hover .result-more {
  opacity: 1;
}

/* 空状态和加载状态 */
.empty-state,
.loading-state {
  text-align: center;
  padding: 60px 20px;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .search-header {
    padding: 6px 12px;
  }
  
  .search-bar {
    gap: 8px;
  }
  
  .search-input :deep(.v-field) {
    min-height: 36px;
  }
  
  .history-item {
    padding: 10px 0;
  }
  
  .result-content {
    padding: 10px 12px;
    gap: 12px;
  }
  
  .result-cover {
    width: 40px !important;
    height: 40px !important;
  }
}
</style>