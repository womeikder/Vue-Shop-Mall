<!-- src/views/web/UserProfile/UserOrder.vue -->
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useGetOrderList, useDeleteOrder, useOrderStatus,useConfirmOrder } from '@/api/web/order';
import { useSubmitComment } from '@/api/web/comment';
import baseUrl from '@/utils/BaseUrl';
import Pagination from '@/components/web/Pagination.vue'; // 引入 Pagination 组件
import { useRouter } from 'vue-router';
import pMessage from '@/components/global/message';
import Dialog from '@/components/global/Dialog.vue';
import ImgUpload from '@/components/global/ImgUpload.vue';

const orderDetailRef = ref(null);
const commentData = ref({
  goods_id: '',
  pics: [],
  rating: 5,
  comment: ''
});


const orderList = ref({
  current_page: 1,
  total: 0,
  per_page: 10,
  data: []
});
const router = useRouter();
const status = ref(null);

// 获取订单列表
const getOrders = async (page = 1) => {
  try {
    const res = await useGetOrderList(page, 10, status.value, null);
    orderList.value = res.data;
  } catch (error) {
    console.error('获取订单列表失败:', error);
  }
};

// 格式化时间
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.split('T')[0];
};

// 格式化金额
const formatPrice = (price) => {
  return price ? `¥${price.toFixed(2)}` : '¥0.00';
};

// 订单状态
const orderStatus = {
  1: '待付款',
  2: '待发货',
  3: '待收货',
  4: '待评价',
  5: '已完成',
  6: '已取消'
};

// 再次购买
const handleRebuy = (id) => {
  router.push(`/goods/detail/${id}`)
};

// 取消订单
const handleCancel = async (order) => {

  const res = await useDeleteOrder(order.id);
  pMessage.success(res.msg);
  getOrders();
};

// 删除订单
const handleDelete = async (order) => {

  console.log('删除订单:', order);
  const res = await useDeleteOrder(order.id);
  pMessage.success(res.msg);
  getOrders();
};

// 立即付款
const handlePay = async (order) => {

  console.log('立即付款:', order);
 const res = await useOrderStatus(order.id);
 if (res.code !== 200) {
   pMessage.error(res.msg);
   getOrders();
   return;
 }
  router.push({
    path: '/order/payment',
    query: {
      id: order.id,
      type: 0,
      price: order.amount,
    },
  })
};

// 确认收货
const handleReceive = async (order) => {

  console.log('确认收货:', order);
  const res = await useConfirmOrder(order.id);
  pMessage.success(res.msg);
  getOrders();
}

// 评价订单
const handleComment = (order) => {

  console.log('评价订单:', order);
  orderDetailRef.value.show();
  commentData.value.goods_id = order.detail[0].goods.id;
};
const rating = ref(0);
// 设置星级
const setRating = (value) => {
  rating.value = value;
  commentData.value.rating = value;
};
// 添加图片
const addPics = (res) => {
  commentData.value.pics.push(res);
  if (commentData.value.pics.length > 4) {
    commentData.value.pics = commentData.value.pics.slice(-4);
  }
};

// 提交评论
const orderDetailConfirm = async () => {
  const res = await useSubmitComment(commentData.value.goods_id, commentData.value.comment, rating.value, commentData.value.pics);
  pMessage.success(res.msg);
  commentData.value = {
    goods_id: '',
    pics: [],
    rating: 5,
    comment: ''
  }
  getOrders();
}

// 格式化商品数量和价格
const formatGoodsInfo = (detail) => {
  if (!detail || !detail.length) return [];
  return detail.map(item => ({
    ...item.goods,
    number: item.number,
    totalPrice: item.price * item.number
  }));
};

// 计算总页数
const totalPages = computed(() => Math.ceil(orderList.value.total / orderList.value.per_page));

// 分页变化时的处理函数
const handlePageChange = (page) => {
  orderList.value.current_page = page;
  getOrders(page);
};

onMounted(() => {
  getOrders();
});
</script>

<template>
  <div class="order-container">
    <div class="option">
      <div class="option-item" v-for="(item, index) in orderStatus" :key="index">
        <button class="btn" @click="status=index; getOrders()" :style="{ backgroundColor: status === index ? '#FF7E00' : '#fff' }">{{ item }}</button>
      </div>
    </div>
    
    <!-- 订单列表 -->
    
    <div class="order-list">
      <div v-for="order in orderList.data" :key="order.id" class="order-item">
        <div class="order-header">
          <div class="order-info">
            <span class="order-time">下单时间：{{ formatDate(order.create_time) }}</span>
            <span class="order-no">订单号：{{ order.order_no }}</span>
            <span v-if="order.express_no">快递单号: {{ order.express_no }}</span>
          </div>
          <div class="order-status">{{ orderStatus[order.status] }}</div>
        </div>

        <div class="order-content">
          <!-- 商品信息 -->
          <div class="goods-info">
            <div class="goods-list">
              <div v-for="(item, index) in formatGoodsInfo(order.detail)" :key="index" class="goods-item">
                <div class="goods-img">
                  <img :src="baseUrl + item.cover" :alt="item.goods_name">
                </div>
                <div class="goods-detail">
                  <div class="goods-name">{{ item.goods_name }}</div>
                  <div class="goods-desc">{{ item.description }}</div>
                  <div class="goods-price">
                    <span class="price">{{ formatPrice(item.price) }}</span>
                    <span class="count">x{{ item.number }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="order-detail">
            <div class="amount-info">
              <div class="amount">订单金额：<span class="price">{{ formatPrice(order.amount) }}</span></div>
              <div class="status-info">
                <span v-if="order.pay_time">支付时间：{{ formatDate(order.pay_time) }}</span>
                <span v-if="order.pay_type">支付方式：{{ order.pay_type }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="order-footer">
          <template v-if="order.status === 1">
            <button class="btn" @click="handleCancel(order)">取消订单</button>
            <button class="btn primary" @click="handlePay(order)">立即付款</button>
          </template>
          <template v-else-if="order.status === 2">
            <button class="btn" @click="handleCancel(order)">取消订单</button>
          </template>
          <template v-else-if="order.status === 3">
            <button class="btn" @click="handleReceive(order)">确认收货</button>
          </template>
          <template v-else-if="order.status === 4">
            <button class="btn" @click="handleDelete(order)">删除订单</button>
            <button class="btn" @click="handleComment(order)">评价订单</button>
          </template>
          <button class="btn" @click="handleRebuy(order.detail[0].goods.id)">再次购买</button>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <Pagination
      v-if="totalPages > 1"
      :current-page="orderList.current_page"
      :total-pages="totalPages"
      @page-change="handlePageChange"
    />
  </div>
  <Dialog ref="orderDetailRef" @agree="orderDetailConfirm" title="订单评论" >
    <div class="comment-form">
      <!-- 星级评论输入框 -->
      <div class="star-rating">
        <span v-for="i in 5" :key="i" @click="setRating(i)" :class="{ 'active': rating >= i }">★</span>
      </div>
      <!-- 评论框 -->
      <textarea v-model="commentData.comment" placeholder="请输入评论内容" class="comment-textarea"></textarea>
      <!-- 上传图片 -->
       <ImgUpload @upload-success="addPics" :show-size="4"></ImgUpload>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
.order-container {
  padding: 30px; /* 增大外边距 */
  background-color: #f9f9f9; /* 设置背景色为浅灰色 */
}
.option {
  display: flex;
  justify-content: left;
  margin-bottom: 20px; /* 增加选项之间的间距 */
  .option-item {
    margin-right: 20px; /* 增加选项之间的间距 */ 
  }
}

.order-list {
  .order-item {
    background-color: white;
    border-radius: 12px; /* 圆角更大 */
    border: 1px solid #e0e0e0; /* 添加浅灰色边框 */
    margin-bottom: 30px; /* 增大订单项之间的间距 */
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); /* 更柔和的阴影效果 */
    overflow: hidden;

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px; /* 增大头部内边距 */
      background: #f8f8f8;
      border-bottom: 1px solid #eee;

      .order-info {
        span {
          margin-right: 20px;
          color: #666;
          font-size: 15px; /* 稍微增大信息文字 */
        }
      }

      .order-status {
        color: #FF7E00; /* 更鲜艳的颜色 */
        font-weight: 500; /* 加粗状态文字 */
      }
    }

    .order-content {
      padding: 25px; /* 增大内容区的内边距 */
      font-size: 16px; /* 增大默认字体大小 */

      .goods-info {
        padding: 20px;
        border-bottom: 1px solid #eee;

        .goods-list {
          .goods-item {
            display: flex;
            padding: 15px 0;
            border-bottom: 1px solid #f5f5f5;

            &:last-child {
              border-bottom: none;
            }

            .goods-img {
              width: 80px;
              height: 80px;
              margin-right: 15px;
              border-radius: 4px;
              overflow: hidden;

              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }

            .goods-detail {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;

              .goods-name {
                font-size: 16px; /* 增大商品名称字体 */
                font-weight: 500; /* 加粗商品名称 */
                color: #333;
                margin-bottom: 8px;
              }

              .goods-desc {
                font-size: 12px;
                color: #999;
                margin-bottom: 8px;
              }

              .goods-price {
                display: flex;
                justify-content: space-between;
                align-items: center;

                .price {
                  color: #FF7E00; /* 更鲜艳的颜色 */
                  font-weight: 500;
                }

                .count {
                  color: #999;
                  font-size: 12px;
                }
              }
            }
          }
        }
      }

      .order-detail {
        display: flex;
        justify-content: right;

        .amount-info {
          text-align: right;

          .amount {
            margin-bottom: 10px;
            font-size: 22px; /* 增大金额字体 */
            font-weight: bold;

            .price {
              color: #FF7E00;
            }
          }

          .status-info {
            color: #666;
            font-size: 14px;

            span {
              display: block;
              margin-bottom: 5px;
            }
          }
        }
      }
    }

    .order-footer {
      padding: 20px; /* 增大底部内边距 */
      border-top: 1px solid #eee;
      text-align: right;
    }
  }
}

.btn {
  padding: 8px 20px;
  margin-left: 10px;
  border: 1px solid #e0e0e0; /* 浅灰色按钮边框 */
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #FF7E00;
    border-color: #FF7E00;
    transform: translateY(-2px); /* 悬停时稍微上移 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  }

  &.primary {
    background-color: #FF7E00; /* 更鲜艳的主按钮颜色 */
    color: white;
    border-color: #FF7E00;

    &:hover {
      opacity: 0.9;
    }
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}


.comment-form {
  padding: 20px;

  .star-rating {
    font-size: 24px;
    color: #ccc;
    margin-bottom: 10px;

    span {
      cursor: pointer;
      transition: color 0.3s ease;

      &.active {
        color: #FF7E00;
      }
    }
  }

  .comment-textarea {
    width: 100%;
    height: 120px;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    resize: none;
    margin-bottom: 10px;
  }

  .submit-button {
    padding: 8px 20px;
    border: 1px solid #FF7E00;
    border-radius: 4px;
    background-color: #FF7E00;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      opacity: 0.9;
    }
  }
}
</style>