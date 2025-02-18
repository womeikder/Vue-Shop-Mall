<template>
    <transition name="fade">
      <div v-show="showCard" class="purchase-card">
        <div class="card-header">
          <span class="price">¥{{ price }}</span>
          <span class="discount">{{ discountText }}</span>
        </div>
        <div class="card-img">
            <img :src="image" alt="商品图片" />
        </div>
        <div class="card-body">
          <div class="promotion">
            <tag v-for="(tag, index) in promotions" :key="index" class="promo-tag">
              {{ tag }}
            </tag>
          </div>
          <div class="count">
            <input type="button" value="-" @click="payCount--" :disabled="payCount <= 1" />
            <input type="text" value="1" v-model="payCount" @blur="payCount = Math.max(1, Math.min(payCount, stock))"/>
            <input type="button" value="+" @click="payCount++" />
          </div>
          <button class="buy-btn" @click="handleBuy">立即购买</button>
          <button class="cart-btn" @click="handleAdd">加入购物车</button>
          <div class="countdown" v-if="countdown">
            剩余时间：{{ countdown }}
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';

  
  // 定义 props
  const props = defineProps({
    threshold: {
      type: Number,
      default: 500 // 默认触发滚动高度
    },
    price: {
      type: Number,
      required: true
    },
    discountText: {
      type: String,
      default: '限时折扣'
    },
    promotions: {
      type: Array,
      default: () => ['满减优惠', '包邮']
    },
    countdown: String,
    image: {
      type: String,
      default: ''
    },
    stock: {
      type: Number,
      default: 100
    }
  });
  
  // 定义响应式数据
  const showCard = ref(false);

  // 定义支付数量
  const payCount = ref(1);
  // 滚动事件处理函数
  const handleScroll = () => {
    requestAnimationFrame(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      showCard.value = scrollTop > props.threshold && scrollTop < document.documentElement.scrollHeight - 1500;
    });
  };
  
  const emit = defineEmits(['buy', 'add']);
  // 立即购买方法
  const handleBuy = () => {
    // 触发父组件的 'buy' 事件
    emit('buy', payCount);
  };
  
  // 加入购物车方法
  const handleAdd = () => {
    // 触发父组件的 'add' 事件
    emit('add', payCount);
  };
  
  // 组件挂载时添加滚动事件监听
  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });
  
  // 组件卸载时移除滚动事件监听
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
  </script>
  
  <style lang="scss" scoped>
  .purchase-card {
    position: fixed;
    bottom: 40vh;
    left: 55vw;
    width: 500px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.15);
    padding: 16px;
    z-index: 1000;
  }
  
  .card-header {
    display: flex;
    align-items: baseline;
    margin-bottom: 12px;
  }
  
  .card-img {
    width: 500px;

    img {
        width: 100%;
        height: 300px;
        object-fit: cover;
    }
  }
  
  .price {
    color: #ff5000;
    font-size: 24px;
    font-weight: 700;
    margin-right: 8px;
  }
  
  .discount {
    color: #666;
    font-size: 12px;
  }
  
  .promotion {
    margin: 12px 0;
  }
  
  .promo-tag {
    background: #fff0e8;
    color: #ff5000;
    padding: 4px 8px;
    border-radius: 4px;
    margin-right: 8px;
    font-size: 12px;
  }
  
  .buy-btn {
    width: 50%;
    height: 40px;
    background: linear-gradient(90deg, #f3d023, #f34d23);
    color: white;
    border: none;

    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
    font-size: 16px;
    cursor: pointer;
  }
  
  .cart-btn {
    width: 50%;
    height: 40px;
    background: linear-gradient(90deg, #f34d23, #23f39c);
    color: white;
    border: none;
    border-radius: 4px;
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
    font-size: 16px;
    cursor: pointer;
  }
  
  .countdown {
    margin-top: 12px;
    color: #999;
    font-size: 12px;
    text-align: center;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
  .count {
    display: flex;
    input {
      width: 30px;
      height: 30px;
      border: 1px solid #ccc;
      padding: 0 5px;
      margin: 0 5px;
      border-radius: 5px;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
    }
    input[type="button"] {
      cursor: pointer;
    }
  }
  </style>