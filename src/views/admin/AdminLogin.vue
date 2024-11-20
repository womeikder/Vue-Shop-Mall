<script setup>
import {onMounted, ref} from "vue";
import Dialog from "@/components/global/Dialog.vue";
import {AdminLogin, AdminRegister} from "@/api/admin/login.js";
import {useUserStore} from "@/stores/index.js";
import pMessage from "@/components/global/message/index.js";
import {useRouter} from "vue-router";
import {md5} from "js-md5";
import {getNowUserInfo} from "@/api/admin/user.js";



// 登陆注册状态切换
const status = ref(true)
const change = () => {
  formData.value = {}
  status.value = !status.value
}

// 表单数据
const formData = ref({
  username: '',
  email: '',
  password: '',
  rePassword: '',
  remember: false,
  agree: false
})

// 在页面渲染完成后将本地存储的密码邮箱给到表单中
onMounted(() => {
  // 获取数据
  const loginInfo = JSON.parse(localStorage.getItem('loginInfo'))
  if (loginInfo) {
    // 判断是否过期
    if (loginInfo.expirationDate < new Date().getTime()) return

    formData.value.email = loginInfo.email
    formData.value.password = loginInfo.password
  }
})

const router = useRouter()
const userStore = useUserStore()

// 提交按钮，发送请求
const submit = async (type) => {
  // 登录
  if (type) {

    // 先获取存储中的数据，如果表单相同就证明是已经加密过的数据，不需要再次加密
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'))
    let pass = loginInfo.password === formData.value.password ? formData.value.password : md5(formData.value.password)

    // 发送请求
    const res  = await AdminLogin({
      email: formData.value.email,
      password: pass
    })



    // 如果标记了记住我
    if (formData.value.remember) {

      // 也是判断数据的相同性来决定是否加密
      const getLoginInfo = JSON.parse(localStorage.getItem('loginInfo'))
      let pass = getLoginInfo.password === formData.value.password ? formData.value.password : md5(formData.value.password)

      // 设置7天的过期时间
      const now = new Date();
      const expirationDate = new Date(now.getTime()+(7 * 24 * 60 * 60 * 1000));

      // 存储数据的格式
      const loginInfo = {
        email: formData.value.email,
        password: pass,
        expirationDate: expirationDate.getTime()
      }
      localStorage.setItem('loginInfo', JSON.stringify(loginInfo))
    }

    // 将后端返回的token给到pinia中在请求拦截器前会携带
    userStore.setToken(res.data.data.token_type + ' ' + res.data.data.access_token)

    // 获取当前登录用户的数据并且存入到token中
    const currentUserInfo = await getNowUserInfo()
    userStore.currentUserInfo.value = currentUserInfo.data.data

    // 发送消息，并跳转路由
    pMessage.success(res.data.msg)
    router.push('/admin/layout')
  } else {
    // 注册

    // 验证表单的数据
    if (!formData.value.agree) {
      DialogRef.value.show()
      return
    }
    if (formData.value.password !== formData.value.rePassword) {
      console.log(formData.value.password, formData.value.rePassword)
      pMessage.error('两次密码输入不相同!')
      return
    }

    // 发送请求
    const res  = await AdminRegister({
      name: formData.value.username,
      email: formData.value.email,
      password: md5(formData.value.password)
    })

    console.log(res)

    // 跳转到登录页
    formData.value = {}
    status.value = true

    pMessage.success(res.data.msg)
  }

}

// 注册时的服务条款
const DialogRef = ref()
const clause = () => {
  DialogRef.value.show()
}
// 弹框返回的数据
const agree = () => {
  formData.value.agree = true
}
</script>

<template>
  <div class="container">
    <div class="login-box">

<!--      登录-->
      <div class="login" v-if="status">
        <h1>登录</h1>
        <form id="login" @submit.prevent="submit(true)" >
          <label>邮箱</label>
          <input id="email" type="email" v-model.trim="formData.email" required>
          <label>密码</label>
          <input id="password" type="password" v-model.trim="formData.password" required pattern="^\S*(?=\S{6,})(?=\S*\d)(?=\S*[a-z])\S*$">
          <div class="tips">
            <div class="remember">
              <input type="checkbox" v-model="formData.remember">
              <span>记住我</span>
            </div>
            <div class="change">
              <span>还没有账户吗? </span>
              <a @click="change">在此注册</a>
            </div>
          </div>
          <button class="submit" type="submit">登录</button>
        </form>
      </div>

<!--      注册-->
      <div class="register" v-else>
        <h1>注册</h1>
        <form id="register" @submit.prevent="submit(false)">
          <label>用户名</label>
          <input type="text" v-model="formData.username" required>
          <label>邮箱</label>
          <input type="email" v-model="formData.email" required>
          <label>密码</label>
          <input type="password" v-model.trim="formData.password" required>
          <label>确认密码</label>
          <input type="password" v-model.trim="formData.rePassword" required>
          <div class="tips">
            <div class="agree">
              <input type="checkbox" v-model="formData.agree">
              <span>我同意 </span>
              <a @click="clause">服务条款</a>
            </div>
            <div class="change">
              <span>已经有账户了? </span>
              <a @click="change">在此登录</a>
            </div>
          </div>
          <button class="submit" type="submit">注册</button>
        </form>
        <Dialog @agree="agree" title="服务条款" ref="DialogRef" button="我同意">
          <span>
            该项目是基于前后端分离开发的一个Vue3项目
            <br>
            项目采用了 router，pinia，axios等工具
            采用vite构建最新版的Vue3项目pnpm包管理工具
            <br>
            项目介绍
            商城项目 分为前台与后台项目
            前台就是商品浏览，购买等常规商城项目页面
            后台为管理人员的管理端，有员工管理，商品，订单管理等等
            <br>
            项目前后端在同时联合开发，后端是基于Laravel10的一个Api项目
          </span>
        </Dialog>
      </div>
    </div>
  </div>
</template>
`
<style scoped>
  .container {
    width: 100vw;
    height: 100vh;
    background-image: url("@/assets/admin/login_background.png");
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    .login-box {
      margin: auto 0;
      width: 500px;
      background: white;
      position: absolute;
      right: 10%;
      top: 10%;
      border-radius: 20px;
      font-weight: bold;
      font-size: large;
      .login, .register {
        h1 {
          text-align: center;
        }
        form {
          margin: 50px 20px;
          input {
            margin: 20px auto;
            display: block;
            height: 40px;
            width: 400px;
            border-radius: 5px;
            font-size: larger;
          }
          .tips {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .remember {
              input {
                height: 20px;
                width: 20px;
                margin-left: 20px;
                margin-right: 20px;
                display: inline-block;
              }
            }
            .agree {
              input {
                height: 20px;
                width: 20px;
                margin-left: 20px;
                margin-right: 20px;
                display: inline-block;
              }

              a {
                color: #486FF8;
                cursor: pointer;
              }

              a:hover {
                color: #0532dc;
                font-weight: bold;
              }
            }
            .change {
              margin-right: 20px;
              a {
                color: #486FF8;
                cursor: pointer;
              }
              a:hover {
                color: #0532dc;
                font-weight: bold;
              }
            }
          }
          .submit {
            width: 450px;
            height: 50px;
            background: #486FF8;
            border: none;
            border-radius: 5px;
            margin: 0 auto;
            transition: all 1s;
          }
          .submit:hover {
            box-shadow: 0 0 20px gray;
          }
        }
      }
    }
  }
</style>
