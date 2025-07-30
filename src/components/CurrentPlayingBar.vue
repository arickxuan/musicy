<template>
  <v-card class="current-playing-bar" color="rgba(255,255,255,0.1)" rounded="xl">
    <div class="playing-content">
      <v-avatar size="40" class="mr-3">
        <v-img :src="currentSong.cover"></v-img>
      </v-avatar>
      <div class="playing-info">
        <div class="playing-title">{{ currentSong.artist }}</div>
      </div>
      <div class="playing-controls">
        <v-btn icon size="small" color="yellow" @click="togglePlay">
          <v-icon>{{ currentSong.isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
        </v-btn>
        <v-btn icon size="small" class="ml-2" @click="showPlaylist">
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-btn>
      </div>
    </div>
  </v-card>
  <div id="vs"></div>
  <canvas ref="analyzerCanvas"></canvas>
</template>

<script setup>

import { ref,onMounted } from 'vue';
import { HeadlessAudioPlayer } from '../core/player';
import Player from 'xgplayer';
import 'xgplayer/dist/index.min.css'
// 现在music作为一个固定的preset使用，不再继承player, 解决耦合性过大问题
import MusicPreset, { Analyze } from 'xgplayer-music';
import 'xgplayer-music/dist/index.min.css'

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

const togglePlay = () => {
  player.play();
  emit('toggle-play');

  

};

const showPlaylist = () => {
  player.pause();
  emit('show-playlist');
};
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