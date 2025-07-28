<template>
  <v-text-field
    v-model="searchQuery"
    variant="solo"
    :placeholder="placeholder"
    prepend-inner-icon="mdi-magnify"
    hide-details
    class="search-field"
    color="yellow"
    bg-color="rgba(255,255,255,0.1)"
    rounded="pill"
    @input="handleSearch"
  ></v-text-field>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  placeholder: {
    type: String,
    default: '歌手/歌名/专辑/歌词'
  }
});

const emit = defineEmits(['search']);

const searchQuery = ref('');

const handleSearch = () => {
  emit('search', searchQuery.value);
};
</script>

<style scoped>
.search-field {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
}
</style>