<template>
  <v-dialog
    v-model="dialogVisible"
    max-width="400"
    persistent
    class="create-playlist-dialog"
  >
    <v-card class="create-playlist-card" color="surface">
      <!-- 对话框头部 -->
      <v-card-title class="dialog-header">
        <div class="header-content">
          <h3 class="text-h6 font-weight-medium text-white">新建歌单</h3>
          <v-btn
            icon
            size="small"
            variant="text"
            color="white"
            @click="handleCancel"
            :disabled="isCreating"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-divider color="rgba(255,255,255,0.1)"></v-divider>

      <!-- 对话框内容 -->
      <v-card-text class="dialog-content">
        <v-text-field
          v-model="playlistName"
          label="歌单名称"
          placeholder="请输入歌单名称"
          variant="outlined"
          color="primary"
          :error-messages="nameError"
          :disabled="isCreating"
          class="playlist-name-input"
          @keyup.enter="handleConfirm"
          @input="validateName"
          autofocus
        />
        
        <div class="input-hint">
          <p class="text-caption text-grey">
            歌单名称不能为空，且不能与现有歌单重名
          </p>
        </div>
      </v-card-text>

      <!-- 对话框操作按钮 -->
      <v-card-actions class="dialog-actions">
        <v-spacer></v-spacer>
        
        <v-btn
          variant="text"
          color="white"
          @click="handleCancel"
          :disabled="isCreating"
        >
          取消
        </v-btn>
        
        <v-btn
          color="primary"
          @click="handleConfirm"
          :disabled="!canCreate || isCreating"
          :loading="isCreating"
        >
          确认
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

import { useSongListStore } from '../stores/list'
import { storeToRefs } from 'pinia'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  existingPlaylists: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'create'])

// 响应式数据
const dialogVisible = ref(false)
const playlistName = ref('')
const nameError = ref('')
const isCreating = ref(false)

// 计算属性
const canCreate = computed(() => {
  return playlistName.value.trim() !== '' && !nameError.value
})

// 监听visible属性变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
  if (newVal) {
    resetDialog()
  }
})

// 监听对话框显示状态
watch(dialogVisible, (newVal) => {
  if (!newVal) {
    emit('close')
  }
})

// 方法
const validateName = () => {
  nameError.value = ''
  const name = playlistName.value.trim()
  
  if (!name) {
    nameError.value = '歌单名称不能为空'
    return
  }
  
  if (name.length > 50) {
    nameError.value = '歌单名称不能超过50个字符'
    return
  }
  
  // 检查是否与现有歌单重名
  const exists = props.existingPlaylists.some(playlist => 
    playlist.name && playlist.name.toLowerCase() === name.toLowerCase()
  )
  
  if (exists) {
    nameError.value = '歌单名称已存在，请选择其他名称'
    return
  }
}

const handleConfirm = async () => {
  if (!canCreate.value) return
  
  validateName()
  if (nameError.value) return
  
  isCreating.value = true
  
  try {
    // 模拟创建过程
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newPlaylist = {
      id: Date.now().toString(),
      name: playlistName.value.trim(),
      description: '',
      songs: [],
      createdAt: new Date(),
      cover: null
    }
    const store = useSongListStore()
    const { addItem, list } = store //storeToRefs(store)
    // Add(re)
    addItem(newPlaylist)
    
    emit('create', newPlaylist)
    dialogVisible.value = false
  } catch (error) {
    console.error('创建歌单失败:', error)
    nameError.value = '创建失败，请重试'
  } finally {
    isCreating.value = false
  }
}

const handleCancel = () => {
  if (!isCreating.value) {
    dialogVisible.value = false
  }
}

const resetDialog = () => {
  playlistName.value = ''
  nameError.value = ''
  isCreating.value = false
}
</script>

<style scoped>
.create-playlist-card {
  background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dialog-header {
  padding: 20px 24px 16px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.dialog-content {
  padding: 24px;
}

.dialog-actions {
  padding: 16px 24px 24px;
}

.playlist-name-input :deep(.v-field) {
  background-color: rgba(255, 255, 255, 0.05);
}

.playlist-name-input :deep(.v-field__outline) {
  border-color: rgba(255, 255, 255, 0.2);
}

.playlist-name-input :deep(.v-field__input) {
  color: white;
}

.playlist-name-input :deep(.v-field__input::placeholder) {
  color: rgba(255, 255, 255, 0.6);
}

.playlist-name-input :deep(.v-label) {
  color: rgba(255, 255, 255, 0.7);
}

.input-hint {
  margin-top: 8px;
}

.input-hint p {
  margin: 0;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .dialog-content {
    padding: 16px;
  }
  
  .dialog-header {
    padding: 16px 16px 12px;
  }
  
  .dialog-actions {
    padding: 12px 16px 16px;
  }
}
</style>