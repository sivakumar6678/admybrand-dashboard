import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  FileText,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  Filter,
  X
} from "lucide-react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { useToast } from "../hooks/useToast";
import { cn } from "../utils/cn";

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

export default function DataTable({ data, loading = false }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const { toast } = useToast();

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

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('User Analytics Report', 20, 20);
    
    const tableData = sortedData.map(item => [
      item.name,
      item.email,
      item.role,
      item.status,
      item.lastLogin,
      `$${item.revenue.toLocaleString()}`
    ]);

    doc.autoTable({
      head: [['Name', 'Email', 'Role', 'Status', 'Last Login', 'Revenue']],
      body: tableData,
      startY: 30,
    });

    doc.save('analytics-report.pdf');
  };

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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="h-10 bg-muted animate-pulse rounded flex-1"></div>
              <div className="h-10 bg-muted animate-pulse rounded w-32"></div>
              <div className="h-10 bg-muted animate-pulse rounded w-32"></div>
            </div>
            <div className="h-96 bg-muted animate-pulse rounded"></div>
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
    >
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>User Data</CardTitle>
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
        
        <CardContent>
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
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      <SortIcon column="name" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center gap-2">
                      Email
                      <SortIcon column="email" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center gap-2">
                      Role
                      <SortIcon column="role" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <SortIcon column="status" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('lastLogin')}
                  >
                    <div className="flex items-center gap-2">
                      Last Login
                      <SortIcon column="lastLogin" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 text-right"
                    onClick={() => handleSort('revenue')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Revenue
                      <SortIcon column="revenue" />
                    </div>
                  </TableHead>
                  <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
              <TableBody>
                {paginatedData.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-muted/50"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(user.id)}
                        onCheckedChange={(checked) => handleSelectRow(user.id, checked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={user.status} />
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${user.revenue.toLocaleString()}
                    </TableCell>
                    <TableCell>
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

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, sortedData.length)} of{' '}
              {sortedData.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}