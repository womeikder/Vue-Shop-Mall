<script setup>
import {computed, onMounted, ref, toRef, toRefs, watch} from "vue";
import Button from "@/components/global/Button.vue";
import Icon from "@/components/global/Icon.vue";
import Dialog from "@/components/global/Dialog.vue";
import BaseUrl from "@/utils/BaseUrl.js";

const props = defineProps({
  // 表头的字段
  column: {
    type: Array
  },
  // 是否包含序号
  index: {
    type: Boolean,
    default: false
  },
  // 分页组件
  pagination: {
    type: Boolean,
    default: true
  },
  // 表头颜色
  headColor: {
    type: String,
    default: 'white'
  },
  // 斑马线
  stripe: {
    type: Boolean,
    default: false
  },
  // 需要使用的字段名称
  useIndex: {
    type: Array
  },
  imgColumn: {
    type: String,
    default: null
  },
  // 表格的数据
  data: {
    type: Array
  },
  // 分页相关参数
  page: {
    type: Object,
    default: () => ({
      total: 50,
      pageNum: 1,
      pageSize: 10
    })
  },
  editBtn: {
    type: String,
    default: '编辑'
  },
  delBtn: {
    type: String,
    default: '删除'
  }
})

const emit = defineEmits(['paginate','edit','del'])

// 分页的查询数据
const paginateQuery = ref({
  total: props.page.total,
  pageNum: props.page.pageNum,
  pageSize: props.page.pageSize
})



// 当分页数据发生改变时，传递数据到父组件
const paginateChange = () => {
  if (paginateQuery.value) {
    paginateQuery.value.pageNum =  parseInt(paginateQuery.value.pageNum) ? parseInt(paginateQuery.value.pageNum) : null
    paginateQuery.value.pageSize =  parseInt(paginateQuery.value.pageSize) ? parseInt(paginateQuery.value.pageSize) : null
  } else {
    paginateQuery.value = null
  }
  emit('paginate', paginateQuery.value)
}

// 监听变化
watch(paginateQuery, (newValue) => {
  paginateChange()
},{deep: true})

// 修改分页的页码
const changeNum = (num) => {
  if (num < 1 || num > Math.ceil(props.page.total / props.page.pageSize)) return
  paginateQuery.value.pageNum = num
}

// 操作按钮
const edit = (item) => {
  emit('edit',item)
}
const del = (item) => {
  emit('del',item)
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

// 显示图片
const imgDialog = ref()
const dialogShowUrl = ref()
const LookImg = (url) => {
  dialogShowUrl.value = url
  imgDialog.value.show()
}

</script>

<template>
<div class="body">
  <table :style="{ background: `${props.color}` }">
    <thead>
      <tr :style="{ background: `${props.headColor}` }">
        <!-- 如果启用了序号显示 -->
        <th v-if="index">#</th>
<!--        表头字段-->
        <th v-for="item in props.column" >{{ item }}</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item,index) in data">
        <!-- 显示序号 -->
        <td v-if="props.index">{{ index + 1 }}</td>
<!--        数据展示-->
        <td v-for="inner in props.useIndex">
          <p v-if="props.imgColumn == inner" style="display: flex; align-items: center; justify-content: center; cursor: pointer" @click="LookImg(BaseUrl + item[inner])">
            <img v-if="CheckImgExists(BaseUrl + item[inner])" :src="BaseUrl + item[inner]" style="width: 60px;">
            <img v-else src="@/assets/no_data.png"  style="width: 60px;">
          </p>
          <p v-else>{{ item[inner] }}</p>
        </td>
        <td>
          <button @click="edit(item)" class="text-button">{{ props.editBtn }}</button>
          <button @click="del(item)" class="text-button">{{ props.delBtn }}</button>
        </td>
      </tr>
    </tbody>
  </table>

<!--  分页功能-->
  <div v-if="props.pagination" class="paginate">
    <span>总共{{ props.page.total }}条数据</span>
    <select v-model="paginateQuery.pageSize">
      <option value="10">10条每页</option>
      <option value="20">20条每页</option>
      <option value="30">30条每页</option>
      <option value="50">50条每页</option>
    </select>

<!--    修改页码-->
    <div>
      <span @click="changeNum(paginateQuery.pageNum - 1)">
        <Icon style="cursor: pointer" name="paginate-left" :size="15"></Icon></span>
      <span v-for="item in 5" :key="item" @click="changeNum(item)" :class="{light: item === paginateQuery.pageNum}">
        <p class="link">{{ item }}</p>
      </span>
      <span @click="changeNum(paginateQuery.pageNum + 1)">
        <Icon style="cursor: pointer" name="paginate-right" :size="15"></Icon></span>
    </div>

<!--    输入跳转-->
    <span>总共{{ Math.ceil(props.page.total / props.page.pageSize) }}页</span>
    <input v-model="paginateQuery.pageNum" class="goto" type="number" placeholder="输入跳转的页码">
  </div>
</div>
  <Dialog ref="imgDialog" title="查看图片">
    <img v-if="CheckImgExists(dialogShowUrl)" :src="dialogShowUrl" style="width: 60vw;">
    <img v-else src="@/assets/no_data.png"  style="width: 40vw;">
  </Dialog>
</template>

<style scoped lang="scss">
.body {
  width: 98%;
  height: 81vh;
  background: white;
  margin: 20px auto;
  border-radius: 5px;
  box-shadow: 0 0 5px #dadada;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: smaller;
  color: #606060;

  table {
    margin: 20px;
    width: 98%;
    line-height: 40px;
    text-align: center;
    border-collapse: collapse;
    td {
      border-top: 1px solid rgba(128, 128, 128, 0.2);
    }
    tr:nth-child(even) {
      background: rgb(248, 252, 255);
    }
  }
}

.body::-webkit-scrollbar {
  width: 10px;
}
.body::-webkit-scrollbar-thumb {
  background: rgba(174, 120, 219, 0.58);
  border-radius: 5px;
}
.body::-webkit-scrollbar-track {

  border-top-right-radius: 5px;
  background: rgba(219, 240, 246, 0.73);
}

.paginate {
  height: 30px;
  width: 100%;
  background: rgba(186, 232, 199, 0.34);
  display: flex;
  justify-content: right;
  margin-top: 20px;
  text-align: center;
  align-items: center;
  margin-bottom: 20px;
  span {
    margin-right: 50px;
    display: inline-block;
    a {
      text-decoration: none;
      color: pink;
    }
  }
  select {
    border-radius: 5px;
    margin-right: 50px;
    background: rgba(208, 232, 222, 0);
    width: 150px;
    height: 30px;
    border: 1px solid #e5d921;
  }
}

.text-button {
  border: none;
  background: none;
  cursor: pointer;
  color: #4395F9;
}
.text-button:hover {
  opacity: 0.7;
}

.goto {
  width: 110px;
  height: 25px;
  margin-right: 50px;
  margin-left: -30px;
  border: 1px solid #c5c5c5;
  border-radius: 5px;
}

.link {
  cursor: pointer;
  margin: 10px -10px;
}

.light {
  color: #4395F9;
}


</style>
