<template>
  <v-dialog v-model="dialogVisible" max-width="500" persistent class="import-dialog">
    <v-card class="import-dialog-card" color="surface">
      <!-- 对话框头部 -->
      <v-card-title class="dialog-header">
        <div class="header-content">
          <h3 class="text-h6 font-weight-medium text-white">
            {{ getDialogTitle() }}
          </h3>
          <v-btn icon size="small" variant="text" color="white" @click="handleClose" :disabled="isImporting">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-divider color="rgba(255,255,255,0.1)"></v-divider>

      <!-- 对话框内容 -->
      <v-card-text class="dialog-content">
        <!-- 导入源选择 -->
        <div v-if="currentStep === 'source'" class="source-selection">
          <p class="text-body-1 text-white mb-4">选择导入来源：</p>

          <div class="import-sources">
            <v-card v-for="source in importSources" :key="source.id" class="source-card"
              :class="{ 'selected': selectedSourceid === source.id }" color="rgba(255,255,255,0.05)"
              @click="selectSource(source)" hover>
              <v-card-text class="source-content">
                <v-icon :color="selectedSourceid === source.id ? 'primary' : 'white'" size="24" class="mb-2">
                  {{ source.icon }}
                </v-icon>
                <div class="source-name">{{ source.name }}</div>
              </v-card-text>
            </v-card>
          </div>
        </div>

        <!-- 导入配置 -->
        <div v-if="currentStep === 'config'" class="import-config">
          <div v-if="selectedSourceid === 'url'">
            <p class="text-body-1 text-white mb-4">请输入歌单链接：</p>
            <v-text-field v-model="importUrl" label="歌单链接" placeholder="https://..." variant="outlined" color="primary"
              :error-messages="urlError" :disabled="isImporting" class="mb-4" />
          </div>

          <div v-if="selectedSourceid === 'file'">
            <p class="text-body-1 text-white mb-4">请选择文件</p>
            <v-file-input v-model="importFile" label="选择文件" @change="handleFileChange" variant="outlined" color="primary"
              :error-messages="fileError" :disabled="isImporting" class="mb-4" />
          </div>

          <div v-if="selectedSourceid === 'qq'">
            <p class="text-body-1 text-white mb-4">请输入QQ音乐歌单ID：</p>
            <v-text-field v-model="playlistId" label="歌单ID" placeholder="例如：1839459328" variant="outlined"
              color="primary" :error-messages="idError" :disabled="isImporting" class="mb-4" />
          </div>

          <div v-if="selectedSourceid === 'netease'">
            <p class="text-body-1 text-white mb-4">请输入网易云音乐歌单ID：</p>
            <v-text-field v-model="playlistId" label="歌单ID" placeholder="例如：123456789" variant="outlined"
              color="primary" :error-messages="idError" :disabled="isImporting" class="mb-4" />
          </div>
        </div>

        <!-- 导入进度 -->
        <div v-if="currentStep === 'importing'" class="import-progress">
          <div class="progress-info">
            <v-icon color="primary" size="48" class="mb-4">
              mdi-download
            </v-icon>
            <p class="text-h6 text-white mb-2">正在导入歌单...</p>
            <p class="text-body-2 text-grey mb-4">{{ progressText }}</p>
          </div>

          <v-progress-linear v-model="importProgress" color="primary" height="8" rounded class="mb-4" />

          <p class="text-caption text-grey text-center">
            {{ Math.round(importProgress) }}%
          </p>
        </div>

        <!-- 导入结果 -->
        <div v-if="currentStep === 'result'" class="import-result">
          <div class="result-info" :class="{ 'success': importResult?.success, 'error': !importResult?.success }">
            <v-icon :color="importResult?.success ? 'success' : 'error'" size="48" class="mb-4">
              {{ importResult?.success ? 'mdi-check-circle' : 'mdi-alert-circle' }}
            </v-icon>

            <h4 class="text-h6 text-white mb-2">
              {{ importResult?.success ? '导入成功' : '导入失败' }}
            </h4>

            <div v-if="importResult?.success" class="success-details">
              <p class="text-body-2 text-grey mb-2">
                成功导入 {{ importResult.importedSongs }} / {{ importResult.totalSongs }} 首歌曲
              </p>
              <p class="text-body-2 text-grey">
                歌单名称：{{ importResult.playlist?.name }}
              </p>
            </div>

            <div v-if="!importResult?.success" class="error-details">
              <p class="text-body-2 text-error mb-2">
                {{ importResult?.errors?.[0] || '导入过程中发生未知错误' }}
              </p>
            </div>
          </div>
        </div>
      </v-card-text>

      <!-- 对话框操作按钮 -->
      <v-card-actions class="dialog-actions">
        <v-spacer></v-spacer>

        <v-btn v-if="currentStep === 'source'" variant="text" color="white" @click="handleClose"
          :disabled="isImporting">
          取消
        </v-btn>

        <v-btn v-if="currentStep === 'source'" color="primary" @click="nextStep" :disabled="!selectedSourceid">
          下一步
        </v-btn>

        <v-btn v-if="currentStep === 'config'" variant="text" color="white" @click="prevStep" :disabled="isImporting">
          上一步
        </v-btn>

        <v-btn v-if="currentStep === 'config'" color="primary" @click="startImport"
          :disabled="canStartImport.value || isImporting.value" :loading="isImporting">
          开始导入
        </v-btn>

        <v-btn v-if="currentStep === 'result'" color="primary" @click="handleClose">
          完成
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { getList } from '../core/import_qq'
import { StorageUtil } from '../core/localStorage'

import { useSongListStore } from '../stores/list'
import { storeToRefs } from 'pinia'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'import-complete'])

// 响应式数据
const dialogVisible = ref(false)
const currentStep = ref('source') // 'source', 'config', 'importing', 'result'
const selectedSource = ref(null)
const selectedSourceid = ref(null)
const importUrl = ref('')
const importFile = ref(null)
const playlistId = ref('')
const isImporting = ref(false)
const importProgress = ref(0)
const progressText = ref('')
const importResult = ref(null)
const urlError = ref('')
const idError = ref('')

// 导入源配置
const importSources = ref([
  { id: 'qq', name: 'QQ音乐', icon: 'mdi-music-note' },
  { id: 'netease', name: '网易云音乐', icon: 'mdi-music-circle' },
  { id: 'url', name: '链接导入', icon: 'mdi-link' },
  { id: 'file', name: '本地文件', icon: 'mdi-file' }
])

// 计算属性
const canStartImport = computed(() => {
  if (selectedSourceid.value === 'url') {
    return importUrl.value.trim() !== '' && !urlError.value
  }
  if (selectedSourceid.value === 'file') {
    return importUrl.value.trim() !== '' && !urlError.value
  }
  if (selectedSourceid.value === 'qq' || selectedSourceid.value === 'netease') {
    return playlistId.value.trim() !== '' && !idError.value
  }
  return false
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

// 监听输入验证
// watch(importUrl, validateUrl)
// watch(playlistId, validateId)

// 方法
const getDialogTitle = () => {
  switch (currentStep.value) {
    case 'source':
      return '选择导入来源'
    case 'config':
      return '配置导入参数'
    case 'importing':
      return '正在导入'
    case 'result':
      return '导入结果'
    default:
      return '导入歌单'
  }
}

const selectSource = (source) => {
  selectedSourceid.value = source.id
}

const nextStep = () => {
  if (currentStep.value === 'source' && selectedSourceid.value) {
    currentStep.value = 'config'
  }
}

const prevStep = () => {
  if (currentStep.value === 'config') {
    currentStep.value = 'source'
  }
}
const handleFileChange = (event) => {
  importFile.value = event.target.files[0];

  // 直接读取文件示例
  if (importFile.value) {
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log('Base64内容:', e.target.result); // 如果是图片/二进制
    };
    reader.readAsText(importFile.value);
    // reader.readAsText(this.selectedFile); // 根据需求改用 readAsDataURL/readAsArrayBuffer

  }
}

const startImport = async () => {
  if (!canStartImport.value) return

  isImporting.value = true
  currentStep.value = 'importing'
  importProgress.value = 0
  progressText.value = '准备导入...'

  try {
    console.log('开始导入', selectedSourceid)
    if (selectedSourceid.value === 'qq') {

      let re = await doImport()

      // 导入成功
      importResult.value = {
        success: true,
        totalSongs: re.songlist.length,
        importedSongs: re.songlist.length,
        failedSongs: 0,
        errors: [],
        playlist: {
          name: '导入的歌单',
          id: Date.now().toString()
        }
      }

      currentStep.value = 'result'
      canStartImport.value = true
      emit('import-complete', importResult.value)
    }
    if (selectedSourceid.value === 'file') {

    }
  } catch (error) {
    // 导入失败
    importResult.value = {
      success: false,
      errors: [error.message || '导入失败']
    }
    currentStep.value = 'result'
  } finally {
    isImporting.value = false
  }
}

const simulateImport = () => {
  return new Promise((resolve) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        progressText.value = '导入完成'
        resolve()
      } else {
        importProgress.value = progress
        progressText.value = `正在处理歌曲... (${Math.round(progress)}%)`
      }
    }, 200)
  })
}

const doImport = async () => {
  let re = await getList(playlistId.value, true)

  const store = useSongListStore()
  const { addItem, list } = store //storeToRefs(store)
  addItem(re)
  return re
}

const validateUrl = () => {
  urlError.value = ''
  if (importUrl.value && !isValidUrl(importUrl.value)) {
    urlError.value = '请输入有效的URL地址'
  }
}

const validateId = () => {
  idError.value = ''
  if (playlistId.value && !/^\d+$/.test(playlistId.value)) {
    idError.value = '请输入有效的数字ID'
  }
}

const isValidUrl = (string) => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

const resetDialog = () => {
  currentStep.value = 'source'
  selectedSource.value = null
  importUrl.value = ''
  playlistId.value = ''
  isImporting.value = false
  importProgress.value = 0
  progressText.value = ''
  importResult.value = null
  urlError.value = ''
  idError.value = ''
}

const handleClose = () => {
  if (!isImporting.value) {
    dialogVisible.value = false
  }
}
</script>

<style scoped>
.import-dialog-card {
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
  min-height: 200px;
}

.dialog-actions {
  padding: 16px 24px 24px;
}

/* 导入源选择样式 */
.import-sources {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.source-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.source-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.2);
}

.source-card.selected {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(255, 215, 0, 0.1) !important;
}

.source-content {
  text-align: center;
  padding: 20px 16px;
}

.source-name {
  font-size: 14px;
  font-weight: 500;
  color: white;
  margin-top: 8px;
}

/* 进度和结果样式 */
.import-progress,
.import-result {
  text-align: center;
}

.progress-info,
.result-info {
  margin-bottom: 20px;
}

.result-info.success .v-icon {
  color: rgb(var(--v-theme-success));
}

.result-info.error .v-icon {
  color: rgb(var(--v-theme-error));
}

.success-details,
.error-details {
  margin-top: 16px;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .import-sources {
    grid-template-columns: 1fr;
  }

  .dialog-content {
    padding: 16px;
  }
}
</style>