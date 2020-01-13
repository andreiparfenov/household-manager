import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'
import Workspace from '../views/Workspace.vue'
import Dashboard from '../views/Dashboard.vue'
import Chat from '../views/Chat.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { title: 'Household Manager', redirect: true }
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
    meta: { title: 'Login - Household Manager', redirect: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { title: 'My Household', requiresAuth: true}
  },
  {
    path: '/chat',
    name: 'chat',
    component: Chat,
    meta: { title: 'Household Board', requiresAuth: true}
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, email, next) => {
  const auth = localStorage.getItem('user-id')
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth) {
      next('login')
    }
  } else if (to.matched.some(record => record.meta.redirect)) {
    if (auth) {
      next('dashboard')
    }
  }
  next()
})

router.afterEach((to, from) => {
  document.title = to.meta.title
})

export default router