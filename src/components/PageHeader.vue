<template>
  <div class="page-header">
    <div class="header-content">
      <!-- 返回按钮 -->
      <v-btn
        v-if="showBack"
        icon
        size="small"
        color="white"
        variant="text"
        @click="handleBackClick"
        class="back-button"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <!-- 标题 -->
      <div class="header-title">
        <h2 class="text-h6 font-weight-medium">{{ title }}</h2>
      </div>

      <!-- 搜索按钮 -->
      <v-btn
        v-if="showSearch"
        icon
        size="small"
        color="white"
        variant="text"
        @click="handleSearchClick"
        class="search-button"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  title: {
    type: String,
    default: '歌单导入'
  },
  showBack: {
    type: Boolean,
    default: true
  },
  showSearch: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['back-click', 'search-click'])

const handleBackClick = () => {
  emit('back-click')
  // 默认行为：返回上一页
  router.back()
}

const handleSearchClick = () => {
  emit('search-click')
}
</script>

<style scoped>
.page-header {
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
  justify-content: space-between;
  padding: 12px 16px;
  min-height: 56px;
}

.header-title {
  flex: 1;
  text-align: center;
  margin: 0 16px;
}

.header-title h2 {
  color: white;
  margin: 0;
}

.back-button,
.search-button {
  transition: all 0.2s ease;
}

.back-button:hover,
.search-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

/* 确保按钮有相同的宽度以保持标题居中 */
.back-button,
.search-button {
  width: 40px;
  height: 40px;
}
</style>