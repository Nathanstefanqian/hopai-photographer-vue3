import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@@/layout/Layout.vue'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import orderHome from '@/views/Main/Order/index.vue'
import orderDetail from '@/views/Main/Order/detail.vue'
import uploadHome from '@/views/Main/Upload/index.vue'

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Login']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/order',
      name: '',
      component: Layout,
      children: [
        {
          path: '',
          name: '订单中心',
          component: orderHome
        },
        {
          path: 'detail/:id',
          name: '上传照片',
          component: orderDetail
        }
      ]
    },
    {
      path: '/upload',
      name: '',
      component: Layout,
      children: [
        {
          path: '',
          name: '上传列表',
          component: uploadHome
        }
      ]
    }
  ]
})

export default router
