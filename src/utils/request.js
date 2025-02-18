import axios from 'axios'
import { useUserStore } from '@/stores'
import router from '@/router'
import pMessage from "@/components/global/message/index.js";
import pLoading from "@/components/global/loading/index.js";
import Message from "@/components/global/message/index.js";

const baseURL = 'http://127.0.0.1:80/api/'

let loading = false;
const instance = axios.create({
    // TODO 1. 基础地址，超时时间
    baseURL,
    timeout: 10000
})

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        // TODO 2. 携带token
        // 添加loading效果
        if (!loading) {
            loading = true
            pLoading()
        }
        // 获取token，如果有token将token配置在请求头里
        const useStore = useUserStore()
        if (useStore.token) {
            config.headers.Authorization = useStore.token
        }
        return config
    },
    (err) => {
        // 对请求错误做些什么
        if (loading) {
            pLoading.close()
        }
        Message.error("请求发送失败")
        Promise.reject(err)
    }
)

// 响应拦截器
instance.interceptors.response.use(
    (res) => {
        // TODO 3. 处理业务失败
        // TODO 4. 摘取核心响应数据
        // 对请求错误做些什么
        if (loading) {
            pLoading.close()
        }
        if (res.data.code === 200 || res.data.code === 201) {
            return res.data
        }
        if (res.data.code === 401) {
            pMessage.error('先登陆后再浏览页面!')
            if (res.config.url.includes('admin')) {
                router.push('/admin/login')
            } else if (res.config.url.includes('web')) {
                router.push('/web/login')
            }
        }
        pMessage.error(res.data.msg)
        // 业务失败，抛出错误
        return Promise.reject(res.data)
    },
    (err) => {
        // 非默认情况，401 表示为授权，需要登录
        // 对请求错误做些什么
        if (loading) {
            pLoading.close()
        }
        if (err.response.code === 401) {
            pMessage.error('先登陆后再浏览页面!')
            router.push('/admin/login')
        }
        pMessage.error(err.response.data.msg)
        // 错误的默认情况
        // TODO 5. 处理401错误
        return Promise.reject(err)
    }
)

export default instance
export { baseURL }
