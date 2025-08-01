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

        <!-- 新建歌单对话框 -->
        <CreatePlaylistDialog :visible="showCreateDialog" :existing-playlists="existingPlaylists"
            @close="handleCreateDialogClose" @create="handlePlaylistCreate" />
    </v-app>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '../components/PageHeader.vue'
import PlaylistActionList from '../components/PlaylistActionList.vue'
import ImportDialog from '../components/ImportDialog.vue'
import CreatePlaylistDialog from '../components/CreatePlaylistDialog.vue'

import { useSongListStore } from '../stores/list'
import { storeToRefs } from 'pinia'

const router = useRouter()

const store = useSongListStore()

const ount = () => {
    // const store = useSongListStore()
    const { Add, list } = storeToRefs(store)
}

// 对话框状态
const showImportDialog = ref(false)
const showCreateDialog = ref(false)

// 现有歌单列表（用于重名检查）
const existingPlaylists = ref([
    { id: 'favorites', name: '我喜欢' },
    { id: 'recent', name: '最近播放' }
])

    // 监控设置
let unsubscribeStore
let unsubscribeActionStore

onMounted(() => {
    // 监听 Pinia 的 playlists 变化
    watch(
        () => store.list,
        (newPlaylists) => {
            // 根据 Pinia 数据更新 playlistActions
            playlistActions.value = [
                ...playlistActions.value, // 保留原有操作
                // 动态添加新操作（示例）
                ...store.list.map(playlist => ({
                    id: `playlist-${playlist.songListId}`,
                    title: `编辑 ${playlist.songListName}`,
                    icon: 'mdi-playlist-edit',
                    iconBg: '#3d3d3d',
                    description: `修改歌单 ${playlist.songListName}`
                }))
            ];
            console.log(`watch 变化: ${playlistActions}`)
        },
        { deep: false } // 深度监听（如果需要）
    );

    // 使用 store 的 $subscribe 方法监控所有变化
    unsubscribeStore = store.$subscribe((mutation, state) => {
        console.log(`Store 变化: ${mutation.type} ${state.list }`)

        // 详细的 mutation 信息
        if (mutation.payload) {
            console.log('Mutation payload:', mutation.payload)
        }
    })

    unsubscribeActionStore = store.$onAction(({name, store, args, 
        after, 
        onError}) => {
        console.log(`action 变化: ${name} `)
        console.log("store", store, "args", args)
        if (args[0].id != undefined && args[0].name != undefined){
            playlistActions.value.push({
                id: `playlist-${args[0].id}`,
                title: `${args[0].name}`,
                icon: 'mdi-playlist-edit',
                iconBg: '#3d3d3d',
                description: `用户手动创建的歌单`
            })
        }

        if (args[0].songListId != undefined && args[0].songListName != undefined) {
            playlistActions.value.push({
                id: `playlist-${args[0].songListId}`,
                title: `${args[0].songListName}`,
                icon: 'mdi-playlist-edit',
                iconBg: '#3d3d3d',
                description: `从qq导入的歌单`
            })
        }
        

    })
})

// 组件卸载时清理
onUnmounted(() => {
    if (unsubscribeStore) {
        unsubscribeStore()
    }
    unsubscribeActionStore()
    console.log('组件即将卸载，停止监控')
})

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
            showCreateDialog.value = true
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

const handleCreateDialogClose = () => {
    showCreateDialog.value = false
}

const handlePlaylistCreate = (playlist) => {
    console.log('歌单创建成功:', playlist)

    // 添加到现有歌单列表
    existingPlaylists.value.push(playlist)

    // 这里可以添加保存到本地存储或发送到服务器的逻辑
    // localStorage.setItem('playlists', JSON.stringify(existingPlaylists.value))

    // 显示成功提示
    // 可以使用 Vuetify 的 snackbar 或其他提示组件
    console.log('新歌单已创建:', playlist.name)
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