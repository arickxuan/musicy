<script setup>
import { ref } from 'vue';

const currentSong = ref({
  title: '柠乐',
  artist: '陈奕迅 - 孤独患者',
  isPlaying: true,
  cover: 'https://picsum.photos/seed/current/400/400'
});

const quickActions = ref([
  { text: '白噪音', icon: 'mdi-sine-wave', color: '#FFD700' },
  { text: '抖音热曲', icon: 'mdi-music-note', color: '#FF6B6B' },
  { text: '我喜欢', icon: 'mdi-heart', color: '#4ECDC4' },
  { text: '榜单', icon: 'mdi-trophy', color: '#45B7D1' },
  { text: '歌单广场', icon: 'mdi-grid', color: '#96CEB4' },
  { text: '歌单导入', icon: 'mdi-import', color: '#FFEAA7' },
]);

const playlists = ref([
  {
    title: '小众英文 | 遇见夏日的灵魂共鸣',
    description: '2623播放',
    image: 'https://picsum.photos/seed/playlist1/300/200',
  },
  {
    title: '抖音热门 | 2025年爆款DJ精选',
    description: '11万播放',
    image: 'https://picsum.photos/seed/playlist2/300/200',
  },
  {
    title: '梦回20行歌单',
    description: '7万播放',
    image: 'https://picsum.photos/seed/playlist3/300/200',
  },
]);

const handleQuickAction = (item) => {
  console.log('Clicked:', item.text);
};
</script>

<template>
  <v-app theme="dark" class="music-app">
    <!-- 状态栏 -->
    <div class="status-bar">
      <div class="status-left">
        <span class="time">21:14</span>
        <div class="status-icons">
          <v-icon size="16" color="green">mdi-wifi</v-icon>
          <v-icon size="16">mdi-signal-cellular-3</v-icon>
          <v-icon size="16">mdi-battery-80</v-icon>
        </div>
      </div>
      <div class="status-right">
        <v-icon size="20">mdi-bell</v-icon>
        <v-avatar size="24" class="ml-2">
          <v-img src="https://picsum.photos/seed/avatar/100/100"></v-img>
        </v-avatar>
      </div>
    </div>

    <v-main class="main-content">
      <v-container fluid class="pa-4">
        <!-- 标题 -->
        <div class="page-title mb-4">
          <h1 class="text-h4 font-weight-bold">首页</h1>
        </div>

        <!-- 搜索框 -->
        <v-text-field variant="solo" placeholder="歌手/歌名/专辑/歌词" prepend-inner-icon="mdi-magnify" hide-details
          class="search-field mb-6" color="yellow" bg-color="rgba(255,255,255,0.1)" rounded="pill"></v-text-field>

        <!-- 主要内容区域 -->
        <v-row class="mb-4">
          <!-- 正在播放 -->
          <v-col cols="7">
            <v-card class="player-card pa-4" color="rgba(255,255,255,0.05)" rounded="xl">
              <div class="player-content">
                <div class="album-cover mb-3">
                  <v-avatar size="120" class="album-avatar">
                    <v-img :src="currentSong.cover" cover>
                      <div class="play-overlay">
                        <v-btn icon size="large" color="white" class="play-btn">
                          <v-icon size="32">{{ currentSong.isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
                        </v-btn>
                      </div>
                    </v-img>
                  </v-avatar>
                </div>
                <div class="now-playing-badge mb-2">
                  <span class="badge-text">正在播放</span>
                </div>
                <div class="song-title">{{ currentSong.title }}</div>
              </div>
            </v-card>
          </v-col>

          <!-- 功能按钮 -->
          <v-col cols="5">
            <v-row dense>
              <v-col v-for="(action, index) in quickActions.slice(0, 4)" :key="index" cols="6" class="mb-2">
                <v-card class="action-card pa-3 text-center" color="rgba(255,255,255,0.05)" rounded="xl"
                  @click="handleQuickAction(action)" hover>
                  <v-icon :color="action.color" size="24" class="mb-2">
                    {{ action.icon }}
                  </v-icon>
                  <div class="action-text">{{ action.text }}</div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- 更多功能按钮 -->
        <v-row class="mb-6">
          <v-col v-for="(action, index) in quickActions.slice(4)" :key="index + 4" cols="6">
            <v-card class="action-card pa-3 text-center" color="rgba(255,255,255,0.05)" rounded="xl"
              @click="handleQuickAction(action)" hover>
              <v-icon :color="action.color" size="24" class="mb-2">
                {{ action.icon }}
              </v-icon>
              <div class="action-text">{{ action.text }}</div>
            </v-card>
          </v-col>
        </v-row>

        <!-- 歌单推荐 -->
        <div class="section-header mb-4">
          <h2 class="text-h6 font-weight-bold">歌单推荐</h2>
          <span class="text-grey">更多</span>
        </div>

        <!-- 歌单列表 -->
        <v-row>
          <v-col v-for="(playlist, index) in playlists" :key="index" cols="12" class="mb-3">
            <v-card class="playlist-card" color="rgba(255,255,255,0.05)" rounded="xl">
              <div class="playlist-content">
                <v-img :src="playlist.image" width="80" height="80" cover class="playlist-image" rounded="lg"></v-img>
                <div class="playlist-info">
                  <div class="playlist-title">{{ playlist.title }}</div>
                  <div class="playlist-desc text-grey">{{ playlist.description }}</div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- 当前播放条 -->
        <v-card class="current-playing-bar" color="rgba(255,255,255,0.1)" rounded="xl">
          <div class="playing-content">
            <v-avatar size="40" class="mr-3">
              <v-img src="https://picsum.photos/seed/current2/100/100"></v-img>
            </v-avatar>
            <div class="playing-info">
              <div class="playing-title">陈奕迅 - 孤独患者</div>
            </div>
            <div class="playing-controls">
              <v-btn icon size="small" color="yellow">
                <v-icon>mdi-play</v-icon>
              </v-btn>
              <v-btn icon size="small" class="ml-2">
                <v-icon>mdi-format-list-bulleted</v-icon>
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-container>
    </v-main>

    <!-- 底部导航 -->
    <v-bottom-navigation class="bottom-nav" color="rgba(255,255,255,0.05)" height="80">
      <v-btn value="home" class="nav-btn">
        <v-icon>mdi-home</v-icon>
        <span>首页</span>
      </v-btn>
      <v-btn value="search" class="nav-btn">
        <v-icon>mdi-magnify</v-icon>
        <span>搜索</span>
      </v-btn>
      <v-btn value="library" class="nav-btn">
        <v-icon>mdi-music-note</v-icon>
        <span>音乐库</span>
      </v-btn>
      <v-btn value="download" class="nav-btn">
        <v-icon>mdi-download</v-icon>
        <span>下载</span>
      </v-btn>
      <v-btn value="profile" class="nav-btn">
        <v-icon>mdi-account</v-icon>
        <span>我的</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<style scoped>
/* 自定义样式 */
.v-card-subtitle {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 16px;
  display: inline-block;
  padding: 2px 8px;
}
</style>
