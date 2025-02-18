import request from "@/utils/request";
// 获取通知列表
export const useGetNoticeList = () => {
  return request.get("admin/inform")
}