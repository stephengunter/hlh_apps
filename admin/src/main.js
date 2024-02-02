import { createApp } from 'vue'
import App from './App.vue'
import mitt from 'mitt'
import '@/assets/styles/app.scss'
import '@/assets/styles/emoji.scss'
import TreeItem from '@/components/tree/Item.vue'
// import DepartmentTreeItem from '@/components/department/TreeItem.vue'
// import JobTreeItem from '@/components/job/TreeItem.vue'

window.Bus = mitt()
// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)
app.component('TreeItem', TreeItem)
//app.component('DepartmentTreeItem', DepartmentTreeItem)
//app.component('JobTreeItem', JobTreeItem)
registerPlugins(app)
app.mount('#app')
