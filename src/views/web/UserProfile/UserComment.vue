<template>
    <div class="comment-container">
        <!-- 评论列表 -->
        <div class="comment-list-section">
            <h2>评论列表</h2>
            <div class="input-group">
                <input v-model="page" type="number" placeholder="页码" />
                <input v-model="perPage" type="number" placeholder="每页数量" />
                <input v-model="rate" type="number" placeholder="评分" />
                <input v-model="goodsName" type="text" placeholder="商品名称" />
                <button @click="fetchCommentList">获取评论列表</button>
            </div>
            <ul>
                <li v-for="comment in commentList" :key="comment.id">
                    <!-- 上方：头像、用户名、商品信息 -->
                    <div class="comment-top">
                        <div class="user-info">
                            <img :src="baseUrl + comment.user.avatar" alt="用户头像" class="user-avatar">
                            <span class="user-name">{{ comment.user.name }}</span>
                        </div>
                        <div class="goods-info">
                            <p>商品名称: {{ comment.goods.goods_name }}</p>
                            <p>商品价格: {{ comment.goods.price }}</p>
                        </div>
                        <span class="comment-time">{{ formatTime(comment.create_time) }}</span>
                    </div>
                    <!-- 下方：分左右布局 -->
                    <div class="comment-bottom">
                        <div class="comment-left">
                            <p class="comment-rate">评分: <Icon style="margin-left: 5px; " v-for="i in comment.rate" :key="i" name="star-highlight"></Icon></p>
                            <p>评论内容: </p>
                            <p>{{ comment.content }}</p>
                            <div class="pics-container">
                                <img v-for="pic in comment.pics" :key="pic" :src="baseUrl + pic" alt="评价图片" class="comment-pic" @click="previewImgBtn(comment.pics)">
                            </div>
                        </div>
                        <div class="comment-right">
                            <p>商家回复: </p>
                            <p>{{ comment.reply }}</p>
                            <button @click="deleteComment(comment.id)" class="delete-button">删除评论</button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <ImgPreview :images="previewImg" ref="previewImgRef" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useGetCommentList, useDeleteComment } from '@/api/web/comment';
import baseUrl from '@/utils/BaseUrl';
import { formatTime } from '@/utils/timeUtils';
import Icon from '@/components/global/Icon.vue';
import pMessage from '@/components/global/message';
import ImgPreview from '@/components/global/ImgPreview.vue';

// 定义响应式数据
const page = ref(1);
const perPage = ref(10);
const rate = ref(null);
const goodsId = ref(null);
const goodsName = ref('');
const commentList = ref([]);
const previewImg = ref([]);
const previewImgRef = ref(null);

// 获取评论列表
const fetchCommentList = async () => {
    try {
        const response = await useGetCommentList(page.value, perPage.value, rate.value, goodsId.value, goodsName.value);
        commentList.value = response.data.data;
        console.log(commentList.value);
        
    } catch (error) {
        console.error('获取评论列表失败:', error);
    }
};

// 删除评论
const deleteComment = async (id) => {
    try {
        await useDeleteComment(id);
        // 重新获取评论列表
        fetchCommentList();
        pMessage.success('删除评论成功');
    } catch (error) {
        pMessage.error('删除评论失败:');
    }
};

// 预览图片
const previewImgBtn = (pics) => {
    previewImg.value = pics;
    previewImgRef.value.openPreview();
};
// 页面加载时获取评论列表
onMounted(() => {
    fetchCommentList();
});
</script>

<style scoped>
.comment-container {
    font-family: Arial, sans-serif;
    padding: 20px;
}

.comment-list-section {
    margin-bottom: 20px;
}

.input-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 10px;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
    margin: 10px 0;
}

.comment-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.user-info {
    display: flex;
    align-items: center;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
}

.user-name {
    font-weight: bold;
}

.goods-info {
    flex: 1;
    display: flex;
    margin-left: 10px;
}
.goods-info p {
    margin: 0 10px; 
}

.comment-time {
    color: #999;
}

.comment-bottom {
    display: flex;
    gap: 20px;
    border-top: 1px solid #eee; /* 增加顶部边界 */
    padding-top: 10px;
}

.comment-left {
    flex: 2;
    border-right: 1px solid #eee; /* 增加右边边界 */
    padding-right: 20px;
}

.comment-rate {
    display: flex;
}

.comment-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* 将内容靠右 */
    position: relative;
}
.comment-right button {
    position: absolute;
    bottom: 0;
    right: 0;
}

.pics-container {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 5px;
}

.comment-pic {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
    cursor: pointer;
}

.delete-button {
    margin-top: 10px;
}

input,
button {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    background-color: #007BFF;
    color: white;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>  