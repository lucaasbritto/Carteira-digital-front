import { createRouter, createWebHistory } from 'vue-router';
import LoginComponent from '../components/LoginComponent.vue';
import WalletComponent from '../components/WalletComponent.vue';
import TransactionComponent from '../components/TransactionComponent.vue';
import RegisterComponent from '../components/RegisterComponent.vue';

const routes = [
  { path: '/', name: 'login', component: LoginComponent },
  { 
    path: '/wallet', 
    name: 'wallet', 
    component: WalletComponent, 
    meta: { requiresAuth: true } 
},
  {
    path: '/transactions',
    name: 'Transactions',
    component: TransactionComponent,
    meta: { requiresAuth: true } 
  },
  { 
    path: '/register', 
    name: 'register', 
    component: RegisterComponent 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;