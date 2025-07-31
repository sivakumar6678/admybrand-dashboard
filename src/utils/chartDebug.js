// Chart data structure examples for debugging
export const SAMPLE_DATA_STRUCTURES = {
  overviewData: [
    { month: "Jan", moodScore: 8.2, productivity: 85, teamSize: 12 },
    { month: "Feb", moodScore: 7.8, productivity: 88, teamSize: 14 },
    { month: "Mar", moodScore: 8.5, productivity: 92, teamSize: 15 },
    { month: "Apr", moodScore: 7.9, productivity: 87, teamSize: 16 },
    { month: "May", moodScore: 8.7, productivity: 94, teamSize: 18 },
    { month: "Jun", moodScore: 8.1, productivity: 89, teamSize: 20 }
  ],
  
  revenueData: [
    { month: "Jan", revenue: 245000, productivity: 85 },
    { month: "Feb", revenue: 267000, productivity: 88 },
    { month: "Mar", revenue: 298000, productivity: 92 },
    { month: "Apr", revenue: 276000, productivity: 87 },
    { month: "May", revenue: 312000, productivity: 94 },
    { month: "Jun", revenue: 289000, productivity: 89 }
  ],
  
  sentimentData: [
    { week: "Week 1", sentiment: 7.5, engagement: 78 },
    { week: "Week 2", sentiment: 8.1, engagement: 82 },
    { week: "Week 3", sentiment: 7.8, engagement: 79 },
    { week: "Week 4", sentiment: 8.3, engagement: 85 },
    { week: "Week 5", sentiment: 8.0, engagement: 81 },
    { week: "Week 6", sentiment: 8.6, engagement: 88 }
  ],
  
  workloadData: [
    { week: "Week 1", hoursWorked: 42, goalHours: 40, efficiency: 95 },
    { week: "Week 2", hoursWorked: 45, goalHours: 40, efficiency: 88 },
    { week: "Week 3", hoursWorked: 38, goalHours: 40, efficiency: 98 },
    { week: "Week 4", hoursWorked: 44, goalHours: 40, efficiency: 92 },
    { week: "Week 5", hoursWorked: 41, goalHours: 40, efficiency: 96 },
    { week: "Week 6", hoursWorked: 43, goalHours: 40, efficiency: 90 }
  ],
  
  departmentData: [
    { department: "Engineering", count: 45, percentage: 42.5 },
    { department: "Design", count: 18, percentage: 17.0 },
    { department: "Marketing", count: 22, percentage: 20.8 },
    { department: "Sales", count: 21, percentage: 19.8 }
  ]
};

// Validation functions
export const validateChartData = {
  overviewData: (data) => {
    if (!Array.isArray(data)) return false;
    return data.every(item => 
      item.hasOwnProperty('month') && 
      item.hasOwnProperty('moodScore') && 
      item.hasOwnProperty('productivity') &&
      typeof item.moodScore === 'number' &&
      typeof item.productivity === 'number'
    );
  },
  
  revenueData: (data) => {
    if (!Array.isArray(data)) return false;
    return data.every(item => 
      item.hasOwnProperty('month') && 
      item.hasOwnProperty('revenue') && 
      item.hasOwnProperty('productivity') &&
      typeof item.revenue === 'number' &&
      typeof item.productivity === 'number'
    );
  },
  
  sentimentData: (data) => {
    if (!Array.isArray(data)) return false;
    return data.every(item => 
      item.hasOwnProperty('week') && 
      item.hasOwnProperty('sentiment') && 
      item.hasOwnProperty('engagement') &&
      typeof item.sentiment === 'number' &&
      typeof item.engagement === 'number'
    );
  },
  
  workloadData: (data) => {
    if (!Array.isArray(data)) return false;
    return data.every(item => 
      item.hasOwnProperty('week') && 
      item.hasOwnProperty('hoursWorked') && 
      item.hasOwnProperty('goalHours') &&
      typeof item.hoursWorked === 'number' &&
      typeof item.goalHours === 'number'
    );
  },
  
  departmentData: (data) => {
    if (!Array.isArray(data)) return false;
    return data.every(item => 
      item.hasOwnProperty('department') && 
      item.hasOwnProperty('count') && 
      item.hasOwnProperty('percentage') &&
      typeof item.count === 'number' &&
      typeof item.percentage === 'number'
    );
  }
};

// Debug helper to log chart data with validation (production-ready)
export const debugChartData = (chartType, data) => {
  // Only log in development mode
  if (import.meta.env.DEV) {
    console.group(`🔍 ${chartType} Debug`);
    console.log('Data received:', data);
    console.log('Data type:', typeof data);
    console.log('Is array:', Array.isArray(data));
    console.log('Data length:', data?.length || 'N/A');
    
    if (validateChartData[chartType]) {
      const isValid = validateChartData[chartType](data);
      console.log('Data structure valid:', isValid);
      
      if (!isValid && data && Array.isArray(data) && data.length > 0) {
        console.log('Sample expected structure:', SAMPLE_DATA_STRUCTURES[chartType][0]);
        console.log('Actual first item:', data[0]);
      }
    }
    
    console.groupEnd();
  }
};