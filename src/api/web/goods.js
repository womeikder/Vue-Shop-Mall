import request from '@/utils/request'

// 获取十条推荐商品
export const useGetTenRecommendGoods = () => {
  return request.get('web/recommend/goods')
}

// 获取商品详情
export const useGetGoodsDetail = (id) => {
  return request.get(`web/goods/${id}`)
}


// 获取商品列表
export const useGetGoodsList = (params) => {
  return request.get('web/goods', {
    params
  })
}