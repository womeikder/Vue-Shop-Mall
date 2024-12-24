import request from "@/utils/request.js";

export const useCategoryList = (data) => {
    return request.get('admin/category', {
        params: data
    })
}
