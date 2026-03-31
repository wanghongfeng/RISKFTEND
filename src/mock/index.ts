// Mock data for the platform
export const mockDashboardData = {
  riskScore: 72,
  riskTrends: [65, 68, 72, 70, 75, 72, 72],
  stats: {
    criticalAlerts: 3,
    highAlerts: 12,
    affectedRoutes: 12,
    affectedFactories: 5,
    potentialLoss: '¥2.4M'
  },
  globalAlerts: [
    { id: 1, type: 'Geopolitical', severity: 'Critical', title: '红海航运通道阻塞风险', time: '2小时前', region: '中东' },
    { id: 2, type: 'Trade', severity: 'High', title: '欧盟对华家电反倾销调查更新', time: '5小时前', region: '欧洲' },
    { id: 3, type: 'Disaster', severity: 'Medium', title: '东南亚台风影响电子组件工厂', time: '8小时前', region: '亚洲' },
    { id: 4, type: 'Financial', severity: 'Low', title: '供应商 A 信用评级下调', time: '1天前', region: '北美' },
  ],
  globeData: {
    points: [
      { lat: 36.067, lng: 120.382, size: 0.1, color: '#FF4D4F', label: '青岛总部' },
      { lat: 48.135, lng: 11.582, size: 0.05, color: '#FAAD14', label: '欧洲中心' },
      { lat: 37.774, lng: -122.419, size: 0.05, color: '#1890FF', label: '北美分部' },
      { lat: 1.352, lng: 103.819, size: 0.08, color: '#FF4D4F', label: '东南亚基地' },
    ],
    arcs: [
      { startLat: 36.067, startLng: 120.382, endLat: 48.135, endLng: 11.582, color: ['#005AAA', '#FAAD14'] },
      { startLat: 36.067, startLng: 120.382, endLat: 37.774, endLng: -122.419, color: ['#005AAA', '#1890FF'] },
      { startLat: 36.067, startLng: 120.382, endLat: 1.352, endLng: 103.819, color: ['#005AAA', '#FF4D4F'] },
    ]
  }
};

export const mockTradeRiskData = {
  tariffData: [
    { country: '美国', category: '空调配件', current: '25%', status: 'Stable', trend: 'Neutral', impact: 'High' },
    { country: '欧盟', category: '洗衣机整机', current: '12%', status: 'Under Review', trend: 'Up', impact: 'Critical' },
    { country: '印度', category: '冰箱压缩机', current: '10%', status: 'New Policy', trend: 'Up', impact: 'Medium' },
    { country: '巴西', category: '智能家电', current: '35%', status: 'Decreasing', trend: 'Down', impact: 'High' },
  ],
  tradeAlerts: [
    { id: 1, title: '欧盟碳边境调节机制 (CBAM) 实施指南更新', type: 'Policy', level: 'High', date: '2024-03-25' },
    { id: 2, title: '印度提高部分家电零部件进口关税', type: 'Tariff', level: 'Critical', date: '2024-03-22' },
    { id: 3, title: '美国针对特定家电产品的 301 条款豁免延期', type: 'Regulation', level: 'Medium', date: '2024-03-20' },
  ]
};

export const mockSupplierRiskData = {
  suppliers: [
    { id: 1, name: '青岛XX电子科技有限公司', category: '核心组件-主板', location: '中国·青岛', riskScore: 88, status: 'Low', trend: 'Stable' },
    { id: 2, name: 'Siemens Industrial Ltd', category: '核心组件-电机', location: '德国·慕尼黑', riskScore: 72, status: 'Medium', trend: 'Down' },
    { id: 3, name: 'Samsung Semiconductor', category: '存储芯片', location: '韩国·首尔', riskScore: 45, status: 'High', trend: 'Up' },
    { id: 4, name: '东莞XX塑胶模具有限公司', category: '结构件-外壳', location: '中国·东莞', riskScore: 94, status: 'Low', trend: 'Stable' },
    { id: 5, name: 'Texas Instruments', category: '电源管理芯片', location: '美国·达拉斯', riskScore: 68, status: 'Medium', trend: 'Up' },
  ]
};

export const mockLogisticsData = {
  routes: [
    { id: 1, name: '青岛 - 鹿特丹', status: 'Delayed', type: 'Sea', progress: 65, eta: '2024-04-12', risk: 'High' },
    { id: 2, name: '上海 - 汉堡', status: 'On Time', type: 'Rail', progress: 40, eta: '2024-04-05', risk: 'Low' },
    { id: 3, name: '深圳 - 洛杉矶', status: 'Risk', type: 'Sea', progress: 85, eta: '2024-04-02', risk: 'Medium' },
    { id: 4, name: '胡志明 - 广州', status: 'On Time', type: 'Sea', progress: 20, eta: '2024-04-10', risk: 'Low' },
  ],
  ports: [
    { name: '青岛港', status: 'Normal', density: '45%' },
    { name: '鹿特丹港', status: 'Congested', density: '88%' },
    { name: '洛杉矶港', status: 'Normal', density: '62%' },
  ]
};

export const mockAlertsData = {
  timeline: [
    { id: 1, title: '红海局势升级导致航线绕行', date: '2024-03-31', category: 'Geopolitical', severity: 'Critical', desc: '受苏伊士运河通行受阻影响，所有往返欧洲航线需绕行好望角，增加14天航程。' },
    { id: 2, title: '马来西亚半导体工厂突发停电', date: '2024-03-30', category: 'Operation', severity: 'High', desc: '受当地电网故障影响，核心供应商生产线停工48小时，预计影响订单交付。' },
    { id: 3, title: '主要港口罢工预警', date: '2024-03-29', category: 'Social', severity: 'Medium', desc: '欧洲主要港口计划下周举行罢工，可能导致清关延迟。' },
  ]
};
