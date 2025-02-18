<script setup>
import Search from '@/components/web/index/Search.vue';
import Category from '@/components/web/index/Category.vue';
import ContentList from '@/components/web/index/ContentList.vue';
import FootCopyright from '@/components/web/index/FootCopyright.vue';
import FloatCard from '@/components/web/index/FloatCard.vue';
import IndexHeader from '@/components/web/index/IndexHeader.vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const toSearch = (value) => {
    router.push({
        path: '/goods/list', 
        query: { 
            id: null,
            keyword: value
        }
    })
}
const CategorySearch = (value) => {
    router.push({
        path: '/goods/list', 
        query: {
            id: value.id,
            keyword: null
        }
    })
}
const userCenter = (item) => {
    if (item == 5) {
        router.push('/goods/cart')
        return
    }
    if (item == 4) {
        router.push('/comment')
        return
    }
    // 跳转到用户中心
    router.push('/order')
}
const login = () => {
    router.push('/web/login')
}
const toGoodsDetail = (item) => {
    router.push(`/goods/detail/${item.id}`)
}

// 1 用户信息, 2 客服, 3 反馈, 4 消息, 5 购物车
const toSlidePush = (item) => {
    console.log('跳转侧边栏对应的页面', item)
}

// 1 已买到的宝贝, 2 用户中心, 3 购物车, 4 帮助中心, 5 账号管理
const toHeaderPush = (item) => {
    console.log('跳转头部对应的页面', item)
}
const toLogout = () => {
    
}
 
</script>

<template>
    <div class="layout">
        <div class="header">
            <IndexHeader></IndexHeader>
        </div>
        <div class="search">
            <Search @search="toSearch"></Search>
        </div>
        <div class="category">
            <Category @categoryClick="CategorySearch" @userCenter="userCenter" @login="login"></Category>
        </div>
        <div class="content">
            <ContentList @toGoodsDetail="toGoodsDetail"></ContentList>
        </div>
        <div class="footer">
            <FootCopyright></FootCopyright>
        </div>
        <div class="float-card">
            <FloatCard></FloatCard>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.layout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: linear-gradient(to bottom, #BFBEFA , #ECF2FD 500px);
}

.header {
    width: 100%;
    height: 50px;
    
}
.search {
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 100;
}
.category {
    width: 100%;
    height: 400px;
}
.content {
    width: 100%;
    margin-top: 100px;
}
.footer {
    width: 100%;
    height: 150px; 
}                                              
</style>