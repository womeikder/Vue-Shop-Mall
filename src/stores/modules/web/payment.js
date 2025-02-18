import { defineStore } from 'pinia'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    paymentTimers: {}  // 存储所有订单的支付截止时间
  }),
  
  actions: {
    // 设置订单支付截止时间
    setPaymentDeadline(orderId) {
      // 获取已存在的计时器
      const existingTimer = this.paymentTimers[orderId]
      if (existingTimer) {
        return // 如果已经存在则不重新设置
      }
      
      // 设置1小时后的截止时间
      this.paymentTimers[orderId] = Date.now() + 3600000 // 1小时 = 3600000毫秒
    },
    
    // 获取订单剩余支付时间（秒）
    getRemainingTime(orderId) {
      const deadline = this.paymentTimers[orderId]
      if (!deadline) return 0
      
      const remaining = deadline - Date.now()
      return remaining > 0 ? Math.floor(remaining / 1000) : 0
    },
    
    // 检查订单是否可以支付
    canPay(orderId) {
      return this.getRemainingTime(orderId) > 0
    },

    // 删除订单支付定时器
    deletePaymentTimer(orderId) {
      clearTimeout(this.paymentTimers[orderId])
      delete this.paymentTimers[orderId]
    },

    // 设置订单过期
    setOrderExpired(orderId) {
      this.paymentTimers[orderId] = Date.now() + 5000
    },
    
  },
  
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'payment-timers',
        storage: localStorage,
      },
    ],
  },
})
