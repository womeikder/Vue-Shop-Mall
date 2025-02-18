<script setup>
import {computed, onMounted, ref, toRef, toRefs, watch, onUnmounted} from "vue";
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

// 修改tooltip显示方法
const showTooltip = (event, content) => {
  // 如果内容为空，不显示tooltip
  if (!content) return;
  
  // 先清除可能存在的tooltip
  hideTooltip();
  
  const tooltip = document.createElement('div');
  tooltip.className = 'global-tooltip'; // 修改class名称
  tooltip.textContent = content;
  document.body.appendChild(tooltip);
  
  // 获取单元格位置
  const rect = event.target.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // 计算tooltip位置
  tooltip.style.left = `${rect.left}px`;
  tooltip.style.top = `${rect.bottom + scrollTop + 5}px`;
}

const hideTooltip = () => {
  const tooltips = document.querySelectorAll('.global-tooltip');
  tooltips.forEach(tooltip => tooltip.remove());
}

// 组件卸载时清除所有tooltip
onUnmounted(() => {
  hideTooltip();
});

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
        <td v-for="inner in props.useIndex" 
            class="table-cell"
            @mouseover="(e) => showTooltip(e, item[inner])"
            @mouseout="hideTooltip">
          <template v-if="props.imgColumn == inner">
            <p style="display: flex; align-items: center; justify-content: center; cursor: pointer" @click="LookImg(BaseUrl + item[inner])">
              <img v-if="CheckImgExists(BaseUrl + item[inner])" :src="BaseUrl + item[inner]" style="width: 60px;">
              <img v-else src="@/assets/no_data.png"  style="width: 60px;">
            </p>
          </template>
          <template v-else>{{ item[inner] }}</template>
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

<style>
/* 注意：这里不使用 scoped，使样式全局生效 */
.global-tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 9999;
  max-width: 300px;
  word-wrap: break-word;
  pointer-events: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>

<style scoped lang="scss">
.body {
  width: 100%;
  min-height: 200px;
  max-height: 85vh;
  margin: 20px auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 14px;
  color: #444;

  table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    line-height: 1.5;
    
    th, td {
      padding: 8px;
      height: 40px !important;
      line-height: 20px !important;
      border-bottom: 1px solid #eee;
      text-align: left;
      width: auto;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: middle;
      
      p {
        height: 40px !important;
        margin: 0 !important;
        padding: 0 !important;
        
        img {
          max-height: 36px !important;
          width: auto;
          object-fit: contain;
        }
      }
    }

    th {
      height: 40px !important;
      line-height: 20px !important;
      font-weight: 500;
      background: #f5f5f5;
    }

    tr {
      &:hover {
        background-color: #f5f7fa;
      }
    }

    th:first-child,
    td:first-child {
      width: 60px;
    }

    th:last-child,
    td:last-child {
      width: 120px;
    }
  }
}

.paginate {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px;
  border-top: 1px solid #eee;
  gap: 24px;

  select {
    padding: 6px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    
    &:hover {
      border-color: #999;
    }
  }

  div {
    display: flex;
    align-items: center;
    gap: 8px;
    
    span {
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      
      &:hover:not(.light) {
        background: #f5f5f5;
      }
      
      &.light {
        background: #e3f2fd;
        color: #1976d2;
      }
    }
  }

  .goto {
    width: 80px;
    padding: 6px;
    border: 1px solid #ddd;
    border-radius: 4px;
    text-align: center;
    
    &:focus {
      border-color: #999;
      outline: none;
    }
  }
}

.text-button {
  padding: 4px 8px;
  border: none;
  background: none;
  color: #1976d2;
  cursor: pointer;
  border-radius: 4px;
  
  &:hover {
    background: #e3f2fd;
  }
  
  & + & {
    margin-left: 8px;
  }
}

img {
  max-width: 100%;
  height: auto;
  vertical-align: middle;
}

.table-cell {
  position: relative;
  cursor: default;
}

table {
  td {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 0;
  }
}
</style>
