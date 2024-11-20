<script setup>
import {onMounted} from "vue";

const props = defineProps({
  title: {
    type: String
  },
  button: {
    type: String,
    default: '确定'
  }
})
const emit = defineEmits(['agree'])

const agree = () => {
  emit('agree')
  close()
}
let overlay = ''
let dialog = ''
onMounted(() => {
  overlay = document.querySelector('.overlay')
  dialog = document.querySelector('#dialog')
})

const show = () => {
  dialog.showModal(); // 显示 dialog
  overlay.style.display = 'block'; // 显示遮罩层
}
const close = () => {
  dialog.close(); // 关闭 dialog
  overlay.style.display = 'none'; // 隐藏遮罩层
}



defineExpose({
  show,close
})
</script>

<template>
  <div class="overlay"></div>
    <dialog id="dialog">
      <header>
        <p>{{ props.title }}</p>
        <p @click="close">X</p>
      </header>
      <section>
        <slot></slot>
      </section>
      <footer>
        <button class="submit" @click="agree">{{ props.button }}</button>
        <button class="cancel" @click="close">取消</button>
      </footer>
    </dialog>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
  display: none; /* 默认隐藏 */
  z-index: 9995; /* 确保遮罩层在最上层 */
}
  dialog {
    width: 600px;
    position: fixed;
    top: 0;
    z-index: 9998;
    border: none;
    border-radius: 15px;
    header p{
      font-size: larger;
      font-weight: bold;
      display: inline-block;
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
      transition: all 1s;
    }
    button {
      width: 100px;
      height: 40px;
      background: #486FF8;
      border: none;
      border-radius: 5px;
      margin-right: 20px;
      margin-top: 20px;
      float: right;
      transition: all 1s;
      cursor: pointer;
    }
    button:hover {
      box-shadow: 0 0 20px gray;
    }
  }


</style>
