<template>
  <transition name="scale">
    <div v-show="state.showMessage" class="pMessage">
      {{ state.content }}
    </div>
  </transition>
</template>

<script setup>
import { reactive, ref } from "vue";

const state = reactive({
  content: "这是一个 message",
  duration: 1500,
  type: "primary",
  showMessage: false,
});
let messageTimer = null;
const open = () => {
  if (messageTimer) {
    clearTimeout(messageTimer);
    messageTimer = null;
  }
  handleColor(state.type);
  state.showMessage = true;
  messageTimer = setTimeout(() => {
    state.showMessage = false;
  }, state.duration);
};
const close = () => {
  if (messageTimer) {
    clearTimeout(messageTimer);
    messageTimer = null;
  }
  state.showMessage = false;
};
let color = ref("");

const handleColor = (type) => {
  switch (type) {
    case "primary":
      color.value = 'rgba(174,214,241,0.73)'
      break;
    case "success":
      color.value = 'rgba(171,235,198,0.72)'
      break;
    case "error":
      color.value = 'rgba(245,183,177,0.74)'
      break;
    case "warning":
      color.value = 'rgba(250,215,160,0.7)'
      break;
    case "info":
      color.value = 'rgba(234,237,237,0.72)'
      break;
  }
};
defineExpose({ state, open, close });
</script>

<style scoped>
.pMessage {
  --base_color: v-bind(color);

  color: #f3f3f3;
  font-weight: bold;
  width: 500px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 5%;
  left: calc(50% - (500px / 2));
  z-index: 10000;
  background: var(--base_color);
  border-radius: 10px;
}

.scale-enter-active,
.scale-leave-active {
  transition: 0.2s ease-out;
}

.scale-enter,
.scale-leave-to {
  transform: scale(2);
  opacity: 0;
}
</style>

