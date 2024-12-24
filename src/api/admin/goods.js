import request from "@/utils/request.js";

// 获取商品列表
export const useGetGoodsList = (data) => {
    return request.get('admin/goods', {
        params: {
            ...data
        }
    })
}

// 获取商品分类列表
export const useGetGoodsCategoryList = () => {
    return request.get('admin/category/list')
}

// 新增商品
export const useAddGoods = (data) => {
    return request.post('admin/goods', {
        ...data
    })
}

// 删除商品

export const useDeleteGoods = (data) => {
    return request.delete(`admin/goods/${data}`)
}

// 修改商品
export const useUpdateGoods = (data) => {
    return request.put(`admin/goods/${data.id}`, {
        ...data
    })
}

