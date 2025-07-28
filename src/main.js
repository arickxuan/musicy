import { createApp } from "vue";


// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Components
import App from './App.vue'

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


const app = createApp(App)
app.use(vuetify) // Use Vuetify
app.mount('#app')

