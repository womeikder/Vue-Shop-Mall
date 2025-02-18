<script setup>
import baseUrl from '@/utils/BaseUrl';
import { ref } from 'vue'
import { formatTime } from '@/utils/timeUtils';
const props = defineProps({
    comments: {
        type: Array,
        default: []
    }
})
props.comments.splice(5)
console.log(props.comments)
const rateList = ref([
    { rate: 5, name: '五星好评' },
    { rate: 4, name: '一般好评' },
    { rate: 3, name: '中评' },
    { rate: 2, name: '差评' },
    { rate: 1, name: '极差评' }
])

const emit = defineEmits(['previewComment', 'previewComments', 'ratePreview'])
const previewComment = (item) => {
    emit('previewComment', item)
}
const previewComments = () => {
    emit('previewComments')
}
const ratePreview = (item) => {
    emit('ratePreview', item)
}
</script>

<template>
    <div class="goods-comment">
        <h1>用户评价</h1>
        <div class="comment-list">
            <div class="comment-item" v-for="(item, index) in rateList" :key="index" @click="ratePreview(item.rate)">
                {{ item.name }}
            </div>
        </div>

        <div class="comment-detail-list" v-if="props.comments.length > 0">
            <div class="comment-detail-item" v-for="(item, index) in props.comments" :key="index" @click="previewComment(item)">
                <div class="left">
                    <img :src="baseUrl + item.user.avatar" alt="">
                </div>
                <div class="right">
                    <div class="user-info">
                        <span class="user-name" style="margin-right: 10px;">{{ item.user.name }}</span>
                        <span class="comment-time">{{ formatTime(item.create_time) }}</span>
                    </div>
                    
                    <div class="comment-content">{{ item.content }}</div>
                    <div class="comment-img">
                        <ul>
                            <li v-for="(item, index) in item.pics" :key="index">
                                <img :src="baseUrl + item" alt="" />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="more-comment" @click="previewComments">查看更多评论</div>
        </div>

        <div class="no-comment" v-else>暂无用户评论</div>

    </div>
</template>

<style lang="scss" scoped>
@import url('../../../assets/css/comment-list.scss');
</style>