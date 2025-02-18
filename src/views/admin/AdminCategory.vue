<script setup>
import CheckBox from "@/components/global/CheckBox.vue";
import {computed, ref, watch} from "vue";
import Button from "@/components/global/Button.vue";
import Table from "@/components/global/Table.vue";
import {useCategoryList,useGetCategoryDetail,useAddCategory} from "@/api/admin/category.js";
import Drawer from "@/components/global/Drawer.vue";
import { formatTime } from "@/utils/timeUtils";
import pMessage from "@/components/global/message";
import Dialog from "@/components/global/Dialog.vue";

// 表头
const column = ref([
  '分类名称', '分类状态', '分类等级', '创建时间', '上级分类'
])

// 需要显示的字段
const useIndex = ref([
  'name', 'status', 'level', 'create_time', 'pname'
])

const query = ref({
  status: null,
  per_page: null,
  page: null
})
const paginateList = ref({})
const CategoryList = ref([])
const tableData = ref([])

const getData = async (item) => {
  tableData.value = []
  if (item) {
    query.value.page = item.pageNum
    query.value.per_page = item.pageSize
  }
  const res = await useCategoryList(query.value)
  CategoryList.value = res.data.data
  computeLevel(CategoryList.value, tableData.value)
  
  paginateList.value = {
    total: tableData.value.length,
    pageNum: res.data.current_page,
    pageSize: res.data.per_page
  }
}

const computeLevel = (List, Data) => {
  for (let item of List) {
    Data.push({
      id: item.id,
      name: item.name,
      level: item.level,
      pid: item.pid,
      status: item.status === 1 ? '启用' : '禁用',
      create_time: item.create_time ? item.create_time.substring(0, 10) : '',
      pname: '最高级'
    })
    if (item.children) {
      for (let inner of item.children) {
        Data.push({
          id: inner.id,
          name: inner.name,
          level: inner.level,
          pid: inner.pid,
          status: inner.status === 1 ? '启用' : '禁用',
          create_time: inner.create_time ? inner.create_time.substring(0, 10) : '',
          pname: inner.name
        })
        if (inner.children) {
          for (let res of inner.children) {
            Data.push({
              id: res.id,
              name: res.name,
              level: res.level,
              pid: res.pid,
              status: res.status === 1 ? '启用' : '禁用',
              create_time: res.create_time ? res.create_time.substring(0, 10) : '',
              pname: res.name
            })
          }
        }
      }
    }
  }
}

const changeStatus = (data) => {
  query.value.status = data
}


getData()

const drawerRef = ref()

const currentColumnItem = ref({
  name: null,
  pid: null,
  level: null,
  status: null
})

// 查看分类详情
const showCurrentColumnItem = async (item) => {

  const res = await useGetCategoryDetail(item.id)

  currentColumnItem.value = res.data[0]

  drawerRef.value.show()
  
}

// 设置分类状态
const setStatus = async () => {
  const res = await useUpdateCategoryStatus(currentColumnItem.value.id, currentColumnItem.value.status)
  pMessage.success(res.msg)
  getData()
}

const addCategory = ref({
  name: null,
  pid: null,
  level: null,
  status: null
})

const dialogStatus = ref(false)
const dialogRef = ref()

// 添加分类按钮
const addCategoryButton = () => {
  dialogStatus.value = true
  dialogRef.value.show()
}

// 编辑分类按钮
const setCurrentColumnItem = async (item) => {
  addCategory.value = item
  dialogRef.value.show()
  
}

// 添加与修改分类发请求
const CategoryAdd = async () => {
  if (dialogStatus.value) {
    const res = await useAddCategory(addCategory.value)
    pMessage.success(res.msg)
    getData()
  } else {
    const res = await useUpdateCategoryStatus(currentColumnItem.value.id, currentColumnItem.value.status)
    pMessage.success(res.msg)
    getData()
  }
}

</script>

<template>
  
  <div class="container">
    <div class="header">
      <form @submit.prevent="getData(null)">
        <label>分类状态: </label>
        <CheckBox @status="changeStatus" class="checkbox"></CheckBox>
        <Button style="margin-right: 5px" text="搜索" color="primary" type="submit"></Button>
        <Button text="重置" color="info" type="reset"></Button>
        <Button style="position: absolute; right: 5%" text="添加分类" type="button" @onClicked="addCategoryButton"
                color="success"></Button>
      </form>
    </div>
    <div class="data-display">

      <!--      自定义表格-->
      <Table
          class="table"
          :data="tableData"
          :index="true"
          :useIndex="useIndex"
          :column="column"
          imgColumn="cover"
          :page="paginateList"
          @paginate="getData"
          editBtn="查看"
          delBtn="编辑"
          @edit="showCurrentColumnItem"
          @del="setCurrentColumnItem"
      ></Table>
    </div>
  </div>

  <Drawer title="分类详情" ref="drawerRef">
    <div class="drawer-detail">
            <div>分类昵称: {{ currentColumnItem.name }}</div>
            <div>分类等级: {{ currentColumnItem.level }}</div>
            <div>分类Id: {{ currentColumnItem.id }}</div>
            <div>上级分类: {{ currentColumnItem.pid == 0 ? '最高级' : currentColumnItem.pid }}</div>
            <div>分类状态: {{ currentColumnItem.status=== 1 ? '启用' : '禁用' }}</div>
            <div>创建时间: {{ formatTime(currentColumnItem.create_time) }}</div>
            <div class="chlidren-title">相关子类</div>
            <Button :text="currentColumnItem.status=== 1 ? '禁用' : '启用'" type="button" @onClicked="setStatus"></Button>

            
            <div class="chlidren" v-for="item in currentColumnItem.children">
              <div>分类昵称: {{ item.name }}</div>
              <div>分类等级: {{ item.level }}</div>
              <div>分类Id: {{ item.id }}</div>
              <div>上级分类: {{ item.pid == 0 ? '最高级' : item.pid }}</div>
              <div>分类状态: {{ item.status=== 1 ? '启用' : '禁用' }}</div>
              
              <div class="son" v-for="inner in item.children">
                <div>分类昵称: {{ inner.name }}</div>
                <div>分类等级: {{ inner.level }}</div>
                <div>分类Id: {{ inner.id }}</div>
                <div>上级分类: {{ inner.pid == 0 ? '最高级' : inner.pid }}</div>
                <div>分类状态: {{ inner.status=== 1 ? '启用' : '禁用' }}</div>
              </div>
            </div>
        </div>
  </Drawer>

  <Dialog :title="dialogStatus ? '添加分类' : '修改分类'" ref="dialogRef" @agree="CategoryAdd">
      <p>
          <label>分类名称:</label>
          <input class="input" type="text" v-model="addCategory.name" placeholder="输入商品名称"
                                        required>
          <label>上级分类:</label>
          <select v-model="addCategory.pid" class="select">
            <option v-for="item in CategoryList" :value="item.id">{{ item.name }}</option>
          </select>
      </p>
      <p>
          <label>分类等级:</label>
          <select v-model="addCategory.level" class="select">
            <option v-for="item in 3" :value="item">{{ item }}</option>
          </select>

          <label>分类状态:</label>
          <select v-model="addCategory.status" class="select">
            <option value="1">启用</option>
            <option value="0">禁用</option>
          </select>
      </p>
  </Dialog>
  

</template>

<style scoped lang="scss">

.container {
  width: 100%;
  height: 100vh;
}

.header {
  width: 97%;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ffffff;
  border-radius: 10px;
  background: white;
  margin: 0 auto;
  box-shadow: 0 0 5px #dadada;


  form {
    display: flex;
    justify-content: left;
    align-items: center;

    input[type="text"] {
      border: 1px solid rgb(211, 210, 210);
      border-radius: 5px;
      width: 20%;
      height: 30px;
      margin-right: 1%;
      color: #c2c1c1;
    }

    select {
      border: 1px solid rgb(211, 210, 210);
      border-radius: 5px;
      width: 10%;
      height: 30px;
      margin-right: 1%;
      color: #c2c1c1;
    }

    .checkbox {
      align-items: center;
    }

    label {
      margin-right: 10px;
    }
  }
}

.input {
  width: 30%;
  height: 30px;
  margin-left: 10px;
  margin-right: 50px;
  border: 1px solid #d2d2d2;
  border-radius: 5px;
}

.textarea {
  resize: none;
  width: 80vw;
  height: 80px;
  border: 1px solid #d2d2d2;
  border-radius: 5px;
}

.select {
  width: 10%;
  height: 30px;
  margin-left: 10px;
  margin-right: 50px;
  border: 1px solid #d2d2d2;
  border-radius: 5px;
}

label {
  color: #696969;
}
.drawer-detail {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    div {
        font-size: large;
        color: #606060;
        text-align: left;
        align-content: center;
    }
    .chlidren {
      line-height: 50px;
      text-indent: 2em;
      box-shadow: 0 0 10px #dadada;
      border-radius: 5px;
      padding: 10px;

    }
    .son {
      margin-top: 50px;
      line-height: 30px;
      text-indent: 4em;
    }
}

.chlidren-title {
    font-size: 20px;
    font-weight: bold;
    width: 100px;
    border: 1px solid #a2ceab;
    border-radius: 5px;
    padding-left: 20px;
    background: #d8ecda;
}
.select {
  width: 10%;
  height: 30px;
  margin-left: 10px;
  margin-right: 50px;
  border: 1px solid #d2d2d2;
  border-radius: 5px;
}
</style>
