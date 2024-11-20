// 用户模块 token setToken removeToken
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    // 定义用户token方法
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }


    // 将数据暴露
    return {
      token,
      setToken,
      removeToken
    }
  },
  // 设置pinia持久化更新
  {
    persist: true
  }
)
