<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  AlertTriangle,
  Building2,
  MapPin,
  FileText,
  Activity,
  UserCheck
} from 'lucide-vue-next'
import { getSupplierRiskData } from '../api/risk'

const supplierData = ref<any>(null)
const selectedSupplier = ref<any>(null)

const fetchData = async () => {
  supplierData.value = await getSupplierRiskData();
  if (supplierData.value.suppliers.length > 0) {
    selectedSupplier.value = supplierData.value.suppliers[0];
  }
}

onMounted(() => {
  fetchData();
})
</script>

<template>
  <div v-if="supplierData" class="space-y-3">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold flex items-center gap-2">
        <ShieldAlert class="w-6 h-6 text-haier-blue" />
        供应商多维风险监控
      </h1>
      <div class="flex gap-2">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input type="text" placeholder="搜索供应商名称..." class="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs w-64 focus:ring-1 focus:ring-haier-blue outline-none" />
        </div>
        <button class="p-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 text-slate-400"><Filter class="w-4 h-4" /></button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 h-[calc(100vh-200px)]">
      <!-- Supplier List -->
      <div class="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col min-h-0">
        <div class="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 class="font-bold text-sm">供应商清单</h2>
          <span class="text-[10px] text-slate-500">共 {{ supplierData.suppliers.length }} 家</span>
        </div>
        <div class="flex-1 overflow-auto custom-scrollbar p-2 space-y-1.5">
          <div 
            v-for="s in supplierData.suppliers" 
            :key="s.id" 
            @click="selectedSupplier = s"
            class="p-3 rounded-lg border transition-all cursor-pointer group"
            :class="[
              selectedSupplier?.id === s.id 
                ? 'bg-haier-blue/10 border-haier-blue shadow-sm' 
                : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
            ]"
          >
            <div class="flex items-start justify-between mb-1">
              <h3 class="font-medium text-xs group-hover:text-haier-blue transition-colors truncate pr-2">{{ s.name }}</h3>
              <div 
                class="w-2 h-2 rounded-full shrink-0 mt-1"
                :class="{
                  'bg-risk-low': s.status === 'Low',
                  'bg-risk-high': s.status === 'Medium',
                  'bg-risk-critical': s.status === 'High',
                }"
              ></div>
            </div>
            <div class="flex items-center justify-between text-[10px] text-slate-500">
              <span class="flex items-center gap-1 truncate"><Building2 class="w-3 h-3" /> {{ s.category }}</span>
              <span class="font-bold shrink-0" :class="[s.riskScore > 80 ? 'text-risk-low' : s.riskScore > 60 ? 'text-risk-high' : 'text-risk-critical']">
                {{ s.riskScore }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Supplier Details -->
      <div v-if="selectedSupplier" class="lg:col-span-8 space-y-3 flex flex-col min-h-0 overflow-auto custom-scrollbar">
        <!-- Profile Header -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden shrink-0">
          <div class="absolute top-0 right-0 w-48 h-48 bg-haier-blue/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
          <div class="relative flex items-start justify-between">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center text-haier-blue shrink-0">
                <Building2 class="w-8 h-8" />
              </div>
              <div class="space-y-1">
                <h2 class="text-xl font-bold">{{ selectedSupplier.name }}</h2>
                <div class="flex items-center gap-3 text-[11px] text-slate-400">
                  <span class="flex items-center gap-1"><MapPin class="w-3.5 h-3.5 text-haier-blue" /> {{ selectedSupplier.location }}</span>
                  <span class="flex items-center gap-1"><Activity class="w-3.5 h-3.5 text-haier-blue" /> {{ selectedSupplier.category }}</span>
                  <span class="px-1.5 py-0.5 rounded bg-slate-800 text-[9px]">HAIER-2024-{{ selectedSupplier.id }}</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <p class="text-[10px] text-slate-500 font-medium">健康指数</p>
              <p class="text-3xl font-bold" :class="[selectedSupplier.riskScore > 80 ? 'text-risk-low' : selectedSupplier.riskScore > 60 ? 'text-risk-high' : 'text-risk-critical']">
                {{ selectedSupplier.riskScore }}
              </p>
            </div>
          </div>
        </div>

        <!-- Risk Dimensions Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 shrink-0">
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 class="font-bold text-xs mb-4 flex items-center gap-2">
              <Activity class="w-3.5 h-3.5 text-haier-blue" /> 财务状况
            </h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between text-[10px]">
                <span class="text-slate-400">流动比率</span>
                <span class="font-bold text-risk-low">1.82</span>
              </div>
              <div class="flex items-center justify-between text-[10px]">
                <span class="text-slate-400">资产负债率</span>
                <span class="font-bold text-slate-200">58%</span>
              </div>
              <div class="flex items-center justify-between text-[10px]">
                <span class="text-slate-400">信用评级</span>
                <span class="font-bold text-haier-blue">AA-</span>
              </div>
              <div class="h-1 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
                <div class="h-full bg-haier-blue w-[85%]"></div>
              </div>
            </div>
          </div>

          <div class="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 class="font-bold text-xs mb-4 flex items-center gap-2">
              <UserCheck class="w-3.5 h-3.5 text-haier-blue" /> 产能交付
            </h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between text-[10px]">
                <span class="text-slate-400">及时交付率</span>
                <span class="font-bold text-risk-low">98.5%</span>
              </div>
              <div class="flex items-center justify-between text-[10px]">
                <span class="text-slate-400">品质合格率</span>
                <span class="font-bold text-risk-low">99.8%</span>
              </div>
              <div class="flex items-center justify-between text-[10px]">
                <span class="text-slate-400">产能负荷</span>
                <span class="font-bold text-risk-high">82%</span>
              </div>
              <div class="h-1 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
                <div class="h-full bg-risk-high w-[82%]"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Risk Events -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 min-h-0 flex flex-col">
          <h3 class="font-bold text-xs mb-4 flex items-center justify-between">
            <span class="flex items-center gap-2"><AlertTriangle class="w-3.5 h-3.5 text-risk-high" /> 风险动态</span>
            <button class="text-[9px] text-haier-blue hover:underline">全部</button>
          </h3>
          <div class="space-y-3 overflow-auto custom-scrollbar pr-2">
            <div class="flex gap-3 p-3 bg-slate-800/40 rounded-lg border border-slate-800/50">
              <div class="p-1.5 bg-risk-high/10 rounded-lg h-fit"><AlertTriangle class="w-3.5 h-3.5 text-risk-high" /></div>
              <div>
                <h4 class="text-xs font-medium mb-1">地缘政治：核心物料出口限制</h4>
                <p class="text-[10px] text-slate-500 mb-1.5 leading-relaxed">特定芯片型号可能面临对华出口许可证审批延迟风险。</p>
                <div class="flex items-center gap-3 text-[9px]">
                  <span class="text-slate-600">2024-03-28</span>
                  <span class="text-risk-high font-bold">高风险</span>
                </div>
              </div>
            </div>
            <div class="flex gap-3 p-3 bg-slate-800/40 rounded-lg border border-slate-800/50">
              <div class="p-1.5 bg-haier-blue/10 rounded-lg h-fit"><FileText class="w-3.5 h-3.5 text-haier-blue" /></div>
              <div>
                <h4 class="text-xs font-medium mb-1">ESG 年度审计通过</h4>
                <p class="text-[10px] text-slate-500 mb-1.5 leading-relaxed">各项指标均符合海尔供应商准入标准。</p>
                <div class="flex items-center gap-3 text-[9px]">
                  <span class="text-slate-600">2024-02-15</span>
                  <span class="text-risk-low font-bold">合规</span>
                </div>
              </div>
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
