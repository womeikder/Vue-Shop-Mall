<script setup>
import {ref} from "vue";
import pMessage from "@/components/global/message/index.js";
import {getCommentList} from "@/api/admin/comment";
import baseUrl from "@/utils/BaseUrl";
import Icon from "@/components/global/Icon.vue";
import { formatTime } from "@/utils/timeUtils";
import {useReplyComment} from "@/api/admin/comment";


const tableData = ref([])
const getDataList = async () => {
  const res = await getCommentList(null)
  tableData.value = res.data.data
  tableData.value.map(item => {
    item.oldReply = item.reply
  })
}
getDataList()


// 商家回复
const submitReply = async (item) => {
  if (item.reply === item.oldReply) {
    return
  }
  const res = await useReplyComment(item.id, item.reply)
  pMessage.success(res.msg)
  getDataList()
}

</script>

<template>
  <div class="admin-comment">
    <div class="card" v-for="item in tableData" :key="item.id">


        <div class="card-img" v-if="item.pics">
          <div class="card-img-item" v-for="(img, index) in item.pics">
            <img :src="baseUrl + img" alt="" />
          </div>
        </div>
        <div class="no-img" v-else>
            <img src="@/assets/no_data_1.jpg" alt="">
        </div>


        <div class="card-content">
          <div class="user-content">
            <span>商品名称: {{ item.goods.goods_name }}</span>
            <h1>评论内容 </h1>
            <div class="text">{{ item.content }}</div>
            <div class="time">{{ formatTime(item.create_time) }}</div>
          </div>



          <div class="admin-content">
            <div class="star">
              <span style="margin-right: 10px;">评价星级: </span>
              <Icon v-for="i in item.rate" name="star-highlight" size="20"></Icon>
              <div class="username">
                <span style="margin-right: 10px;">用户昵称: </span>
                <span>{{ item.user.name }}</span>
              </div>
            </div>


            <div>
              <h1>商家回复</h1>
            <div class="text">
              <textarea class="textarea" @blur="submitReply(item)" v-model="item.reply"></textarea>
            </div>
            </div>


          </div>

        </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.admin-comment {
  height: 94%;
  width: 100%;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.card {
  width: 97%;
  height: 200px;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ffffff;
  border-radius: 10px;
  background: white;
  margin: 0 auto;
  box-shadow: 0 0 10px #d1d1d1;
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: 1fr 3fr;
}
.card-img {
  height: 200px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  box-shadow: 0 0 20px pink;
}
.no-img {
  display: grid;
  height: 200px;
  box-shadow: 0 0 20px pink;
  grid-template-columns: 1fr;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
  }
}
.card-img-item {
  height: 95px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
  }
  &:hover {
    transform: scale(1.1);
    transition: all 1s;
  }
}

.card-content {
  height: 200px;
  display: flex;
  flex: 1;
  margin:0 20px;
}

.user-content {
  height: 200px;
  width: 70%;
}
.admin-content {
  height: 200px;
  width: 50%;
  .star {
    display: flex;
    margin-left: -100px;
    position: relative;
    .username {
      position: absolute;
      right: 10px;
    }
  }
}


.card-button {
  height: 200px;
  box-shadow: 0 0 20px rgb(218, 218, 218);
  border-radius: 5px;
}

.text {
  width: 95%;
  height: 40%;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 20px;
  text-indent: 2em;
  font-size: small;
  margin-left: 2%;
}

.textarea {
  width: 80%;
  height: 100px;
  border: 1px solid #d1d1d1;
  outline: none;
  resize: none;
  padding: 5px;
  margin-top: 5px;
  border-radius: 5px;
  box-shadow: 0 0 10px #d1d1d1;
  color: rgb(109, 109, 109);
}
.textarea:focus {
  box-shadow: 0 0 10px #c1edf8;
  outline: none;
  border: 1px solid #c1edf8;
  transition: all 1s;
  transform: scale(1.1);
}
.time {
  margin-top: 10px;
  color: rgb(109, 109, 109);
  font-size: small;
  margin-left: 2%;
}
</style>
