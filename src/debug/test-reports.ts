// Debug script to test reports API directly
// Run this in browser console to test reports generation

import { dashboardService } from '../lib/dashboard-api';

// Test function to generate all report types
export const testAllReports = async () => {
  console.log('🧪 Testing all report types...');
  
  const reportTypes = ['financial', 'project_status', 'client_activity', 'performance'];
  
  for (const reportType of reportTypes) {
    try {
      console.log(`\n🔄 Testing ${reportType} report...`);
      
      const response = await dashboardService.generateReport(reportType);
      
      if (response.success) {
        console.log(`✅ ${reportType} report generated successfully:`, response.data);
      } else {
        console.error(`❌ ${reportType} report failed:`, response.error);
      }
    } catch (error) {
      console.error(`💥 ${reportType} report error:`, error);
    }
    
    // Wait 1 second between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🏁 All report tests completed!');
};

// Test function to check database connection
export const testDatabaseConnection = async () => {
  console.log('🔌 Testing database connection...');
  
  try {
    const response = await dashboardService.getReports();
    
    if (response.success) {
      console.log('✅ Database connection working, reports:', response.data?.length || 0);
    } else {
      console.error('❌ Database connection failed:', response.error);
    }
  } catch (error) {
    console.error('💥 Database connection error:', error);
  }
};

// Test function to check individual data sources
export const testDataSources = async () => {
  console.log('📊 Testing data sources...');
  
  try {
    // Test projects
    const projects = await dashboardService.getProjects();
    console.log('Projects:', projects.success ? `${projects.data?.length} found` : projects.error);
    
    // Test messages
    const messages = await dashboardService.getMessages();
    console.log('Messages:', messages.success ? `${messages.data?.length} found` : messages.error);
    
    // Test stats
    const stats = await dashboardService.getDashboardStats();
    console.log('Stats:', stats.success ? 'loaded successfully' : stats.error);
    
  } catch (error) {
    console.error('💥 Data sources error:', error);
  }
};

// Add to window for easy access in console
if (typeof window !== 'undefined') {
  (window as any).testReports = {
    testAllReports,
    testDatabaseConnection,
    testDataSources
  };
  
  console.log('🧪 Report testing functions added to window.testReports');
  console.log('Usage:');
  console.log('  window.testReports.testAllReports()');
  console.log('  window.testReports.testDatabaseConnection()');
  console.log('  window.testReports.testDataSources()');
}
