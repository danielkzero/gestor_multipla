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
        {
          path: '/pedido/:id',
          name: 'PedidoDetalhes',
          component: () => import('../views/paginas/pedido_detalhes.vue')
        },
        {
          path: '/usuarios',
          name: 'Usuarios',
          component: () => import('../views/paginas/lista_usuarios.vue')
        },
        {
          path: "/cadastro/usuarios",
          name: "CadastroUsuario",
          component: () =>
            import("../views/paginas/cadastro_usuario.vue"),
        },
        {
          path: "/cadastro/usuarios/:id",
          name: "CadastroUsuarioId",
          component: () =>
            import("../views/paginas/cadastro_usuario.vue"),
        },
      ],
    },
  ],
})

export default router
