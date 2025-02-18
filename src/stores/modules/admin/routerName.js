import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCurrentName = defineStore(
  'routerName',
  () => {
    // 定义当前路由的名字
    const routerName = ref('')

    // 设置当前路由名字
    const setRouterName = (newName) => {
        routerName.value = newName
    }

    // 将数据暴露
    return {
        routerName,
        setRouterName
    }
  }
)
