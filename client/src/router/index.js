import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { title: 'Household Manager' }
  },
  {
    path: '/signup/:id',
    name: 'signup',
    component: Signup,
    meta: { title: 'Signup - Household Manager' }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { title: 'Login - Household Manager' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.afterEach((to, from) => {
  document.title = to.meta.title
})

export default router
