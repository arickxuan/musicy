<template>
  <v-dialog
    v-model="dialogVisible"
    max-width="400"
    class="equalizer-dialog"
  >
    <v-card class="equalizer-card" color="surface">
      <!-- 对话框头部 -->
      <v-card-title class="dialog-header">
        <div class="header-content">
          <h3 class="text-h6 font-weight-medium text-white">均衡器</h3>
          <v-btn
            icon
            size="small"
            variant="text"
            color="white"
            @click="handleClose"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-divider color="rgba(255,255,255,0.1)"></v-divider>

      <!-- 均衡器内容 -->
      <v-card-text class="dialog-content">
        <!-- 预设选择 -->
        <div class="preset-section mb-6">
          <h4 class="section-title mb-3">预设</h4>
          <v-select
            v-model="selectedPreset"
            :items="presets"
            item-title="name"
            item-value="id"
            variant="outlined"
            color="primary"
            class="preset-select"
            @update:model-value="applyPreset"
          />
        </div>

        <!-- 频段控制 -->
        <div class="bands-section">
          <h4 class="section-title mb-4">频段调节</h4>
          <div class="bands-container">
            <div
              v-for="(band, index) in bands"
              :key="index"
              class="band-control"
            >
              <div class="band-label">{{ band.frequency }}</div>
              <v-slider
                v-model="band.gain"
                :min="-12"
                :max="12"
                :step="1"
                direction="vertical"
                color="primary"
                track-color="rgba(255,255,255,0.3)"
                thumb-color="primary"
                class="band-slider"
                @update:model-value="updateBand(index, $event)"
              />
              <div class="band-value">{{ band.gain }}dB</div>
            </div>
          </div>
        </div>

        <!-- 开关控制 -->
        <div class="controls-section mt-6">
          <v-switch
            v-model="equalizerEnabled"
            label="启用均衡器"
            color="primary"
            hide-details
            @update:model-value="toggleEqualizer"
          />
        </div>
      </v-card-text>

      <!-- 对话框操作按钮 -->
      <v-card-actions class="dialog-actions">
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          color="white"
          @click="resetToDefault"
        >
          重置
        </v-btn>
        <v-btn
          color="primary"
          @click="handleClose"
        >
          确定
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'change'])

const dialogVisible = ref(false)
const equalizerEnabled = ref(false)
const selectedPreset = ref('custom')

// 预设配置
const presets = ref([
  { id: 'off', name: '关闭' },
  { id: 'rock', name: '摇滚' },
  { id: 'pop', name: '流行' },
  { id: 'jazz', name: '爵士' },
  { id: 'classical', name: '古典' },
  { id: 'electronic', name: '电子' },
  { id: 'custom', name: '自定义' }
])

// 频段配置
const bands = ref([
  { frequency: '60Hz', gain: 0 },
  { frequency: '170Hz', gain: 0 },
  { frequency: '310Hz', gain: 0 },
  { frequency: '600Hz', gain: 0 },
  { frequency: '1kHz', gain: 0 },
  { frequency: '3kHz', gain: 0 },
  { frequency: '6kHz', gain: 0 },
  { frequency: '12kHz', gain: 0 },
  { frequency: '14kHz', gain: 0 },
  { frequency: '16kHz', gain: 0 }
])

// 预设配置数据
const presetConfigs = {
  off: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  rock: [5, 4, -1, -1, 0, 1, 3, 4, 4, 4],
  pop: [-1, 2, 4, 4, 1, -1, -1, 0, 1, 2],
  jazz: [4, 3, 1, 2, -1, -1, 0, 1, 2, 3],
  classical: [5, 4, 3, 2, -1, -1, 0, 2, 3, 4],
  electronic: [5, 4, 1, 0, -1, 2, 1, 2, 4, 5]
}

// 监听visible属性变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
})

// 监听对话框显示状态
watch(dialogVisible, (newVal) => {
  if (!newVal) {
    emit('close')
  }
})

// 应用预设
const applyPreset = (presetId) => {
  if (presetId === 'off') {
    equalizerEnabled.value = false
    resetBands()
  } else if (presetConfigs[presetId]) {
    equalizerEnabled.value = true
    const config = presetConfigs[presetId]
    bands.value.forEach((band, index) => {
      band.gain = config[index] || 0
    })
  }
  
  emitChange()
}

// 更新频段
const updateBand = (index, value) => {
  bands.value[index].gain = value
  selectedPreset.value = 'custom'
  emitChange()
}

// 切换均衡器
const toggleEqualizer = (enabled) => {
  if (!enabled) {
    selectedPreset.value = 'off'
  } else if (selectedPreset.value === 'off') {
    selectedPreset.value = 'custom'
  }
  emitChange()
}

// 重置到默认
const resetToDefault = () => {
  equalizerEnabled.value = false
  selectedPreset.value = 'off'
  resetBands()
  emitChange()
}

// 重置所有频段
const resetBands = () => {
  bands.value.forEach(band => {
    band.gain = 0
  })
}

// 发射变化事件
const emitChange = () => {
  emit('change', {
    enabled: equalizerEnabled.value,
    preset: selectedPreset.value,
    bands: bands.value.map(band => band.gain)
  })
}

const handleClose = () => {
  dialogVisible.value = false
}
</script>

<style scoped>
.equalizer-card {
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

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.preset-select :deep(.v-field) {
  background-color: rgba(255, 255, 255, 0.05);
}

.preset-select :deep(.v-field__outline) {
  border-color: rgba(255, 255, 255, 0.2);
}

.preset-select :deep(.v-field__input) {
  color: white;
}

.bands-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  height: 200px;
  padding: 0 10px;
}

.band-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  flex: 1;
}

.band-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
  text-align: center;
  writing-mode: horizontal-tb;
}

.band-slider {
  flex: 1;
  margin: 8px 0;
}

.band-slider :deep(.v-slider__track) {
  background-color: rgba(255, 255, 255, 0.2);
}

.band-slider :deep(.v-slider__thumb) {
  background-color: rgb(var(--v-theme-primary));
}

.band-value {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 8px;
  text-align: center;
  min-height: 16px;
}

.controls-section {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
}

.controls-section :deep(.v-switch) {
  color: white;
}

.controls-section :deep(.v-switch .v-label) {
  color: white;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .bands-container {
    gap: 4px;
    padding: 0 5px;
  }
  
  .band-label {
    font-size: 0.7rem;
  }
  
  .band-value {
    font-size: 0.65rem;
  }
}
</style>