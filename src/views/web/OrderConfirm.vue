<template>
  <div class="order-container">
    <!-- 左侧主要内容区域 -->
    <div class="main-content">
      <!-- 收货地址部分 -->
      <div class="section address-section">
        <div class="section-header">
          <h2>确认收货地址</h2>
          <div class="header-actions">
            <span class="action-btn" @click="addNewAddress">使用新地址</span>
            <span class="action-btn" @click="manageAddress">管理地址</span>
          </div>
        </div>
        <div class="address-list">
          <div class="address-grid">
            <div v-for="(address, index) in displayAddresses" 
                 :key="index"
                 :class="['address-item', { active: selectedAddressId === address.id }]"
                 @click="selectAddress(address)">
              <div class="location-icon">📍</div>
              <div class="address-content">
                <div class="address-main">{{ address.province }} {{ address.city }} {{ address.district }} {{ address.detail }}</div>
                <div class="address-contact">{{ address.name }} {{ address.phone }}</div>
              </div>
              <div class="address-tag" v-if="address.is_default">默认</div>
            </div>
          </div>
          <div class="show-more" 
               v-if="addressList.length > 4" 
               @click="toggleAddresses">
            {{ showAllAddresses ? '收起地址' : '显示更多地址' }}
            <span class="arrow" :class="{ 'arrow-up': showAllAddresses }">
              {{ showAllAddresses ? '▲' : '▼' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 订单信息部分 -->
      <div class="section order-section">
        <div class="section-header">
          <h2>确认订单信息</h2>
        </div>
        <div v-for="(item, index) in orderPreviewData" :key="index" class="store-block">
          <div class="product-item">
            <img :src="baseUrl + item.goods.cover" class="product-img" />
            <div class="product-info">
              <div class="product-title">{{ item.goods.title }}</div>
              <div class="product-spec">{{ item.goods.specs || '默认规格' }}</div>
              <div class="product-price">
                <span class="price">¥{{ item.goods.price }}</span>
                <div class="quantity">
                  <button @click="decreaseCount(item.id)">-</button>
                  <span>{{ item.count }}</span>
                  <button @click="increaseCount(item.id)">+</button>
                </div>
              </div>
            </div>
          </div>
          <div class="order-remark">
            <span>订单备注:</span>
            <input type="text" placeholder="请输入备注信息" maxlength="200" />
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧支付信息卡片 -->
    <div class="payment-card" :class="{ 'is-sticky': isSticky }" ref="paymentCard">
      <div class="card-content">
        <div class="price-item">
          <span>商品总价</span>
          <span class="price">¥{{ totalOrderPrice }}</span>
        </div>
        <div class="price-item">
          <span>店铺优惠</span>
          <span class="discount">-¥28.33</span>
        </div>
        <div class="price-item">
          <span>红包</span>
          <span class="discount">-¥10.00</span>
        </div>
        <div class="divider"></div>
        <div class="payment-method">
          <div class="method-title">支付方式</div>
          <div class="method-options">
            <div class="bank-list">
              <div class="bank-item" :class="{ 'bank-item-active': paymentMethod === 0 }" @click="paymentMethod = 0">微信</div>
              <div class="bank-item" :class="{ 'bank-item-active': paymentMethod === 1 }" @click="paymentMethod = 1">支付宝</div>
              <div class="bank-item" :class="{ 'bank-item-active': paymentMethod === 2 }" @click="paymentMethod = 2">银行卡</div>
            </div>
          </div>
        </div>
        <div class="total-price">
          <span>实付款</span>
          <span class="final-price">¥{{ Math.round(totalOrderPrice - 38.33) }}</span>
        </div>
        <button class="submit-btn" @click="submitOrder">提交订单</button>
      </div>
    </div>
  </div>

  <Dialog ref="dialogRef" title="提示" button="确定" @agree="agree">
    <PostAddressComponent @success="handleAddressSuccess" />
  </Dialog>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useOrderPreview } from '@/api/web/order';
import { useAddressList } from '@/api/web/address';
import { useUpdateCartCount } from '@/api/web/cart';
import { useSubmitOrder, useBuyPreviewGoods } from '@/api/web/order';
import baseUrl from '@/utils/BaseUrl';
import Dialog from '@/components/global/Dialog.vue';
import PostAddressComponent from '@/components/web/address/PostAddressComponent.vue';
import { useRouter, useRoute } from 'vue-router';
import pMessage from '@/components/global/message';
import { usePaymentStore } from '@/stores/modules/web/payment';

const orderPreviewData = ref([]);
const addressList = ref([]);
const selectedAddressId = ref(null);
const showAllAddresses = ref(false);
const isSticky = ref(false);
const paymentCard = ref(null);
const mainContentWidth = ref('0px');
const dialogRef = ref(null);
const router = useRouter();
const route = useRoute();
const paymentMethod = ref(0);
const paymentStore = usePaymentStore();
const buyType = ref(route.query.type);

// 获取订单预览数据
const fetchOrderPreview = async () => {
  if (buyType === 'cart') {
    const response = await useOrderPreview();
    orderPreviewData.value = response.data;
    return
  }
  const response = await useBuyPreviewGoods(route.query.id, route.query.count);
  orderPreviewData.value = response.data;
  console.log(response.data);
  
};

// 获取地址列表并排序
const fetchAddressList = async () => {
  const response = await useAddressList();
  if (response.code === 200) {
    // 对地址列表进行排序，默认地址排在第一位
    addressList.value = response.data.sort((a, b) => {
      if (a.is_default === 1 && b.is_default !== 1) return -1;
      if (a.is_default !== 1 && b.is_default === 1) return 1;
      return 0;
    });
    
    // 如果有地址，默认选中第一个地址（此时已经排序，默认地址会在最前面）
    if (addressList.value.length > 0) {
      selectedAddressId.value = addressList.value[0].id;
    }
  }
};

// 计算总价
const totalOrderPrice = computed(() => {
  return orderPreviewData.value.reduce((total, item) => total + item.goods.price * item.count, 0)
});

// 数量控制
const increaseCount = async (id) => {
  const item = orderPreviewData.value.find(i => i.id === id);
  if (item) {
    item.count += 1;
    if (buyType === 'cart') {
      await useUpdateCartCount(id, item.count);
    }
    
  }
};

const decreaseCount = async (id) => {
  const item = orderPreviewData.value.find(i => i.id === id);
  if (item && item.count > 1) {
    item.count -= 1;
    if (buyType === 'cart') {
      await useUpdateCartCount(id, item.count);
    }
    
    
  }
};

// 选择地址
const selectAddress = (address) => {
  selectedAddressId.value = address.id;
};

// 提交订单
const submitOrder = async () => {
  if (!selectedAddressId.value) {
    pMessage.warning('请选择收货地址');
    return;
  }

  try {
    let res = null

    if (buyType.value === 'cart') {
      res = await useSubmitOrder(selectedAddressId.value, null, null);
    } else if (buyType.value === 'buy') {
      res = await useSubmitOrder(selectedAddressId.value, orderPreviewData.value[0].id, orderPreviewData.value[0].count);
    }
    if (res.code === 201) {
      // 设置支付倒计时
      paymentStore.setPaymentDeadline(res.data.id);
      
      // 跳转到支付页面
      router.push({
        path: '/order/payment',
        query: {
          id: res.data.id,
          type: paymentMethod.value,
          price: totalOrderPrice.value - 38.33
        }
      });
    } else {
      pMessage.error(res.msg || '提交订单失败');
    }
  } catch (error) {
    pMessage.error('提交订单失败');
    console.error('提交订单失败:', error);
  }
};

// 计算要显示的地址列表
const displayAddresses = computed(() => {
  return showAllAddresses.value ? addressList.value : addressList.value.slice(0, 4);
});

// 切换地址显示状态
const toggleAddresses = () => {
  showAllAddresses.value = !showAllAddresses.value;
};

// 添加新地址打开dialog弹窗
const addNewAddress = () => {
    dialogRef.value.show();
}

// 关闭dialog弹窗
const handleAddressSuccess = () => {
    dialogRef.value.close()
}

// 管理地址
const manageAddress = () => {
    router.push('/address')
}

// 优化后的滚动处理函数
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  isSticky.value = scrollTop > 100;

  if (isSticky.value && paymentCard.value) {
    // 获取父容器的右边距离
    const container = document.querySelector('.order-container');
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const rightOffset = window.innerWidth - containerRect.right;
      // 计算卡片应该的右侧位置
      paymentCard.value.style.right = `${rightOffset}px`;
    }
  } else if (paymentCard.value) {
    paymentCard.value.style.right = 'auto';
  }
};


// 处理窗口大小变化
const handleResize = () => {
  handleScroll(); // 重新计算位置
};

onMounted(() => {
  fetchOrderPreview();
  fetchAddressList();
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleResize);
  handleScroll(); // 初始化位置
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.order-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
  max-width: 100%;
  margin: 0 auto;
  overflow-x: hidden;
}

.main-content {
  flex: 0 0 70%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0; /* 防止子元素溢出 */
}

.payment-card {
  flex: 0 0 28%;
  position: relative;
  height: fit-content;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  transition: all 0.3s ease;
  background: #fff;
}

.payment-card.is-sticky {
  position: fixed;
  top: 20px;
  width: calc(28% - 20px);
  /* right 值会通过 JS 动态设置 */
}

.section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  color: #666;
  font-size: 14px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #f5f5f5;
  color: #ff4400;
}

/* 地址部分样式优化 */
.address-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.address-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.address-item {
  height: 120px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.address-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.address-item.active {
  border-color: #ff4400;
  background: #fff9f7;
}

.location-icon {
  font-size: 20px;
  margin-right: 12px;
}

.address-content {
  flex: 1;
  overflow: hidden;
}

.address-main {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.address-contact {
  color: #666;
  font-size: 13px;
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
}

.address-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 2px 6px;
  background: #ff4400;
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
}

.show-more {
  text-align: center;
  color: #666;
  font-size: 14px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.show-more:hover {
  color: #ff4400;
}

.arrow {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.arrow-up {
  transform: rotate(180deg);
}

/* 商品部分样式优化 */
.store-block {
  border-bottom: 1px solid #f0f0f0;
  padding: 20px 0;
}

.store-block:last-child {
  border-bottom: none;
}


.product-item {
  display: flex;
  gap: 20px;
  padding: 20px 0;
  align-items: center;
}

.product-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
}

.product-spec {
  color: #999;
  font-size: 14px;
  margin-bottom: 12px;
}

.product-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #ff4400;
  font-size: 18px;
  font-weight: 600;
}

.quantity {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 4px;
}

.quantity button {
  width: 28px;
  height: 28px;
  border: none;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quantity button:hover {
  background: #e8e8e8;
}

.quantity span {
  min-width: 40px;
  text-align: center;
  font-size: 15px;
}

/* 右侧支付卡片样式优化 */
.card-content {
  padding: 24px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 15px;
}

.discount {
  color: #ff4400;
  font-weight: 500;
}

.divider {
  height: 1px;
  background: #f0f0f0;
  margin: 20px 0;
}

.payment-method {
  margin: 24px 0;
}

.method-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}

.method-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.method-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
}

.bank-list {
  margin: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bank-item {
  padding: 12px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.bank-item:hover {
  border-color: #ff4400;
  background: #fff9f7;
}
.bank-item-active {
  border-color: #ff4400;
  background: #fff9f7;
}

.total-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.final-price {
  color: #ff4400;
  font-size: 26px;
  font-weight: bold;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: #ff4400;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: #ff5500;
  transform: translateY(-2px);
  box-shadow: 0 2px 12px rgba(255, 68, 0, 0.2);
}

/* 响应式优化 */
@media (max-width: 1400px) {
  .address-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .payment-card.is-sticky {
    width: calc(28% - 16px);
  }
}

@media (max-width: 1200px) {
  .address-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .payment-card.is-sticky {
    position: static;
    width: 100%;
    right: auto !important;
  }
}

@media (max-width: 768px) {
  .address-grid {
    grid-template-columns: 1fr;
  }
  
  .address-item {
    height: auto;
  }
}

/* 订单备注样式优化 */
.order-remark {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
}

.order-remark span {
  color: #666;
  font-size: 14px;
}

.order-remark input {
  flex: 1;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.order-remark input:focus {
  border-color: #ff4400;
  box-shadow: 0 0 0 2px rgba(255, 68, 0, 0.1);
}
</style>