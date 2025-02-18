<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from "@/stores";
import baseUrl from '@/utils/BaseUrl';
import { useGetUserIndexData } from '@/api/web';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const userInfo = ref({});
const emits = defineEmits(['changeTab']);
const IndexData = ref({
  goods: [], // 商品数据
  orders: {
    1: 22, // 待支付
    2: 17, // 待发货
    3: 5,  // 待收货
    4: 1,  // 待评价
    5: 0   // 购物车
  }
});

// 获取数据
const getData = async () => {
  const res = await useGetUserIndexData();
  IndexData.value = res.data;
};

onMounted(() => {
  getData();
  if (userStore.currentUserInfo.value) {
    userInfo.value = userStore.currentUserInfo.value;
  }
});

// 格式化时间显示
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.split('T')[0];
};

// 性别显示
const genderMap = {
  '男': '男',
  '女': '女',
  '': '未设置'
};

// 账号状态
const statusMap = {
  1: '正常',
  0: '禁用'
};

const RouterPush = () => {
  emits('changeTab', { 
    key: 'order',
    path: '/order'
   });
}
</script>

<template>
  <div class="profile-container">
    <!-- 用户基本信息卡片 -->
    <div class="user-card">
      <div class="avatar-section">
        <img :src="baseUrl + userInfo.avatar" alt="用户头像" class="avatar">
        <h2 class="username">{{ userInfo.name }}</h2>
        <div class="user-status" :class="{ 'active': userInfo.status === 1 }">
          {{ statusMap[userInfo.status] }}
        </div>
      </div>
      
      <div class="account-info">
        <div class="info-item">
          <span class="label">账号类型：</span>
          <span class="value">{{ userInfo.is_admin ? '管理员' : '普通用户' }}</span>
        </div>
        <div class="info-item">
          <span class="label">注册时间：</span>
          <span class="value">{{ formatDate(userInfo.create_time) }}</span>
        </div>
      </div>
    </div>

    <!-- 详细信息卡片 -->
    <div class="info-card">
      <h3 class="card-title">个人信息</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">手机号码：</span>
          <span class="value">{{ userInfo.phone || '未设置' }}</span>
        </div>
        <div class="info-item">
          <span class="label">电子邮箱：</span>
          <span class="value">{{ userInfo.email || '未设置' }}</span>
        </div>
        <div class="info-item">
          <span class="label">性别：</span>
          <span class="value">{{ genderMap[userInfo.gender] }}</span>
        </div>
        <div class="info-item">
          <span class="label">生日：</span>
          <span class="value">{{ formatDate(userInfo.birthday) || '未设置' }}</span>
        </div>
        <div class="info-item">
          <span class="label">最后更新：</span>
          <span class="value">{{ formatDate(userInfo.update_time) }}</span>
        </div>
      </div>
    </div>

    <!-- 订单状态 -->
    <div class="order-section">
      <div class="card-header">
        <h3>我的订单</h3>
      </div>
      <div class="order-stats">
        <div class="stat-item" @click="RouterPush">
          <div class="num">{{ IndexData.orders[1] }}</div>
          <div class="label">待付款</div>
        </div>
        <div class="stat-item" @click="RouterPush">
          <div class="num">{{ IndexData.orders[2] }}</div>
          <div class="label">待发货</div>
        </div>
        <div class="stat-item" @click="RouterPush">
          <div class="num">{{ IndexData.orders[3] }}</div>
          <div class="label">待收货</div>
        </div>
        <div class="stat-item" @click="RouterPush">
          <div class="num">{{ IndexData.orders[4] }}</div>
          <div class="label">待评价</div>
        </div>
        <div class="stat-item" @click="RouterPush">
          <div class="num">{{ IndexData.orders[5] }}</div>
          <div class="label">购物车</div>
        </div>
      </div>
    </div>

    <!-- 推荐商品 -->
    <div class="goods-section">
      <div class="card-header">
        <h3>推荐商品</h3>
      </div>
      <div class="goods-grid">
        <div v-for="item in IndexData.goods" :key="item.id" class="goods-item" @click="router.push(`/goods/detail/${item.id}`)">
          <div class="goods-image">
            <img :src="baseUrl + item.cover" :alt="item.goods_name">
          </div>
          <div class="goods-info">
            <div class="goods-title">{{ item.title }}</div>
            <div class="goods-desc">{{ item.description }}</div>
            <div class="goods-price">¥{{ item.price }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.profile-container {
  width: 100%;
  
  .user-card {
    background: white;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

    .avatar-section {
      display: flex;
      align-items: center;
      margin-bottom: 24px;

      .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 16px;
      }

      .username {
        font-size: 24px;
        color: #333;
        margin: 0 16px 0 0;
      }

      .user-status {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        background: #f5f5f5;
        color: #999;

        &.active {
          background: #e6f7ff;
          color: #1890ff;
        }
      }
    }

    .account-info {
      display: flex;
      gap: 24px;
    }
  }

  .info-card {
    background: white;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

    .card-title {
      font-size: 18px;
      color: #333;
      margin: 0 0 24px 0;
      padding-bottom: 12px;
      border-bottom: 1px solid #eee;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
  }

  .info-item {
    .label {
      color: #666;
      margin-right: 8px;
    }

    .value {
      color: #333;
      font-weight: 500;
    }
  }
}

.order-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

  .card-header {
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;

    h3 {
      font-size: 18px;
      color: #333;
      margin: 0;
      padding-left: 10px;
      border-left: 4px solid #FF4400;
    }
  }

  .order-stats {
    display: flex;
    justify-content: space-around;
    padding: 20px 0;

    .stat-item {
      text-align: center;
      cursor: pointer;

      &:hover {
        .num, .label {
          color: #FF4400;
        }
      }

      .num {
        font-size: 24px;
        font-weight: bold;
        color: #333;
        margin-bottom: 8px;
      }

      .label {
        font-size: 14px;
        color: #666;
      }
    }
  }
}

.goods-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

  .goods-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-top: 20px;

    .goods-item {
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .goods-image {
        width: 100%;
        height: 200px;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 12px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .goods-info {
        padding: 0 8px;

        .goods-title {
          font-size: 14px;
          color: #333;
          margin-bottom: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .goods-desc {
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .goods-price {
          font-size: 16px;
          color: #FF4400;
          font-weight: bold;
        }
      }
    }
  }
}
</style>