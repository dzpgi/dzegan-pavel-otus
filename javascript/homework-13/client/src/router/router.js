/* eslint-disable */
import { createRouter, createWebHistory } from 'vue-router'
import PageContainer from '../views/PageContainer'

const routes = [
  {
    path: '/:page*',
    name: 'Page',
    component: PageContainer,
    meta: {
      reload: true,
    },
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(function(to, from) {
  // Возможность запретить переход с одного url на другой (например логин)
  return true
})

export default router
