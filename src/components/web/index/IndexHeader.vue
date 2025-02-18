<script setup>
import { ref } from 'vue'
import {useUserStore} from "@/stores"
import Popover from '@/components/global/Popover.vue'
import baseUrl from '@/utils/BaseUrl'
import { useRouter } from 'vue-router'

// 用户信息
const userInfo = ref({})
if (useUserStore().currentUserInfo.value) {
    userInfo.value = useUserStore().currentUserInfo.value
}
const userStatus = ref(Object.keys(userInfo.value).length > 0)
const router = useRouter()

const meanList = [
    {
        path: '/order',
        name: '已买到的宝贝'
    }, 
    {
        path: '/profile',
        name: '用户中心' 
    },
    {
        path: '/goods/cart',
        name: '购物车' 
    },
    {
        path: '/help',
        name: '帮助中心' 
    },
    {
        path: '/setting',
        name: '账号管理' 
    }
]
const toLogin = () => {
    router.push('/web/login')
}
const toLogout = () => {
    router.push('/admin/login')
    localStorage.clear()
}
const topush = (type) => {
    router.push(meanList[type].path)
}

</script>

<template>
    <div class="index-header">
        <ul>
            <li>
                <span style="color: #f53686;" @click="toLogin" v-if="!userStatus">亲, 请登录</span>
    
                <Popover v-else>
                    <template #trigger>
                        <span class="user-login-header">{{ userInfo.name }}</span>
                    </template>
                    <div class="popover">
                        <div class="popover-item-header">
                            <button type="button" @click="topush(4)">账号管理</button>
                            <button type="button" @click="toLogout">退出登录</button>
                        </div>
                        <div class="popover-item-info">
                            <img :src="baseUrl + userInfo.avatar" alt="">
                            <div>
                                <span>{{ userInfo.name }}</span>
                                <span>{{ userInfo.email }}</span>
                            </div>
                        </div>
                    </div>
                </Popover>
            </li>
            <li v-for="(item, index) in meanList" :key="index">
                <span @click="topush(index)">{{ item.name }}</span>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.index-header {
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: center;
    background: rgba(240, 240, 240, 0.24);
    align-items: center;
    ul {
        display: flex;
        justify-content: space-around;
        align-items: center;
        li {
            list-style: none;
            font-size: 14px;
            margin: 0 50px;
            cursor: pointer;
            color: #818181;
        }
        li:hover {
            color: #f53686;
        }
    }
}

.popover {
    width: 200px;
    height: 100px;
    background: #fff;
    border-radius: 5px;
    .popover-item-header {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px solid #f53686;
        button {
            border: none;
            background: none;
            cursor: pointer;
        }
        button:hover {
            color: #e7431a;
        }
    }
    .popover-item-info {
        display: flex;
        align-items: center;
        padding: 10px;
        img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 10px;
            object-fit: cover;
        }
        div {
            span {
                display: block;
                font-size: 14px;
                color: #818181;
                &:nth-child(2) {
                    font-size: 12px;
                }
            }
        }
    }
}

.user-login-header {
    color: #818181;
    cursor: pointer;
}
.user-login-header:hover {
    color: #f53686;
}
</style>