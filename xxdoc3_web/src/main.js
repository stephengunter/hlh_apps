import { registerPlugins } from '@/plugins'
import mitt from 'mitt'
import App from './App.vue'
import { createApp } from 'vue'

window.Bus = mitt()

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
