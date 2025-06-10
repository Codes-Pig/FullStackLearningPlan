import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from '@fsdev/element-plus'
import '@fsdev/element-plus/dist/index.css'
import BochUI from '@fscut/bochui'
import '@fscut/bochui/lib/style.css'
import FsIcon from '@fscut/icon'
import '@fscut/icon/lib/style.css'

createApp(App)
  .use(ElementPlus)
  .use(BochUI)
  .use(FsIcon)
  .mount('#app')
