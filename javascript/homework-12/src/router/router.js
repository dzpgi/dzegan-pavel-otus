/* eslint-disable */
import { createRouter, createWebHistory } from 'vue-router'
import Settings from '../views/Settings.vue'
import Game from '../views/Game.vue'

const routes = [
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/game',
    name: 'Game',
    component: Game
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(function(to, from) {
  // Возможность запретить переход с одного url на другой (например логин)
  return true
})

export default router
