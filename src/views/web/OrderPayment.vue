<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePayOrder } from '@/api/web/order'
import { usePaymentStore } from '@/stores/modules/web/payment'
import pMessage from '@/components/global/message'

const route = useRoute()
const router = useRouter()
const paymentStore = usePaymentStore()
const showSuccessModal = ref(false)
const remainingTime = ref(0)
let timer = null
const paymentType = ref(['aliyun', 'wechat', 'unionpay'])
const fiveInterval = ref(5)
// 格式化时间
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 更新倒计时
const updateCountdown = () => {
  const orderId = route.query.id
  if (!orderId) return
  
  remainingTime.value = paymentStore.getRemainingTime(orderId)
  
  if (remainingTime.value <= 0) {
    clearInterval(timer)
    router.push('/order')
  }
  if (showSuccessModal.value) {
    fiveInterval.value-- 
  }
}



// 检查支付时间是否有效
const checkPaymentValidity = () => {
  const orderId = route.query.id
  if (!orderId) {
    pMessage.error('订单参数错误')
    router.push('/order')
    return false
  }

  if (!paymentStore.canPay(orderId)) {
    router.push('/order')
    return false
  }

  return true
}

// 处理支付
const handlePayment = async () => {
  if (!checkPaymentValidity()) return

  try {
    const { id, type } = route.query
    const res = await usePayOrder(parseInt(id), paymentType.value[parseInt(type)])

    if (res.code === 200) {
      // 支付成功后立即设置订单为过期状态
      paymentStore.setOrderExpired(id)
      showSuccessModal.value = true
    } else {
      pMessage.error(res.msg || '支付失败')
    }


  } catch (error) {
    console.error('支付失败:', error)
    pMessage.error('支付失败')
  }
}

// 放弃支付
const cancelPayment = () => {
  if (confirm('确定要放弃支付吗？')) {
    router.push('/order')
  }
}

// 跳转到首页
const goToHome = () => {
  router.push('/')
}

// 跳转到订单页
const goToOrder = () => {
  router.push('/order')
}

// 页面加载时检查支付时效
onMounted(() => {
  if (checkPaymentValidity()) {
    updateCountdown()
    timer = setInterval(updateCountdown, 1000)
  }
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <div class="pay-container">
    <div class="pay-content">
      <div class="pay-header">
        <h2>订单支付</h2>
        <div class="order-amount">
          支付金额：<span class="amount">¥{{ route.query.price || '0.00' }}</span>
        </div>
        <div class="countdown" :class="{ 'countdown-warning': remainingTime < 300 }">
          支付剩余时间：{{ formatTime(remainingTime) }}
        </div>
      </div>

      <div class="pay-actions">
        <button class="pay-btn" @click="handlePayment">确认支付</button>
        <button class="cancel-btn" @click="cancelPayment">放弃支付</button>
      </div>
    </div>

    <!-- 支付成功弹窗 -->
    <div class="modal" v-if="showSuccessModal">
      <div class="modal-content">
        <div class="success-icon">✓</div>
        <h3>支付成功</h3>
        <div class="modal-actions">
          <button class="btn-home" @click="goToHome">返回首页</button>
          <button class="btn-order" @click="goToOrder">查看订单({{ fiveInterval }}秒后自动跳转)</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pay-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.pay-content {
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.pay-header {
  text-align: center;
  margin-bottom: 32px;
}

.order-amount {
  font-size: 16px;
  color: #666;
  margin-top: 16px;
}

.amount {
  font-size: 24px;
  color: #ff4400;
  font-weight: bold;
}

.pay-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.pay-btn,
.cancel-btn {
  padding: 12px 36px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.pay-btn {
  background: #ff4400;
  border: none;
  color: #fff;
}

.pay-btn:hover {
  background: #ff5500;
}

.cancel-btn {
  background: #fff;
  border: 1px solid #d9d9d9;
  color: #666;
}

.cancel-btn:hover {
  background: #f5f5f5;
}

/* 弹窗样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  animation: modalShow 0.3s ease;
}

.success-icon {
  width: 64px;
  height: 64px;
  background: #52c41a;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin: 0 auto 16px;
}

.modal-actions {
  margin-top: 24px;
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn-home,
.btn-order {
  padding: 8px 24px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-home {
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  color: #666;
}

.btn-order {
  background: #ff4400;
  border: none;
  color: #fff;
}

.btn-home:hover {
  background: #e8e8e8;
}

.btn-order:hover {
  background: #ff5500;
}

@keyframes modalShow {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 添加倒计时样式 */
.countdown {
  margin-top: 12px;
  font-size: 16px;
  color: #666;
}

.countdown-warning {
  color: #ff4400;
  font-weight: bold;
  animation: blink 1s infinite;
}

@keyframes blink {
  50% {
    opacity: 0.5;
  }
}
</style>