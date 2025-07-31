import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Calendar, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { cn } from '../../utils/cn';
import 'react-datepicker/dist/react-datepicker.css';

const presetRanges = [
  {
    label: 'Last 7 Days',
    getValue: () => ({
      from: subDays(new Date(), 6),
      to: new Date()
    })
  },
  {
    label: 'Last 30 Days',
    getValue: () => ({
      from: subDays(new Date(), 29),
      to: new Date()
    })
  },
  {
    label: 'Last 90 Days',
    getValue: () => ({
      from: subDays(new Date(), 89),
      to: new Date()
    })
  },
  {
    label: 'This Month',
    getValue: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date())
    })
  },
  {
    label: 'Last Month',
    getValue: () => {
      const lastMonth = subMonths(new Date(), 1);
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth)
      };
    }
  }
];

export const AdvancedDateRangePicker = ({ dateRange, onDateChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(dateRange?.from || null);
  const [tempEndDate, setTempEndDate] = useState(dateRange?.to || null);

  const handlePresetSelect = (preset) => {
    const range = preset.getValue();
    onDateChange(range);
    setIsOpen(false);
    setShowCustomRange(false);
  };

  const handleCustomRangeSelect = () => {
    setShowCustomRange(true);
  };

  const handleCustomRangeApply = () => {
    if (tempStartDate && tempEndDate) {
      onDateChange({
        from: tempStartDate,
        to: tempEndDate
      });
      setIsOpen(false);
      setShowCustomRange(false);
    }
  };

  const handleCustomRangeCancel = () => {
    setTempStartDate(dateRange?.from || null);
    setTempEndDate(dateRange?.to || null);
    setShowCustomRange(false);
  };

  const formatDateRange = () => {
    if (!dateRange?.from) {
      return 'Select date range';
    }
    
    if (!dateRange.to) {
      return format(dateRange.from, 'MMM dd, yyyy');
    }
    
    // Check if it matches any preset
    const matchingPreset = presetRanges.find(preset => {
      const presetRange = preset.getValue();
      return (
        format(dateRange.from, 'yyyy-MM-dd') === format(presetRange.from, 'yyyy-MM-dd') &&
        format(dateRange.to, 'yyyy-MM-dd') === format(presetRange.to, 'yyyy-MM-dd')
      );
    });

    if (matchingPreset) {
      return matchingPreset.label;
    }
    
    return `${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'justify-between text-left font-normal min-w-[200px]',
            !dateRange?.from && 'text-muted-foreground',
            className
          )}
        >
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4">
          {!showCustomRange ? (
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground mb-3">
                Quick Select
              </div>
              {presetRanges.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handlePresetSelect(preset)}
                >
                  {preset.label}
                </Button>
              ))}
              
              <div className="border-t pt-2 mt-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleCustomRangeSelect}
                >
                  Custom Range
                </Button>
              </div>
              
              {dateRange?.from && (
                <div className="border-t pt-2 mt-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      onDateChange(null);
                      setIsOpen(false);
                    }}
                  >
                    Clear selection
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm font-medium text-muted-foreground">
                Custom Date Range
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Start Date
                  </label>
                  <DatePicker
                    selected={tempStartDate}
                    onChange={setTempStartDate}
                    selectsStart
                    startDate={tempStartDate}
                    endDate={tempEndDate}
                    maxDate={new Date()}
                    className="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    placeholderText="Select start date"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    End Date
                  </label>
                  <DatePicker
                    selected={tempEndDate}
                    onChange={setTempEndDate}
                    selectsEnd
                    startDate={tempStartDate}
                    endDate={tempEndDate}
                    minDate={tempStartDate}
                    maxDate={new Date()}
                    className="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    placeholderText="Select end date"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCustomRangeCancel}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleCustomRangeApply}
                  disabled={!tempStartDate || !tempEndDate}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};