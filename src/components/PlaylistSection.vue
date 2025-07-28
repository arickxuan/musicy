<template>
  <div class="playlist-section">
    <!-- 歌单推荐标题 -->
    <div class="section-header mb-4">
      <h2 class="text-h6 font-weight-bold">{{ title }}</h2>
      <span class="text-grey more-text" @click="handleMoreClick">{{ moreText }}</span>
    </div>

    <!-- 歌单列表 -->
    <v-row>
      <v-col 
        v-for="(playlist, index) in playlists" 
        :key="index"
        cols="12"
        class="mb-3"
      >
        <PlaylistCard 
          :playlist="playlist" 
          @click="handlePlaylistClick(playlist)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import PlaylistCard from './PlaylistCard.vue';

const props = defineProps({
  title: {
    type: String,
    default: '歌单推荐'
  },
  moreText: {
    type: String,
    default: '更多'
  },
  playlists: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['playlist-click', 'more-click']);

const handlePlaylistClick = (playlist) => {
  emit('playlist-click', playlist);
};

const handleMoreClick = () => {
  emit('more-click');
};
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.more-text {
  cursor: pointer;
  transition: color 0.3s;
}

.more-text:hover {
  color: #FFD700 !important;
}
</style>