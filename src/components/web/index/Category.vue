<script setup>
import { ref, computed } from "vue"
import baseUrl from "@/utils/BaseUrl"
import Icon from "@/components/global/Icon.vue"
import {useUserStore} from "@/stores"
import { useGetIndexData } from "@/api/web"

const slideList = ref([])

const categoryList = ref([])
const orderList = ref([])
const selectIndex = ref(0)
const showPreNext = ref(false)
const categoryIcon = ref(['computer','commerce', 'digital', 'furniture', 'cloth', 'outdoor', 'car', 'food', 'baby', 'makeup', 'flower'])
const emit = defineEmits(['categoryClick', 'login', 'userCenter'])
const orderEmun = ref(['待支付', '待发货', '待收货', '待评价', '购物车'])

// 获取首页数据
const getIndexData = async () => {
    const res = await useGetIndexData()
    slideList.value = res.data.slides
    categoryList.value = res.data.categories
    const ordersEntries = Object.entries(res.data.orders);
    const firstFiveEntries = ordersEntries.slice(0, 5);
    orderList.value = Object.fromEntries(firstFiveEntries)
}
getIndexData()

let timer = null

// >计时器逻辑
const timeFuc = () => {
    timer = setInterval(() => {
      // 更改选中的index
      if (selectIndex.value >= slideList.value.length - 1) {
        selectIndex.value = 0
      } else {
        selectIndex.value++
      }
    }, 5000)
}

timeFuc()

// >开启轮播
const start = () => {
    if (timer) return
    timeFuc()
    showPreNext.value = false
}

// >关闭轮播
const stop = () => {
    clearInterval(timer)
    timer = null
    showPreNext.value = true
}

// 点击上下页切换轮播图
const setIndex = (num) => {
    
    selectIndex.value += num

    if (selectIndex.value < 0) {
        selectIndex.value = slideList.value.length - 1
    }
    if (selectIndex.value > slideList.value.length - 1) {
        selectIndex.value = 0
    }
}

//  分类弹窗逻辑
const categoryDialog = ref(false)
const currentCategoryList = ref([])
const currentHoverCategory = (item) => {
    categoryDialog.value = true
    currentCategoryList.value = item.children
}

// 鼠标离开分类时的判断
const leaveCate = (e) => {
    const dialog = document.querySelector('.category-show-dialog');
    if (!dialog.contains(e.relatedTarget)) {
        categoryDialog.value = false;
    }
}

// 点击分类时向父组件发送点击事件
const currentClickCategory = (item) => {
    emit('categoryClick', { id: item.id, name: item.name })
}

// 用户信息
const userInfo = ref({})
if (useUserStore().currentUserInfo.value) {
    userInfo.value = useUserStore().currentUserInfo.value
}
const userStatus = ref(Object.keys(userInfo.value).length > 0)

// 当前时间
const currentTime = ref('')
const judge = ref(new Date().getHours())
setInterval(() => {
    if (judge.value >= 6 && judge.value <= 11) {
        currentTime.value = '上午好, 活力满满'
    } else if (judge.value >= 12 && judge.value <= 14) {
        currentTime.value = '中午好, 准时吃饭'
    } else if (judge.value >= 14 && judge.value <= 17) {
        currentTime.value = '下午好, 努力工作'
    } else if (judge.value >= 18 && judge.value <= 24) {
        currentTime.value = '晚上好, 早点休息'
    } else if (judge.value >= 0 && judge.value <= 6) {
        currentTime.value = '凌晨了, 该睡觉了'
    }
})

// 登录
const toLogin = () => {
    emit('login')
}
// 用户中心
const toUserCenter = (item) => {
    emit('userCenter', item)
}

</script>

<template>
    <div class="category">

        <!-- 左侧分类列表 -->
        <div class="category-list">
            <div class="title">分类</div>
            <div class="category-list-item">
                <ul>
                    <li v-for="(item, index) in categoryList" @mouseenter="currentHoverCategory(item)" @mouseleave="leaveCate">
                        <Icon :name="categoryIcon[index]" size="25"></Icon>
                        <span class="item-name" v-for="(item, index) in item.children" @click="currentClickCategory(item)" > {{item.name}}</span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- 轮播图 -->
        <div class="slide" @mouseenter="stop" @mouseleave="start">
            <Transition name="slide" v-for="(item, index) in slideList" :key="selectIndex">
                <div class="slide-item" v-show="selectIndex === index">
                    <img :src="baseUrl + item.img" alt="" />
                    <Icon v-if="showPreNext" name="pre" @click="setIndex(-1)" class="icon-arrow-left" size="50"></Icon>
                    <Icon v-if="showPreNext" name="next" @click="setIndex(1)" class="icon-arrow-right" size="50"></Icon>
                    <div class="pointer">
                        <ul>
                            <li v-for="(item, index) in slideList" @click="selectIndex = index" :class="{ active: selectIndex === index }"></li>
                        </ul>
                    </div>
                </div>
            </Transition>  
        </div>

        <!-- 用户信息 -->
        <div class="user-info">

            <!-- 登陆状态 -->
            <div v-if="userStatus">
                <div class="header-info">
                    <div class="user-info-header">
                        <img :src="baseUrl + userInfo.avatar" alt="" />
                        <div class="user-info-header-name">{{ currentTime }} {{ userInfo.name }}</div>
                    </div>
                </div>
                <div class="order-info">
                    <div class="order-item" v-for="(item, index) in orderList" @click="toUserCenter(index)">
                        <div class="order-item-header">
                            <span>{{ item }}</span>
                            <span>{{ orderEmun[index-1] }}</span>
                            <Icon style="margin: 10px 0;" :name="'indexUser' + index" size="25"></Icon>
                        </div>
                    </div>
                    
                </div>
                <div class="user-login-footer">
                    <img src="../../../assets/web/user_login_img.png" alt="">
                </div>
            </div>

            <!-- 未登陆状态 -->
            <div v-else>
                <div class="header-info">
                    <div class="user-info-header">
                        <img src="../../../assets/logo_dog.png" alt="" />
                        <div class="user-info-header-name">{{ currentTime }}</div>
                    </div>
                </div>
                <div class="user-login">
                    <div class="user-login-header">
                        <h1>登录我没空商城后更多精彩</h1>
                        <span>嘿！更懂你的推荐，更便捷的搜索</span>
                        <button @click="toLogin" type="button">立即登录</button>
                    </div>
                    <div class="user-login-footer">
                        <img src="../../../assets/web/user_login_img.png" alt="">
                    </div>
                </div>
            </div>
            
        </div>

        <!-- 分类弹窗 -->
        <div class="category-show-dialog" v-show="categoryDialog" @mouseleave="leaveCate">
            <div class="content-dialog">
                <ul>
                    <li v-for="item in currentCategoryList">
                        <span>{{ item.name }}></span>
                        <div class="inner-dialog" v-for="inner in item.children" @click="currentClickCategory(item)">{{ inner.name }}</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.category {
    width: 100%;
    height: 100%;
    margin-top: 20px;
    display: grid;
    grid-template-columns: 15% 50% 15%;
    justify-content: center;
    gap: 20px;
}
.category-list {
    background: white;
    border: none;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

}

.title {
    margin: 10px;
    font-size: 16px;
    font-weight: bold;
}

// 分类列表
.category-list-item {
    ul {
        list-style: none;
        padding: 0;
        li {
            display: flex;
            justify-content: space-evenly;
            padding: 5px 0;
            .item-name {
                font-size: 14px;
                color: #333;
                margin-left: 10px;
                cursor: pointer;
                &:hover {
                    color: #c351e0;
                }
            }
        }
        li:hover {
            background: #f5f5f5;
        }
    }
}


// 分类弹窗
.category-show-dialog {
    position: fixed;
    top: 15%;
    left: 24%;
    background: white;
    z-index: 999;
    width: 50%;
    min-height: 500px;
    border: 4px solid #A99BEC;
    border-radius: 20px;
    margin-left: -5px;
    .content-dialog {
        ul {
            list-style: none;
            li {
                display: flex;
                justify-content: left;
                line-height: 30px;
                flex-wrap: wrap;
                padding: 10px 0;

                .inner-dialog {
                    display: flex;
                    align-items: center;

                    font-size: 14px;
                    color: #333;
                    margin-left: 20px;
                    cursor: pointer;
                    &:hover {
                        color: #c351e0;
                    }
                }
                
            }
        }

    }

}



// 用户卡片
.user-info {
    background: linear-gradient(to left bottom, #befaeb , #ECF2FD 70%);
    border: none;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    .header-info {
        display: flex;
        .user-info-header {
            display: flex;
            align-items: center;
            justify-content: left;
            margin: 10px;
            width: 100%;
            height: 100%;
            img {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                object-fit: cover;
            }
            .user-info-header-name {
                margin-left: 20px;
                font-size: 16px;
                font-weight: bold;
                color: #333;
            }
            
        }
    }
    .order-info {
        margin-bottom: 20px;
        margin-top: 20px;
        display: flex;
        justify-content: space-around;
        .order-item {
            .order-item-header {
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
                line-height: 25px;
            }
            .order-item-header:hover {
                color: #c351e0;
            }
        }

    }

    .user-login {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        .user-login-header {
            text-align: center;
            h1 {
                font-size: 20px;

            }
            span {
                font-size: 14px;
                color: #333;
                margin-top: 10px;
            }
            button {
                width: 90%;
                margin-top: 20px;
                background: linear-gradient(to left bottom, #5bcaae , #c281e7);
                border: none;
                border-radius: 10px;
                padding: 10px 0;
                color: white;
                font-size: 16px;
                cursor: pointer;
            }
        }
        
    }
}

.user-login-footer {
    margin-top: 20px;
    img {
        width: 90%;
        object-fit: cover;
        margin: 10px;
    }
}



// 轮播样式


.slide {
    background: white;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    .slide-item {
        display: flex;
        width: 100%;
        height: 100%;
        position: relative;
        img {
            width: 100%;
            object-fit: cover;
            border-radius: 10px;
        }
    }
}

.icon-arrow-left {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    opacity: 0.5;
}
.icon-arrow-right {
    opacity: 0.5;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
}

.pointer {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    ul {
        display: flex;
        justify-content: center;
        align-items: center;
        list-style: none;
        padding: 0;
        li {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #e6e5e5;
            margin: 0 5px;
            cursor: pointer;
        }
        .active {
            border-radius: 10px;
            background: white;
            width: 20px;
        }
    }

}

.v-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.v-enter-active,
.v-leave-active {
    transition: transform 1s ease-in-out, opacity 1s ease-in-out;
}

.v-enter-to {
    transform: translateX(0);
    opacity: 1;
}

.v-leave-from {
    transform: translateX(0);
    opacity: 1;
}

.v-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}
</style>