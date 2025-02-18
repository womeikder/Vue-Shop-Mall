import request from '@/utils/request'

// 获取评论列表
export const getCommentList = (params) => {
  return request.get('admin/comments', {
    params: params
  })
}

// 回复评论
export const useReplyComment = (id, reply) => {
  return request.put(`admin/comments/${id}/reply`, { reply: reply })
}