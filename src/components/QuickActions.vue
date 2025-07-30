<template>
  <div class="quick-actions">
    <!-- 主要功能按钮 -->
    <v-row dense class="mb-2">
      <v-col 
        v-for="(action, index) in actions.slice(0, 4)" 
        :key="index"
        cols="6"
        class="mb-2"
      >
        <ActionCard 
          :action="action" 
          @click="handleAction(action)"
        />
      </v-col>
    </v-row>

    <!-- 更多功能按钮 -->
    <v-row dense>
      <v-col 
        v-for="(action, index) in actions.slice(4)" 
        :key="index + 4"
        cols="6"
      >
        <ActionCard 
          :action="action" 
          @click="handleAction(action)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import ActionCard from './ActionCard.vue';
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const props = defineProps({
  actions: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['action-click']);

const handleAction = (action) => {
  if (action.text == "歌单导入"){
    // this.$router.push('/import-music-list')
    router.push({ path: '/import-music-list' })
    return
  }
  emit('action-click', action);

};
</script>

<style scoped>
.quick-actions {
  width: 100%;
}
</style>