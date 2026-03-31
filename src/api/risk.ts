import { mockDashboardData, mockTradeRiskData, mockSupplierRiskData, mockLogisticsData, mockAlertsData } from '../mock'

// Simulated API calls that return mock data
// In the future, these can be replaced with real axios calls to the backend

export const getDashboardData = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockDashboardData;
}

export const getTradeRiskData = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockTradeRiskData;
}

export const getSupplierRiskData = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockSupplierRiskData;
}

export const getLogisticsData = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockLogisticsData;
}

export const getAlertsData = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockAlertsData;
}
