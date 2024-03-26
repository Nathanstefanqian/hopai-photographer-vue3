import router from './router'
import { getAccessToken } from '@/utils/auth'

// 路由不重定向白名单
const whiteList = [
  '/login'
]

router.beforeEach(async (to, from, next) => {
  // 检查用户是否已登录
  const hasAccessToken = getAccessToken();

  // 如果用户已登录
  if (hasAccessToken) {
    // 如果目标路由是登录页，则重定向到根路径
    if (to.path === '/login') {
      next({ path: '/order' })
    } else {
      next(); // 继续导航
    }
  } else {
    // 如果用户未登录，并且目标路由不在白名单中，则重定向到登录页
    if (!whiteList.includes(to.path)) {
      next('/login');
    } else {
      next(); // 目标路由在白名单中，继续导航
    }
  }
});
