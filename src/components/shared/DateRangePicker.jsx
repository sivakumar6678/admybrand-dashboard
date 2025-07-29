import React, { useState } from 'react'
import { Calendar } from 'lucide-react'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns'
import { cn } from '../../utils/cn'

const presetRanges = [
  {
    label: 'Today',
    getValue: () => ({
      from: new Date(),
      to: new Date()
    })
  },
  {
    label: 'Last 7 days',
    getValue: () => ({
      from: subDays(new Date(), 6),
      to: new Date()
    })
  },
  {
    label: 'Last 30 days',
    getValue: () => ({
      from: subDays(new Date(), 29),
      to: new Date()
    })
  },
  {
    label: 'This month',
    getValue: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date())
    })
  },
  {
    label: 'Last month',
    getValue: () => {
      const lastMonth = subMonths(new Date(), 1)
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth)
      }
    }
  }
]

export const DateRangePicker = ({ dateRange, onDateRangeChange, className }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handlePresetSelect = (preset) => {
    const range = preset.getValue()
    onDateRangeChange(range)
    setIsOpen(false)
  }

  const formatDateRange = () => {
    if (!dateRange?.from) {
      return 'Select date range'
    }
    
    if (!dateRange.to) {
      return format(dateRange.from, 'MMM dd, yyyy')
    }
    
    return `${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}`
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'justify-start text-left font-normal',
            !dateRange?.from && 'text-muted-foreground',
            className
          )}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <div className="space-y-2">
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
          </div>
          
          {dateRange?.from && (
            <div className="mt-3 pt-3 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700"
                onClick={() => {
                  onDateRangeChange(null)
                  setIsOpen(false)
                }}
              >
                Clear selection
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}