import request from '@/utils/request'

// 获取地址列表
export const useAddressList = () => {
  return request.get('web/address')
}

// 添加地址
export const useAddAddress = (data) => {
  return request.post('web/address', data)
}

// 获取省市区列表
export const useAreaList = (pid) => {
  return request.get('web/city', {
    params: {
      pid: pid
    }
  })
}

// 设置为默认地址
export const useSetDefaultAddress = (id) => {
  return request.put(`web/default/${id}`)
}

// 删除地址
export const useDeleteAddress = (id) => {
  return request.delete(`web/address/${id}`) 
}

// 更新地址
export const useUpdateAddress = (id, data) => {
  return request.put(`web/address/${id}`, data)
}
