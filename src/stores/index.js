import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

// 将pinia独立为一个文件，方便维护
const pinia = createPinia()
pinia.use(persist)

export default pinia

// * 将modules下某个仓库方法全部导出
export * from './modules/user.js'
