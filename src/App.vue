<script setup lang="ts">
import { ref } from 'vue'
import { 
  Globe, 
  ShieldAlert, 
  BarChart3, 
  Truck, 
  AlertCircle, 
  Menu, 
  X,
  Map,
  Settings,
  Bell,
  Search,
  LayoutDashboard
} from 'lucide-vue-next'

const isSidebarOpen = ref(true)
const activeMenu = ref('Dashboard')

const menuItems = [
  { name: '风险概览', icon: LayoutDashboard, path: '/' },
  { name: '贸易与关税', icon: Globe, path: '/trade-risk' },
  { name: '供应商风险', icon: ShieldAlert, path: '/supplier-risk' },
  { name: '物流监控', icon: Truck, path: '/logistics' },
  { name: '风险预警', icon: Bell, path: '/alerts' },
  { name: '统计分析', icon: BarChart3, path: '/analytics' },
  { name: '系统设置', icon: Settings, path: '/settings' },
]
</script>

<template>
  <div class="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
    <!-- Sidebar -->
    <aside 
      :class="[
        'bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out z-30',
        isSidebarOpen ? 'w-64' : 'w-20'
      ]"
    >
      <div class="flex items-center gap-3 p-6 border-b border-slate-800">
        <div class="w-8 h-8 bg-haier-blue rounded flex items-center justify-center shrink-0">
          <ShieldAlert class="w-5 h-5 text-white" />
        </div>
        <span v-if="isSidebarOpen" class="font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden">
          Haier SCRM
        </span>
      </div>

      <nav class="p-4 space-y-2">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          class="flex items-center gap-4 px-4 py-3 rounded-lg transition-colors group relative"
          :class="[
            $route.path === item.path 
              ? 'bg-haier-blue/10 text-haier-blue' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 shrink-0" />
          <span v-if="isSidebarOpen" class="font-medium whitespace-nowrap">{{ item.name }}</span>
          
          <!-- Tooltip for collapsed state -->
          <div v-if="!isSidebarOpen" class="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
            {{ item.name }}
          </div>
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0">
      <!-- Topbar -->
      <header class="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex items-center justify-between px-6 shrink-0">
        <div class="flex items-center gap-4">
          <button @click="isSidebarOpen = !isSidebarOpen" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
            <Menu v-if="!isSidebarOpen" class="w-5 h-5" />
            <X v-else class="w-5 h-5" />
          </button>
          
          <div class="relative max-w-md hidden md:block">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="搜索供应商、航线、风险事件..." 
              class="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-1.5 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-haier-blue/50"
            />
          </div>
        </div>

        <div class="flex items-center gap-6">
          <!-- Quick Status Indicators -->
          <div class="hidden lg:flex items-center gap-4 text-xs">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-risk-critical animate-pulse"></span>
              <span class="text-slate-400">极高风险: 3</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-risk-high"></span>
              <span class="text-slate-400">高风险: 12</span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button class="relative p-2 hover:bg-slate-800 rounded-lg text-slate-400">
              <Bell class="w-5 h-5" />
              <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <div class="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 overflow-hidden cursor-pointer hover:border-haier-blue transition-colors">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
            </div>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <div class="flex-1 overflow-auto p-6 custom-scrollbar">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
</style>
