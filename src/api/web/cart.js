import request from '@/utils/request'

// 添加商品到购物车
export const useAddCart = (id, count) => {
  return request.post('web/carts', {
    goods_id: id,
    count: count
  })
}

// 获取购物车列表
export const useGetCartList = () => {
  return request.get('web/carts')
}

// 修改购物车商品数量
export const useUpdateCartCount = (id, count) => {
  return request.put(`web/carts/${id}`, {
    count
  })
}

// 删除购物车商品
export const useDeleteCart = (id) => {
  return request.delete(`web/carts/${id}`)
}

// 更新购物车选中状态
export const useUpdateCartCheck = (ids, checked) => {
  return request.put(`web/carts/checked`, {
    ids,
    checked
  })
}