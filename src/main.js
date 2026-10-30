import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).mount('#app')

/* 生产环境注册 Service Worker：装到主屏后可以离线打开 */
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      /* 注册失败不影响正常使用 */
    })
  })
}
