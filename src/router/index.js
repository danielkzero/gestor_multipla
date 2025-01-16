import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/login/login.vue'),
    },
    {
      path: '/inicio',
      name: 'Inicio',
      redirect: '/principal',
      component: () => import('../views/layout/principal.vue'),
      children: [
        {
          path: '/principal',
          name: 'Principal',
          component: () => import('../views/paginas/principal.vue')
        },
      ],
    },
  ],
})

export default router
