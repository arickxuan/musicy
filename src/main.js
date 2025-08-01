import { createApp } from "vue";
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Components
import App from './App.vue'
import {router} from './router/route'

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark',
        themes: {
            dark: {
                colors: {
                    primary: '#FFD700',
                    secondary: '#FF6B6B',
                    accent: '#4ECDC4',
                    background: '#1a1a1a',
                    surface: '#2d2d2d',
                }
            }
        }
    },
    icons: {
        iconfont: 'mdi',
    },
})

const pinia = createPinia()
const app = createApp(App)
app.use(vuetify) // Use Vuetify
app.use(router)
app.use(pinia)
app.mount('#app')

