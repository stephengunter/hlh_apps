import { createApp } from 'vue'
import App from './App.vue'
import mitt from 'mitt'
import '@/assets/styles/app.scss'
import '@/assets/styles/emoji.scss'
import TreeItem from '@/components/common/tree/Item.vue'



window.Bus = mitt()
// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)
app.component('TreeItem', TreeItem)
registerPlugins(app)
app.mount('#app')
