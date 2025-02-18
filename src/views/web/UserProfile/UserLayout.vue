<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import IndexHeader from '@/components/web/index/IndexHeader.vue';
import FloatCard from '@/components/web/index/FloatCard.vue';
import {useUserStore} from "@/stores"

const router = useRouter();
const route = useRoute(); 
const activeMenu = ref('profile');

const menuItems = [
  { key: 'profile', label: '个人中心', path: '/profile' },
  { key: 'cart', label: '我的购物车', path: '/goods/cart' },
  { key: 'order', label: '我的订单', path: '/order' },
  { key: 'collect', label: '宝贝收藏', path: '/collect' },
  { key: 'address', label: '收货地址', path: '/address' },
  { key: 'comment', label: '评论管理', path: '/comment' },
  { key: 'setting', label: '账户设置', path: '/setting' },
];

const handleMenuClick = (item) => {
  router.push(item.path);
};

// 用户信息
const userInfo = ref({})
if (useUserStore().currentUserInfo.value) {
    userInfo.value = useUserStore().currentUserInfo.value
}

watch(route, (newRoute) => {
  const currentPath = newRoute.path;
  const matchedMenu = menuItems.find((item) => item.path === currentPath);
  if (matchedMenu) {
    activeMenu.value = matchedMenu.key;
  }
}, { immediate: true });
</script>

<template>
    <IndexHeader />
  <div class="user-layout">
    <!-- 左侧导航 -->
    <div class="sidebar">
      <div class="menu-list">
        <div
          v-for="item in menuItems"
          :key="item.key"
          class="menu-item"
          :class="{ active: activeMenu === item.key }"
          @click="handleMenuClick(item)"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
    
    <!-- 右侧内容区 -->
    <div class="content">
      <router-view v-slot="{ Component }">
        <component :is="Component" @changeTab="handleMenuClick"></component>
      </router-view>
    </div>
  </div>
  <FloatCard />
</template>

<style scoped lang="scss">
.user-layout {
  display: flex;
  min-height: calc(100vh - 60px); // 减去头部导航的高度
  background: #f5f5f5;
  padding: 20px;
  box-sizing: border-box;
}

.sidebar {
  width: 200px;
  background: white;
  border-radius: 8px;
  padding: 16px 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  
  .menu-list {
    .menu-item {
      height: 48px;
      line-height: 48px;
      padding: 0 24px;
      cursor: pointer;
      font-size: 14px;
      color: #333;
      transition: all 0.3s;
      
      &:hover {
        color: #ff4400;
        background: #fff5f5;
      }
      
      &.active {
        color: #ff4400;
        background: #fff5f5;
        border-left: 3px solid #ff4400;
      }
    }
  }
}

.content {
  flex: 1;
  margin-left: 20px;
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}
</style>