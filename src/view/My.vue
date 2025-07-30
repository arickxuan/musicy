<template>
    <v-app theme="dark" class="my-page">
        <!-- 页面头部 -->
        <div class="page-header">
            <div class="header-content">
                <h1 class="page-title">我的</h1>
                <div class="header-actions">
                    <v-btn icon size="small" variant="text" color="white">
                        <v-icon>mdi-share-variant</v-icon>
                    </v-btn>
                    <v-btn icon size="small" variant="text" color="white">
                        <v-icon>mdi-cog</v-icon>
                    </v-btn>
                </div>
            </div>
        </div>

        <v-main class="main-content">
            <v-container fluid class="pa-4">
                <!-- 用户信息卡片 -->
                <v-card class="user-card mb-6" color="rgba(255,255,255,0.05)" rounded="xl">
                    <div class="user-content">
                        <v-avatar size="80" class="user-avatar">
                            <v-img :src="userInfo.avatar" cover></v-img>
                        </v-avatar>
                        <div class="user-info">
                            <h3 class="user-name">{{ userInfo.name }}</h3>
                            <div class="user-stats">
                                <span class="stat-item">{{ userInfo.following }}关注</span>
                                <span class="stat-item">{{ userInfo.followers }}粉丝</span>
                                <span class="stat-item">Lv{{ userInfo.level }}</span>
                            </div>
                        </div>
                        <v-btn icon size="small" variant="text" color="white" class="user-arrow">
                            <v-icon>mdi-chevron-right</v-icon>
                        </v-btn>
                    </div>
                </v-card>

                <!-- 快捷功能 -->
                <div class="quick-functions mb-6">
                    <v-row dense>
                        <v-col v-for="func in quickFunctions" :key="func.id" cols="4">
                            <v-card class="function-card" color="rgba(255,255,255,0.05)" rounded="xl"
                                @click="handleFunctionClick(func)" hover>
                                <div class="function-content">
                                    <v-icon :color="func.iconColor" size="32" class="mb-2">
                                        {{ func.icon }}
                                    </v-icon>
                                    <div class="function-name">{{ func.name }}</div>
                                </div>
                            </v-card>
                        </v-col>
                    </v-row>
                </div>

                <!-- 歌单部分 -->
                <div class="playlist-section">
                    <div class="section-header">
                        <h3 class="section-title">歌单</h3>
                        <div class="section-actions">
                            <v-btn icon size="small" variant="text" color="white" @click="handleCreatePlaylist">
                                <v-icon>mdi-plus</v-icon>
                            </v-btn>
                            <v-btn icon size="small" variant="text" color="white" @click="handleImportPlaylist">
                                <v-icon>mdi-import</v-icon>
                            </v-btn>
                        </div>
                    </div>

                    <!-- 歌单列表 -->
                    <div class="playlist-list">
                        <v-card v-for="playlist in playlists" :key="playlist.id" class="playlist-item"
                            color="rgba(255,255,255,0.05)" rounded="xl" @click="handlePlaylistClick(playlist)" hover>
                            <div class="playlist-content">
                                <v-avatar size="48" class="playlist-cover" rounded="lg">
                                    <v-img :src="playlist.cover" cover></v-img>
                                </v-avatar>
                                <div class="playlist-info">
                                    <div class="playlist-name">{{ playlist.name }}</div>
                                    <div class="playlist-count">{{ playlist.songCount }}首</div>
                                </div>
                                <v-btn icon size="small" variant="text" color="white"
                                    @click.stop="handlePlaylistMore(playlist)" class="playlist-more">
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                            </div>
                        </v-card>
                    </div>
                </div>
            </v-container>
        </v-main>

        <!-- 底部播放栏 -->
        <CurrentPlayingBar :current-song="currentSong" @toggle-play="handleTogglePlay"
            @show-playlist="handleShowPlaylist" />

        <!-- 底部导航 -->
        <BottomNavigation v-model="activeTab" @tab-change="handleTabChange" />
    </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CurrentPlayingBar from '../components/CurrentPlayingBar.vue'
import BottomNavigation from '../components/BottomNavigation.vue'

const router = useRouter()

// 用户信息
const userInfo = ref({
    name: '添加账号',
    avatar: 'https://picsum.photos/seed/user/200/200',
    following: 0,
    followers: 0,
    level: 0
})

// 快捷功能
const quickFunctions = ref([
    {
        id: 'favorites',
        name: '我喜欢',
        icon: 'mdi-heart',
        iconColor: '#FF6B6B'
    },
    {
        id: 'local',
        name: '本地',
        icon: 'mdi-music-note',
        iconColor: 'white'
    },
    {
        id: 'history',
        name: '历史',
        icon: 'mdi-history',
        iconColor: 'white'
    }
])

// 歌单列表
const playlists = ref([
    {
        id: 'favorites',
        name: '我喜欢',
        cover: 'https://picsum.photos/seed/favorites/200/200',
        songCount: 0
    }
])

// 当前播放歌曲
const currentSong = ref({
    title: '周杰伦 - 等你下课',
    artist: '周杰伦',
    isPlaying: false,
    cover: 'https://picsum.photos/seed/current/200/200'
})

// 底部导航状态
const activeTab = ref('profile')

// 事件处理函数
const handleFunctionClick = (func) => {
    console.log('快捷功能点击:', func.name)

    switch (func.id) {
        case 'favorites':
            // 跳转到我喜欢歌单
            console.log('打开我喜欢歌单')
            break
        case 'local':
            // 跳转到本地音乐
            console.log('打开本地音乐')
            break
        case 'history':
            // 跳转到播放历史
            console.log('打开播放历史')
            break
    }
}

const handleCreatePlaylist = () => {
    console.log('创建新歌单')
    // 后续实现创建歌单功能
}

const handleImportPlaylist = () => {
    console.log('导入歌单')
    // 跳转到歌单导入页面
    router.push('/import-music-list')
}

const handlePlaylistClick = (playlist) => {
    console.log('点击歌单:', playlist.name)
    // 跳转到歌单详情页面
}

const handlePlaylistMore = (playlist) => {
    console.log('歌单更多操作:', playlist.name)
    // 显示歌单操作菜单
}

const handleTogglePlay = () => {
    currentSong.value.isPlaying = !currentSong.value.isPlaying
    console.log('播放状态切换:', currentSong.value.isPlaying)
}

const handleShowPlaylist = () => {
    console.log('显示播放列表')
}

const handleTabChange = (tab) => {
    console.log('切换标签:', tab)
    activeTab.value = tab
}
</script>

<style scoped>
.my-page {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    min-height: 100vh;
}

/* 页面头部 */
.page-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: rgba(26, 26, 26, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    min-height: 56px;
}

.page-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
    margin: 0;
}

.header-actions {
    display: flex;
    gap: 8px;
}

/* 主要内容 */
.main-content {
    padding-top: 0 !important;
    padding-bottom: 160px !important;
    /* 为底部播放栏和导航留空间 */
}

/* 用户信息卡片 */
.user-card {
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.user-content {
    display: flex;
    align-items: center;
    padding: 20px;
    gap: 16px;
}

.user-avatar {
    flex-shrink: 0;
}

.user-info {
    flex: 1;
}

.user-name {
    font-size: 1.2rem;
    font-weight: 600;
    color: white;
    margin: 0 0 8px 0;
}

.user-stats {
    display: flex;
    gap: 16px;
}

.stat-item {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
}

.user-arrow {
    flex-shrink: 0;
}

/* 快捷功能 */
.quick-functions {
    margin-bottom: 24px;
}

.function-card {
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
    height: 100px;
}

.function-card:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.2);
}

.function-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 16px;
}

.function-name {
    font-size: 0.9rem;
    font-weight: 500;
    color: white;
    text-align: center;
}

/* 歌单部分 */
.playlist-section {
    margin-bottom: 24px;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
    margin: 0;
}

.section-actions {
    display: flex;
    gap: 8px;
}

/* 歌单列表 */
.playlist-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.playlist-item {
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
}

.playlist-item:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.2);
}

.playlist-content {
    display: flex;
    align-items: center;
    padding: 16px;
    gap: 16px;
}

.playlist-cover {
    flex-shrink: 0;
}

.playlist-info {
    flex: 1;
}

.playlist-name {
    font-size: 1rem;
    font-weight: 600;
    color: white;
    margin-bottom: 4px;
}

.playlist-count {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
}

.playlist-more {
    flex-shrink: 0;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.playlist-item:hover .playlist-more {
    opacity: 1;
}

/* 响应式设计 */
@media (max-width: 600px) {
    .user-content {
        padding: 16px;
    }

    .user-avatar {
        width: 60px !important;
        height: 60px !important;
    }

    .user-name {
        font-size: 1.1rem;
    }

    .function-card {
        height: 80px;
    }

    .function-content {
        padding: 12px;
    }
}
</style>