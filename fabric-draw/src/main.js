import { createApp } from 'vue'
import App from './App.vue';
import { router } from './router'
import 'element-plus/dist/index.css'
const app = createApp(App)
app.use(router);
app.mount('#app')

// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//   app.component(key, component)
// }
