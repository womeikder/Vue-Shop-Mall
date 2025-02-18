import request from '@/utils/request'

// 提交评论
export const useSubmitComment = (goods_id, comment, star, pics) => {
  return request.post('web/comment', {
    goods_id: goods_id,
    comment: comment,
    star: star,
    pics: pics
  })
}


// 获取评论列表
export const useGetCommentList = (page, per_page, rate, goods_id, goods_name) => {
  return request.get('web/comment', {
    params: {
      page,
      per_page,
      rate,
      goods_id,
      goods_name
    }
  })
}

// 评论详情
export const useCommentDetail = (id) => {
  return request.get(`web/comment/${id}`)
}

// 删除评论
export const useDeleteComment = (id) => {
  return request.delete(`web/comment/${id}`)
}

