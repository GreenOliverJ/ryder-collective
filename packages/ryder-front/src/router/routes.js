const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/IndexPage.vue') },
      { path: 'login', name: 'login', meta: { guestOnly: true }, component: () => import('pages/LoginPage.vue') },
      { path: 'register', name: 'register', meta: { guestOnly: true }, component: () => import('pages/RegisterPage.vue') },
      { path: 'forgot-password', name: 'forgot-password', meta: { guestOnly: true }, component: () => import('pages/ForgotPasswordPage.vue') },
      { path: 'reset-password', name: 'reset-password', meta: { guestOnly: true }, component: () => import('pages/ResetPasswordPage.vue') },
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: { requiresAuth: true },
        component: () => import('pages/DashboardPage.vue')
      },
      {
        path: 'editor/:id',
        name: 'editor',
        meta: { requiresAuth: true },
        component: () => import('pages/EditorPage.vue')
      }
    ]
  },
  {
    path: '/stage/:handle/:slug',
    name: 'stage-public',
    component: () => import('pages/StageViewPage.vue')
  },
  {
    path: '/s/:publicId',
    name: 'stage-short',
    component: () => import('pages/StageViewPage.vue')
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
