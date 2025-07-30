<template>
    <v-app theme="dark" class="import-music-list-view">
        <!-- 页面头部 -->
        <PageHeader title="歌单导入" :show-back="true" :show-search="true" @back-click="handleBackClick"
            @search-click="handleSearchClick" />

        <v-main class="main-content">
            <v-container fluid class="pa-4">
                <!-- 歌单操作列表 -->
                <div class="playlist-actions">
                    <PlaylistActionList :actions="playlistActions" :show-more="true" @action-click="handleActionClick"
                        @more-click="handleMoreClick" />
                </div>
            </v-container>
        </v-main>

        <!-- 导入对话框 -->
        <ImportDialog :visible="showImportDialog" @close="handleDialogClose" @import-complete="handleImportComplete" />
    </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '../components/PageHeader.vue'
import PlaylistActionList from '../components/PlaylistActionList.vue'
import ImportDialog from '../components/ImportDialog.vue'

const router = useRouter()

// 对话框状态
const showImportDialog = ref(false)

// 歌单操作数据
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

const handleBackClick = () => {
    console.log('返回按钮点击')
    // PageHeader组件会自动处理返回逻辑
}

const handleSearchClick = () => {
    console.log('搜索按钮点击')
    // 后续实现搜索功能
}

const handleActionClick = (action) => {
    console.log('操作项点击:', action.title)

    switch (action.id) {
        case 'import':
            showImportDialog.value = true
            break
        case 'create':
            // 后续实现新建歌单功能
            console.log('新建歌单')
            break
        case 'favorites':
            // 后续实现我喜欢歌单功能
            console.log('我喜欢歌单')
            break
        default:
            console.log('未知操作:', action.id)
    }
}

const handleMoreClick = (action) => {
    console.log('更多操作点击:', action.title)
    // 后续实现更多操作菜单
}

const handleDialogClose = () => {
    showImportDialog.value = false
}

const handleImportComplete = (result) => {
    console.log('导入完成:', result)
    // 后续处理导入结果
}
</script>

<style scoped>
.import-music-list-view {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    min-height: 100vh;
}

.main-content {
    padding-top: 0 !important;
}

.playlist-actions {
    max-width: 600px;
    margin: 0 auto;
}
</style>