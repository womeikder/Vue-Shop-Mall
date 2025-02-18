<script setup>
import IndexHeader from '@/components/web/index/IndexHeader.vue';
import { computed, reactive, ref, watch } from 'vue';
import { useGetGoodsDetail } from '@/api/web/goods';
import { useRoute, useRouter } from 'vue-router';
import baseUrl from '@/utils/BaseUrl';
import GoodsDetailComponent from '@/components/web/detail/GoodsDetailComponent.vue';
import GoodsCommentComponent from '@/components/web/detail/GoodsCommentComponent.vue';
import GoodsfloatComponent from '@/components/web/detail/GoodsfloatComponent.vue';
import GoodsRecommendListComponent from '@/components/web/detail/GoodsRecommendListComponent.vue';
import Icon from '@/components/global/Icon.vue';
import FloatCard from '@/components/web/index/FloatCard.vue';
import { useAddCart } from '@/api/web/cart';
import pMessage from '@/components/global/message';
import Drawer from '@/components/global/Drawer.vue';
import { useGetCommentList } from '@/api/web/comment';
import { formatTime } from '@/utils/timeUtils';
import ImgPreview from '@/components/global/ImgPreview.vue';
import {useUserStore} from "@/stores"

const route = useRoute();
const router = useRouter();
const tableData = ref({});
const smellImg = ref([]);
const commentList = ref([]);
const userInfo = ref({})
if (useUserStore().currentUserInfo.value) {
    userInfo.value = useUserStore().currentUserInfo.value
}
const userStatus = ref(Object.keys(userInfo.value).length > 0)


// 获取商品详情数据
const getData = async () => {
  const res = await useGetGoodsDetail(route.params.id);
  tableData.value = res.data;
  smellImg.value = res.data.pics.slice(0, 5);
};


// 获取评论数据
const commentIndex = ref(10)
const getComment = async (rate) => {
  const comment = await useGetCommentList(1, commentIndex.value, rate, tableData.value.id, null)
  commentList.value = comment.data.data
};
getData();


// 图片选择控制下标
const opeImgIndex = ref(0);
const Select = ref(0);

// 新增放大镜相关逻辑
const showMagnifier = ref(false);
const mainImage = ref(null);
const magnifierPos = reactive({ x: 0, y: 0 });
const zoomLevel = 2; // 可调整放大倍数

// 计算放大预览样式
const zoomPreviewStyle = computed(() => ({
  backgroundImage: `url(${baseUrl + smellImg.value[opeImgIndex.value]})`,
  backgroundPosition: `-${magnifierPos.x * zoomLevel }px -${magnifierPos.y * zoomLevel - 500}px`,
  backgroundSize: `${mainImage.value?.naturalWidth * zoomLevel * 2}px ${mainImage.value?.naturalHeight * zoomLevel * 2}px`
}));

// 处理鼠标移动
const handleMouseMove = (e) => {
  if (!mainImage.value) return;

  const rect = mainImage.value.getBoundingClientRect();
  const imgWidth = mainImage.value.offsetWidth;
  const imgHeight = mainImage.value.offsetHeight;

  let x = e.clientX-rect.left;
  let y = e.clientY-rect.top;

  // 放大镜半径
  const magnifierRadius = 75;
  // 边界限制
  x = Math.max(magnifierRadius, Math.min(x, imgWidth-magnifierRadius)) + 75;
  y = Math.max(magnifierRadius, Math.min(y, imgHeight-magnifierRadius)) + 75;

  magnifierPos.x = x-magnifierRadius;
  magnifierPos.y = y-magnifierRadius;
};

// 购买数量控制
const payCount = ref(1);
// 加入购物车
const addCart = async (count) => {
  if (!userStatus.value) {
    pMessage.warning('请先登录');
    router.push('/web/login');
    return;
  } 
  const res = await useAddCart(route.params.id, count);
  pMessage.success(res.msg);
  
  
};

// 立即购买
const nowBuy = (count) => {
  if (!userStatus.value) {
    pMessage.warning('请先登录');
    router.push('/web/login');
    return;
  }
  router.push({
    path: '/order/confirm',
    query: {
      type: 'buy',
      id: route.params.id,
      count: count
    }
  });
};

// 推荐商品到详情页
const toGoodsDetail = (item) => {
  router.push(`/goods/detail/${item.id}`);
};


// 监听路由变化, 重新获取数据
watch(
  () => route.params,
  (newParams, oldParams) => { 
    getData();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
  },
  { immediate: true }
);

// 抽屉
const drawerRef = ref();
const drawerOpen = ref(false);

// 预览评论
const previewComments = () => {
  drawerRef.value.show();
  commentIndex.value = 10
  getComment(null)
  drawerOpen.value = true;
}

// 在drawe打开时，禁止浏览器滚动
watch(drawerOpen, (newValue) => {
  document.body.style.overflow = newValue ? 'hidden' : 'auto';
}, {
  immediate: true,
  deep: true
})

// 更多评论
const moreComment = () => {
  commentIndex.value += 10
  getComment(null)
}

// 图片预览
const previewImg = ref([])
const previewImgRef = ref()
const previewImgBtn = (img) => {
  previewImg.value = img
  previewImgRef.value.openPreview()
}

// 根据评分获取评论
const ratePreview = (rate) => {
  drawerRef.value.show();
  commentIndex.value = 10
  getComment(rate)
  drawerOpen.value = true;
}
</script>

<template>
  <div >
    <div class="head"><IndexHeader></IndexHeader></div>
    <div class="back">
      <Icon name="back-arrows" size="30" @click="router.go(-1)"></Icon>
      <Icon name="home" size="30" @click="router.push('/')"></Icon>
    </div>
    <div class="goods-intro">
      <div class="goods-intro-left">
        <div class="smell-img">
          <ul>
            <li v-for="(item, index) in smellImg" :key="index" @mouseenter="opeImgIndex = index">
              <img :src="baseUrl + item" alt="" :class="{ active: opeImgIndex === index }" />
            </li>
          </ul>
        </div>
        <div class="now-img" @mousemove="handleMouseMove" @mouseenter="showMagnifier = true" @mouseleave="showMagnifier = false">
          <img :src="baseUrl + smellImg[opeImgIndex]" alt="" ref="mainImage" />
          <!-- 放大镜遮罩 -->
          <div v-show="showMagnifier" class="magnifier" :style="{ left: magnifierPos.x + 'px', top: magnifierPos.y + 'px' }"></div>
        </div>
      </div>

      <!-- 放大预览区域 -->
      <div v-show="showMagnifier" class="zoom-preview" :style="zoomPreviewStyle"></div>

      <div class="goods-intro-right">
        <div class="tilte">
          <h1>【{{ tableData.goods_name }}】{{ tableData.title }}</h1>
        </div>
        <div class="price">
          <span>￥{{ tableData.price }}</span>
          <span>库存: {{ tableData.stock }}</span>
          <span>销量: {{ tableData.sales }}</span>
        </div>
        <div class="protect">
          保障：假一赔四 极速退款 7天无理由退换
        </div>
        <div class="count">
          <div class="count-left">
            <div class="count-left-num">
              <input type="button" value="-" @click="payCount--" :disabled="payCount <= 1" />
              <input type="text" value="1" v-model="payCount" @blur="payCount = Math.max(1, Math.min(payCount, tableData.stock))"/>
              <input type="button" value="+" @click="payCount++" />
            </div>
          </div>
        </div>
        <div class="btn">
          <button type="button" @click="addCart(payCount)">加入购物车</button>
          <button type="button" @click="nowBuy(payCount)">立即购买</button>
        </div>
      </div>
    </div>
    <div class="goods-select">
      <div :class="{ select: Select === 0 }" @click="Select = 0">
        商品详情
      </div>
      <div :class="{ select: Select === 1 }" @click="Select = 1">
        商品评价
      </div>
    </div>

    <!-- 商品详情和商品评价 -->
    <div class="goods-select-content">
      <GoodsDetailComponent :goodsImg="tableData.pics" v-if="Select === 0"></GoodsDetailComponent>
      <GoodsCommentComponent
        :comments="tableData.comments"
        @previewComment="previewComments" 
        @previewComments="previewComments" 
        @ratePreview="ratePreview"
        v-else></GoodsCommentComponent>
    </div>

    <!-- 推荐列表 -->
    <div class="recommend-list">
      <GoodsRecommendListComponent @toGoodsDetail="toGoodsDetail"></GoodsRecommendListComponent>
    </div>

    <!-- 悬浮购买按钮 -->
    <GoodsfloatComponent
    :price=tableData.price
    :discount-text="限时5折"
    :promotions="['跨店满200减30', '88VIP95折']"
    :threshold="800"
    :image="baseUrl + tableData.cover"
    @buy="nowBuy"
    @add="addCart"
    :stock="tableData.stock"
    v-show="!drawerOpen"
    />

    <!-- 悬浮帮助按钮 -->
    <FloatCard></FloatCard>

    <Drawer title="用户评论" ref="drawerRef" @close="drawerOpen = false">
      <div class="comment-list">
        <div v-if="commentList.length === 0" class="no-comments">
          <p>暂无用户评论</p>
        </div>
        <div v-else>
          <div class="comment-detail-item" v-for="(item, index) in commentList" :key="index" @click="detailComment(item)">
            <div class="left">
              <img :src="baseUrl + item.user.avatar" alt="User Avatar" class="avatar">
            </div>
            <div class="right">
              <div class="user-info">
                <span class="user-name">{{ item.user.name }}</span>
                <span class="comment-time">{{ formatTime(item.create_time) }}</span>
              </div>
              <div class="rating">
                <span v-for="star in item.rate" :key="star" class="star">&#9733;</span>
              </div>
              <div class="comment-content">{{ item.content }}</div>
              <div class="comment-img">
                <ul>
                  <li v-for="(pic, picIndex) in item.pics" :key="picIndex">
                    <img :src="baseUrl + pic" alt="Comment Image" class="comment-image" @click="previewImgBtn(item.pics)" />
                  </li>
                </ul>
              </div>
              <!-- 商家回复 -->
              <div class="seller-reply" v-if="item.reply">
                <div class="reply-header">
                  <span class="seller-name">商家回复:</span>
                </div>
                <div class="reply-content">
                  {{ item.reply }}
                </div>
              </div>
            </div>
          </div>
          <div class="more-comment">
            <button @click="moreComment()">查看更多评论</button>
          </div>
        </div>
      </div>
    </Drawer>
    <ImgPreview :images="previewImg" ref="previewImgRef"></ImgPreview>
  </div>
</template>

<style lang="scss" scoped>
@import url('../../assets/css/comment-detail.scss');
.back {
  display: flex;
  justify-content: space-around;
  width: 80px;
  height: 50px;
  margin-left: 10%;
  margin-top: 10px;
  cursor: pointer;
}

.goods-intro {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  margin-top: 20px;
}

.goods-intro-left {
  // margin-left: 50px;
  width: 50%;
  display: flex;
  justify-content: center;
.smell-img {
    width: 15%;
    height: 15%;
    margin-right: 30px;
    ul {
      list-style: none;
      li {
        margin: 20px;
        width: 100%;
        height: 100px;
        img {
          width: 90%;
          height: 90%;
          border-radius: 10px;
          object-fit: cover;
        }
      }
      li:hover {
        cursor: pointer;
        transform: scale(1.1);
        transition: all 0.5s;
      }
    }
  }
}

.now-img {
  position: relative; /* 添加定位 */
  width: 50%;
  height: 600px;
  margin-top: 20px;
  overflow: hidden; /* 防止放大镜溢出 */
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
}

/* 放大镜样式 */
.magnifier {
  position: absolute;
  width: 150px;
  height: 150px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(2px);
  pointer-events: none;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

/* 放大预览区域 */
.zoom-preview {
  position: absolute;
  left: calc(45%); /* 调整位置到右侧 */
  top: 90px;
  width: 500px;
  height: 500px;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  background: #fff;
  background-repeat: no-repeat;
  z-index: 100;
}

.active {
  transform: scale(1.1);
  border: 2px solid red;
  border-radius: 10px;
}

.goods-intro-right {
  position: relative;
  margin-top: 20px;
  width: 50%;
  display: flex;
  flex-direction: column;
.price {
    font-size: 30px;
    color: red;
    margin-top: 20px;
    font-weight: bold;
    span {
      margin-right: 50px;
    }
  }
.protect {
    margin-top: 20px;
    font-size: 20px;
    color: #666;
  }
.count {
    display: flex;
    margin-top: 30%;
  .count-left {
      width: 30%;
    .count-left-num {
        display: flex;
        justify-content: space-around;
        input {
          width: 50px;
          height: 50px;
          border: 1px solid #ccc;
          border-radius: 10px;
          text-align: center;
          font-size: 20px;
          font-weight: bold;
        }
      }
    }
  }
.btn {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    margin-top: 50px;
    button {
      width: 40%;
      height: 60px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(90deg, #f3d023, #f34d23);
      color: #fff;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
    }
    button:nth-child(2) {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
      background: linear-gradient(90deg, #f34d23, #23f39c);
      border-left: 1px solid #5e0adb;
    }
    button:nth-child(1) {
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
    }
  }
}

.goods-select {
  display: flex;
  justify-content: left;
  margin: 50px auto;
  width: 80vw;
  height: 50px;
  font-size: larger;
  color: #a4a3a3;
  border-bottom: 1px solid #dddddd;
  div {
    margin-right: 50px;
    cursor: pointer;
    &:hover {
      color: #eb593c;
    }
  }
}

.select {
  color: #eb593c;
  border-bottom: 2px solid #eb593c;
}

.goods-select-content {
  display: flex;
  flex-direction: column;
  margin: 50px auto;
  width: 80vw;
}

.comment-list {
  width: 50vw;
  display: flex;
  flex-direction: column;
}

.comment-item {
  width: 200px;
}

.ban-scroll {
  overflow: hidden;
}
</style>