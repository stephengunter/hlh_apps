import { createApp } from 'vue'
import App from './App.vue'
import mitt from 'mitt'
import '@/assets/styles/app.scss'
import '@/assets/styles/emoji.scss'

window.Bus = mitt()
// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)
registerPlugins(app)
app.mount('#app')