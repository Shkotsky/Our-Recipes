import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/auth/Login.vue'
import Signup from '../views/auth/Signup.vue'
import CreateRecipe from '../views/recipes/CreateRecipe.vue'
import RecipeDetails from '../views/recipes/RecipeDetails'
import UserRecipes from '../views/recipes/UserRecipes'

// route guard
import { projectAuth } from '@/firebase/config'

const requireAuth = (to, from, next) => {
  let user = projectAuth.currentUser;
  if (!user) {
    next({ name: 'Login' })
  } else {
    next()
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: requireAuth
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/recipes/create',
    name: 'CreateRecipe',
    component: CreateRecipe,
    beforeEnter: requireAuth
  },
  {
    path: '/recipes/:id',
    name: 'RecipeDetails',
    component: RecipeDetails,
    beforeEnter: requireAuth,
    props: true
  },
  {
    path: '/recipes/user',
    name: 'UserRecipes',
    component: UserRecipes,
    beforeEnter: requireAuth
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
