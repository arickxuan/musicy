<template>
  <div class="search-field">
    <v-text-field
      v-model="searchQuery"
      placeholder="搜索音乐、歌手、专辑"
      variant="outlined"
      color="primary"
      prepend-inner-icon="mdi-magnify"
      clearable
      hide-details
      class="search-input"
      @keyup.enter="handleSearch"
      @click:clear="handleClear"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search', 'clear'])

const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim())
  }
}

const handleClear = () => {
  searchQuery.value = ''
  emit('clear')
}
</script>

<style scoped>
.search-field {
  width: 100%;
}

.search-input :deep(.v-field) {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
}

.search-input :deep(.v-field__outline) {
  border-color: rgba(255, 255, 255, 0.2);
}

.search-input :deep(.v-field__outline--focused) {
  border-color: rgb(var(--v-theme-primary));
}

.search-input :deep(.v-field__input) {
  color: white;
  padding: 0 16px;
}

.search-input :deep(.v-field__input::placeholder) {
  color: rgba(255, 255, 255, 0.6);
}

.search-input :deep(.v-field__prepend-inner) {
  color: rgba(255, 255, 255, 0.6);
}
</style>