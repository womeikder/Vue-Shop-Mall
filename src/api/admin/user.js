import request from "@/utils/request.js";

// 获取当前用户的数据
export const getNowUserInfo = () => {
    return request.get('admin/user/info')
}

// 生成oss获取token
export const getOssToken = () => {
    return request.get('auth/oss/token')
}

// 更新用户信息
export const useUpdateUserInfo = (data) => {
    return request.put('auth/current/update', {
        ...data
    })
}

// 用户列表
export const useUserList = (data) => {
    return request.get('admin/user', data)
}
