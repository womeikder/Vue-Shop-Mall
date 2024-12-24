<template>
  <div :class="['checkbox-container', { checked: isChecked }]">
    <div class="btn">
      <input
          @click="change"
          type="checkbox"
          v-model="isChecked"
          style="display: none"
          :id="uniqueId"
      />
      <label :for="uniqueId"></label>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid'; // 引入 UUID 包来生成唯一 ID

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'status']);

// 使用ref来管理复选框的状态，并与父组件的v-model同步
const isChecked = ref(props.modelValue);

// 监听 props 的变化并更新本地状态
onMounted(() => {
  if (props.modelValue !== isChecked.value) {
    isChecked.value = props.modelValue;
  }
});

// 确保每个组件实例有唯一的ID
const uniqueId = ref(uuidv4());

const change = () => {
  isChecked.value = !isChecked.value;
  emit('update:modelValue', isChecked.value);
  emit('status', isChecked.value ? 1 : 0);
};
</script>

<style scoped lang="scss">
.checkbox-container {
  display: inline-block;
  position: relative;
  margin: 1px 10px;
  width: 50px;
  height: 20px;
  background-color: rgba(108, 213, 161, 0.51);
  border-radius: 10px;
}

.btn:before {
  content: "";
  position: absolute;
  top: 8px;
  left: 10px;
  height: 2px;
  width: 30px;
  background-color: #111;
}

.btn label {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  transition: all .5s ease;
  cursor: pointer;
  position: absolute;
  top: 2px;
  z-index: 1;
  left: 5px;
  background-color: pink;
}

.checked .btn label {
  left: 30px;
  background: rgb(32, 103, 236);
}
</style>
