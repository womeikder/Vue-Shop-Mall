import request from "@/utils/request.js";

// 获取当前用户的数据
export const getNowUserInfo = () => {
    return request.get('admin/user/info')
}
