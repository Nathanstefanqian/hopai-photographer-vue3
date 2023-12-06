import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
// import Frame from '@@/layout/Frame.vue'
// import Layout from '@@/layout/Layout.vue'
// console.log(import.meta.env.BASE_URL)
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    }
  ]
})

export default router
