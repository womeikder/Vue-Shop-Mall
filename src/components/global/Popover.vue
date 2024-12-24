<template>
  <div>
    <!-- 触发按钮 -->
    <button ref="triggerButton" @click="togglePopover" style="border: none;background: none">
      <slot name="trigger"></slot>
    </button>

    <!-- 弹出框 -->
    <transition name="fade">
      <div v-if="isPopoverVisible" ref="popoverElement" class="popover" :style="popoverStyle">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';

// 独立的状态管理
const isPopoverVisible = ref(false);

// 获取 DOM 元素的引用
const triggerButton = ref(null);
const popoverElement = ref(null);

// 计算弹出框的位置
const popoverStyle = computed(() => {
  if (!isPopoverVisible.value || !triggerButton.value || !popoverElement.value) return {};

  const rect = triggerButton.value.getBoundingClientRect();
  const popoverRect = popoverElement.value.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let top = rect.bottom + window.scrollY + 10;
  let left = rect.left + window.scrollX;

  // 检查是否超出视口底部，若超出则向上调整位置
  if (top + popoverRect.height > viewportHeight + window.scrollY) {
    top = rect.top + window.scrollY - popoverRect.height - 10;
  }

  // 检查是否超出视口右侧，若超出则向左调整位置
  if (left + popoverRect.width > viewportWidth + window.scrollX) {
    left = rect.right + window.scrollX - popoverRect.width;
  }

  return {
    top: `${top}px`,
    left: `${left}px`,
  };
});

// 切换弹出框的显示状态
const togglePopover = (event) => {
  event.stopPropagation(); // 阻止事件冒泡
  isPopoverVisible.value = !isPopoverVisible.value;
};

// 处理窗口大小变化
const handleResize = () => {
  if (isPopoverVisible.value) {
    // 当弹出框可见时重新计算位置
    popoverStyle.value; // 强制重新计算样式
  }
};

// 处理点击页面其他地方关闭弹出框
const handleClickOutside = (event) => {
  if (isPopoverVisible.value && popoverElement.value && !popoverElement.value.contains(event.target) && !triggerButton.value.contains(event.target)) {
    isPopoverVisible.value = false;
  }
};

onMounted(() => {
  nextTick(() => {
    // 添加全局事件监听器
    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);
  });
});

onUnmounted(() => {
  // 移除全局事件监听器
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.popover {
  position: fixed;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 10px;
  z-index: 9999;
}

/* 过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
