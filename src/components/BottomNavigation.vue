<template>
  <div class="bottom-navigation">
    <v-bottom-navigation
      v-model="activeTab"
      color="primary"
      grow
      class="navigation-bar"
    >
      <v-btn
        v-for="tab in navigationTabs"
        :key="tab.value"
        :value="tab.value"
        @click="handleTabClick(tab)"
        class="nav-btn"
      >
        <v-icon size="24">{{ tab.icon }}</v-icon>
        <span class="nav-label">{{ tab.label }}</span>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  modelValue: {
    type: String,
    default: 'home'
  }
})

const emit = defineEmits(['update:modelValue', 'tab-change'])

const activeTab = ref(props.modelValue)

// 导航标签配置
const navigationTabs = ref([
  {
    value: 'home',
    label: '首页',
    icon: 'mdi-home',
    route: '/'
  },
  {
    value: 'search',
    label: '搜索',
    icon: 'mdi-magnify',
    route: '/search'
  },
  {
    value: 'music',
    label: '音乐',
    icon: 'mdi-music-note',
    route: '/music'
  },
  {
    value: 'download',
    label: '下载',
    icon: 'mdi-download',
    route: '/download'
  },
  {
    value: 'profile',
    label: '我的',
    icon: 'mdi-account',
    route: '/my'
  }
])

// 监听props变化
watch(() => props.modelValue, (newVal) => {
  activeTab.value = newVal
})

// 监听activeTab变化
watch(activeTab, (newVal) => {
  emit('update:modelValue', newVal)
  emit('tab-change', newVal)
})

const handleTabClick = (tab) => {
  console.log('导航标签点击:', tab.label)
  
  // 如果有路由配置，进行路由跳转
  if (tab.route && tab.route !== router.currentRoute.value.path) {
    router.push(tab.route).catch(err => {
      // 忽略重复导航错误
      if (err.name !== 'NavigationDuplicated') {
        console.error('路由跳转失败:', err)
      }
    })
  }
}
</script>

<style scoped>
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.navigation-bar {
  background: rgba(26, 26, 26, 0.95) !important;
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  height: 80px !important;
}

.nav-btn {
  flex-direction: column !important;
  height: 100% !important;
  min-width: 0 !important;
  padding: 8px 4px !important;
}

.nav-label {
  font-size: 0.75rem;
  margin-top: 4px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.2s ease;
}

/* 激活状态样式 */
.v-btn--active .nav-label {
  color: rgb(var(--v-theme-primary));
}

.v-btn--active .v-icon {
  color: rgb(var(--v-theme-primary)) !important;
}

/* 悬停效果 */
.nav-btn:hover .nav-label {
  color: rgba(255, 255, 255, 0.9);
}

.nav-btn:hover .v-icon {
  color: rgba(255, 255, 255, 0.9) !important;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .navigation-bar {
    height: 70px !important;
  }
  
  .nav-btn {
    padding: 6px 2px !important;
  }
  
  .nav-label {
    font-size: 0.7rem;
  }
  
  .v-icon {
    font-size: 20px !important;
  }
}
</style>