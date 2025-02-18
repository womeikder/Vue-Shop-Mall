<script setup>
import { onMounted, defineProps, defineEmits,onBeforeUnmount } from 'vue'
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

// 显示弹窗
const show = () => {
    document.querySelector('.mask').style.display = 'block'
    document.querySelector('.drawer').style.right= '0'
}


// 关闭弹窗
const emit = defineEmits(['close'])
const close = () => {
    document.querySelector('.mask').style.display = 'none'
    document.querySelector('.drawer').style.right= '-50%'
    emit('close')
}

// 监听点击事件
onMounted(() => {
    const overlay = document.querySelector('.mask');
    overlay.addEventListener('click', () => {
        close()
    })
})

// 卸载前移除事件监听器
onBeforeUnmount(() => {
    const overlay = document.querySelector('.mask');
  if (overlay) {
    overlay.removeEventListener('click', close);
  }
});

// 暴露方法
defineExpose({
  show
})
</script>

<template>
    <div class="mask"></div>
    <div class="drawer">
        <div class="header">
            <div class="drawer-header">{{ props.title }}</div>
            <div class="canel" @click="close">x</div>
        </div>

        <div class="content">
            <slot></slot>
        </div>
        
    </div>
</template>

<style lang="scss" scoped>
.mask {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 995;
}
.drawer {
    position: fixed;
    top: 0;
    right: -50%;
    max-width: 50%;
    height: 100%;
    background: #fff;
    z-index: 996;
    transition: all 0.5s ease;
}

.header {
    display: flex;
    width: 100%;
    height: 50px;
    justify-content: space-between;
    border-bottom: 1px solid #e6e5e5;
}

.drawer-header {
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    font-size: 20px;

    
}
.canel {
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #ccc;
    cursor: pointer;
}
.canel:hover {
    color: #000;
}

.content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    height: calc(100% - 50px);
}

</style>