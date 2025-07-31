import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "./ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Skeleton } from "./ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown
} from "lucide-react";

import Papa from 'papaparse';
import { useToast } from "../hooks/useToast";

const RoleBadge = ({ role }) => {
  const variants = {
    Admin: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    Manager: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400", 
    User: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    Guest: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[role] || variants.Guest}`}>
      {role}
    </span>
  );
};

const StatusBadge = ({ status }) => (
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        status === 'Active'
          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      }`}
    >
      {status}
    </span>
  </div>
)

export default function DataTable({ data = [], loading = false }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const { toast } = useToast();

  // Debug table data in development only
  if (import.meta.env.DEV) {
    console.log('DataTable data:', { 
      data, 
      loading, 
      isArray: Array.isArray(data), 
      length: data?.length || 0,
      firstItem: data?.[0] || null 
    });
  }

  // Filter and search data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = Object.values(item).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesRole = roleFilter === "all" || item.role === roleFilter;
      
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [data, searchTerm, statusFilter, roleFilter]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(new Set(paginatedData.map(item => item.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (id, checked) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedRows(newSelected)
  }

  const handleRowAction = (action, user) => {
    toast({
      title: `${action} Action`,
      description: `${action} action performed on ${user.name}`,
    })
  }

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return null
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />
  }



  const exportToCSV = () => {
    const csvData = selectedRows.size > 0 
      ? data.filter(item => selectedRows.has(item.id))
      : sortedData

    const csv = Papa.unparse(csvData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'users_data.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: "Export Successful",
      description: `Exported ${csvData.length} records to CSV`,
    })
  };

  if (loading || !data || data.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0 pb-3">
          <div>
            <CardTitle className="text-xl font-bold">User Management</CardTitle>
            <CardDescription className="mt-1">
              Loading user data and performance metrics...
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4 pt-0">
          <div className="space-y-6 h-full">
            {/* Filter skeleton */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
            {/* Table skeleton */}
            <div className="space-y-3 flex-1">
              <Skeleton className="h-12 w-full" />
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
            {/* Pagination skeleton */}
            <div className="flex justify-between items-center py-4 border-t">
              <Skeleton className="h-4 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0 pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-bold">User Management</CardTitle>
              <CardDescription className="mt-1">
                Manage users, track revenue, and monitor performance metrics
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={exportToCSV}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-4 pt-0 flex flex-col overflow-hidden">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-32">
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

          {/* Table */}
          <div className="rounded-md border overflow-hidden flex-1 flex flex-col min-h-0 bg-card shadow-sm">
            <div className="overflow-auto flex-1 max-h-[900px] min-h-[650px]">
            <Table className="relative">
              <TableHeader className="sticky top-0 bg-muted/70 backdrop-blur-sm z-10 border-b-2 border-border">
                <TableRow className="border-b hover:bg-transparent">
                  <TableHead className="w-12 py-4 px-4 font-semibold">
                    <Checkbox
                      checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/30 transition-colors py-4 px-4 font-semibold"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      <SortIcon column="name" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/30 transition-colors py-4 px-4 font-semibold"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center gap-2">
                      Email
                      <SortIcon column="email" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/30 transition-colors py-4 px-4 font-semibold"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center gap-2">
                      Role
                      <SortIcon column="role" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/30 transition-colors py-4 px-4 font-semibold"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <SortIcon column="status" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/30 transition-colors py-4 px-4 font-semibold"
                    onClick={() => handleSort('lastLogin')}
                  >
                    <div className="flex items-center gap-2">
                      Last Login
                      <SortIcon column="lastLogin" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/30 transition-colors py-4 px-4 font-semibold text-right"
                    onClick={() => handleSort('revenue')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Revenue (₹)
                      <SortIcon column="revenue" />
                    </div>
                  </TableHead>
                  <TableHead className="w-12 py-4 px-4 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
              <TableBody>
                {paginatedData.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-muted/50 hover:shadow-sm transition-all duration-200 even:bg-muted/20 group border-b border-border/30"
                  >
                    <TableCell className="py-5 px-4">
                      <Checkbox
                        checked={selectedRows.has(user.id)}
                        onCheckedChange={(checked) => handleSelectRow(user.id, checked)}
                      />
                    </TableCell>
                    <TableCell className="font-semibold py-5 px-4 text-foreground">{user.name}</TableCell>
                    <TableCell className="py-5 px-4 text-muted-foreground">{user.email}</TableCell>
                    <TableCell className="py-5 px-4">
                      <RoleBadge role={user.role} />
                    </TableCell>
                    <TableCell className="py-5 px-4">
                      <StatusBadge status={user.status} />
                    </TableCell>
                    <TableCell className="py-5 px-4 text-muted-foreground">{user.lastLogin}</TableCell>
                    <TableCell className="text-right font-semibold py-5 px-4 text-foreground">
                      ₹{user.revenue.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRowAction('View', user)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRowAction('Edit', user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRowAction('Delete', user)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-2 py-6 px-2 border-t bg-muted/20">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground font-medium">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, sortedData.length)} of{' '}
                <span className="font-semibold">{sortedData.length}</span> results
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}