import React, { useState, useMemo, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FixedSizeList as List } from 'react-window'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import { Badge } from '../ui/badge'
import { 
  Search, 
  Download, 
  Filter,
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Users,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { useDebounce } from '../../hooks/usePerformanceMonitor'
import { debounce } from '../../utils/performance'
import { LoadingSkeleton } from '../shared/LoadingSkeleton'
import { cn } from '../../utils/cn'

// Optimized table row component
const TableRow = memo(({ index, style, data }) => {
  const { items, selectedItems, onToggleSelect, onAction } = data
  const item = items[index]
  
  if (!item) return null

  const isSelected = selectedItems.has(item.id)

  return (
    <motion.div
      style={style}
      className={cn(
        "flex items-center px-6 py-4 border-b border-border/50 hover:bg-muted/30 transition-colors",
        isSelected && "bg-primary/5 border-primary/20"
      )}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.01 }}
    >
      {/* Checkbox */}
      <div className="w-12 flex-shrink-0">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(item.id)}
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </div>

      {/* Avatar */}
      <div className="w-16 flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-sm font-semibold text-primary">
          {item.name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
      </div>

      {/* Name & Email */}
      <div className="flex-1 min-w-0 pr-4">
        <div className="font-medium text-foreground truncate">{item.name}</div>
        <div className="text-sm text-muted-foreground truncate">{item.email}</div>
      </div>

      {/* Role */}
      <div className="w-24 flex-shrink-0">
        <Badge 
          variant={item.role === 'Admin' ? 'default' : 'secondary'}
          className="text-xs"
        >
          {item.role}
        </Badge>
      </div>

      {/* Status */}
      <div className="w-20 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            item.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
          )} />
          <span className="text-sm text-muted-foreground">{item.status}</span>
        </div>
      </div>

      {/* Last Login */}
      <div className="w-32 flex-shrink-0 text-sm text-muted-foreground">
        {new Date(item.lastLogin).toLocaleDateString()}
      </div>

      {/* Actions */}
      <div className="w-12 flex-shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onAction('view', item)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction('edit', item)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onAction('delete', item)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  )
})

// Optimized table header
const TableHeader = memo(({ sortConfig, onSort, selectedCount, totalCount, onSelectAll }) => {
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4 opacity-50" />
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4 text-primary" />
      : <ArrowDown className="h-4 w-4 text-primary" />
  }

  return (
    <div className="flex items-center px-6 py-4 bg-muted/30 border-b border-border font-medium text-sm">
      {/* Select All */}
      <div className="w-12 flex-shrink-0">
        <Checkbox
          checked={selectedCount === totalCount && totalCount > 0}
          indeterminate={selectedCount > 0 && selectedCount < totalCount}
          onCheckedChange={onSelectAll}
        />
      </div>

      <div className="w-16 flex-shrink-0"></div>

      {/* Name */}
      <div className="flex-1 min-w-0 pr-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSort('name')}
          className="h-auto p-0 font-medium hover:bg-transparent"
        >
          Name
          {getSortIcon('name')}
        </Button>
      </div>

      {/* Role */}
      <div className="w-24 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSort('role')}
          className="h-auto p-0 font-medium hover:bg-transparent"
        >
          Role
          {getSortIcon('role')}
        </Button>
      </div>

      {/* Status */}
      <div className="w-20 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSort('status')}
          className="h-auto p-0 font-medium hover:bg-transparent"
        >
          Status
          {getSortIcon('status')}
        </Button>
      </div>

      {/* Last Login */}
      <div className="w-32 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSort('lastLogin')}
          className="h-auto p-0 font-medium hover:bg-transparent"
        >
          Last Login
          {getSortIcon('lastLogin')}
        </Button>
      </div>

      <div className="w-12 flex-shrink-0"></div>
    </div>
  )
})

export const OptimizedDataTable = memo(({ data = [], isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [selectedItems, setSelectedItems] = useState(new Set())
  const [itemsPerPage, setItemsPerPage] = useState(20)

  // Debounced search
  const debouncedSearch = useDebounce(searchTerm, 300)

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return []

    let filtered = data.filter(item => {
      const matchesSearch = !debouncedSearch || 
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.email.toLowerCase().includes(debouncedSearch.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      const matchesRole = roleFilter === 'all' || item.role === roleFilter

      return matchesSearch && matchesStatus && matchesRole
    })

    // Sort data
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      
      if (sortConfig.key === 'lastLogin') {
        const aDate = new Date(aValue)
        const bDate = new Date(bValue)
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate
      }
      
      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
    })

    return filtered
  }, [data, debouncedSearch, statusFilter, roleFilter, sortConfig])

  // Event handlers
  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }, [])

  const handleToggleSelect = useCallback((id) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  const handleSelectAll = useCallback(() => {
    if (selectedItems.size === processedData.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(processedData.map(item => item.id)))
    }
  }, [selectedItems.size, processedData])

  const handleAction = useCallback((action, item) => {
    console.log(`Action: ${action}`, item)
    // Implement actions here
  }, [])

  const handleExport = useCallback(() => {
    const selectedData = processedData.filter(item => selectedItems.has(item.id))
    const dataToExport = selectedData.length > 0 ? selectedData : processedData
    
    // Create CSV content
    const headers = ['Name', 'Email', 'Role', 'Status', 'Last Login']
    const csvContent = [
      headers.join(','),
      ...dataToExport.map(item => [
        item.name,
        item.email,
        item.role,
        item.status,
        new Date(item.lastLogin).toLocaleDateString()
      ].join(','))
    ].join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users-export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }, [processedData, selectedItems])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <LoadingSkeleton className="h-6 w-32" />
            <LoadingSkeleton className="h-10 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <LoadingSkeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5 text-primary" />
              User Management
              <Badge variant="secondary" className="ml-2">
                {processedData.length} users
              </Badge>
            </CardTitle>

            <div className="flex items-center gap-3 flex-wrap">
              {selectedItems.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <Badge variant="outline">
                    {selectedItems.size} selected
                  </Badge>
                  <Button
                    onClick={handleExport}
                    size="sm"
                    variant="outline"
                    className="h-8"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 bg-background/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-32 bg-background/50">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Guest">Guest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Table Header */}
          <TableHeader
            sortConfig={sortConfig}
            onSort={handleSort}
            selectedCount={selectedItems.size}
            totalCount={processedData.length}
            onSelectAll={handleSelectAll}
          />

          {/* Virtual Scrolled Table Body */}
          <div className="h-96 border-b">
            <List
              height={384}
              itemCount={processedData.length}
              itemSize={72}
              itemData={{
                items: processedData,
                selectedItems,
                onToggleSelect: handleToggleSelect,
                onAction: handleAction
              }}
            >
              {TableRow}
            </List>
          </div>

          {/* Pagination Info */}
          <div className="flex justify-between items-center p-4 bg-muted/20">
            <div className="text-sm text-muted-foreground">
              Showing {processedData.length} of {data?.length || 0} users
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
})

OptimizedDataTable.displayName = 'OptimizedDataTable'