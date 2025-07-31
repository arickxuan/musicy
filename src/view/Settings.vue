<template>
  <v-app theme="dark" class="settings-page">
    <!-- 页面头部 -->
    <div class="settings-header">
      <div class="header-content">
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
        <h1 class="page-title">柠乐</h1>
      </div>
    </div>

    <v-main class="main-content">
      <v-container fluid class="pa-4">
        <!-- 下载路径设置 -->
        <v-card class="setting-card mb-4" color="rgba(255,255,255,0.05)" rounded="xl">
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title">下载路径</div>
              <div class="setting-description">/storage/emulated/0/Download/柠乐</div>
            </div>
          </div>
        </v-card>

        <!-- 均衡器设置 -->
        <v-card class="setting-card mb-4" color="rgba(255,255,255,0.05)" rounded="xl">
          <div class="setting-item" @click="handleEqualizerClick">
            <div class="setting-info">
              <div class="setting-title">均衡器</div>
            </div>
            <div class="setting-action">
              <span class="action-text">{{ equalizerStatus }}</span>
            </div>
          </div>
        </v-card>

        <!-- 播放设置组 -->
        <v-card class="setting-card mb-4" color="rgba(255,255,255,0.05)" rounded="xl">
          <!-- 后台播放 -->
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title">后台播放</div>
              <div class="setting-description">建议前往设置页开启</div>
            </div>
          </div>

          <v-divider color="rgba(255,255,255,0.1)" class="mx-4"></v-divider>

          <!-- 锁屏播放 -->
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title">锁屏播放</div>
              <div class="setting-description">建议打开此设置</div>
            </div>
            <div class="setting-action">
              <v-switch
                v-model="lockScreenPlay"
                color="primary"
                hide-details
                class="setting-switch"
              />
            </div>
          </div>

          <v-divider color="rgba(255,255,255,0.1)" class="mx-4"></v-divider>

          <!-- 音乐通知栏 -->
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title">音乐通知栏</div>
              <div class="setting-description">如果无法显示请点击这里</div>
            </div>
          </div>
        </v-card>

        <!-- 联系我们 -->
        <v-card class="setting-card mb-4" color="rgba(255,255,255,0.05)" rounded="xl">
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title">侵权联系</div>
              <div class="setting-description">arickxuan@gmail.com</div>
            </div>
          </div>
        </v-card>

        <!-- 免责声明 -->
        <v-card class="setting-card mb-4" color="rgba(255,255,255,0.05)" rounded="xl">
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title">免责声明</div>
              <div class="setting-description">
                本软件所有在线资源来源于互联网，版权归原创作者所有，如果侵犯您的权益，请联系作者删除。
              </div>
            </div>
          </div>
        </v-card>
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

    <!-- 均衡器对话框 -->
    <EqualizerDialog
      :visible="showEqualizerDialog"
      @close="handleEqualizerClose"
      @change="handleEqualizerChange"
    />
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CurrentPlayingBar from '../components/CurrentPlayingBar.vue'
import BottomNavigation from '../components/BottomNavigation.vue'
import EqualizerDialog from '../components/EqualizerDialog.vue'

const router = useRouter()

// 设置状态
const lockScreenPlay = ref(true)
const showEqualizerDialog = ref(false)
const equalizerStatus = ref('关闭')

// 当前播放歌曲
const currentSong = ref({
  title: '周杰伦 - 等你下课',
  artist: '周杰伦',
  isPlaying: false,
  cover: 'https://picsum.photos/seed/current/200/200'
})

// 底部导航状态
const activeTab = ref('profile')

// 事件处理函数
const handleBack = () => {
  router.back()
}

const handleEqualizerClick = () => {
  console.log('打开均衡器设置')
  showEqualizerDialog.value = true
}

const handleEqualizerClose = () => {
  showEqualizerDialog.value = false
}

const handleEqualizerChange = (config) => {
  console.log('均衡器配置变化:', config)
  equalizerStatus.value = config.enabled ? (config.preset === 'custom' ? '自定义' : config.preset) : '关闭'
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
</script>

<style scoped>
.settings-page {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  min-height: 100vh;
}

.settings-page :deep(.v-application__wrap) {
  min-height: 100vh;
}

/* 页面头部 */
.settings-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  min-height: 56px;
  width: 100%;
}

.back-button {
  margin-right: 16px;
  flex-shrink: 0;
}

.page-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin: 0;
  flex: 1;
}

/* 主要内容 */
.main-content {
  padding-top: 0 !important;
  padding-bottom: 160px !important;
}

/* 设置卡片 */
.setting-card {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.setting-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.setting-info {
  flex: 1;
  min-width: 0;
}

.setting-title {
  font-size: 1rem;
  font-weight: 500;
  color: white;
  margin-bottom: 4px;
  line-height: 1.3;
}

.setting-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.4;
  word-wrap: break-word;
}

.setting-action {
  flex-shrink: 0;
  margin-left: 16px;
}

.action-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

/* 开关样式 */
.setting-switch {
  transform: scale(0.8);
}

.setting-switch :deep(.v-switch__track) {
  background-color: rgba(255, 255, 255, 0.3);
}

.setting-switch :deep(.v-switch__thumb) {
  background-color: white;
}

.setting-switch :deep(.v-selection-control--dirty .v-switch__track) {
  background-color: rgb(var(--v-theme-primary));
}

/* 分割线样式 */
.v-divider {
  opacity: 0.3;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .header-content {
    padding: 10px 12px;
  }
  
  .back-button {
    margin-right: 12px;
  }
  
  .page-title {
    font-size: 1.1rem;
  }
  
  .setting-item {
    padding: 14px 16px;
  }
  
  .setting-title {
    font-size: 0.95rem;
  }
  
  .setting-description {
    font-size: 0.85rem;
  }
  
  .action-text {
    font-size: 0.85rem;
  }
}

/* 特殊样式调整 */
.setting-item:last-child {
  border-bottom: none;
}

/* 长文本描述样式 */
.setting-item .setting-description {
  max-width: 280px;
}

@media (max-width: 600px) {
  .setting-item .setting-description {
    max-width: 200px;
  }
}
</style>