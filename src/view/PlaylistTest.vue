<template>
  <v-app theme="dark" class="playlist-test">
    <v-main class="main-content">
      <v-container fluid class="pa-4">
        <h1 class="text-white mb-4">播放队列测试页面</h1>
        
        <v-card class="test-card mb-4" color="rgba(255,255,255,0.05)" rounded="xl">
          <v-card-text>
            <h3 class="text-white mb-3">当前播放信息</h3>
            <p class="text-white">歌曲: {{ currentSong.title }}</p>
            <p class="text-white">歌手: {{ currentSong.artist }}</p>
            <p class="text-white">状态: {{ currentSong.isPlaying ? '播放中' : '暂停' }}</p>
          </v-card-text>
        </v-card>

        <v-btn 
          color="primary" 
          @click="showQueue = true"
          class="mb-4"
        >
          显示播放队列
        </v-btn>
      </v-container>
    </v-main>

    <!-- 播放队列组件 -->
    <PlaylistQueue
      :visible="showQueue"
      :playlist="testPlaylist"
      :current-index="currentIndex"
      @close="handleQueueClose"
      @song-click="handleSongClick"
      @song-more="handleSongMore"
      @shuffle-toggle="handleShuffleToggle"
    />
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import PlaylistQueue from '../components/PlaylistQueue.vue'

const showQueue = ref(false)
const currentIndex = ref(0)

const currentSong = ref({
  title: '等你下课',
  artist: '周杰伦',
  isPlaying: true
})

const testPlaylist = ref([
  {
    id: '1',
    title: '等你下课',
    artist: '周杰伦',
    cover: 'https://picsum.photos/seed/song1/200/200',
    isPlaying: true
  },
  {
    id: '2',
    title: '远走高飞',
    artist: '金志文',
    cover: 'https://picsum.photos/seed/song2/200/200',
    isPlaying: false
  },
  {
    id: '3',
    title: '答案',
    artist: '杨坤 郭采洁',
    cover: 'https://picsum.photos/seed/song3/200/200',
    isPlaying: false
  },
  {
    id: '4',
    title: '陷阱',
    artist: '王北车',
    cover: 'https://picsum.photos/seed/song4/200/200',
    isPlaying: false
  },
  {
    id: '5',
    title: '说散就散',
    artist: '袁娅维TIA RAY',
    cover: 'https://picsum.photos/seed/song5/200/200',
    isPlaying: false
  }
])

const handleQueueClose = () => {
  showQueue.value = false
}

const handleSongClick = (song, index) => {
  console.log('切换歌曲:', song.title, index)
  currentIndex.value = index
  currentSong.value = {
    title: song.title,
    artist: song.artist,
    isPlaying: true
  }
  
  // 更新播放列表状态
  testPlaylist.value.forEach((item, i) => {
    item.isPlaying = i === index
  })
}

const handleSongMore = (song, index) => {
  console.log('歌曲更多操作:', song.title, index)
}

const handleShuffleToggle = (isShuffled) => {
  console.log('随机播放切换:', isShuffled)
}
</script>

<style scoped>
.playlist-test {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  min-height: 100vh;
}

.main-content {
  padding-top: 20px !important;
}

.test-card {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>