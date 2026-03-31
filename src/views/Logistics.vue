<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  Truck, 
  Ship, 
  Train, 
  MapPin,
  Activity
} from 'lucide-vue-next'
import { getLogisticsData } from '../api/risk'

const logisticsData = ref<any>(null)

const fetchData = async () => {
  logisticsData.value = await getLogisticsData();
}

onMounted(() => {
  fetchData();
})
</script>

<template>
  <div v-if="logisticsData" class="space-y-3">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold flex items-center gap-2">
        <Truck class="w-6 h-6 text-haier-blue" />
        全球物流监控
      </h1>
      <div class="flex gap-2">
        <button class="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium hover:bg-slate-700 transition-colors">
          航线优化建议
        </button>
      </div>
    </div>

    <!-- Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-slate-400">在途货运总量</span>
          <Activity class="w-4 h-4 text-haier-blue" />
        </div>
        <div class="text-2xl font-bold">1,284 TEU</div>
        <div class="text-[10px] text-risk-low mt-1">运行平稳</div>
      </div>
      <div v-for="port in logisticsData.ports" :key="port.name" class="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-slate-400">{{ port.name }} 拥堵度</span>
          <MapPin class="w-4 h-4 text-haier-blue" />
        </div>
        <div class="text-2xl font-bold">{{ port.density }}</div>
        <div :class="['text-[10px] mt-1', port.status === 'Normal' ? 'text-risk-low' : 'text-risk-critical']">
          {{ port.status === 'Normal' ? '正常' : '严重拥堵' }}
        </div>
      </div>
    </div>

    <!-- Routes List -->
    <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div class="p-4 border-b border-slate-800 font-bold text-sm">重点航线监控</div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-800 text-slate-400">
              <th class="px-6 py-3 font-medium">航线名称</th>
              <th class="px-6 py-3 font-medium">运输方式</th>
              <th class="px-6 py-3 font-medium">当前进度</th>
              <th class="px-6 py-3 font-medium">预计到达 (ETA)</th>
              <th class="px-6 py-3 font-medium">风险等级</th>
              <th class="px-6 py-3 font-medium">状态</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr v-for="route in logisticsData.routes" :key="route.id" class="hover:bg-slate-800/30">
              <td class="px-6 py-4 font-medium">{{ route.name }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <Ship v-if="route.type === 'Sea'" class="w-3.5 h-3.5" />
                  <Train v-else class="w-3.5 h-3.5" />
                  {{ route.type === 'Sea' ? '海运' : '铁运' }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div class="h-full bg-haier-blue" :style="`width: ${route.progress}%`"></div>
                </div>
              </td>
              <td class="px-6 py-4 text-slate-400">{{ route.eta }}</td>
              <td class="px-6 py-4">
                <span :class="['px-2 py-0.5 rounded-full text-[9px] font-bold', 
                  route.risk === 'High' ? 'bg-risk-critical/20 text-risk-critical' : 
                  route.risk === 'Medium' ? 'bg-risk-high/20 text-risk-high' : 'bg-risk-low/20 text-risk-low']">
                  {{ route.risk }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="['text-[10px]', 
                  route.status === 'Delayed' ? 'text-risk-critical' : 
                  route.status === 'Risk' ? 'text-risk-high' : 'text-risk-low']">
                  {{ route.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div v-else class="h-full w-full flex items-center justify-center">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-haier-blue"></div>
  </div>
</template>
