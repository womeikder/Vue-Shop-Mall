<script setup>
import {useUserStore} from "@/stores"
import {ref} from "vue";
import Icon from "@/components/global/Icon.vue";
import { useRouter } from 'vue-router'
// 用户信息
const userInfo = ref({})
if (useUserStore().currentUserInfo.value) {
    userInfo.value = useUserStore().currentUserInfo.value
}
const userStatus = ref(Object.keys(userInfo.value).length > 0)


// 侧边栏数据列表
const sliderList = ref([
    { id:3, name: '首页',icon: 'index_float_icon/feedback' },
    { id:2, name: '客服',icon: 'index_float_icon/servicer' },
    { id:1, name: '用户信息',icon: 'index_float_icon/userinfo' },
    { id:4, name: '消息',icon: 'index_float_icon/info' },
    { id:5, name: '购物车',icon: 'index_float_icon/cart' },
])

const slideRouter = ref({
    1: '/profile',
    2: '/servicer',
    3: '/',
    4: '/info',
    5: '/goods/cart'
})




// 回到顶部
const backTop = ref(false)
window.addEventListener('scroll', () => {
    let pageYOffset = document.documentElement.scrollTop
    if (pageYOffset > 500) {
        backTop.value = true
    } else {
        backTop.value = false
    }
})
const toBack = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
    backTop.value = false
}


const router = useRouter()
// 根据点击的不同跳转
const toPush = (type) => {
    router.push(slideRouter.value[type])
}

// 登录
const toLogin = () => {
    router.push('/web/login')
}

// 未登录浮窗
const UnloginFloatCard = ref(false)
UnloginFloatCard.value = !userStatus.value
const close = () => {
    UnloginFloatCard.value = false
}

</script>

<template>
    <div class="right-float-card">
        <div class="login-card" v-if="userStatus">
            <ul>
                <li v-for="item in sliderList" @click="toPush(item.id)">
                    <Icon class="user-icon" :name="item.icon" size="40" />
                    <span>{{ item.name }}</span>
                </li>
                <li v-if="backTop" @click="toBack" >
                    <Icon class="user-icon" name="index_float_icon/top" size="40" />
                    <span>回顶部</span>
                </li>
            </ul>
        </div>
        <div class="logout-card" v-else>
            <ul>
                <li v-for="item in sliderList" @click="toLogin">
                    <Icon class="user-icon" :name="item.icon + '_black'" size="40" />
                    <span>{{ item.name }}</span>
                </li>
                <li v-if="backTop" @click="toBack">
                    <Icon class="user-icon" name="index_float_icon/top_black" size="30" />
                    <span>回顶部</span>
                </li>
            </ul>
        </div>
    </div>
    <div class="login-caution" v-if="UnloginFloatCard">
        <div class="login-caution-content">
            <Icon name="redbage" size="80"></Icon>
            <span>登录查看更多福利，有机会得</span>
            <span>20元</span>
            <span>红包</span>
            <button type="button" @click="toLogin">立即登录</button>
            <Icon style="cursor: pointer;" name="close" size="30" @click="close"></Icon>
        </div>
    </div>

</template>

<style lang="scss" scoped>
.right-float-card {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 60px;
    z-index: 994;
}

.logout-card,
.login-card {
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 10px 0 0 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    ul {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        list-style: none;
        padding: 0;
        li {
            text-align: center;
            padding: 4px 0;
            font-size: smaller;
            cursor: pointer;
        }
    }
}
.user-icon {
    margin: 0 auto;
}


.login-caution {
    position: fixed;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    width: 100%;
    height: 100px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    .login-caution-content {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: larger;
        span:nth-child(3) {
            color: #f3d21a;
            font-size: 30px;
            font-weight: bold;
            margin: 0 5px;
        }
        button {
            width: 200px;
            height: 50px;
            margin-top: 20px;
            background: linear-gradient(to left bottom, #f87408 , #f31a98);
            border: none;
            border-radius: 10px;
            padding: 10px 0;
            color: white;
            font-size: 16px;
            cursor: pointer;
            margin: 10px 20px;
        }
    }
}
</style>