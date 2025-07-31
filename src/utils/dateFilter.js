import { isWithinInterval, parseISO, format } from 'date-fns';

/**
 * Filter data based on date range
 * @param {Array} data - Array of data objects
 * @param {Object} dateRange - Object with 'from' and 'to' Date objects
 * @param {string} dateField - Field name containing the date (default: 'date')
 * @returns {Array} Filtered data array
 */
export const filterDataByDateRange = (data, dateRange, dateField = 'date') => {
  if (!data || !Array.isArray(data) || !dateRange?.from || !dateRange?.to) {
    return data || [];
  }

  return data.filter(item => {
    const itemDate = item[dateField];
    if (!itemDate) return false;

    // Handle different date formats
    let date;
    if (itemDate instanceof Date) {
      date = itemDate;
    } else if (typeof itemDate === 'string') {
      // Try to parse the date string
      try {
        date = parseISO(itemDate);
      } catch {
        // If parsing fails, try creating a new Date
        date = new Date(itemDate);
      }
    } else {
      return false;
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return false;
    }

    return isWithinInterval(date, {
      start: dateRange.from,
      end: dateRange.to
    });
  });
};

/**
 * Generate mock data with dates for filtering
 * @param {Object} originalData - Original mock data
 * @param {Object} dateRange - Current date range filter
 * @returns {Object} Filtered mock data
 */
export const generateFilteredMockData = (originalData, dateRange) => {
  if (!dateRange?.from || !dateRange?.to) {
    return originalData;
  }

  // Generate dates within the range for revenue data
  const filteredRevenueData = originalData.revenueData?.map((item, index) => {
    const totalDays = Math.ceil((dateRange.to - dateRange.from) / (1000 * 60 * 60 * 24));
    const dayInterval = Math.max(1, Math.floor(totalDays / originalData.revenueData.length));
    const itemDate = new Date(dateRange.from);
    itemDate.setDate(itemDate.getDate() + (index * dayInterval));
    
    return {
      ...item,
      date: itemDate,
      month: format(itemDate, 'MMM')
    };
  }) || [];

  // Generate dates for table data
  const filteredTableData = originalData.tableData?.map(item => {
    const randomDaysAgo = Math.floor(Math.random() * Math.ceil((dateRange.to - dateRange.from) / (1000 * 60 * 60 * 24)));
    const itemDate = new Date(dateRange.to);
    itemDate.setDate(itemDate.getDate() - randomDaysAgo);
    
    return {
      ...item,
      lastLogin: format(itemDate, 'yyyy-MM-dd'),
      date: itemDate
    };
  }).filter(item => 
    isWithinInterval(item.date, {
      start: dateRange.from,
      end: dateRange.to
    })
  ) || [];

  return {
    ...originalData,
    revenueData: filteredRevenueData,
    tableData: filteredTableData,
    // Preserve chart data that doesn't need date filtering
    channelData: originalData.channelData,
    userRoles: originalData.userRoles
  };
};

/**
 * Get default date range (Last 30 days)
 * @returns {Object} Date range object with 'from' and 'to' properties
 */
export const getDefaultDateRange = () => {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 29); // Last 30 days
  
  return { from, to };
};