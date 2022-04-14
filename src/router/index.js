import {
  createRouter,
  createWebHistory
} from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [{
    path: '/',
    name: 'home',
    component: HomeView
  },
  // {
  //   path: '/odView',
  //   name: 'odview',
  //   component: () => import( /* webpackChunkName: "about" */ '../views/ODView.vue')
  // },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router