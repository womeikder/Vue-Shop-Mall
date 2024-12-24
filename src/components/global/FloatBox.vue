<template>
  <div class="mask" :ref="setMaskRef" :class="{ 'mask-hidden':!isMaskVisible }"></div>
  <div class="float-box" :style="{top: `${props.top}px`, left: `${props.left}px`}" :ref="setBoxRef" :class="{ 'float-box-hidden':!isBoxVisible }">
    <section>
      <slot></slot>
    </section>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

// 生成唯一实例标识的计数器
let instanceCounter = 0;

// 定义组件接收的属性
const props = defineProps({
  left: {
    type: Number,
    default: 100
  },
  top: {
    type: Number,
    default: 100
  },
  weight: {
    type: Number,
    default: 200
  }
});

// 定义组件向外发射的事件
const emit = defineEmits(['close']);

// 用于存储当前组件实例的唯一标识
const instanceId = ref(instanceCounter++);

// 使用ref来引用DOM元素，并初始化为null
const maskRef = ref(null);
const boxRef = ref(null);

// 响应式数据，用于控制mask的显示隐藏
const isMaskVisible = ref(false);
// 响应式数据，用于控制box的显示隐藏
const isBoxVisible = ref(false);

// 设置mask的ref引用的函数
const setMaskRef = (el) => {
  maskRef.value = el;
  if (el) {
    el.dataset.instanceId = instanceId.value;
  }
};

// 设置box的ref引用的函数
const setBoxRef = (el) => {
  boxRef.value = el;
};

onMounted(() => {
  const handleMaskClick = (e) => {
    if (e.target === maskRef.value && e.target.dataset.instanceId === instanceId.value.toString()) {
      isBoxVisible.value = false;
      isMaskVisible.value = false;
      emit('close');
    }
  };

  if (maskRef.value) {
    maskRef.value.addEventListener('click', handleMaskClick);
  }

  onUnmounted(() => {
    if (maskRef.value) {
      maskRef.value.removeEventListener('click', handleMaskClick);
    }
  });
});

const show = () => {
  isBoxVisible.value = true;
  isMaskVisible.value = true;
};

defineExpose({
  show
});
</script>

<style scoped>
.mask {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}

.mask-hidden {
  display: none;
}

.float-box {
  width: 200px;
  position: fixed;
  border: none;
  border-radius: 15px;
  background: white;
  box-shadow: 0 0 25px grey;
  z-index: 200;

  header {
    width: 100%;
    height: 20px;
    padding-bottom: 10px;

    button {
      float: right;
      border: none;
      background: white;
      cursor: pointer;
    }
  }
}

.float-box-hidden {
  display: none;
}
</style>
