import request from "@/utils/request.js";

//获取分类列表
export const useCategoryList = (data) => {
    return request.get('admin/category', {
        params: data
    })
}

// 获取分类详情
export const useGetCategoryDetail = (id) => {
    return request.get('admin/category/' + id)
}

// 启用禁用
export const useUpdateCategoryStatus = (id, status) => {
    return request.put('admin/category/' + id + '/status', {
        status: status
    })
}

// 添加分类
export const useAddCategory = (data) => {
    return request.post('admin/category', data)
}

// 修改分类
export const useUpdateCategory = (id, data) => {
    return request.put('admin/category/' + id, data)
}