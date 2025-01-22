import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "../stores/auth";

export const authGuard = async (to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = await authStore.verifyStatus();
  if (!isAuthenticated) {
    next({ name: "login" });
  } else {
    next();
  }
};

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
      beforeEnter: authGuard,
      children: [
        {
          path: '/principal',
          name: 'Principal',
          component: () => import('../views/paginas/principal.vue'),
          beforeEnter: authGuard,
        },
        {
          path: '/pedido/:id',
          name: 'PedidoDetalhes',
          component: () => import('../views/paginas/pedido_detalhes.vue'),
          beforeEnter: authGuard,
        },
        {
          path: '/usuarios',
          name: 'Usuarios',
          component: () => import('../views/paginas/lista_usuarios.vue'),
          beforeEnter: authGuard,
        },
        {
          path: "/cadastro/usuarios",
          name: "CadastroUsuario",
          component: () => import("../views/paginas/cadastro_usuario.vue"),
          beforeEnter: authGuard,
        },
        {
          path: "/cadastro/usuarios/:id",
          name: "CadastroUsuarioId",
          component: () => import("../views/paginas/cadastro_usuario.vue"),
          beforeEnter: authGuard,
        },
      ],
    },
  ],
})

export default router
