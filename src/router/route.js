import { createMemoryHistory, createWebHistory,createRouter } from 'vue-router'

import Index from '../Index.vue'
import ImportMusicListView from '../view/ImportMusicListView.vue'
import My from '../view/My.vue'
import Search from '../view/Search.vue'
import Lyrics from '../view/Lyrics.vue'
import PlaylistTest from '../view/PlaylistTest.vue'
import NotFound from '../view/NotFound.vue'

const routes = [
    { path: '/', component: Index },
    { path: '/import-music-list', component: ImportMusicListView },
    { path: '/my', component: My },
    { path: '/search', component: Search },
    { path: '/lyrics', component: Lyrics },
    { path: '/playlist-test', component: PlaylistTest },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})
