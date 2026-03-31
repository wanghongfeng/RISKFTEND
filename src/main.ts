import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

// Basic routes
const routes = [
  { 
    path: '/', 
    name: 'Dashboard',
    component: () => import('./views/Dashboard.vue') 
  },
  { 
    path: '/trade-risk', 
    name: 'TradeRisk',
    component: () => import('./views/TradeRisk.vue') 
  },
  { 
    path: '/supplier-risk', 
    name: 'SupplierRisk',
    component: () => import('./views/SupplierRisk.vue') 
  },
  { 
    path: '/logistics', 
    name: 'Logistics',
    component: () => import('./views/Logistics.vue') 
  },
  { 
    path: '/alerts', 
    name: 'Alerts',
    component: () => import('./views/Alerts.vue') 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.mount('#app')
