import axios from 'axios'
import { useUserStore } from '@/stores'
import router from '@/router'
import pMessage from "@/components/global/message/index.js";

const baseURL = 'http://192.168.56.56:80/api/'

const instance = axios.create({
    // TODO 1. 基础地址，超时时间
    baseURL,
    timeout: 10000
})

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        // TODO 2. 携带token
        // 获取token，如果有token将token配置在请求头里
        const useStore = useUserStore()
        if (useStore.token) {
            config.headers.Authorization = useStore.token
        }
        return config
    },
    (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
    (res) => {
        // TODO 3. 处理业务失败
        // TODO 4. 摘取核心响应数据
        if (res.data.code === 200) {
            return res
        }
        pMessage.error(res.data.msg)
        // 业务失败，抛出错误
        return Promise.reject(res.data)
    },
    (err) => {
        // 非默认情况，401 表示为授权，需要登录
        if (err.response?.status === 401) {
            pMessage.error('先登陆后在浏览页面!')
            router.push('/login')
        }
        pMessage.error(err.response.data.msg)
        // 错误的默认情况
        // TODO 5. 处理401错误
        return Promise.reject(err)
    }
)

export default instance
export { baseURL }
