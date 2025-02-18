import { defineStore } from 'pinia'
import {ref} from "vue"

// 历史搜索记录
export const useHistorySearchStore = defineStore(
  'historySearch',
  () => {
    // 历史搜索记录
    const historySearchList = ref([])

    // 添加历史搜索记录
    const addHistorySearch = (newHistorySearch) => {
      // 如果存在就将之前的记录删除，添加新值在数组后
      historySearchList.value = historySearchList.value.filter(item => item !== newHistorySearch)
      historySearchList.value.push(newHistorySearch)
    }

    // 删除单个记录
    const removeHistorySearch = (newHistorySearch) => {
      historySearchList.value = historySearchList.value.filter(item => item !== newHistorySearch)
    }

    // 清空所有记录
    const clearHistorySearch = () => {
        historySearchList.value = []
    }
    // 获取历史搜索记录
    const getHistorySearch = () => {
      return historySearchList.value
    }

    return {
      historySearchList,
      addHistorySearch,
      removeHistorySearch,
      clearHistorySearch,
      getHistorySearch
    }
  }, 
  {
    persist: true
  }
)