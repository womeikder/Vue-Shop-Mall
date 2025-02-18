import request from '@/utils/request'

// 获取订单预览信息
export const useOrderPreview = () => {
  return request.get('web/order/preview')
}

// 提交订单
export const useSubmitOrder = (address_id, goods_id, count) => {
  return request.post('web/order/post', {
    address_id: address_id,
    goods_id: goods_id,
    count: count
  })
}

// 订单支付
export const usePayOrder = (id, type) => {
  return request.post('web/payment', { 
    id: id,
    type: type
   })
}

// 支付前当个商品订单预览信息
export const useBuyPreviewGoods = (id, count) => {
  return request.get('web/buy', {
    params: {
      goods_id: id,
      number: count
    }
  })
}

// 获取订单列表
export const useGetOrderList = (page, per_page, status, order_by) => {
  return request.get('web/orders', {
    params: {
      page,
      per_page,
      status,
      order_by
    }
  })
}

// 确认收货
export const useConfirmOrder = (id) => {
  return request.put('web/order/receive', {
    id: id
  })
}

// 删除订单、取消订单
export const useDeleteOrder = (id) => {
  return request.delete('web/order/cancel', {
    params: {
      id: id 
    }
  })
}

// 订单状态
export const useOrderStatus = (id) => {
  return request.get('web/order/status', {
    params: {
      id: id 
    }
  })
}