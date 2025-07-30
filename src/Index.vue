<script setup>
import { ref } from 'vue';
import StatusBar from './components/StatusBar.vue';
import SearchField from './components/SearchField.vue';
import PlayerCard from './components/PlayerCard.vue';
import QuickActions from './components/QuickActions.vue';
import PlaylistSection from './components/PlaylistSection.vue';
import CurrentPlayingBar from './components/CurrentPlayingBar.vue';
import BottomNavigation from './components/BottomNavigation.vue';

import {getList} from './core/import_qq';

import { onMounted } from 'vue'

onMounted(async () => {
  console.log(`the component is now mounted.`)
  let re = await getList(1839459328,true)
  console.log(re)
})

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

const activeTab = ref('home');

// 事件处理函数
const handleSearch = (query) => {
  console.log('搜索:', query);
};

const handleTogglePlay = (song) => {
  currentSong.value.isPlaying = !currentSong.value.isPlaying;
  console.log('播放状态切换:', song);
};

const handleQuickAction = (action) => {
  console.log('快捷操作:', action.text);
};

const handlePlaylistClick = (playlist) => {
  console.log('点击歌单:', playlist.title);
};

const handleMoreClick = () => {
  console.log('查看更多歌单');
};

const handleCurrentPlayToggle = () => {
  currentSong.value.isPlaying = !currentSong.value.isPlaying;
};

const handleShowPlaylist = () => {
  console.log('显示播放列表');
};

const handleTabChange = (tab) => {
  console.log('切换标签:', tab);
};
</script>

<template>
  <v-app theme="dark" class="music-app">
    <!-- 状态栏组件 -->
    <!-- <StatusBar /> -->

    <v-main class="main-content">
      <v-container fluid class="pa-4">
        <!-- 标题 -->
        <div class="page-title mb-4">
          <h1 class="text-h4 font-weight-bold">首页</h1>
        </div>

        <!-- 搜索框组件 -->
        <SearchField 
          class="mb-6"
          @search="handleSearch"
        />

        <!-- 主要内容区域 -->
        <v-row class="mb-4">
          <!-- 正在播放组件 -->
          <v-col cols="7">
            <PlayerCard 
              :song="currentSong"
              @toggle-play="handleTogglePlay"
            />
          </v-col>

          <!-- 快捷操作组件 -->
          <v-col cols="5">
            <QuickActions 
              :actions="quickActions"
              @action-click="handleQuickAction"
            />
          </v-col>
        </v-row>

        <!-- 歌单推荐组件 -->
        <PlaylistSection 
          :playlists="playlists"
          @playlist-click="handlePlaylistClick"
          @more-click="handleMoreClick"
        />

        <!-- 当前播放条组件 -->
        <CurrentPlayingBar 
          :current-song="currentSong"
          @toggle-play="handleCurrentPlayToggle"
          @show-playlist="handleShowPlaylist"
        />
      </v-container>
    </v-main>

    <!-- 底部导航组件 -->
    <BottomNavigation 
      v-model="activeTab"
      @tab-change="handleTabChange"
    />
  </v-app>
</template>

<style scoped>
.music-app {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  min-height: 100vh;
}

.main-content {
  padding-top: 44px !important; /* 为状态栏留空间 */
  padding-bottom: 160px !important; /* 为底部播放栏和导航栏留空间 */
}

.page-title h1 {
  color: white;
}
</style>
