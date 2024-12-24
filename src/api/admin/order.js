import request from "@/utils/request.js";

// 获取订单的信息
export const useGetOrderList = (data) => {
    return request.get('admin/orders', {
        params: {
            ...data
        }

    })

}

// 快递发货
export const useOrderPost = (data) => {
    return request.put(`admin/orders/${data.id}/post`, data)
}

// 查看订单详情
export const useOrderDetail = (id) => {
    return request.get(`admin/orders/${id}`)
}
