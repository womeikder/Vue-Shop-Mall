import request from "@/utils/request.js";

// 登录
export const AdminLogin = (data) => {
    return request.post('auth/login', {
        ...data
    })
}

// 注册
export const AdminRegister = (data) => {
    return request.post('auth/register', {
        ...data
    })
}
