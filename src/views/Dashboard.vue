<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch } from 'vue'
import { 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Globe as GlobeIcon,
  Filter,
  ChevronRight
} from 'lucide-vue-next'
import * as echarts from 'echarts'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import { getDashboardData } from '../api/risk'

// State
const riskData = ref<any>(null)
const mapContainer = ref<HTMLElement | null>(null)
const riskTrendsChart = ref<HTMLElement | null>(null)
let chartInstance: any = null

const fetchData = async () => {
  riskData.value = await getDashboardData();
}

const initD3Map = async () => {
  if (!mapContainer.value || !riskData.value) return;

  const width = mapContainer.value.clientWidth;
  const height = mapContainer.value.clientHeight;

  // Clear previous content
  d3.select(mapContainer.value).selectAll("*").remove();

  const svg = d3.select(mapContainer.value)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  const projection = d3.geoOrthographic()
    .scale(Math.min(width, height) / 2.2)
    .translate([width / 2, height / 2])
    .rotate([-110, -30]);

  const path = d3.geoPath(projection);

  // Background circle for the ocean
  svg.append("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", projection.scale())
    .attr("fill", "#001a33")
    .attr("stroke", "#005AAA")
    .attr("stroke-width", "0.5");

  try {
    const world: any = await d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
    const countries = topojson.feature(world, world.objects.countries);

    // Draw countries
    svg.append("g")
      .selectAll("path")
      .data((countries as any).features)
      .join("path")
      .attr("fill", "#0a192f")
      .attr("stroke", "#1e293b")
      .attr("d", path as any)
      .append("title")
      .text((d: any) => d.properties.name);

    // Draw graticule
    const graticule = d3.geoGraticule();
    svg.append("path")
      .datum(graticule())
      .attr("class", "graticule")
      .attr("d", path as any)
      .attr("fill", "none")
      .attr("stroke", "#334155")
      .attr("stroke-width", "0.2")
      .attr("opacity", 0.5);

    // Add points from riskData
    const pointsGroup = svg.append("g");
    
    riskData.value.globeData.points.forEach((point: any) => {
      const container = pointsGroup.append("g")
        .attr("class", "point-container")
        .datum(point); // Bind point data for sync

      container.append("circle")
        .attr("r", 5)
        .attr("fill", point.color)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .append("title")
        .text(point.label);
          
      // Add ripple effect for critical points
      if (point.color === '#FF4D4F') {
        container.append("circle")
          .attr("r", 5)
          .attr("fill", "none")
          .attr("stroke", point.color)
          .attr("stroke-width", 1)
          .append("animate")
          .attr("attributeName", "r")
          .attr("from", "5")
          .attr("to", "15")
          .attr("dur", "1.5s")
          .attr("begin", "0s")
          .attr("repeatCount", "indefinite");
            
        container.append("circle")
          .attr("r", 5)
          .attr("fill", "none")
          .attr("stroke", point.color)
          .attr("stroke-width", 1)
          .attr("opacity", "1")
          .append("animate")
          .attr("attributeName", "opacity")
          .attr("from", "1")
          .attr("to", "0")
          .attr("dur", "1.5s")
          .attr("begin", "0s")
          .attr("repeatCount", "indefinite");
      }
    });

    // Rotation animation
    let lastTime = 0;
    const rotationSpeed = 0.01;
    
    const timer = d3.timer((elapsed) => {
      const dt = elapsed - lastTime;
      lastTime = elapsed;
      
      const rotate = projection.rotate();
      projection.rotate([rotate[0] + rotationSpeed * dt, rotate[1]]);
      
      // Update map paths
      svg.selectAll("path").attr("d", path as any);
      
      // Update points position and visibility
      pointsGroup.selectAll(".point-container").each(function(d: any) {
        const container = d3.select(this);
        const coords = projection([d.lng, d.lat]);
        
        // Calculate if the point is on the visible hemisphere
        const geoPoint: [number, number] = [d.lng, d.lat];
        const center: [number, number] = [-projection.rotate()[0], -projection.rotate()[1]];
        const distance = d3.geoDistance(geoPoint, center);
        
        if (coords && distance < Math.PI / 2) {
          container.style("display", "block")
            .attr("transform", `translate(${coords[0]}, ${coords[1]})`);
        } else {
          container.style("display", "none");
        }
      });
    });

    onUnmounted(() => timer.stop());

  } catch (error) {
    console.error("Error loading map data:", error);
  }
}

// Helper removed as we integrate logic into timer


const initChart = () => {
  if (!riskTrendsChart.value || !riskData.value) return;

  chartInstance = echarts.init(riskTrendsChart.value, 'dark')
  chartInstance.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true, top: '10%' },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { lineStyle: { color: '#334155' } }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLine: { show: false }
    },
    series: [
      {
        name: '风险指数',
        data: riskData.value.riskTrends,
        type: 'line',
        smooth: true,
        lineStyle: { color: '#005AAA', width: 3 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 90, 170, 0.3)' },
            { offset: 1, color: 'rgba(0, 90, 170, 0)' }
          ])
        }
      }
    ]
  })
}

const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
  initD3Map();
}

onMounted(async () => {
  await fetchData();
  initD3Map();
  initChart();
  window.addEventListener('resize', handleResize);
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (chartInstance) chartInstance.dispose();
})

watch(riskData, () => {
  if (riskData.value) {
    initD3Map();
    initChart();
  }
})
</script>

<template>
  <div v-if="riskData" class="space-y-3">
    <!-- Hero Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="bg-slate-900/60 border border-slate-800 p-4 rounded-xl relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-24 h-24 bg-haier-blue/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-haier-blue/10 rounded-lg">
            <ShieldAlert class="w-4 h-4 text-haier-blue" />
          </div>
          <span class="text-[10px] font-medium px-2 py-0.5 rounded bg-haier-blue/10 text-haier-blue">系统评估</span>
        </div>
        <div class="space-y-1">
          <h3 class="text-slate-400 text-xs font-medium">全域风险健康值</h3>
          <div class="flex items-end gap-2">
            <span class="text-2xl font-bold">{{ riskData.riskScore }}</span>
            <span class="text-[10px] text-risk-high mb-1 font-medium flex items-center gap-0.5">
              <TrendingUp class="w-3 h-3" /> +5.2%
            </span>
          </div>
        </div>
      </div>

      <div class="bg-slate-900/60 border border-slate-800 p-4 rounded-xl relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-24 h-24 bg-risk-critical/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-risk-critical/10 rounded-lg">
            <AlertTriangle class="w-4 h-4 text-risk-critical" />
          </div>
          <span class="text-[10px] font-medium px-2 py-0.5 rounded bg-risk-critical/10 text-risk-critical">需关注</span>
        </div>
        <div class="space-y-1">
          <h3 class="text-slate-400 text-xs font-medium">待处置极高风险</h3>
          <div class="flex items-end gap-2">
            <span class="text-2xl font-bold text-risk-critical">{{ riskData.stats.criticalAlerts }}</span>
            <span class="text-[10px] text-slate-500 mb-1">项/实时</span>
          </div>
        </div>
      </div>

      <div class="bg-slate-900/60 border border-slate-800 p-4 rounded-xl relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-24 h-24 bg-haier-blue/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-haier-blue/10 rounded-lg">
            <GlobeIcon class="w-4 h-4 text-haier-blue" />
          </div>
        </div>
        <div class="space-y-1">
          <h3 class="text-slate-400 text-xs font-medium">受影响航线/工厂</h3>
          <div class="flex items-end gap-2">
            <span class="text-2xl font-bold">{{ riskData.stats.affectedRoutes }} / {{ riskData.stats.affectedFactories }}</span>
            <span class="text-[10px] text-risk-low mb-1 font-medium flex items-center gap-0.5">
              <TrendingDown class="w-3 h-3" /> -2
            </span>
          </div>
        </div>
      </div>

      <div class="bg-slate-900/60 border border-slate-800 p-4 rounded-xl relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-24 h-24 bg-haier-blue/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-haier-blue/10 rounded-lg">
            <TrendingUp class="w-4 h-4 text-haier-blue" />
          </div>
        </div>
        <div class="space-y-1">
          <h3 class="text-slate-400 text-xs font-medium">潜在成本损失</h3>
          <div class="flex items-end gap-2">
            <span class="text-2xl font-bold">{{ riskData.stats.potentialLoss }}</span>
            <span class="text-[10px] text-risk-high mb-1 font-medium flex items-center gap-0.5">
              预计
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 h-[calc(100vh-280px)]">
      <!-- Left: Map/Globe Visualization -->
      <div class="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col">
        <div class="p-4 flex items-center justify-between border-b border-slate-800/50">
          <div class="flex items-center gap-2">
            <h2 class="font-bold text-base">全球风险 D3 投影地图</h2>
            <div class="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              实时监控中
            </div>
          </div>
          <div class="flex gap-2">
            <button class="p-1.5 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-400"><Filter class="w-3.5 h-3.5" /></button>
          </div>
        </div>
        <div ref="mapContainer" class="flex-1 relative bg-slate-950/50 flex items-center justify-center">
          <!-- D3 Map will be rendered here -->
          
          <!-- Map Overlay -->
          <div class="absolute bottom-4 left-4 p-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg space-y-2 z-20 pointer-events-none">
            <div class="flex items-center gap-2 text-[10px]">
              <span class="w-2.5 h-2.5 rounded bg-risk-critical"></span>
              <span>极高风险</span>
            </div>
            <div class="flex items-center gap-2 text-[10px]">
              <span class="w-2.5 h-2.5 rounded bg-risk-high"></span>
              <span>高风险</span>
            </div>
            <div class="flex items-center gap-2 text-[10px]">
              <span class="w-2.5 h-2.5 rounded bg-haier-blue"></span>
              <span>正常监控</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Alert List & Trends -->
      <div class="lg:col-span-4 flex flex-col gap-3 h-full overflow-hidden">
        <!-- Trend Chart -->
        <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col h-1/2 min-h-0">
          <h2 class="font-bold text-xs mb-2">风险指数趋势</h2>
          <div ref="riskTrendsChart" class="flex-1 w-full min-h-0"></div>
        </div>

        <!-- Alert Feed -->
        <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-4 h-1/2 flex flex-col min-h-0">
          <div class="flex items-center justify-between mb-3">
            <h2 class="font-bold text-xs">实时情报中心</h2>
            <button class="text-[10px] text-haier-blue flex items-center gap-1 hover:underline">
              全部 <ChevronRight class="w-3 h-3" />
            </button>
          </div>
          <div class="flex-1 space-y-3 overflow-auto custom-scrollbar pr-2">
            <div v-for="alert in riskData.globalAlerts" :key="alert.id" class="p-3 bg-slate-800/40 rounded-lg border border-slate-800/50 hover:border-slate-700 transition-colors cursor-pointer group">
              <div class="flex items-start justify-between mb-1.5">
                <span 
                  class="text-[9px] px-1.5 py-0.5 rounded font-bold"
                  :class="{
                    'bg-risk-critical/20 text-risk-critical': alert.severity === 'Critical',
                    'bg-risk-high/20 text-risk-high': alert.severity === 'High',
                    'bg-risk-medium/20 text-risk-medium': alert.severity === 'Medium',
                    'bg-slate-700 text-slate-300': alert.severity === 'Low',
                  }"
                >
                  {{ alert.severity }}
                </span>
                <span class="text-[9px] text-slate-500">{{ alert.time }}</span>
              </div>
              <h4 class="text-xs font-medium mb-1 line-clamp-1 group-hover:text-haier-blue transition-colors">{{ alert.title }}</h4>
              <div class="flex items-center gap-2 text-[9px] text-slate-500">
                <span class="px-1.5 py-0.5 bg-slate-800 rounded">{{ alert.type }}</span>
                <span>•</span>
                <span>{{ alert.region }}</span>
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

<style scoped>
.graticule {
  pointer-events: none;
}
</style>
