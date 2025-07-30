<template>
  <div class="playlist-action-list">
    <!-- 列表标题（可选） -->
    <div v-if="title" class="list-title">
      <h3 class="text-h6 font-weight-medium text-white mb-4">{{ title }}</h3>
    </div>

    <!-- 操作项列表 -->
    <div class="action-items">
      <PlaylistActionItem
        v-for="action in actions"
        :key="action.id"
        :action="action"
        :show-more="showMore"
        @click="handleActionClick"
        @more-click="handleMoreClick"
        class="action-item"
      />
    </div>

    <!-- 空状态 -->
    <div v-if="actions.length === 0" class="empty-state">
      <v-icon size="48" color="rgba(255,255,255,0.3)" class="mb-4">
        mdi-playlist-music-outline
      </v-icon>
      <p class="text-body-1 text-grey">{{ emptyText }}</p>
    </div>
  </div>
</template>

<script setup>
import PlaylistActionItem from './PlaylistActionItem.vue'

const props = defineProps({
  actions: {
    type: Array,
    required: true,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
  showMore: {
    type: Boolean,
    default: true
  },
  emptyText: {
    type: String,
    default: '暂无歌单操作'
  }
})

const emit = defineEmits(['action-click', 'more-click'])

const handleActionClick = (action) => {
  emit('action-click', action)
}

const handleMoreClick = (action) => {
  emit('more-click', action)
}
</script>

<style scoped>
.playlist-action-list {
  width: 100%;
}

.list-title {
  margin-bottom: 16px;
}

.action-items {
  display: flex;
  flex-direction: column;
  gap: 0; /* PlaylistActionItem已经有margin-bottom */
}

.action-item {
  animation: slideInUp 0.3s ease-out;
}

/* 为每个项目添加延迟动画 */
.action-item:nth-child(1) {
  animation-delay: 0.1s;
}

.action-item:nth-child(2) {
  animation-delay: 0.2s;
}

.action-item:nth-child(3) {
  animation-delay: 0.3s;
}

.action-item:nth-child(4) {
  animation-delay: 0.4s;
}

.action-item:nth-child(5) {
  animation-delay: 0.5s;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  opacity: 0;
  animation: fadeIn 0.5s ease-out 0.3s forwards;
}

/* 动画定义 */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 600px) {
  .list-title h3 {
    font-size: 1.2rem;
  }
  
  .empty-state {
    padding: 40px 20px;
  }
}

/* 加载状态样式 */
.playlist-action-list.loading .action-item {
  opacity: 0.6;
  pointer-events: none;
}

/* 错误状态样式 */
.playlist-action-list.error .action-item {
  opacity: 0.4;
}
</style>