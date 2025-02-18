<script setup>

import {onMounted, ref, watch} from "vue";
import Icon from "@/components/global/Icon.vue";
import FloatBox from "@/components/global/FloatBox.vue";
import {useRouter, useRoute} from "vue-router";
import {getNowUserInfo, useUpdateUserInfo} from "@/api/admin/user.js";
import BaseUrl from "@/utils/BaseUrl.js";
import Popover from "@/components/global/Popover.vue";
import ImgUpload from "@/components/global/ImgUpload.vue";
import pMessage from "@/components/global/message/index.js";
import Button from "@/components/global/Button.vue";

let prefersDarkScheme = null
let layout = null
let aside = null
onMounted(() => {
  prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')
  layout = document.querySelector('#layout')
  aside = document.querySelector('#aside')

  if (JSON.parse(localStorage.getItem('sync_system'))) {
    if (prefersDarkScheme) {
      layout.dataset.theme = 'dark'
      aside.dataset.theme = 'dark'
    } else {
      layout.dataset.theme = 'light'
      aside.dataset.theme = 'light'
    }
  } else {
    layout.dataset.theme = localStorage.getItem('theme') || 'light'
    aside.dataset.theme = localStorage.getItem('theme') || 'light'
  }
})

const updateTheme = (isDark, isSyncSystem) => {
  layout.dataset.theme = isDark ? 'dark' : 'light'
  aside.dataset.theme = isDark ? 'dark' : 'light'
  localStorage.setItem('sync_system', isSyncSystem)
  localStorage.setItem('theme', layout.dataset.theme)
}

const light = () => {
  updateTheme(false, false)
}
const night = () => {
  updateTheme(true, false)
}

const follow = () => {
  updateTheme(prefersDarkScheme.matches, true)
}

const floatBoxRef = ref(null)
const floatBoxStatus = ref(false)
const asideButton = ref()
const asideButtonOperation = (type) => {
  if (type === 0) {
    asideButton.value = 0
  } else {
    asideButton.value = 1
  }
  floatBoxStatus.value = true

  if (!floatBoxRef.value) return

  floatBoxRef.value.show()
}

// 用户信息
const CurrentUserInfo = ref({})


const menu = [
  { id: 1, router: 'index', name: '首页', icon: 'data-b'},
  { id: 2, router: 'goods', name: '商品管理', icon: 'goods-start-to-ship-fill'},
  { id: 3, router: 'order', name: '订单管理', icon: 'order'},
  { id: 4, router: 'category', name: '分类管理', icon: 'category'},
  { id: 5, router: 'comment', name: '评论管理', icon: 'comment'},
  { id: 6, router: 'slide', name: '轮播管理', icon: 'img-fill'},
  { id: 7, router: 'user', name: '用户管理', icon: 'user'},
]

const router = useRouter()
const route = useRoute()
// 跳转路由
const jumpRouter = (type) => {
  router.push(`/admin/${type}`)
}

const headerStatus = ref(null)

// 获取用户的信息，并且将默认图片传入
const imgList = ref([])
const getUserInfo = async () => {
  const res = await getNowUserInfo()
  CurrentUserInfo.value = res.data
  imgList.value.push(CurrentUserInfo.value.avatar) 
}
getUserInfo()

// 更新用户数据
const updateUser = async (url) => {
  CurrentUserInfo.value.avatar = url
  const res = await useUpdateUserInfo(CurrentUserInfo.value)
  pMessage.success(res.msg)
  getUserInfo()
}

const headerName = ref('首页')
watch(route, () => {
  menu.map((item) => {
    if (item.router === route.path.substring(route.path.lastIndexOf('/')+1)) {
      headerName.value = item.name
    }
  })
})

// 退出登录
const logout = () => {
  router.push('/admin/login')
  localStorage.clear()
}

</script>

<template>
  <div class="layout" id="layout">
    <aside class="aside" id="aside">
      <div class="up"></div>
      <div class="medium">
        <ul>
          <li v-for="(item, index) in menu" :class="{ 'aside-highlight': item.router === route.path.substring(route.path.lastIndexOf('/')+1) ? true : false }" :key="item.id" @click="jumpRouter(item.router)">
            <Icon :name="item.icon" size="20"></Icon>
            <span>{{ item.name}}</span>
          </li>
        </ul>
      </div>
      <div class="bottom">
        <div class="float-box" v-if="floatBoxStatus">
          <FloatBox left="50" top="500" weight="200" ref="floatBoxRef">
            <div v-if="!asideButton" class="asideButton">
              <button @click="light">日间模式</button>
              <button @click="night">夜晚模式</button>
              <button @click="follow">跟随系统</button>
            </div>
            <div v-else>
              帮助
            </div>
          </FloatBox>
        </div>

        <div class="color" @click="asideButtonOperation(0)">
          <Icon name="light-fill" size="20"></Icon>
        </div>
        <div class="help" @click="asideButtonOperation(1)">
          <Icon class="icon" name="help" size="20"></Icon>
        </div>

      </div>
    </aside>
    <section class="body">
      <header class="header">
        <div class="logo">
          <Icon name="online-shop" size="30"></Icon>
          <div class="header-name">
            {{ headerName }}
          </div>
        </div>
        <div class="navigation">

<!--          自定义的popover组件显示右上角的信息-->
          <Popover>
            <template #trigger>
              <div class="avatar" data-slot="customSlot" >
                <img :src="BaseUrl + CurrentUserInfo.avatar"  alt="" v-if="CurrentUserInfo.avatar">
                <img src="@/assets/icons/avatar.svg" alt="" v-else>
              </div>
            </template>
            <ImgUpload showSize="1" @upload-success="updateUser" :imgList="imgList"></ImgUpload>
          </Popover>

          <div class="information" @click="headerStatus(1)">
            <Popover>
              <template #trigger>
                <Icon name="inform" size="20"></Icon>
              </template>
              test
            </Popover>

          </div>


          <div class="user">
            <Popover>
              <template #trigger>
                <Icon data-slot="customSlot" name="admin" size="20"></Icon>
              </template>
              <div class="user-set">
                <p>
                  <label>用户昵称:</label>
                  <input type="text" v-model="CurrentUserInfo.name">
                </p>

                <p>
                  <label>用户电话:</label>
                  <input type="text" v-model="CurrentUserInfo.phone">
                </p>

                <p>
                  <label>用户性别:</label>
                  <select v-model="CurrentUserInfo.gender">
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </p>

                <p>
                  <label>用户生日:</label>
                  <input type="date" v-model="CurrentUserInfo.birthday">
                </p>

              </div>
              <Button text="更改信息" type="button" color="primary" @onClicked="updateUser(null)" style="margin-right: 30%;"></Button>
              <Button text="退出登录" type="button" color="info" @onClicked="logout"></Button>
            </Popover>
          </div>
        </div>
      </header>

<!--      主页面-->
      <article class="main">
        <router-view></router-view>
      </article>
    </section>
  </div>
</template>

<style lang="scss" scoped>
:root{
  overflow: hidden;
}
[data-theme="light"] {
  --background-color: #ffffff;
  --aside-color: rgba(235, 245, 254, 0.23);
  --font-color: black;
  --header-color: rgba(175, 241, 237, 0.36)
}
[data-theme="dark"] {
  --background-color: rgb(12, 27, 51);
  --aside-color: rgb(20, 29, 65);
  --font-color: white;
  --header-color: #224f75
}
.aside-highlight {
  background: lightskyblue;
}
.layout {
  width: 100vw;
  height: 100vh;
  background: var(--background-color);
  color: var(--font-color);
  display: flex;
  overflow: hidden;
  
  .aside {
    width: 8%;
    height: 100%;
    background: var(--aside-color);
    color: var(--font-color);
    border-right: 1px solid var(--background-color);
    .up {
      margin-top: 20px;
      height: 10%;
      width: 100%;
      background-image: url("@/assets/logo_dog.png");
      background-repeat: no-repeat;
      background-size: 60% 100%;
      background-position: center;
    }
    .medium {
      margin: 50px 0;
      width: 100%;
      ul {
        margin: 0;
        padding: 0;
        li {
          height: 40px;
          align-items: center;
          display: flex;
          justify-content: space-around;
          margin: 20% 10px;
          border-radius: 10px;
          cursor: pointer;
        }
        li:hover {
          background: lightskyblue;
        }
      }
    }
    .bottom {
      height: 10%;
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      text-align: center;
      padding-top: 40%;
      .float-box {
        width: 200px;
        height: auto;
        position: fixed;
        left: 50px;
        bottom: 100px;
        border-radius: 10px;
        box-shadow: 0 0 25px grey;
        background: white;
        .asideButton {
          button {
            margin-top: 20px;
            width: 95%;
            height: 40px;
            border: none;
            border-radius: 10px;
            margin-bottom: 10px;
          }
          button:hover {
            background: lightskyblue ;
          }
        }
      }
      .color {
        width: 30px;
        height: 30px;
        align-content: center ;
        border-radius: 50%;
        transition: all 1s;
        .icon {
          margin-left: 4px;
        }
      }
      .color:hover {
        background: rgba(98, 180, 210, 0.8);
      }
      .help {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        align-content: center ;
        transition: all 1s;
        .icon {
          margin-left: 5px;
        }
      }
      .help:hover {
        background: rgba(98, 180, 210, 0.8);
      }
    }
  }
  .body {
    width: 95%;
    height: 100%;
    .header {
      width: 100%;
      height: 4%;
      background: var(--header-color);
      align-items: center;
      position: relative;
      border-bottom-left-radius: 10px ;
      border-bottom-right-radius: 10px;
      display: flex;
      justify-content: space-between;
      .logo {
        width: 130px;
        display: flex;
        justify-content: space-between;
        margin-left: 10px;
        .header-name {
          align-content: center;
          font-size: larger;
          font-weight: bold;
          font-family:cursive
        }
      }

      .navigation {
        width: 100px;
        margin-right: 2%;
        display: flex;
        margin-top: 5px;
        justify-content: space-between;

        .information, .user, .avatar {
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          transition: background-color 0.5s;
          img {
            width: 20px;
            height: 20px;
            border-radius: 50%;
          }
        }
        .information:hover, .user:hover, .avatar:hover {
          background: rgba(159, 195, 229, 0.8);
        }
      }
    }
  }
}

.user-set {
  width: 300px;
  line-height: 30px;
  input {
    border-radius: 5px;
    width: 200px;
    height: 30px;
    margin-left: 10px;
  }
}
.main {
  padding-top: 20px;
  height: 100vh;
  background: #F7FAFC;
}
</style>
