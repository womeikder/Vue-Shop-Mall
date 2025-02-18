<script setup>
import CheckBox from "@/components/global/CheckBox.vue";
import {computed, ref, watch} from "vue";
import Button from "@/components/global/Button.vue";
import Table from "@/components/global/Table.vue";
import {
  useAddGoods,
  useDeleteGoods,
  useGetGoodsCategoryList,
  useGetGoodsList,
  useUpdateGoods
} from "@/api/admin/goods.js";
import Dialog from "@/components/global/Dialog.vue";
import ImgUpload from "@/components/global/ImgUpload.vue";
import pMessage from "@/components/global/message/index.js";
import MessageBox from "@/components/global/MessageBox.vue";


// 查询参数
const formData = ref({
  status: null,
  goods_name: null,
  recommend: null,
  category_id: null,
  per_page: null,
  page: null,
})

// 状态切换按钮
const changeStatus = (data) => {
  formData.value.recommend = data
}

// 表头
const column = ref([
  '商品名称', '商品标题', '分类名称', '商品详情', '商品价格', '商品库存', '商品封面', '商品状态', '是否推荐', '上架时间'
])

// 需要显示的字段
const useIndex = ref([
  'goods_name', 'title', 'category_name', 'detail', 'price', 'stock', 'cover', 'status', 'recommend', 'create_time'
])

// 处理表格数据的请求
const GoodsList = ref([])
const paginateList = ref({})
const DataList = ref([])
const getGoodsList = async (item) => {
  if (item) {
    formData.value.page = item.pageNum
    formData.value.per_page = item.pageSize
  }
  const res = await useGetGoodsList(formData.value)
  GoodsList.value = res.data.data
  paginateList.value = {
    total: res.data.total,
    pageNum: res.data.current_page,
    pageSize: res.data.per_page
  }
  

  // 格式化数据
  DataList.value = GoodsList.value.map(item => ({
    ...item,
    recommend: item.recommend == '1' ? '推荐' : '不推荐',
    status: item.status == '1' ? '销售中' : '已下架',
    create_time: item.create_time ? item.create_time.substring(0, 10) : ''
  }))
}
getGoodsList(null)

// 分类的相关列表
const categoryList = ref([])
const getGoodsCategory = async () => {
  const res = await useGetGoodsCategoryList()
  categoryList.value = res.data
}
getGoodsCategory()

// 添加商品
const dialogRef = ref()
const addGoods = () => {
  dialogRef.value.show()
}
const addData = ref({
  goods_name: null,
  title: null,
  category_id: null,
  description: null,
  price: null,
  stock: null,
  cover: null,
  pics: [],
  detail: null,
  status: null,
  recommend: null
})

// 在添加商品和修改商品图片的回调函数，来设置图片路径
const dialogRecommend = (data) => {
  addData.value.recommend = data
}

const addCover = (url) => {
  addData.value.cover = url
}

const addPics = (url) => {
  addData.value.pics.push(url)
}

const setCover = (url) => {
  currentColumnItem.value.cover = url
}

const setPics = (url) => {
  currentColumnItem.value.pics.push(url)
}


// 添加用户
const GoodsAdd = async () => {
  if (
      addData.value.goods_name === null ||
      addData.value.title === null ||
      addData.value.price === null ||
      addData.value.stock === null ||
      addData.value.cover === null ||
      addData.value.description === null
  ) {
    pMessage.warning('添加失败,有非空字段未填')
    return
  }
  const res = await useAddGoods(addData.value)
  pMessage.success(res.msg)
  getGoodsList(null)
}

// 更新数据
const GoodsEdit = async () => {
  const res = await useUpdateGoods(currentColumnItem.value)
  pMessage.success(res.msg)
  getGoodsList(null)
  currentColumnItem.value = null
}

// 删除提示框
const MessageRef = ref()
const delCurrentColumnItem = (item) => {
  currentColumnItem.value = item
  MessageRef.value.show()
}

// 设置当前的数据的格式
const currentColumnItem = ref({})
const editGoodsRef = ref()
const setCurrentColumnItem = (item) => {
  editGoodsRef.value.show()
  currentColumnItem.value = item
  currentColumnItem.value.recommend = currentColumnItem.value.recommend === "推荐" ? 1 : 0
  currentColumnItem.value.status = currentColumnItem.value.status === "销售中" ? 1 : 0
  currentColumnItem.value.update_time = null
}

// 删除
const del = async () => {
  if (!currentColumnItem.value) {
    pMessage.error('删除失败，再重新尝试')
  }
  const res = await useDeleteGoods(currentColumnItem.value.id)
  pMessage.success(res.msg)
  getGoodsList(null)
  currentColumnItem.value = null
}

</script>

<template>
  <div class="container">
    <div class="header">
      <form @submit.prevent="getGoodsList(null)">
        <label>商品名称: </label>
        <input v-model="formData.goods_name" placeholder="输入商品名称" type="text">
        <label>商品分类: </label>
        <select v-model="formData.category_id">
          <option value="null">分类</option>
          <option :value="item.id" v-for="item in categoryList">{{ item.name }}</option>
        </select>
        <label>销售状态: </label>
        <select v-model="formData.status">
          <option value="null">状态</option>
          <option value="1">销售中</option>
          <option value="0">已下架</option>
        </select>
        <label>是否推荐: </label>
        <CheckBox @status="changeStatus" class="checkbox"></CheckBox>
        <Button style="margin-right: 5px" text="搜索" color="primary" type="submit"></Button>
        <Button text="重置" color="info" type="reset"></Button>
        <Button style="position: absolute; right: 5%" text="添加商品" type="button" @onClicked="addGoods"
                color="success"></Button>
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
          imgColumn="cover"
          :page="paginateList"
          @paginate="getGoodsList"
          @edit="setCurrentColumnItem"
          @del="delCurrentColumnItem"
      ></Table>
    </div>
  </div>

<!--  自定义弹窗-->
  <Dialog title="添加商品" ref="dialogRef" @agree="GoodsAdd">
    <template #default>
      <p>
        <label>商品名称:</label><input class="input" type="text" v-model="addData.goods_name" placeholder="输入商品名称"
                                       required>
        <label>商品标题:</label><input class="input" type="text" v-model="addData.title" placeholder="输入商品标题"
                                       required>
      </p>

      <p>
        <label>商品分类:</label>
        <select v-model="addData.category_id" class="select">
          <option value="null">分类</option>
          <option :value="item.id" v-for="item in categoryList">{{ item.name }}</option>
        </select>
        <label>商品状态:</label>
        <select v-model="addData.status" class="select">
          <option value="null">状态</option>
          <option value="1">销售中</option>
          <option value="0">已下架</option>
        </select>
        <label>是否推荐: </label>
        <CheckBox @status="dialogRecommend"></CheckBox>
      </p>

      <p>
        <label>商品价格:</label><input class="input" type="text" v-model="addData.price" placeholder="输入商品价格"
                                       required>
        <label>商品库存:</label><input class="input" type="text" v-model="addData.stock" placeholder="输入商品库存"
                                       required>
      </p>

      <p>
        <label>商品描述:</label><textarea class="textarea" v-model="addData.description" placeholder="输入商品描述"
                                          required/>
      </p>

      <p>
        <label>商品详情:</label><textarea class="textarea" v-model="addData.detail" placeholder="输入商品详情"/>
      </p>

      <label>封面图片</label>
      <p style="display: flex; justify-content: left">
        <ImgUpload showSize="1" @upload-success="addCover"></ImgUpload>
      </p>

      <label>商品详情图</label>
      <p style="display: flex; justify-content: left">
        <ImgUpload @upload-success="addPics"></ImgUpload>
      </p>
    </template>

  </Dialog>
  <Dialog title="修改商品" ref="editGoodsRef" @agree="GoodsEdit">
    <template #default>
      <p>
        <label>商品名称:</label><input class="input" type="text" v-model="currentColumnItem.goods_name" placeholder="输入商品名称"
                                       required>
        <label>商品标题:</label><input class="input" type="text" v-model="currentColumnItem.title" placeholder="输入商品标题"
                                       required>
      </p>

      <p>
        <label>商品分类:</label>
        <select v-model="currentColumnItem.category_id" class="select">
          <option value="null">分类</option>
          <option :value="item.id" v-for="item in categoryList">{{ item.name }}</option>
        </select>
        <label>商品状态:</label>
        <select v-model="currentColumnItem.status" class="select">
          <option value="null">状态</option>
          <option value="1">销售中</option>
          <option value="0">已下架</option>
        </select>
        <label>是否推荐: </label>
        <CheckBox @status="dialogRecommend"></CheckBox>
      </p>

      <p>
        <label>商品价格:</label><input class="input" type="text" v-model="currentColumnItem.price" placeholder="输入商品价格"
                                       required>
        <label>商品库存:</label><input class="input" type="text" v-model="currentColumnItem.stock" placeholder="输入商品库存"
                                       required>
      </p>

      <p>
        <label>商品描述:</label><textarea class="textarea" v-model="currentColumnItem.description" placeholder="输入商品描述"
                                          required/>
      </p>

      <p>
        <label>商品详情:</label><textarea class="textarea" v-model="currentColumnItem.detail" placeholder="输入商品详情"/>
      </p>

      <label>封面图片</label>
      <p style="display: flex; justify-content: left">
        <ImgUpload showSize="1" @upload-success="setCover"></ImgUpload>
      </p>

      <label>商品详情图</label>
      <p style="display: flex; justify-content: left">
        <ImgUpload @upload-success="setPics"></ImgUpload>
      </p>
    </template>

  </Dialog>
  <MessageBox ref="MessageRef" @confirm="del">确定要删除当前商品吗?</MessageBox>
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
</style>
