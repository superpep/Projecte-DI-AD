
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/login' },
      { path: 'login', component: () => import('pages/Index.vue') },
      { path: 'register', component: () => import('pages/Register.vue') },
      { path: 'welcome', component: () => import('pages/Welcome.vue') },
      { path: 'notes', component: () => import('pages/Notes.vue') },
      { path: 'logout', component: () => import('pages/Logout.vue') },
      { path: 'moduls', component: () => import('pages/Moduls.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
