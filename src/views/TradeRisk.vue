<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  Globe, 
  ShieldAlert, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Info,
  Filter,
  Search,
  CheckCircle2
} from 'lucide-vue-next'
import { getTradeRiskData } from '../api/risk'

const tradeData = ref<any>(null)

const fetchData = async () => {
  tradeData.value = await getTradeRiskData();
}

onMounted(() => {
  fetchData();
})
</script>

<template>
  <div v-if="tradeData" class="space-y-3">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold flex items-center gap-2">
        <Globe class="w-6 h-6 text-haier-blue" />
        全球贸易与关税风险分析
      </h1>
      <div class="flex gap-2">
        <button class="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium hover:bg-slate-700 transition-colors flex items-center gap-2">
          <Filter class="w-3.5 h-3.5" /> 筛选条件
        </button>
        <button class="px-3 py-1.5 bg-haier-blue text-white rounded-lg text-xs font-medium hover:bg-haier-blue/90 transition-colors">
          导出分析报告
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-slate-400 text-xs font-medium">活跃贸易壁垒</h3>
          <ShieldAlert class="w-4 h-4 text-risk-high" />
        </div>
        <div class="flex items-end gap-2">
          <span class="text-2xl font-bold">42</span>
          <span class="text-[10px] text-risk-high mb-1 font-medium">+3 本月新增</span>
        </div>
        <div class="mt-3 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div class="h-full bg-risk-high w-3/4"></div>
        </div>
      </div>

      <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-slate-400 text-xs font-medium">平均出口关税率</h3>
          <BarChart3 class="w-4 h-4 text-haier-blue" />
        </div>
        <div class="flex items-end gap-2">
          <span class="text-2xl font-bold">14.8%</span>
          <span class="text-[10px] text-risk-low mb-1 font-medium">-1.2% 同比去年</span>
        </div>
        <div class="mt-3 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div class="h-full bg-haier-blue w-1/2"></div>
        </div>
      </div>

      <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-slate-400 text-xs font-medium">合规风险指数</h3>
          <CheckCircle2 class="w-4 h-4 text-risk-low" />
        </div>
        <div class="flex items-end gap-2">
          <span class="text-2xl font-bold">92.4</span>
          <span class="text-[10px] text-slate-500 mb-1">处于安全区间</span>
        </div>
        <div class="mt-3 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div class="h-full bg-risk-low w-5/6"></div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 h-[calc(100vh-320px)]">
      <!-- Tariff Monitor Table -->
      <div class="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
        <div class="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 class="font-bold text-base">重点市场关税动态</h2>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input type="text" placeholder="搜索国家或产品..." class="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-[10px] w-64" />
          </div>
        </div>
        <div class="flex-1 overflow-auto custom-scrollbar">
          <table class="w-full text-left text-[11px]">
            <thead class="sticky top-0 z-10">
              <tr class="bg-slate-800 text-slate-400">
                <th class="px-6 py-3 font-medium">国家/地区</th>
                <th class="px-6 py-3 font-medium">产品类别</th>
                <th class="px-6 py-3 font-medium">当前税率</th>
                <th class="px-6 py-3 font-medium">政策状态</th>
                <th class="px-6 py-3 font-medium">业务影响</th>
                <th class="px-6 py-3 font-medium">趋势</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <tr v-for="item in tradeData.tariffData" :key="item.country" class="hover:bg-slate-800/30 transition-colors group">
                <td class="px-6 py-3 font-medium">{{ item.country }}</td>
                <td class="px-6 py-3 text-slate-400">{{ item.category }}</td>
                <td class="px-6 py-3 font-bold text-slate-200">{{ item.current }}</td>
                <td class="px-6 py-3">
                  <span class="px-1.5 py-0.5 rounded-full text-[9px] bg-slate-800 text-slate-300">{{ item.status }}</span>
                </td>
                <td class="px-6 py-3">
                  <span 
                    class="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                    :class="{
                      'bg-risk-critical/20 text-risk-critical': item.impact === 'Critical',
                      'bg-risk-high/20 text-risk-high': item.impact === 'High',
                      'bg-risk-medium/20 text-risk-medium': item.impact === 'Medium',
                    }"
                  >
                    {{ item.impact }}
                  </span>
                </td>
                <td class="px-6 py-3">
                  <TrendingUp v-if="item.trend === 'Up'" class="w-3.5 h-3.5 text-risk-critical" />
                  <TrendingDown v-else-if="item.trend === 'Down'" class="w-3.5 h-3.5 text-risk-low" />
                  <span v-else class="text-slate-500">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Policy Alerts -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-full">
        <h2 class="font-bold text-base mb-4">贸易合规预警</h2>
        <div class="space-y-4 flex-1 overflow-auto custom-scrollbar pr-2">
          <div v-for="alert in tradeData.tradeAlerts" :key="alert.id" class="relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:rounded-full group"
            :class="{
              'before:bg-risk-critical': alert.level === 'Critical',
              'before:bg-risk-high': alert.level === 'High',
              'before:bg-haier-blue': alert.level === 'Medium',
            }"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{{ alert.type }}</span>
              <span class="text-[9px] text-slate-600">{{ alert.date }}</span>
            </div>
            <h4 class="text-xs font-medium mb-2 leading-snug group-hover:text-haier-blue cursor-pointer transition-colors">{{ alert.title }}</h4>
            <div class="flex items-center gap-3">
              <button class="text-[9px] text-haier-blue hover:underline">政策原文</button>
              <button class="text-[9px] text-slate-500 hover:underline">影响评估</button>
            </div>
          </div>
        </div>
        <div class="mt-4 p-3 bg-haier-blue/5 border border-haier-blue/10 rounded-lg">
          <div class="flex items-start gap-2">
            <Info class="w-4 h-4 text-haier-blue shrink-0 mt-0.5" />
            <div>
              <p class="text-[10px] font-medium text-haier-blue mb-1">AI 建议</p>
              <p class="text-[9px] text-slate-400 leading-relaxed">近期受地缘政治波动影响，建议提前锁定东南亚至欧洲航线仓位。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="h-full w-full flex items-center justify-center">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-haier-blue"></div>
  </div>
</template>
