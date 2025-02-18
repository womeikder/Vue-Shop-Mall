// 用户模块 token setToken removeToken
import { defineStore } from 'pinia'
import {ref} from "vue"

export const useUserStore = defineStore(
  'user',
  () => {

      // 定义用户token
      const token = ref('')
      // 存储的当前登录用户的信息
      const currentUserInfo = ref({})

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
          removeToken,
          currentUserInfo,
      }
  },
  // 设置pinia持久化更新
  {
    persist: true
  }
)
