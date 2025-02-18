<template>
  <IndexHeader></IndexHeader>
  <div class="logo">
    <div class="logo-title">womeik商城</div>
    <div class="icon" @click="reload">
      <img src="../../assets/no_bg_logo.png" alt="">
    </div>
  </div>
  <div class="cart-container">
    <!-- 头部 -->
    <header class="cart-header">
      <h1>购物车</h1>
      <div class="cart-actions">
        <span>全部商品（{{ cartItems.length }}）</span>
        <div class="action-buttons">
          <button
            class="action-btn move-to-favorite"
            :disabled="!anyItemSelected"
          >
            移入收藏
          </button>
          <button
            class="action-btn delete-btn"
            :disabled="!anyItemSelected"
          >
            删除
          </button>
        </div>
      </div>
    </header>

    <!-- 商品列表 -->
    <main class="cart-main">
      <!-- 店铺分组 -->
      <div class="store-group" v-for="(store, index) in groupedStores" :key="index">
        <!-- 商品项 -->
        <div class="product-item" v-for="item in store.items" :key="item.id">
          <div class="product-select">
            <input type="checkbox" class="checkbox" v-model="item.checked" @change="updateCheckedStatus(item.id, item.checked)" />
          </div>
          <img :src="baseUrl + item.goods.cover" class="product-image" alt="商品图片" />
          <div class="product-info">
            <h3 class="product-title">{{ item.goods.title }}</h3>
            <div class="price-controls">
              <div class="price-section">
                <span class="current-price">¥{{ item.goods.price }}</span>
                <div class="quantity-control">
                  <button @click="decreaseCount(item.id)" class="quantity-btn">-</button>
                  <span class="quantity">{{ item.count }}</span>
                  <button @click="increaseCount(item.id)" class="quantity-btn">+</button>
                </div>
              </div>
              <div class="total-section">
                <span class="total-price">¥{{ item.goods.price * item.count }}</span>
                <button @click="removeItem(item.id)" class="delete-item-btn">删除</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 结算栏 -->
      <div class="checkout-bar">
        <div class="checkout-left">
          <button
            class="action-btn reverse-select"
            :style="{ backgroundColor: allChecked ? '#28a745' : '#ccc' }"
            @click="reverseSelect"
          >
            全选
          </button>
        </div>
        <div class="checkout-right">
          <div class="price-summary">
            <span>合计：</span>
            <span class="total-amount">¥{{ selectedTotalPrice }}</span>
          </div>
          <button class="checkout-btn" :disabled="selectedCount === 0" @click="toConfirm">结算（{{ selectedCount }}）</button>
        </div>
      </div>
    </main>
    <FloatCard></FloatCard>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useGetCartList, useUpdateCartCount, useDeleteCart, useUpdateCartCheck } from '@/api/web/cart';
import baseUrl from '@/utils/BaseUrl';
import FloatCard from '@/components/web/index/FloatCard.vue';
import IndexHeader from '@/components/web/index/IndexHeader.vue';
import { useRouter } from 'vue-router';

const cartItems = ref([]);
const allChecked = ref(false);
const router = useRouter();

// 获取购物车列表
const fetchCartList = async () => {
  const response = await useGetCartList();
  cartItems.value = response.data.map(item => ({ ...item, checked: item.checked === 1 ? true : false }));
  allChecked.value = cartItems.value.every(item => item.checked);
};

// 增加数量和减少数量
const increaseCount = async (id) => {
  const item = cartItems.value.find(i => i.id === id);
  if (item) {
    item.count += 1;
    await useUpdateCartCount(id, item.count);
  }
};

// 减少数量
const decreaseCount = async (id) => {
  const item = cartItems.value.find(i => i.id === id);
  if (item && item.count > 1) {
    item.count -= 1;
    await useUpdateCartCount(id, item.count);
  }
};

// 删除购物车项
const removeItem = async (id) => {
  await useDeleteCart(id);
  cartItems.value = cartItems.value.filter(i => i.id !== id);
  allChecked.value = cartItems.value.every(item => item.checked);
};

// 计算选中的总价和选中的项数
const selectedTotalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => item.checked ? total + item.goods.price * item.count : total, 0);
});

// 计算选中的项数
const selectedCount = computed(() => {
  return cartItems.value.filter(item => item.checked).length;
});

// 判断是否有选中的项
const anyItemSelected = computed(() => selectedCount.value > 0);

// 反选
const reverseSelect = () => {
  cartItems.value.forEach(item => {
    item.checked = !item.checked;
  });
  updateCheckedStatus();
  allChecked.value = cartItems.value.every(item => item.checked);
};

// 更新选中状态
const updateCheckedStatus = (id = null, checked = null) => {
  const ids = cartItems.value.map(item => item.id).join(',');
  const checkedStatus = cartItems.value.map(item => item.checked ? 1 : 0).join(',');
  useUpdateCartCheck(ids, checkedStatus);
};

// 跳转到确认订单页面
const toConfirm = () => {
  router.push('/order/confirm', {
    query: {
      type: 'cart'
    }
  })
};

// 监听购物车项的变化，更新全选状态
watch(cartItems, () => {
  allChecked.value = cartItems.value.every(item => item.checked);
}, { deep: true });

onMounted(() => {
  fetchCartList();
});

const groupedStores = computed(() => {
  return [
    {
      name: 'SAMEOREAME旗舰店',
      items: cartItems.value
    }
  ];
});
</script>

<style scoped>
/* 样式部分保持不变 */
.cart-container {
  max-width: 1200px;
  margin: 10px auto;
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 100vh;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.logo {
  position: fixed;
  top: 5%;
  left: 4%;
}

.logo-title {
  font-size: 14px;
  text-align: center;
  margin: 10px;
  color: #007bff;
  font-weight: bold;
}

.icon {
  width: 70px;
  height: 50px;
  margin: 0 auto;
}

.icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-header {
  padding: 20px 0;
  border-bottom: 1px solid #e0e0e0;
}

.cart-header h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 15px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.cart-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.action-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-btn.move-to-favorite {
  background-color: #007BFF;
  color: white;
}

.action-btn.move-to-favorite:hover {
  background-color: #0056b3;
}

.action-btn.move-to-favorite:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.action-btn.delete-btn {
  background-color: #DC3545;
  color: white;
}

.action-btn.delete-btn:hover {
  background-color: #bd2130;
}

.action-btn.delete-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.action-btn.reverse-select {
  background-color: #28a745;
  color: white;
}

.action-btn.reverse-select:hover {
  background-color: #218838;
}

.store-group {
  margin: 20px 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.store-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.store-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.store-icon {
  font-size: 20px;
}

.store-name {
  font-size: 16px;
  color: #333;
}

.store-promo {
  color: #DC3545;
  font-size: 12px;
  padding: 2px 5px;
  background-color: #ffe6e6;
  border-radius: 3px;
}

.store-menu-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #007BFF;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.store-menu-btn:hover {
  background-color: #0056b3;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.product-select {
  margin-right: 15px;
}

.product-image {
  width: 80px;
  height: 80px;
  margin: 0 15px;
  border-radius: 4px;
  object-fit: cover;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
}

.product-info {
  flex: 1;
}

.price-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.price-section {
  display: flex;
  align-items: center;
}

.current-price {
  margin-right: 15px;
  font-size: 16px;
  color: #333;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.quantity-btn:hover {
  background-color: #f0f0f0;
}

.total-section {
  display: flex;
  align-items: center;
}

.total-price {
  margin-right: 15px;
  font-size: 16px;
  color: #333;
}

.delete-item-btn {
  padding: 6px 12px;
  border: 1px solid #DC3545;
  border-radius: 4px;
  background-color: white;
  color: #DC3545;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.delete-item-btn:hover {
  background-color: #ffe6e6;
}

.checkout-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.checkout-left {
  display: flex;
  align-items: center;
}

.select {
  background: #ccc;
}

.checkout-right {
  display: flex;
  align-items: center;
}

.price-summary {
  display: flex;
  align-items: center;
  margin-right: 30px;
}

.price-summary span {
  margin-right: 10px;
  font-size: 16px;
  color: #333;
}

.total-amount {
  color: #DC3545;
  font-size: 18px;
  font-weight: bold;
}

.checkout-btn {
  background-color: #007BFF;
  color: white;
  padding: 12px 35px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.checkout-btn:hover {
  background-color: #0056b3;
}

.checkout-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.checkbox {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}
</style>