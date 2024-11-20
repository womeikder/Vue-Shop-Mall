<script setup>

import { onMounted, ref, watch, defineProps, defineEmits } from "vue";


const props = defineProps({
  name: { type: String },
  size: { type: Number, default: 20 },
  circle: { type: Boolean, default: false }
});
const iconRef = ref(null);
onMounted(() => {
  if (iconRef.value) {
    const img = `/src/assets/icons/${props.name}.svg`;
    iconRef.value.style.backgroundImage = `url(${img})`;
    iconRef.value.style.width = `${props.size}px`;
    iconRef.value.style.height = `${props.size}px`;
  }
});
const isClicked = ref(false);
const emit = defineEmits(['circle']);
const circleOperation = () => {
  if (props.circle) {
    isClicked.value = true;
    emit('circle');
  }
};
watch(isClicked, (newValue) => {
  if (isClicked.value === true) {
    setTimeout(() => {
      isClicked.value = false;
    },1500);
  }
},{
  deep: true,
  immediate: true
});
</script>

<template>
  <div class="icon" :class="{circle: isClicked}" @click="circleOperation" ref="iconRef"></div>

</template>

<style scoped>
.icon {
  width: 24px;
  height: 24px;
  background-image: none;
  background-size: cover;
}
.circle {
  animation: RotateScale 1.5s infinite linear; /* 应用动画 */
}
@keyframes RotateScale {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
