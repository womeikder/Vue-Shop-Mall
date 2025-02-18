<script setup>
import { useGetSlideList } from '@/api/admin/slide'
import { ref, watch } from 'vue'
import BaseUrl from "@/utils/BaseUrl.js";
import Button from '@/components/global/Button.vue'
import Dialog from '@/components/global/Dialog.vue'
import Icon from '@/components/global/Icon.vue';
import pMessage from '@/components/global/message';
import { useDeleteSlide, useGetSlideDetail,useAddSlide,useUpdateSlide, usePutSlideOn } from '@/api/admin/slide'
import Drawer from '@/components/global/Drawer.vue';
import baseUrl from '@/utils/BaseUrl.js';
import { formatTime } from '@/utils/timeUtils';
import ImgUpload from '@/components/global/ImgUpload.vue';

const slideList = ref([])
const showList = ref([])
const getData = async () => {
    // 获取前30张轮播图
    const res = await useGetSlideList(30)
    slideList.value = res.data

    // 获取页面中展示的轮播图
    const show = await useGetSlideList(6)
    showList.value = show.data 
}
getData()

// 删除轮播图
const delSlide = async (item) => {
    const res = await useDeleteSlide(item.id)
    pMessage.success(res.msg)
    getData() 
}


const drawerRef = ref()
const drawerData = ref({})
// 轮播图详情
const detailSilde = async (item) => {
    const res = await useGetSlideDetail(item.id)
    console.log(res);
    drawerData.value = res.data
    drawerRef.value.show()
}

// 添加轮播图
const addSlideRef = ref()
const dialogFormData = ref({})
const dialogStatus = ref(false)
const editUrl = ref([])
const addDialog = () => {
    dialogStatus.value = true
    addSlideRef.value.show()
}

// 编辑轮播图
const editDialog = (item) => {
    dialogStatus.value = false
    dialogFormData.value = item
    editUrl.value.push(dialogFormData.value.img)
    addSlideRef.value.show()
}


// 添加轮播图
const addSlide = async () => {
    if (dialogStatus) {
        const res = await useAddSlide(dialogFormData.value)
        pMessage.success(res.msg)
    } else {
        const res = await useUpdateSlide(dialogFormData.value)
        pMessage.success(res.msg)
    }
    getData()
}


// 设置轮播图
const operationSlide = async (type) => {
    if (type === 0) {
        const res = await usePutSlideOn(currentSlide.value.id)
        pMessage.success(res.msg)
        console.log(res);
        
    } else {
        const res = await useDeleteSlide(currentSlide.value.id)
        pMessage.success(res.msg)
    }
    getData()
}
const setSlideRef = ref()
const currentSlide = ref({})
const operation = (index) => {
    currentSlide.value = index
    setSlideRef.value.show()
}

</script>

<template>
    <div class="slide">
        <div class="header">
            <div class="slide-title">页面轮播</div>
            <Button style="margin-right: 20px;" text="添加轮播图" color="primary" @click="addDialog"></Button>
        </div>
        
        
        <div class="slide-list">
            <div class="slide-item" v-for="(item, index) in showList" :key="item.id">
                <img class="slide-img" :src="BaseUrl + item.img" alt="">
                <Icon class="slide-icon" @click="delSlide(item)" style="left: 10%;" name="delete" size="50"></Icon>
                <Icon class="slide-icon" @click="detailSilde(item)" style="left: 50%;" name="detail1" size="50"></Icon>
                <Icon class="slide-icon" @click="editDialog(item)" style="left: 90%;" name="edit" size="50"></Icon>
            </div>
        </div>
    </div>

    <div class="slide">
        <div class="all-title">前30张轮播图</div>
        <div class="all-list">
            <div class="all-item" v-for="(item, index) in slideList" :key="item.id" @click="operation(item)">
                <img style="width: 100%; height: 60px;" :src="BaseUrl + item.img" alt="">
            </div>
        </div>
    </div>  
    
    <Dialog :title="dialogStatus ? '添加轮播图' : '修改轮播图'" ref="addSlideRef" :button="dialogStatus ? '添加' : '修改'" @agree="addSlide">
        <div class="add-slide">
            <div class="add-slide-item">
                <div class="add-slide-title">轮播图名称</div>
                <input type="text" class="add-slide-input" v-model="dialogFormData.title">
            </div>

            <div class="add-slide-item">
                <div class="add-slide-title">轮播图状态</div>
                <select v-model="dialogFormData.status">
                    <option value="">请选择轮播图状态</option>
                    <option value="1">正常</option>
                    <option value="0">禁用</option>
                </select>
            </div>

            <div class="add-slide-item">
                <div class="add-slide-title">轮播图图片</div>
                <ImgUpload :imgList="editUrl" :showSize="1" @upload-success="dialogFormData.img = $event"></ImgUpload>
            </div>
        </div>
    </Dialog>
    <Dialog title="设置轮播图" ref="setSlideRef" :button="'确定'">
      
      <div class="set-slide">
        <Button style="margin-right: 5px" @onClicked="operationSlide(0)" text="上架轮播图" color="primary" type="button"></Button>
        <Button style="margin-right: 5px" @onClicked="operationSlide(1)" text="删除轮播图" color="danger" type="button"></Button>
      </div>
    </Dialog>

    <Drawer title="轮播图详情" ref="drawerRef">
        <div class="drawer-content">
            <span>轮播图名称 {{ drawerData.title }}</span>
            <span>轮播图Id {{ drawerData.id }}</span>
            <span>上次更新时间 {{ formatTime(drawerData.update_time) }}</span>
            <span>图片创建时间 {{ formatTime(drawerData.create_time) }}</span>
            <span>当前状态 {{ drawerData.status ? '正常' : '禁用' }}</span>
            <span>排序等级 {{ drawerData.seq }}</span>
            <img :src="baseUrl + drawerData.img" alt="">
        </div>
    </Drawer>


</template>

<style lang="scss" scoped>
.slide {
    width: 97%;
    padding: 10px;
    margin-top: 10px;
    border: 1px solid #ffffff;
    border-radius: 10px;
    background: white;
    margin: 0 auto;
    box-shadow: 0 0 5px #dadada;
    margin-bottom: 10px;
}
.slide-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    flex-wrap: wrap;
}
.slide-item {
    width: 30%;
    margin: 10px;
    height: 300px;
    border: 1px solid #dadada;
    border-radius: 5px;
    overflow: hidden;
    position: relative;
}
.slide-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.slide-icon {
    width: 70%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    align-items: center;
    transition: opacity 0.3s ease;
    opacity: 0;
    cursor: pointer;
}

.slide-item:hover .slide-img{
    transform: scale(1.1);
    transition: all 1s;
    opacity: 0.2;
}
.slide-item:hover .slide-icon {
    opacity: 1;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    width: 100%;
}

.slide-title {
    font-size: 20px;
    font-weight: bold;
    margin-left: 10px;
    width: 100px;
    border: 1px solid #0d972b;
    border-radius: 5px;
    text-align: center;
    background: #b6ebc1a1;
    color: #0f992d;
}
.all-title {
    font-size: 20px;
    font-weight: bold;
    margin-left: 10px;
    width: 150px;
    border: 1px solid #0d6497;
    border-radius: 5px;
    text-align: center;
    background: #b4dafaa1;
    color: #0d6497;
}



.all-list {
    display: grid;
    grid-template-columns: repeat(15, 1fr);
    align-items: center;
    width: 100%;
    flex-wrap: wrap;
}

.all-item {
    margin: 10px;
    border-radius: 5px;
    cursor: pointer;
}

.drawer-content {
    display: grid;
    width: 100%;
    height: 100%;
    font-size: large;
    color: #6e6e6e;
    img {
        width: 100%;
    }
}

.add-slide {
    width: 800px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 50px 50px;
    input[type="text"] {
      border: 1px solid rgb(211, 210, 210);
      border-radius: 5px;
      width: 80%;
      height: 30px;
      color: #c2c1c1;
    }

    select {
      border: 1px solid rgb(211, 210, 210);
      border-radius: 5px;
      width: 50%;
      height: 30px;
      color: #707070;
    }
}
</style>
