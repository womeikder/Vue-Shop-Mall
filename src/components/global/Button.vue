<script setup>
import {ref, computed} from "vue";

const props = defineProps({
  color: {
    type: String,
    default: 'primary'
  },
  text: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    default: 100
  },
  height: {
    type: Number,
    default: 30
  },
  type: {
    type: String,
    default: 'button'
  },
  plain: {
    type: Boolean,
    default: false
  }
});

const buttonColor = computed(() => {
  switch (props.color) {
    case 'primary':
      return '#4395F9';
    case 'info':
      return '#909399';
    case 'success':
      return '#46C54E';
    case 'warning':
      return '#EAA74D';
    case 'danger':
      return '#FF9A99';
    default:
      return 'rgba(240,240,240,0.87)';
  }
});

const emit = defineEmits(['onClicked']);

const onClicked = () => {
  emit('onClicked');
};
</script>

<template>
  <div class="button">
    <button
        @click="onClicked"
        :style="{ backgroundColor: buttonColor }"
        :type="props.type"
    >
      {{ props.text }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.button {
  display: inline-block;
}

.button button {
  height: 35px;
  align-content: center;
  padding: 0 10px;
  border-radius: 7px;
  border: none;
  text-align: center;
  cursor: pointer;
  font-size: large;
  color: white;
  font-family: '微软雅黑';
}

.button button:hover {
  opacity: 0.7;
}
</style>
