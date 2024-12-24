<script setup>
import CheckBox from "@/components/global/CheckBox.vue";
import {computed, ref, watch} from "vue";
import Button from "@/components/global/Button.vue";
import Table from "@/components/global/Table.vue";
import {useCategoryList} from "@/api/admin/category.js";
import {validate} from "uuid";



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
  const res = await useCategoryList(query)
  CategoryList.value = res.data.data
  for (let item of CategoryList.value) {
    tableData.value.push({
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
        tableData.value.push({
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
            tableData.value.push({
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
  paginateList.value = {
    total: tableData.value.length,
    pageNum: res.data.current_page,
    pageSize: res.data.per_page
  }
}

const changeStatus = (data) => {
  query.value.status = data
}


getData()
</script>

<template>
  <div class="title">分类详情</div>
  <div class="container">
    <div class="header">
      <form @submit.prevent="getData(null)">
        <label>分类状态: </label>
        <CheckBox @status="changeStatus" class="checkbox"></CheckBox>
        <Button style="margin-right: 5px" text="搜索" color="primary" type="submit"></Button>
        <Button text="重置" color="info" type="reset"></Button>
        <Button style="position: absolute; right: 5%" text="添加商品" type="button" @onClicked="addCategory"
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
          @edit="setCurrentColumnItem"
          @del="delCurrentColumnItem"
      ></Table>
    </div>
  </div>

  <!--  自定义弹窗-->

</template>

<style scoped lang="scss">
.title {
  font-size: 50px;
  font-weight: bold;
  width: 100%;
  border-bottom: 1px solid gray;
}

.container {
  width: 100%;
  height: 100vh;
}

.header {
  width: 80%;
  padding: 10px;
  margin-top: 10px;

  form {
    display: flex;
    justify-content: left;
    align-items: center;

    input[type="text"] {
      border: 1px solid grey;
      border-radius: 5px;
      width: 20%;
      height: 30px;
      margin-right: 1%;
    }

    select {
      border-radius: 5px;
      width: 10%;
      height: 30px;
      margin-right: 1%;
    }

    .checkbox {
      align-items: center;
    }

    label {
      margin-right: 5px;
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
</style>
