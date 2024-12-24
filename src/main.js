import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Message from "@/components/global/message/index.vue";
import pinia from "@/stores/index.js";

const app = createApp(App)

// 全局组件
app.use(Message)

app.use(pinia)
app.use(router)

app.mount('#app')
