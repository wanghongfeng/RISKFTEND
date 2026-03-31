# 海尔集团供应链风险管理平台 - API 接口文档 (Mock)

此文档旨在为后端开发人员提供 Haier SCRM 平台所需的接口定义及数据结构。目前前端采用 Mock 方式进行开发。

## 1. 风险概览接口 (Dashboard)

**接口路径**: `/api/dashboard`  
**方法**: `GET`  
**描述**: 获取全球风险健康值、统计指标、实时情报及地图数据。

### 响应参数 (Response)
| 字段名 | 类型 | 必填 | 描述 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| riskScore | Number | 是 | 全域风险健康值 (0-100) | 72 |
| riskTrends | Array[Number] | 是 | 过去一周风险指数趋势数据 | [65, 68, 72...] |
| stats | Object | 是 | 关键统计指标 | - |
| stats.criticalAlerts | Number | 是 | 极高风险项数量 | 3 |
| stats.highAlerts | Number | 是 | 高风险项数量 | 12 |
| stats.affectedRoutes | Number | 是 | 受影响航线数量 | 12 |
| stats.affectedFactories | Number | 是 | 受影响工厂数量 | 5 |
| stats.potentialLoss | String | 是 | 潜在成本损失金额 | "¥2.4M" |
| globalAlerts | Array[Object] | 是 | 实时情报列表 | - |
| globalAlerts[].id | Number | 是 | 情报唯一ID | 1 |
| globalAlerts[].type | String | 是 | 风险类型 (Geopolitical/Trade/Disaster/Financial) | "Geopolitical" |
| globalAlerts[].severity | String | 是 | 严重程度 (Critical/High/Medium/Low) | "Critical" |
| globalAlerts[].title | String | 是 | 情报标题 | "红海航运通道阻塞风险" |
| globalAlerts[].time | String | 是 | 发布时间/相对时间 | "2小时前" |
| globalAlerts[].region | String | 是 | 涉及地区 | "中东" |
| globeData | Object | 是 | 地图可视化数据 | - |
| globeData.points | Array[Object] | 是 | 地图风险标注点 | - |
| globeData.points[].lat | Number | 是 | 纬度 | 36.067 |
| globeData.points[].lng | Number | 是 | 经度 | 120.382 |
| globeData.points[].color | String | 是 | 标注颜色 (Hex) | "#FF4D4F" |
| globeData.points[].label | String | 是 | 标注名称 | "青岛总部" |

---

## 2. 贸易与关税风险接口 (Trade Risk)

**接口路径**: `/api/trade-risk`  
**方法**: `GET`  
**描述**: 获取全球重点市场的关税变动及贸易政策预警。

### 响应参数 (Response)
| 字段名 | 类型 | 必填 | 描述 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| tariffData | Array[Object] | 是 | 关税动态列表 | - |
| tariffData[].country | String | 是 | 国家/地区名称 | "美国" |
| tariffData[].category | String | 是 | 产品类别 | "空调配件" |
| tariffData[].current | String | 是 | 当前税率 | "25%" |
| tariffData[].status | String | 是 | 政策状态 (Stable/Under Review/New Policy) | "Stable" |
| tariffData[].trend | String | 是 | 趋势 (Up/Down/Neutral) | "Neutral" |
| tariffData[].impact | String | 是 | 业务影响级别 (Critical/High/Medium/Low) | "High" |
| tradeAlerts | Array[Object] | 是 | 贸易合规预警列表 | - |
| tradeAlerts[].id | Number | 是 | 预警ID | 1 |
| tradeAlerts[].title | String | 是 | 预警标题 | "欧盟碳边境调节机制更新" |
| tradeAlerts[].type | String | 是 | 预警分类 (Policy/Tariff/Regulation) | "Policy" |
| tradeAlerts[].level | String | 是 | 风险等级 (Critical/High/Medium) | "High" |
| tradeAlerts[].date | String | 是 | 发布日期 | "2024-03-25" |

---

## 3. 供应商风险接口 (Supplier Risk)

**接口路径**: `/api/supplier-risk`  
**方法**: `GET`  
**描述**: 获取供应商多维风险评估数据及健康评分。

### 响应参数 (Response)
| 字段名 | 类型 | 必填 | 描述 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| suppliers | Array[Object] | 是 | 供应商清单 | - |
| suppliers[].id | Number | 是 | 供应商唯一ID | 1 |
| suppliers[].name | String | 是 | 供应商全称 | "青岛XX电子科技有限公司" |
| suppliers[].category | String | 是 | 供应物料类别 | "核心组件-主板" |
| suppliers[].location | String | 是 | 地理位置 | "中国·青岛" |
| suppliers[].riskScore | Number | 是 | 综合健康评分 (0-100) | 88 |
| suppliers[].status | String | 是 | 风险状态 (Low/Medium/High) | "Low" |
| suppliers[].trend | String | 是 | 评分趋势 (Stable/Up/Down) | "Stable" |

---

## 4. 物流监控接口 (Logistics)

**接口路径**: `/api/logistics`  
**方法**: `GET`  
**描述**: 监控在途货运航线进度及主要港口状态。

### 响应参数 (Response)
| 字段名 | 类型 | 必填 | 描述 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| routes | Array[Object] | 是 | 重点航线监控列表 | - |
| routes[].id | Number | 是 | 航线ID | 1 |
| routes[].name | String | 是 | 航线起止描述 | "青岛 - 鹿特丹" |
| routes[].status | String | 是 | 运输状态 (Delayed/On Time/Risk) | "Delayed" |
| routes[].type | String | 是 | 运输方式 (Sea/Rail/Air) | "Sea" |
| routes[].progress | Number | 是 | 运输进度百分比 (0-100) | 65 |
| routes[].eta | String | 是 | 预计到达日期 | "2024-04-12" |
| routes[].risk | String | 是 | 航线风险等级 | "High" |
| ports | Array[Object] | 是 | 港口运行状态列表 | - |
| ports[].name | String | 是 | 港口名称 | "青岛港" |
| ports[].status | String | 是 | 运行状态 (Normal/Congested) | "Normal" |
| ports[].density | String | 是 | 泊位/堆场密度百分比 | "45%" |

---

## 5. 风险预警中心接口 (Alerts)

**接口路径**: `/api/alerts`  
**方法**: `GET`  
**描述**: 获取全域风险事件的时间轴数据及分类统计。

### 响应参数 (Response)
| 字段名 | 类型 | 必填 | 描述 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| timeline | Array[Object] | 是 | 风险事件时间轴 | - |
| timeline[].id | Number | 是 | 事件ID | 1 |
| timeline[].title | String | 是 | 事件标题 | "红海局势升级导致航线绕行" |
| timeline[].date | String | 是 | 事件发生/更新日期 | "2024-03-31" |
| timeline[].category | String | 是 | 事件分类 (Geopolitical/Operation/Social) | "Geopolitical" |
| timeline[].severity | String | 是 | 严重程度 (Critical/High/Medium/Low) | "Critical" |
| timeline[].desc | String | 是 | 事件详细描述 | "受苏伊士运河通行受阻..." |

---

## 数据字典 (枚举定义)

### 严重程度/风险等级 (Severity/Risk Level)
*   `Critical`: 极高风险 (红色)，需立即启动应急响应。
*   `High`: 高风险 (橙色)，需重点监控并准备替代方案。
*   `Medium`: 中风险 (蓝色)，常规预警。
*   `Low`: 低风险 (绿色/灰色)，正常运行。

### 风险类型 (Risk Categories)
*   `Geopolitical`: 地缘政治风险。
*   `Trade`: 贸易与关税政策风险。
*   `Disaster`: 自然灾害/极端天气风险。
*   `Financial`: 供应商财务/信用风险。
*   `Operation`: 供应商生产运营风险。
*   `Social`: 社会/罢工/安全风险。
