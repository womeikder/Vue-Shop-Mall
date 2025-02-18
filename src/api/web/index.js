import request from '@/utils/request'

// 获取首页数据
export const useGetIndexData = () => {
  return request.get('web/index')
}

// 用户首页的数据
export const useGetUserIndexData = () => {
  return request.get('web/user/index')
}