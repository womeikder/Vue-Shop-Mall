<script setup>
import { ref } from "vue"
import baseUrl from "@/utils/BaseUrl"
import { useGetTenRecommendGoods } from "@/api/web/goods"

const tableData = ref([])
const emit = defineEmits(['toGoodsDetail'])
const getData = async () => {
    const res = await useGetTenRecommendGoods()
    tableData.value = res.data
}
getData()

const toGoodsDetail = (item) => {
    emit('toGoodsDetail', item)
}
</script>

<template>
    <h1 class="title">本店推荐</h1>
    <div class="list">
        <div class="content-list-item" v-for="item in tableData" :key="item.id" @click="toGoodsDetail(item)">
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
.title {
    font-size: 40px;
    margin-top: 20px;
    color: #313131;
    margin-bottom: 20px;
    text-align: left;
    margin-left: 10%;
    font-weight: bold;
}
.list {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(5, 15%);
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