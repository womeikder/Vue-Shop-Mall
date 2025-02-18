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
    return request.get('admin/user', {
        params: {
            ...data
        }
    })
}

// 获取当前点击用户信息
export const useGetUserDetail = (id) => {
    return request.get('admin/user/' + id)
}

// 修改用户状态
export const useUpdateUserStatus = (id) => {
    return request.put('admin/user/' + id + '/lock')
}

// 删除用户
export const useDeleteUser = (id) => {
    return request.delete('admin/user/' + id)
}