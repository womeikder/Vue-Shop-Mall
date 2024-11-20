<script setup>
import {onMounted} from "vue";

const props = defineProps({
  left: {
    type: Number,
    default: 500
  },
  top: {
    type: Number,
    default: 500
  },
  weight: {
    type: Number,
    default: 200
  }
})

let dialog = null

onMounted(() => {
  dialog = document.querySelector('#float-box')
  if (dialog !== null) {
    dialog.style.top = props.weight + 'px'
    dialog.style.top = props.top + 'px'
    dialog.style.left = props.left + 'px'
  }
})

const show = () => {
  dialog.showModal();
}
const close = () => {
  dialog.close();
}

defineExpose({
  show,close
})
</script>

<template>
  <dialog id="float-box">
    <header>
      <button @click="close">x</button>
    </header>
    <section>
      <slot></slot>
    </section>
  </dialog>
</template>

<style scoped>
  dialog {
    width: 200px;
    position: fixed;
    top: 0;
    border: none;
    border-radius: 15px;
    box-shadow: 0 0 25px grey;
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
</style>
