<script setup>
import { useGetIndexData } from "@/api/web"
import { ref } from "vue"
import baseUrl from "@/utils/BaseUrl"

const goodsList = ref([])
const lazyGoodsList = ref([])
const emit = defineEmits(['toGoodsDetail'])
const getData = async () => {
    const res = await useGetIndexData()
    goodsList.value = res.data.goods
    lazyGoodsList.value = []

    // 实现懒加载，首次只加载30条数据
    for (let i = 0; i < goodsList.value.length; i++) {
        lazyGoodsList.value.push(goodsList.value[i])
        if (lazyGoodsList.value.length === 30) {
            break
        }
    }
    // 删除已经加载的数据
    for (let i = 0; i < goodsList.value.length; i++) {
        goodsList.value.shift()
        if (lazyGoodsList.value.length === 30) {
            break
        }
    }
}
getData()


// 通过滚动条实现懒加载
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = window.innerHeight || document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
    if (scrollPercent >= 80) {
        // 懒加载，当滚动到页面底部时，加载下一页的数据
        for (let i = 0; i < goodsList.value.length; i++) {
            lazyGoodsList.value.push(goodsList.value[i])
            if (lazyGoodsList.value.length === 30) {
                break
            }
        }
        // 删除已经加载的数据
        for (let i = 0; i < goodsList.value.length; i++) {
            goodsList.value.shift()
            if (lazyGoodsList.value.length === 30) {
                break
            }
        }

    }
    
});

const toGoodsDetail = (item) => {
    emit('toGoodsDetail', item)
}

const handleError = (event) => {
      event.target.src = new URL('@/assets/no_data.png', import.meta.url).href;
    }
</script>

<template>
    <div class="list">
        <div class="content-list-item" v-for="(item, index) in lazyGoodsList" @click="toGoodsDetail(item)">
            <div class="item-img">
                <img :src="baseUrl + item.cover" alt="" @error="handleError" >
            </div>
            <div class="item-desc">
                <span>{{ item.goods_name }}</span>
                <span>{{ item.title }}</span>
            </div>
            <div class="item-price">
                <span>￥{{ item.price }}</span>
                <span>10万+人购买</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.list {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(6, 13%);
    justify-content: center;
    gap: 17px;
}
.content-list-item {
    width: 100%;
    height: 400px;
    border: 1px solid #ccc;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 10px #ccc;
    transition: all 0.3s;
    background: white;
    cursor: pointer;
    &:hover {
        transform: scale(1.05);
    }
    .item-img {
        width: 97%;
        height: 70%;
        margin: 3px auto;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 10px;
        }
    }
}
.item-desc {
    width: 95%;
    height: 20%;
    margin: 0 auto;;
    text-wrap: warp;
    color: #313131;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    align-content: center;
    span:nth-child(1) {
        margin-right: 10px;
        color: #FF2441;
        font-size: 16px;
        font-weight: bold;
    }
    span:nth-child(2) {
        color: #535353;
    }
}
.item-price {
    width: 95%;
    height: 10%;
    margin: 0 auto;;
    color: #A88EFB;
    font-size: 16px;
    font-weight: bold;
    span:nth-child(2) {
        margin-left: 15px;
        color: #a6a5a8;
        font-size: 12px;
        font-weight: normal;

    }
}
</style>