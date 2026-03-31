<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  Bell, 
  ShieldAlert, 
  Activity,
  Calendar,
  Filter
} from 'lucide-vue-next'
import { getAlertsData } from '../api/risk'

const alertsData = ref<any>(null)

const fetchData = async () => {
  alertsData.value = await getAlertsData();
}

onMounted(() => {
  fetchData();
})
</script>

<template>
  <div v-if="alertsData" class="space-y-3">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold flex items-center gap-2">
        <Bell class="w-6 h-6 text-haier-blue" />
        风险预警中心
      </h1>
      <div class="flex gap-2">
        <button class="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium hover:bg-slate-700 transition-colors flex items-center gap-2">
          <Filter class="w-3.5 h-3.5" /> 筛选分类
        </button>
      </div>
    </div>

    <!-- Alert Timeline -->
    <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div class="font-bold text-sm mb-6 flex items-center gap-2">
        <Activity class="w-4 h-4 text-haier-blue" />
        风险事件时间轴
      </div>
      <div class="relative pl-6 space-y-8 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
        <div v-for="alert in alertsData.timeline" :key="alert.id" class="relative group">
          <!-- Timeline point -->
          <div :class="['absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 border-slate-900', 
            alert.severity === 'Critical' ? 'bg-risk-critical animate-pulse' : 
            alert.severity === 'High' ? 'bg-risk-high' : 'bg-haier-blue']"></div>
          
          <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-1">
                <span class="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <Calendar class="w-3 h-3" /> {{ alert.date }}
                </span>
                <span :class="['px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider', 
                  alert.severity === 'Critical' ? 'bg-risk-critical/20 text-risk-critical' : 
                  alert.severity === 'High' ? 'bg-risk-high/20 text-risk-high' : 'bg-haier-blue/20 text-haier-blue']">
                  {{ alert.severity }}
                </span>
              </div>
              <h4 class="text-sm font-bold text-slate-100 mb-2 group-hover:text-haier-blue transition-colors">{{ alert.title }}</h4>
              <p class="text-xs text-slate-400 leading-relaxed max-w-3xl">{{ alert.desc }}</p>
            </div>
            <div class="flex gap-2 shrink-0">
              <button class="px-3 py-1.5 bg-haier-blue/10 border border-haier-blue/20 rounded text-haier-blue text-[10px] hover:bg-haier-blue/20">立即处置</button>
              <button class="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-slate-400 text-[10px] hover:bg-slate-700">查看详情</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert Categories -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      <div v-for="cat in ['地缘政治', '供应风险', '物流异常', '财务合规']" :key="cat" class="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-slate-400">{{ cat }}预警</span>
          <ShieldAlert class="w-4 h-4 text-haier-blue" />
        </div>
        <div class="text-xl font-bold">12</div>
        <div class="text-[9px] text-slate-500 mt-1">昨日新增: 2</div>
      </div>
    </div>
  </div>
  <div v-else class="h-full w-full flex items-center justify-center">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-haier-blue"></div>
  </div>
</template>
