import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'
import Workspace from '../views/Workspace.vue'

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
  },
  {
    path: '/w',
    name: 'workspace',
    component: Workspace,
    meta: { title: 'Workspace - Household Manager', requiresAuth: true }
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
      next(login)
    }
  } else if (to.matched.some(record => record.meta.redirect)) {
    if (auth) {
      next(Workspace)
    }
  }
  next()
})

router.afterEach((to, from) => {
  document.title = to.meta.title
})

export default router