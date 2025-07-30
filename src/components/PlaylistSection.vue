<template>
  <div class="playlist-section">
    <!-- 标题和更多按钮 -->
    <div class="section-header">
      <h3 class="section-title">推荐歌单</h3>
      <v-btn
        variant="text"
        color="primary"
        size="small"
        @click="handleMoreClick"
        class="more-button"
      >
        更多
        <v-icon size="16" class="ml-1">mdi-chevron-right</v-icon>
      </v-btn>
    </div>

    <!-- 歌单列表 -->
    <div class="playlist-grid">
      <v-card
        v-for="playlist in playlists"
        :key="playlist.id"
        class="playlist-card"
        color="rgba(255,255,255,0.05)"
        rounded="xl"
        @click="handlePlaylistClick(playlist)"
        hover
      >
        <div class="playlist-content">
          <!-- 封面图片 -->
          <v-img
            :src="playlist.image"
            height="120"
            cover
            class="playlist-image"
            rounded="t-xl"
          >
            <div class="image-overlay">
              <v-btn
                icon
                size="small"
                color="primary"
                class="play-button"
                @click.stop="handlePlayClick(playlist)"
              >
                <v-icon>mdi-play</v-icon>
              </v-btn>
            </div>
          </v-img>

          <!-- 歌单信息 -->
          <div class="playlist-info">
            <div class="playlist-title">{{ playlist.title }}</div>
            <div class="playlist-description">{{ playlist.description }}</div>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  playlists: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['playlist-click', 'more-click', 'play-click'])

const handlePlaylistClick = (playlist) => {
  emit('playlist-click', playlist)
}

const handleMoreClick = () => {
  emit('more-click')
}

const handlePlayClick = (playlist) => {
  emit('play-click', playlist)
}
</script>

<style scoped>
.playlist-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.more-button {
  font-size: 0.9rem;
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.playlist-card {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.playlist-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.2);
}

.playlist-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.playlist-image {
  position: relative;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.playlist-card:hover .image-overlay {
  opacity: 1;
}

.play-button {
  background: rgba(255, 215, 0, 0.9) !important;
}

.playlist-info {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.playlist-title {
  font-size: 14px;
  font-weight: 600;
  color: white;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.playlist-description {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .playlist-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .playlist-info {
    padding: 10px;
  }
  
  .playlist-title {
    font-size: 13px;
  }
  
  .playlist-description {
    font-size: 11px;
  }
}
</style>