import request from '@/utils/request'

// 获取用户信息
export const useUserInfo = () => {
  return request.get('web/user')
}

// 更新用户信息
export const useUpdateUserInfo = (data) => {
  return request.put('web/user', data)
}

// 更新用户密码
export const useUpdateUserPassword = (data) => {
  return request.put('auth/password/update', data)
}

// 发送验证码
export const useSendCode = () => {
  return request.get('auth/email/code')
}

// 更新用户邮箱
export const useUpdateUserEmail = (data) => {
  return request.put('auth/email/update', data)
}