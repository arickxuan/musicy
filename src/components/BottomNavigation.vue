<template>
  <v-bottom-navigation 
    v-model="activeTab"
    class="bottom-nav"
    color="rgba(255,255,255,0.05)"
    height="80"
    @update:model-value="handleTabChange"
  >
    <v-btn 
      v-for="(item, index) in navItems" 
      :key="index"
      :value="item.value" 
      class="nav-btn"
    >
      <v-icon>{{ item.icon }}</v-icon>
      <span>{{ item.text }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: 'home'
  }
});

const emit = defineEmits(['update:modelValue', 'tab-change']);

const activeTab = ref(props.modelValue);

const navItems = [
  { value: 'home', icon: 'mdi-home', text: '首页' },
  { value: 'search', icon: 'mdi-magnify', text: '搜索' },
  { value: 'library', icon: 'mdi-music-note', text: '音乐库' },
  { value: 'download', icon: 'mdi-download', text: '下载' },
  { value: 'profile', icon: 'mdi-account', text: '我的' }
];

const handleTabChange = (value) => {
  emit('update:modelValue', value);
  emit('tab-change', value);
};
</script>

<style scoped>
.bottom-nav {
  background: rgba(0, 0, 0, 0.8) !important;
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-btn {
  flex-direction: column !important;
  height: 100% !important;
  color: rgba(255, 255, 255, 0.7) !important;
}

.nav-btn span {
  font-size: 10px;
  margin-top: 4px;
}

.nav-btn.v-btn--active {
  color: #FFD700 !important;
}
</style>