import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import BlogLayout from '@/layouts/BlogLayout.vue'
import BlogList from '@/views/BlogList.vue'
import MyPosts from '@/views/MyPosts.vue' // Komponen untuk My Posts
import OtherPosts from '@/views/OtherPosts.vue' // Komponen untuk Other Posts
import PostView from '@/views/PostView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
    },
    {
      path: '/blog',
      component: BlogLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'blog',
          component: BlogList, // Menampilkan daftar post secara umum
        },
        {
          path: 'my-posts',
          name: 'my-posts',
          component: MyPosts, // Menampilkan post milik user
        },
        {
          path: 'other-posts',
          name: 'other-posts',
          component: OtherPosts, // Menampilkan post dari orang lain
        },
        {
          path: 'post/:slug',
          name: 'post',
          component: PostView, // Menampilkan detail post
        },
      ],
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!localStorage.getItem('token')) {
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
