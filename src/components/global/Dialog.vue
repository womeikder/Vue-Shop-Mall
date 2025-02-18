<script setup>
import {ref, onMounted, onBeforeUnmount, nextTick} from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  button: {
    type: String,
    default: '确定'
  }
});

const emit = defineEmits(['agree']);

const agree = () => {
  emit('agree');
  close();
};

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
        <p @click="close">x</p>
      </header>
      <section>
        <slot></slot>
      </section>
      <footer>
        <button class="cancel" @click="close" >取消</button>
        <button class="submit" @click="agree">{{ props.button }}</button>
      </footer>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.hidden {
  display: none;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9995;
}

.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9998;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-height: 90vh;
  overflow: auto;
  padding: 20px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;

  p {
    font-size: 18px;
    margin: 0;

    &:nth-child(2) {
      cursor: pointer;
      color: #888;
      font-size: 16px;

      &:hover {
        color: #007bff;
      }
    }
  }
}

section {
  margin-bottom: 20px;
}

footer {
  display: flex;
  justify-content: flex-end;

  button {
    padding: 10px 20px;
    border-radius: 4px;
    margin-left: 10px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;

    &.cancel {
      background-color: #f8f9fa;
      color: #007bff;
      border: 1px solid #007bff;

      &:hover {
        background-color: #e9ecef;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    }

    &.submit {
      background-color: #007bff;
      color: #fff;
      border: 1px solid #007bff;

      &:hover {
        background-color: #0056b3;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>