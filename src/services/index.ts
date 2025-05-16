
// Re-export all services
export * from './authService';
export { getDashboardMetrics, getRecentCandidatesDashboard, getMockChartData } from './dashboardService';
export * from './recommendationsService';
export * from './reportsService';
export * from './utils/experienceUtils';
export * from './candidatesService';
    

// This index file allows importing from a single point:
// import { authenticateUser, getCandidates, ... } from '@/services';
