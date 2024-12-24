<script setup>
import {ref, onMounted, onBeforeUnmount, nextTick} from "vue";

const props = defineProps({
  title: {
    type: String,
    default: '提示'
  },
  button: {
    type: String,
    default: '确定'
  }
});

const emit = defineEmits(['confirm','cancel']);

const confirm = () => {
  emit('confirm');
  close();
};
const cancel = () => {
  emit('cancel')
}



// 使用 ref 引用 DOM 元素
const overlayRef = ref(null);
const dialogRef = ref(null);

// 挂载时添加事件监听器
onMounted(() => {
  nextTick(() => {
    const overlay = overlayRef.value;
    if (overlay) {
      overlay.addEventListener('click', handleClickOutside);
    }
  });
});

// 卸载前移除事件监听器
onBeforeUnmount(() => {
  const overlay = overlayRef.value;
  if (overlay) {
    overlay.removeEventListener('click', handleClickOutside);
  }
});

const handleClickOutside = (e) => {
  if (e.target === e.currentTarget) {
    close();
  }
};

const isVisible = ref(false);

const show = () => {
  isVisible.value = true;
};

const close = () => {
  isVisible.value = false;
  cancel()
};

defineExpose({
  show,
  close
});
</script>

<template>
  <Teleport to="body">
    <div class="overlay" :class="{ 'hidden': !isVisible }" ref="overlayRef"></div>
    <div class="dialog" :class="{ 'hidden': !isVisible }" ref="dialogRef">
      <header>
        <p>{{ props.title }}</p>
        <p @click="close">X</p>
      </header>
      <section>
        <slot></slot>
      </section>
      <footer>
        <button class="submit" @click="confirm">{{ props.button }}</button>
        <button class="cancel" @click="close">取消</button>
      </footer>
    </div>
  </Teleport>
</template>

<style scoped>
.hidden {
  display: none;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
  z-index: 9995; /* 确保遮罩层在最上层 */
}

.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9998;
  border: none;
  border-radius: 15px;
  background: white;
}

header {
  display: flex;
  justify-content: space-between;
  margin: 1px 10px;
  border-bottom: 1px solid #d2d0d0;
}

header p {
  font-size: larger;
  font-weight: bold;
}

header p:nth-child(2) {
  float: right;
  cursor: pointer;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  text-align: center;
}

header p:nth-child(2):hover {
  background: black;
  color: white;
  transition: all 0.5s;
}

section {
  margin: 50px 20px;
  color: gray;
}

button {
  width: 100px;
  height: 40px;
  background: #486FF8;
  border: none;
  border-radius: 5px;
  margin: 20px 20px;
  float: right;
  transition: all 0.5s;
  cursor: pointer;
  color: white;
  font-size: medium;
}

button:hover {
  box-shadow: 0 0 20px gray;
}
</style>
