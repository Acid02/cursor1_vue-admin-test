import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import { setupRouter } from './router'
import { setupStore } from './stores'
import './styles/global.css'

const app = createApp(App)

setupStore(app)
setupRouter(app)

app.use(ElementPlus)

app.mount('#app')

