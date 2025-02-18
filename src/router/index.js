import { createRouter, createWebHistory } from 'vue-router'
import {useUserStore} from "@/stores/index.js";
import pMessage from '@/components/global/message';
import {ref} from "vue";



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // web
    {
      path: '/',
      component: () => import('@/views/web/WebIndex.vue')
    },
    {
      path: '/web/login',
      component: () => import('@/views/web/WebLogin.vue')
    },
    {
      path: '/goods/list',
      component: () => import('@/views/web/GoodsList.vue')
    },
    {
      path: '/goods/detail/:id',
      name: 'goodsDetail',
      component: () => import('@/views/web/GoodsDetail.vue')
    },
    {
      path: '/goods/cart',
      component: () => import('@/views/web/GoodsCart.vue')
    },
    {
      path: '/order/confirm',
      component: () => import('@/views/web/OrderConfirm.vue')
    },
    {
      path: '/order/payment',
      component: () => import('@/views/web/OrderPayment.vue')
    },
    {
      path: '/user',
      component: () => import('@/views/web/UserProfile/UserLayout.vue'),
      redirect: '/profile',
      children: [
        {
          path: '/profile',
          component: () => import('@/views/web/UserProfile/UserProfile.vue')
        },
        {
          path: '/comment',
          component: () => import('@/views/web/UserProfile/UserComment.vue')
        },
        {
          path: '/order',
          component: () => import('@/views/web/UserProfile/UserOrder.vue')
        },
        {
          path: '/collect',
          component: () => import('@/views/web/UserProfile/UserCollection.vue')
        },
        {
          path: '/address',
          component: () => import('@/views/web/UserProfile/UserAddress.vue')
        },
        {
          path: '/setting',
          component: () => import('@/views/web/UserProfile/UserSetting.vue')
        }
      ]
    },

    // admin
    {
      path: '/admin/login',
      component: () => import('@/views/admin/AdminLogin.vue')
    },
    {
      path: '/admin/layout',
      component: () => import('@/views/admin/AdminLayout.vue'),
      redirect: '/admin/goods',
      children: [
        {
          path: '/admin/user',
          component: () => import('@/views/admin/AdminUser.vue')
        },
        {
          path: '/admin/category',
          component: () => import('@/views/admin/AdminCategory.vue')
        },
        {
          path: '/admin/comment',
          component: () => import('@/views/admin/AdminComment.vue')
        },
        {
          path: '/admin/order',
          component: () => import('@/views/admin/AdminOrder.vue')
        },
        {
          path: '/admin/slide',
          component: () => import('@/views/admin/AdminSlide.vue')
        },
        {
          path: '/admin/goods',
          component: () => import('@/views/admin/AdminGoods.vue')
        },
        {
          path: '/admin/index',
          component: () => import('@/views/admin/AdminEcharts.vue')
        }

      ]
    }

  ],
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  const isAdmin = ref(0)

  // 根据登陆后存储的用户信息来判断管理员身份，可以直接打回到主页
  if (userStore.currentUserInfo.value) {
    isAdmin.value = userStore.currentUserInfo.value.is_admin
    if (isAdmin.value === 0 && to.path.includes('/admin')) {
      pMessage.error('无权访问该页面')
      return '/'
    }
  }
  
  // 前面已经判断管理员身份，这里可以直接放行
  if (userStore.token) {
    return true
  }

  // 不需要登陆的界面
  if (!userStore.token &&
    (
      to.path === '/goods/list' || 
      to.name === 'goodsDetail' || 
      to.path === '/web/login' || 
      to.path === '/' || 
      to.path === '/admin/login'
    )) {
    return true

    // 管理端登陆
  } else if (!userStore.token && to.path !== '/admin/login' && to.path.includes('/admin')) {
    
    return '/admin/login'

  } else {
    // 用户端登陆
    return '/web/login'
  }
})



export default router
