<script setup>
import {ref, watch} from "vue";
import Button from "@/components/global/Button.vue";
import Table from "@/components/global/Table.vue";
import Dialog from "@/components/global/Dialog.vue";
import pMessage from "@/components/global/message/index.js";
import {useUserList,useGetUserDetail,useUpdateUserStatus,useDeleteUser} from "@/api/admin/user.js";
import { formatTime } from "@/utils/timeUtils";
import Drawer from "@/components/global/Drawer.vue";
import BaseUrl from "@/utils/BaseUrl";


const tableData = ref([])
const paginateList = ref({})
const query = ref({
    page: 1,
    per_page: 10,
    name: null,
    email: null
})
const DataList = ref([])
const getDataList = async (data) => {
    if (data) {
        query.value.page = item.pageNum
        query.value.per_page = item.pageSize
    }
    const res = await useUserList(query.value)
    tableData.value = res.data.data
    paginateList.value = {
    total: res.data.total,
    pageNum: res.data.current_page,
    pageSize: res.data.per_page
  }

  DataList.value = tableData.value.map(item => ({
        ...item,
        status: item.status == '1' ? '启用' : '禁用',
        create_time: formatTime(item.create_time),
        update_time: formatTime(item.update_time),
        phone: item.phone ? item.phone : '暂无',
        gender: item.gender === null ? '未知' : item.gender
  }))
}
getDataList(null)

const reset = () => {
    query.value = {
        page: 1,
        per_page: 10,
        name: null,
        email: null
    }
    getDataList(null)
}

// 表头
const column = ref([
  '用户Id', '用户昵称', '用户邮箱', '当前状态', '电话号码', '用户头像', '用户性别', '更新时间', '创建时间'
])

// 需要显示的字段
const useIndex = ref([
  'id', 'name', 'email', 'status', 'phone', 'avatar', 'gender', 'update_time', 'create_time'
])


const drawerRef = ref()
const currentColumnItem = ref({})
const show = async (item) => {
    const res = await useGetUserDetail(item.id)
    drawerRef.value.show()
    currentColumnItem.value = res.data[0]
    console.log(res);
    
    
}

//检查图片是否存在
const CheckImgExists = (imgurl) => {
  let ImgObj = new Image(); //判断图片是否存在
  ImgObj.src = imgurl;
  //加了一个onload事件，赋值成功后进行加载之后获取宽高，
  if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
    return true
  } else {
    return false
  }
}

// 修改状态
const setStatus = async () => {
    await useUpdateUserStatus(currentColumnItem.value.id)
    pMessage.success('修改成功')
    getDataList(null)
}

// 删除
const del = async (item) => {
    await useDeleteUser(item.id)
    pMessage.success('删除成功')
    getDataList(null)
}

</script>

<template>
  <div class="container">
    <div class="header">
      <form @submit.prevent="getDataList(null)">
        <label>根据昵称查询: </label>
        <input type="text" v-model="query.name">

        <label>根据邮箱查询: </label>
        <input type="text" v-model="query.email">

        <Button style="margin-right: 5px" text="搜索" color="primary" type="submit"></Button>
        <Button text="重置" color="info" type="reset" @onClicked="reset"></Button>
      </form>
    </div>

    <div class="data-display">
      <!--      自定义表格-->
      <Table
          class="table"
          :data="DataList"
          :index="true"
          :useIndex="useIndex"
          :column="column"
          :page="paginateList"
          imgColumn="avatar"
          editBtn="查看"
          delBtn="删除"
          @paginate="getDataList"
          @edit="show"
          @del="del"
      ></Table>
    </div>
  </div>

    <Drawer title="用户详情" ref="drawerRef">
        <div class="drawer-detail">
            <div>用户昵称: {{ currentColumnItem.name }}</div>
            <div>
                <img v-if="CheckImgExists(BaseUrl + currentColumnItem.avatar)" :src="BaseUrl + currentColumnItem.avatar" alt="">
                <img v-else src="@/assets/no_data.png"  style="width: 60px;">
            </div>
            <div>用户邮箱: {{ currentColumnItem.email }}</div>
            <div>用户Id: {{ currentColumnItem.id }}</div>
            <div>用户性别: {{ currentColumnItem.gender === null ? '未知' : currentColumnItem.gender }}</div>
            <div>用户电话: {{ currentColumnItem.phone }}</div>
            <div>用户状态: {{ currentColumnItem.status=== 1 ? '启用' : '禁用' }}</div>
            <div>创建时间: {{ formatTime(currentColumnItem.create_time) }}</div>
            <div>更新时间: {{ formatTime(currentColumnItem.update_time) }}</div>
            <div>用户生日: {{ formatTime(currentColumnItem.birthday) }}</div>
            <Button :text="currentColumnItem.status=== 1 ? '禁用' : '启用'" type="button" @onClicked="setStatus"></Button>
        </div>
    </Drawer>
</template>

<style scoped lang="scss">

.post-dialog {
  label {
    margin: 20px;
  }
  select {
    width: 200px;
    height: 30px;
    border-radius: 3px;
    border: 1px solid #d7d7d7;
  }
  input {
    width: 300px;
    height: 30px;
    border-radius: 5px;
    border: 1px solid #d7d7d7;
  }
}

.detail {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 30px;
  span {
    font-size: large;
    color: #606060;

  }

}
.item-detail {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 30px;
  margin-bottom: 50px;
  span {
    font-size: large;
    color: #606060;

  }
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

    input {
      border: 1px solid rgb(211, 210, 210);
      border-radius: 5px;
      width: 10%;
      height: 30px;
      margin-right: 1%;
      color: #c2c1c1;
    }

    label {
      margin-right: 10px;
    }
  }
}
.drawer-detail {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(5, 1fr);
    gap: 30px;
    div {
        font-size: large;
        color: #606060;
        text-align: left;
        align-content: center;
        img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 10px;
            box-shadow: 0 0 5px #dadada;
            border: 1px solid #dadada;
            margin-left: 50px;
        };
    }
}
</style>
