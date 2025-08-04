<template>
  <v-card
    class="playlist-action-item"
    color="rgba(255,255,255,0.05)"
    rounded="xl"
    @click="handleClick"
    hover
  >
    <div class="action-content">
      <!-- 图标区域 -->
      <div class="action-icon-wrapper">
        <!-- 如果是URL则显示图片 -->
        <div
          v-if="isImageUrl(action.icon)"
          class="action-icon image-icon"
          :style="{ backgroundColor: action.iconBg || 'rgba(255,255,255,0.1)' }"
        >
          <v-img
            :src="action.icon"
            width="48"
            height="48"
            cover
            class="action-image"
          />
        </div>
        <!-- 否则显示图标 -->
        <v-avatar
          v-else
          :color="action.iconBg || 'rgba(255,255,255,0.1)'"
          size="48"
          class="action-icon"
        >
          <v-icon
            :color="getIconColor()"
            size="24"
          >
            {{ action.icon }}
          </v-icon>
        </v-avatar>
      </div>

      <!-- 文本信息区域 -->
      <div class="action-info">
        <div class="action-title">{{ action.title }}</div>
        <div class="action-description" v-if="action.description">
          {{ action.description }}
        </div>
      </div>

      <!-- 更多操作按钮 -->
      <div class="action-more" v-if="showMore">
        <v-btn
          icon
          size="small"
          variant="text"
          color="white"
          @click.stop="handleMoreClick"
        >
          <v-icon size="20">mdi-dots-vertical</v-icon>
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup>
const props = defineProps({
  action: {
    type: Object,
    required: true,
    validator: (action) => {
      return action.id && action.title && action.icon
    }
  },
  showMore: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click', 'more-click'])

const handleClick = () => {
  emit('click', props.action)
}

const handleMoreClick = () => {
  emit('more-click', props.action)
}

const getIconColor = () => {
  // 根据不同的操作类型返回不同的图标颜色
  switch (props.action.id) {
    case 'import':
      return 'white'
    case 'create':
      return 'white'
    case 'favorites':
      return 'white'
    default:
      return 'white'
  }
}

const isImageUrl = (icon) => {
  // 判断是否为图片URL
  return typeof icon === 'string' && (icon.startsWith('http://') || icon.startsWith('https://'))
}
</script>

<style scoped>
.playlist-action-item {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 12px;
}

.playlist-action-item:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.08) !important;
}

.action-content {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 16px;
}

.action-icon-wrapper {
  flex-shrink: 0;
}

.action-icon {
  transition: all 0.3s ease;
}

.playlist-action-item:hover .action-icon {
  transform: scale(1.05);
}

.image-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-image {
  border-radius: 50%;
  width: 100% !important;
  height: 100% !important;
}

.action-icon .v-img {
  border-radius: 50%;
}

.action-info {
  flex: 1;
  min-width: 0; /* 防止文本溢出 */
}

.action-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
  line-height: 1.2;
}

.action-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-more {
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.playlist-action-item:hover .action-more {
  opacity: 1;
}

/* 特殊样式：我喜欢歌单 */
.playlist-action-item[data-action-id="favorites"] .action-icon {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
}

/* 响应式设计 */
@media (max-width: 600px) {
  .action-content {
    padding: 12px;
    gap: 12px;
  }
  
  .action-icon-wrapper .v-avatar {
    width: 40px !important;
    height: 40px !important;
  }
  
  .action-title {
    font-size: 15px;
  }
  
  .action-description {
    font-size: 13px;
  }
}
</style>