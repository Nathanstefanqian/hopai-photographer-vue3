import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@@/layout/Layout.vue'
import Welcome from '@/views/Main/Dashboard/Home.vue'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Frame from '@@/layout/Frame.vue'
import orderHome from '@/views/Main/Order/Order.vue'
import orderDetail from '@/views/Main/Order/OrderDetail.vue'
import uploadHome from '@/views/Main/Upload/Upload.vue'

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
      path: '/main',
      name: '主页',
      component: Layout,
      children: [
        {
          path: '',
          name: 'Welcome',
          component: Welcome
        },
        {
          path: 'order',
          name: '',
          component: Frame,
          children: [{
            path: '',
            name: '订单列表',
            component: orderHome
          },
          {
              path: 'detail',
              name: '订单详情',
              component: orderDetail
          }]
        },
        {
          path: 'upload',
          name: '',
          component: Frame,
          children: [
            {
              path: '',
              name: '上传列表',
              component: uploadHome
            }
          ]
        },
      ]
    }
  ]
})

export default router
