import request from "@/utils/request.js";

// 获取轮播列表
export const useGetSlideList = (size) => {
    return request.get("admin/slides", {
        params: { size }
    })
}

// 删除轮播图
export const useDeleteSlide = (id) => {
    return request.delete(`admin/slides/${id}`)
}

// 详情轮播图
export const useGetSlideDetail = (id) => {
    return request.get(`admin/slides/${id}`)
}

// 修改轮播图
export const useUpdateSlide = (data) => {
    return request.put(`admin/slides/${data.id}`, data)
}

// 添加轮播图
export const useAddSlide = (data) => {
    return request.post("admin/slides", data)
}

// 将其他轮播图上架
export const usePutSlideOn = (id) => {
    return request.put(`admin/slides/seq`, {
       id
    })
}