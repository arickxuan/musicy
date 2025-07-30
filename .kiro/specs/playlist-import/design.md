# 歌单导入功能设计文档

## 概述

歌单导入功能是一个完整的歌单管理界面，提供导入外部歌单、创建新歌单和管理个人收藏的功能。该功能基于Vue 3 + Vuetify 3 + Tauri技术栈，采用组件化设计，确保良好的用户体验和代码可维护性。

## 架构

### 技术栈
- **前端框架**: Vue 3 (Composition API)
- **UI组件库**: Vuetify 3 (Material Design)
- **路由**: Vue Router 4
- **桌面应用**: Tauri 2
- **图标**: Material Design Icons (@mdi/font)
- **构建工具**: Vite

### 页面结构
```
ImportMusicListView.vue (主页面)
├── StatusBar.vue (状态栏)
├── PageHeader.vue (页面头部 - 返回按钮、标题、搜索按钮)
├── PlaylistActionList.vue (歌单操作列表)
│   ├── PlaylistActionItem.vue (单个操作项)
│   └── ImportDialog.vue (导入对话框)
├── CurrentPlayingBar.vue (底部播放栏)
└── BottomNavigation.vue (底部导航)
```

## 组件和接口

### 1. ImportMusicListView.vue (主页面组件)
**职责**: 作为歌单导入功能的主容器，管理整体布局和状态

**Props**: 无

**State**:
```javascript
const playlistActions = ref([
  {
    id: 'import',
    title: '导入歌单',
    icon: 'mdi-import',
    iconBg: '#2d2d2d',
    description: '从其他平台导入歌单'
  },
  {
    id: 'create',
    title: '新建歌单',
    icon: 'mdi-plus',
    iconBg: '#2d2d2d',
    description: '创建一个新的歌单'
  },
  {
    id: 'favorites',
    title: '我喜欢',
    icon: 'mdi-heart',
    iconBg: '#FF6B6B',
    description: '我收藏的音乐'
  }
])

const currentSong = ref({
  title: '周杰伦 - 等你下课',
  isPlaying: false,
  cover: 'default-cover.jpg'
})
```

**Events**:
- `@action-click`: 处理歌单操作点击
- `@back-click`: 处理返回按钮点击
- `@search-click`: 处理搜索按钮点击

### 2. PageHeader.vue (页面头部组件)
**职责**: 提供页面导航和标题显示

**Props**:
```javascript
{
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
}
```

**Events**:
- `@back-click`: 返回按钮点击
- `@search-click`: 搜索按钮点击

### 3. PlaylistActionList.vue (歌单操作列表组件)
**职责**: 渲染歌单操作选项列表

**Props**:
```javascript
{
  actions: {
    type: Array,
    required: true
  }
}
```

**Events**:
- `@action-click`: 操作项点击事件

### 4. PlaylistActionItem.vue (歌单操作项组件)
**职责**: 单个歌单操作选项的展示和交互

**Props**:
```javascript
{
  action: {
    type: Object,
    required: true,
    validator: (action) => {
      return action.id && action.title && action.icon
    }
  }
}
```

**Events**:
- `@click`: 操作项点击事件

### 5. ImportDialog.vue (导入对话框组件)
**职责**: 处理歌单导入的具体流程

**Props**:
```javascript
{
  visible: {
    type: Boolean,
    default: false
  }
}
```

**State**:
```javascript
const importSources = ref([
  { id: 'qq', name: 'QQ音乐', icon: 'mdi-music-note' },
  { id: 'netease', name: '网易云音乐', icon: 'mdi-music-circle' },
  { id: 'url', name: '链接导入', icon: 'mdi-link' }
])

const selectedSource = ref(null)
const importUrl = ref('')
const isImporting = ref(false)
const importProgress = ref(0)
```

**Events**:
- `@close`: 关闭对话框
- `@import-complete`: 导入完成

## 数据模型

### Playlist (歌单模型)
```javascript
interface Playlist {
  id: string
  name: string
  description?: string
  cover?: string
  songs: Song[]
  createdAt: Date
  updatedAt: Date
  isDefault: boolean // 标识是否为默认歌单（如"我喜欢"）
}
```

### Song (歌曲模型)
```javascript
interface Song {
  id: string
  title: string
  artist: string
  album?: string
  duration?: number
  cover?: string
  url?: string
  source: 'local' | 'qq' | 'netease' | 'other'
}
```

### ImportResult (导入结果模型)
```javascript
interface ImportResult {
  success: boolean
  totalSongs: number
  importedSongs: number
  failedSongs: number
  errors: string[]
  playlist: Playlist
}
```

## 错误处理

### 导入错误处理
1. **网络错误**: 显示网络连接失败提示，提供重试选项
2. **格式错误**: 显示不支持的格式提示，提供格式说明
3. **权限错误**: 显示权限不足提示，引导用户检查链接权限
4. **部分失败**: 显示导入摘要，列出成功和失败的歌曲数量

### 用户输入验证
1. **歌单名称**: 不能为空，不能与现有歌单重名
2. **导入链接**: 必须是有效的URL格式
3. **歌单ID**: 必须是有效的数字格式

### 错误显示策略
- 使用Vuetify的Snackbar组件显示简短错误信息
- 使用Dialog组件显示详细错误信息和解决建议
- 在表单字段下方显示验证错误信息

## 测试策略

### 单元测试
1. **组件渲染测试**: 验证所有组件正确渲染
2. **事件处理测试**: 验证用户交互事件正确触发
3. **数据验证测试**: 验证输入数据格式和有效性检查
4. **状态管理测试**: 验证组件状态正确更新

### 集成测试
1. **导入流程测试**: 测试完整的歌单导入流程
2. **路由导航测试**: 测试页面间的导航功能
3. **数据持久化测试**: 测试歌单数据的保存和加载

### 用户体验测试
1. **响应性测试**: 验证界面在不同屏幕尺寸下的表现
2. **加载状态测试**: 验证加载指示器和进度显示
3. **错误恢复测试**: 验证错误状态下的用户体验

## 样式设计

### 主题配置
基于现有的Vuetify深色主题配置：
```javascript
{
  primary: '#FFD700',    // 金色 - 主要操作按钮
  secondary: '#FF6B6B',  // 红色 - "我喜欢"等特殊功能
  accent: '#4ECDC4',     // 青色 - 强调元素
  background: '#1a1a1a', // 深灰 - 页面背景
  surface: '#2d2d2d'     // 中灰 - 卡片背景
}
```

### 视觉设计原则
1. **一致性**: 与现有组件保持视觉一致性
2. **层次感**: 使用不同的背景透明度创建层次
3. **交互反馈**: 悬停和点击状态的视觉反馈
4. **可访问性**: 确保足够的颜色对比度

### 动画效果
1. **页面转场**: 使用Vue Router的过渡动画
2. **组件动画**: 卡片悬停效果和按钮点击反馈
3. **加载动画**: 导入过程中的进度指示器动画