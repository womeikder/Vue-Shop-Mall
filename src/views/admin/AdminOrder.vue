<script setup>
import { ref, watch } from "vue";
import Button from "@/components/global/Button.vue";
import Table from "@/components/global/Table.vue";
import Dialog from "@/components/global/Dialog.vue";
import { useGetOrderList, useOrderDetail, useOrderPost } from "@/api/admin/order.js";
import pMessage from "@/components/global/message/index.js";
import { useUserList } from "@/api/admin/user.js";

// 表头
const column = ref([
  '订单编号', '总金额', '订单状态', '订单地址', '快递类型', '快递号', '支付时间', '支付方式', '交易单号', '下单时间'
])

// 需要显示的字段
const useIndex = ref([
  'order_no', 'amount', 'status', 'address', 'express_type', 'express_no', 'pay_time', 'pay_type', 'trade_no', 'create_time'
])
const userList = ref([])
const paginateList = ref({})
const DataList = ref([])
const tableData = ref([])
const query = ref({
  user_id: null,
  status: null,
  per_page: null,
  page: null,
})
const statusEmu = ref({
  1: '待付款',
  2: '待发货',
  3: '待收货',
  4: '待评价',
  5: '已完成',
  6: '已取消'
})

const getUserList = async () => {
  const res = await useUserList(null)
  userList.value = res.data
}
getUserList()

const getDataList = async (item) => {
  if (item) {
    query.value.page = item.pageNum
    query.value.per_page = item.pageSize
  }


  const res = await useGetOrderList(query.value)
  DataList.value = res.data.data
  paginateList.value = {
    total: res.data.total,
    pageNum: res.data.current_page,
    pageSize: res.data.per_page
  }

  tableData.value = DataList.value.map(item => ({
    ...item,
    status: statusEmu.value[item.status],
    create_time: item.create_time ? item.create_time.substring(0, 10) : ''
  }))
}

getDataList(null)

const postDialogRef = ref()
const postQuery = ref({})
const post = async (item) => {
  if (item.status === '已发货') {
    pMessage.warning('快递已经发货')
  } else if (item.status === '已下单') {
    pMessage.warning('等待用户支付后才可发货')
  } else if (item.status === '已收货') {
    pMessage.warning('订单已经完成')
  } else {
    postDialogRef.value.show()
    postQuery.value.id = item.id
  }
}
const postConfirm = async () => {
  await useOrderPost(postQuery.value)
  pMessage.success("快递已发货")
  getDataList(null)
}


const orderDetailRef = ref()
const orderDetail = ref({})
const userName = ref('')
const detail = async (item) => {
  const res = await useOrderDetail(item.id)
  orderDetail.value = res.data[0]
  orderDetailRef.value.show()
  userName.value = orderDetail.value.user.name
}


</script>

<template>
  <div class="container">
    <div class="header">
      <form @submit.prevent="getDataList(null)">
        <label>根据用户查询: </label>
        <select v-model="query.user_id">
          <option value="null">用户</option>
          <option :value="item.id" v-for="item in userList">{{ item.name }}</option>
        </select>

        <label>根据状态查询: </label>
        <select v-model="query.status">
          <option value="null">状态</option>
          <option :value="parseInt(index)" v-for="(item, index) in statusEmu">{{ item }}</option>
        </select>

        <Button style="margin-right: 5px" text="搜索" color="primary" type="submit"></Button>
        <Button text="重置" color="info" type="reset"></Button>
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
        :page="paginateList"
        editBtn="发货" 
        delBtn="详情" 
        @paginate="getDataList" 
        @edit="post" 
        @del="detail"
        >
      </Table>
    </div>
  </div>
  <Dialog title="发货信息" ref="postDialogRef" @agree="postConfirm">
    <p class="post-dialog">
      <label>选择快递类型</label>
      <select v-model="postQuery.express_type">
        <option value="SF">顺丰</option>
        <option value="YT">圆通</option>
        <option value="YD">韵达</option>
      </select>
      <label>输入快递单号</label>
      <input type="text" placeholder="输入快递单号" v-model.trim="postQuery.express_no">
    </p>
  </Dialog>
  <Dialog title="订单详情" ref="orderDetailRef">
    <h1>订单明细</h1>
    <div class="detail">
      <span>订单总金额: {{ orderDetail.amount }}</span>
      <span v-if="orderDetail.address">收货地址: {{ orderDetail.address }}</span>
      <span v-if="orderDetail.express_type">快递公司: {{ orderDetail.express_type }}</span>
      <span v-if="orderDetail.express_no">快递单号: {{ orderDetail.express_no }}</span>
      <span>下单用户: {{ userName }}</span>
      <span>交易单号: {{ orderDetail.trade_no }}</span>
      <span v-if="orderDetail.pay_type">支付类型: {{ orderDetail.pay_type }}</span>
      <span v-if="orderDetail.pay_time">支付时间: {{ orderDetail.pay_time }}</span>
      <span>订单状态: {{ statusEmu[orderDetail.status] }}</span>
      <span>下单日期: {{ orderDetail.create_time ? orderDetail.create_time.substring(0, 10) : '' }}</span>

    </div>
    <h1>商品明细</h1>
    <div v-for="item in orderDetail.order_detail" class="item-detail">
      <span>下单数量: {{ item.number }}</span>
      <span>商品总价: {{ item.price }}</span>
      <span>商品名称: {{ item.goods.goods_name }}</span>
      <span>商品单价: {{ item.goods.price }}</span>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100vh;
}

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

    select {
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
</style>
