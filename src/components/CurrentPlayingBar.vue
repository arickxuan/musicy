<template>
  <v-card class="current-playing-bar" color="rgba(255,255,255,0.1)" rounded="xl">
    <div class="playing-content">
      <div class="playing-main" @click="goToLyrics">
        <v-avatar size="40" class="mr-3">
          <v-img :src="currentSong.cover"></v-img>
        </v-avatar>
        <div class="playing-info">
          <div class="playing-title">{{ currentSong.artist }}</div>
        </div>
      </div>
      <div class="playing-controls">
        <v-btn icon size="small" color="yellow" @click.stop="togglePlay">
          <v-icon>{{ currentSong.isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
        </v-btn>
        <v-btn icon size="small" class="ml-2" @click.stop="showPlaylist">
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-btn>
      </div>
    </div>
  </v-card>
  <div id="vs"></div>
  <canvas ref="analyzerCanvas"></canvas>

  <!-- 播放队列 -->
  <PlaylistQueue
    :visible="showPlaylistQueue"
    :playlist="samplePlaylist"
    :current-index="currentSongIndex"
    @close="handleQueueClose"
    @song-click="handleSongClick"
    @song-more="handleSongMore"
    @shuffle-toggle="handleShuffleToggle"
  />
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { HeadlessAudioPlayer } from '../core/player';
import Player from 'xgplayer';
import 'xgplayer/dist/index.min.css'
// 现在music作为一个固定的preset使用，不再继承player, 解决耦合性过大问题
import MusicPreset, { Analyze } from 'xgplayer-music';
import 'xgplayer-music/dist/index.min.css'
import PlaylistQueue from './PlaylistQueue.vue'

const router = useRouter();

// 创建canvas的引用
const canvasRef = ref(null)

// 假设你有player数据
// let player = ref(null) // 根据你的实际情况初始化
let player = null

let analyzeInstance = null

onMounted(() => {
  console.log('onMounted music');
  player = new HeadlessAudioPlayer();

  // 加载音频文件
  player.load('http://s2.pstatp.com/cdn/expire-1-M/byted-player-videos/1.0.0/xgplayer-demo.mp4');

  // 播放控制
  player.play();
  // player.pause();
  // player.stop();

  // 音量控制 (0-1)
  player.setVolume(0.5);

  // 跳转到指定时间 (秒)
  player.setCurrentTime(10);

  // 事件监听
  player.on('playing', () => console.log('开始播放'));
  player.on('ended', () => console.log('播放结束')); 


  // 确保canvas元素已经渲染
  if (canvasRef.value) {
    // 将analyze实例挂载到window对象上
    // window.analyze = new Analyze(player.value, canvasRef.value, {
    //   bgColor: 'rgba(0,0,0,0.65)',
    //   stroke: 1,
    // })

    // // 同时保存本地引用，方便后续操作
    // analyzeInstance = window.analyze
  }
})



const props = defineProps({
  currentSong: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['toggle-play', 'show-playlist']);

// 播放队列状态
const showPlaylistQueue = ref(false)
const currentSongIndex = ref(0)

// 示例播放列表数据
const samplePlaylist = ref([
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
  },
  {
    id: '6',
    title: '讲真的',
    artist: '刘宇宁',
    cover: 'https://picsum.photos/seed/song6/200/200',
    isPlaying: false
  },
  {
    id: '7',
    title: '像我这样的人',
    artist: '毛不易',
    cover: 'https://picsum.photos/seed/song7/200/200',
    isPlaying: false
  },
  {
    id: '8',
    title: '病变',
    artist: 'CUBI',
    cover: 'https://picsum.photos/seed/song8/200/200',
    isPlaying: false
  }
])

const togglePlay = () => {
  player.play();
  emit('toggle-play');
};

const showPlaylist = () => {
  showPlaylistQueue.value = true
  emit('show-playlist');
};

const handleQueueClose = () => {
  showPlaylistQueue.value = false
}

const handleSongClick = (song, index) => {
  console.log('播放队列歌曲点击:', song.title, index)
  // 更新当前播放索引
  currentSongIndex.value = index
  // 更新播放列表中的播放状态
  samplePlaylist.value.forEach((item, i) => {
    item.isPlaying = i === index
  })
  // 切换到选中的歌曲
  emit('toggle-play')
}

const handleSongMore = (song, index) => {
  console.log('歌曲更多操作:', song.title, index)
  // 显示歌曲操作菜单
}

const handleShuffleToggle = (isShuffled) => {
  console.log('随机播放切换:', isShuffled)
  // 切换播放模式
}

const goToLyrics = () => {
  console.log('跳转到歌词页面')
  router.push('/lyrics')
}
</script>

<style scoped>
.current-playing-bar {
  position: fixed;
  bottom: 80px;
  left: 16px;
  right: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
}

.playing-content {
  display: flex;
  align-items: center;
  padding: 8px 16px;
}

.playing-main {
  display: flex;
  align-items: center;
  flex: 1;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.playing-main:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.playing-info {
  flex: 1;
  margin-left: 8px;
}

.playing-title {
  font-size: 14px;
  color: white;
  font-weight: 500;
}

.playing-controls {
  display: flex;
  align-items: center;
}
</style>