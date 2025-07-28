# 组件说明

## 组件结构

### 1. StatusBar.vue
- **功能**: 顶部状态栏，显示时间、网络状态、电池等信息
- **Props**: `avatarUrl` - 用户头像URL
- **特性**: 实时时间更新

### 2. SearchField.vue
- **功能**: 搜索输入框
- **Props**: `placeholder` - 占位符文本
- **Events**: `search` - 搜索事件

### 3. PlayerCard.vue
- **功能**: 主播放器卡片，显示当前播放歌曲
- **Props**: `song` - 歌曲对象
- **Events**: `toggle-play` - 播放/暂停切换

### 4. QuickActions.vue
- **功能**: 快捷操作按钮网格
- **Props**: `actions` - 操作按钮数组
- **Events**: `action-click` - 按钮点击事件
- **子组件**: ActionCard

### 5. ActionCard.vue
- **功能**: 单个操作按钮卡片
- **Props**: `action` - 操作对象 (text, icon, color)
- **Events**: `click` - 点击事件

### 6. PlaylistSection.vue
- **功能**: 歌单推荐区域
- **Props**: `title`, `moreText`, `playlists`
- **Events**: `playlist-click`, `more-click`
- **子组件**: PlaylistCard

### 7. PlaylistCard.vue
- **功能**: 单个歌单卡片
- **Props**: `playlist` - 歌单对象
- **Events**: `click` - 点击事件

### 8. CurrentPlayingBar.vue
- **功能**: 底部当前播放条
- **Props**: `currentSong` - 当前播放歌曲
- **Events**: `toggle-play`, `show-playlist`

### 9. BottomNavigation.vue
- **功能**: 底部导航栏
- **Props**: `modelValue` - 当前激活标签
- **Events**: `update:modelValue`, `tab-change`

## 数据流

```
App.vue (主组件)
├── StatusBar (状态栏)
├── SearchField (搜索框)
├── PlayerCard (播放器)
├── QuickActions (快捷操作)
│   └── ActionCard (操作按钮)
├── PlaylistSection (歌单区域)
│   └── PlaylistCard (歌单卡片)
├── CurrentPlayingBar (播放条)
└── BottomNavigation (底部导航)
```

## 样式特点

- 所有组件都采用深色主题
- 使用毛玻璃效果 (backdrop-filter)
- 统一的圆角设计 (rounded="xl")
- 悬停动画效果
- 响应式布局