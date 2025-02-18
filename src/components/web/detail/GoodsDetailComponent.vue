<script setup>
import baseUrl from '@/utils/BaseUrl';
const props = defineProps({
    goodsImg: {
        type: Array,
        default: []
    }
})
console.log(props.goodsImg);

</script>

<template>
    <div class="goods-img">
        <ul>
            <li v-for="(item, index) in props.goodsImg" :key="index">
                <img :src="baseUrl + item" alt="" />
            </li>
            <img src="../../../assets/web/price.png" alt="">
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.goods-img {
    ul {
        padding: 0;
        margin: 0;
        list-style: none;
        li {
            width: 50%;
            img {
                width: 100%;
                object-fit: cover;
            }
        }
    }
}
</style>