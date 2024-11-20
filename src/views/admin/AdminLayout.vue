<script setup>

import {onMounted, ref} from "vue";
import Icon from "@/components/global/Icon.vue";
import FloatBox from "@/components/global/FloatBox.vue";

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

</script>

<template>
  <div class="layout" id="layout">
    <aside class="aside" id="aside">
      <div class="up"></div>
      <div class="medium">
        <ul>
          <li>
            <Icon name="goods-start-to-ship-fill" size="20"></Icon>
            <span>商品管理</span>
          </li>
          <li>
            <Icon name="order" size="20"></Icon>
            <span>订单管理</span>
          </li>
          <li>
            <Icon name="category" size="20"></Icon>
            <span>分类管理</span>
          </li>
          <li>
            <Icon name="comment" size="20"></Icon>
            <span>评论管理</span>
          </li>
          <li>
            <Icon name="img-fill" size="20"></Icon>
            <span>轮播管理</span>
          </li>
          <li>
            <Icon name="user" size="20"></Icon>
            <span>用户管理</span>
          </li>

        </ul>
      </div>
      <div class="bottom">

        <div class="float-box" v-if="floatBoxStatus">
          <FloatBox left="-1600" top="400" weight="200" ref="floatBoxRef">
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
        <nav class="navigation"></nav>
      </header>
      <article class="main"></article>
    </section>
  </div>
</template>

<style scoped>
[data-theme="light"] {
  --background-color: #ffffff;
  --aside-color: rgba(235, 245, 254, 0.23);
  --font-color: black;
}
[data-theme="dark"] {
  --background-color: rgb(12, 27, 51);
  --aside-color: rgb(20, 29, 65);
  --font-color: white;
}
.layout {
  width: 100vw;
  height: 100vh;
  background: var(--background-color);
  color: var(--font-color);
  .aside {
    width: 10%;
    height: 100%;
    background: var(--aside-color);
    color: var(--font-color);
    border-right: 1px solid var(--background-color);
    .up {
      margin-top: 20px;
      height: 12%;
      width: 100%;
      background-image: url("@/assets/logo_dog.png");
      background-repeat: no-repeat;
      background-size: 60% 100%;
      background-position: center;
    }
    .medium {
      margin: 10px 0;
      width: 100%;
      ul {
        margin: 0;
        padding: 0;
        li {
          height: 40px;
          align-items: center;
          display: flex;
          justify-content: space-around;
          margin: 33% 10px;
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
}


</style>
