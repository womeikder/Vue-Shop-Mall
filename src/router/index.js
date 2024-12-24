import { createRouter, createWebHistory } from 'vue-router'
import {useUserStore} from "@/stores/index.js";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
          path: '/admin/echarts',
          component: () => import('@/views/admin/AdminEcharts.vue')
        }

      ]
    }

  ],
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  if (!userStore.token && to.path !== '/admin/login' ) return '/admin/login'
  return true
})

export default router
