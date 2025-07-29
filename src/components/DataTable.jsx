import React, { useState, useMemo } from "react";
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
import { Select } from "./ui/select";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  FileText
} from "lucide-react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

export default function DataTable({ data, loading = false }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

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

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="ml-2 h-4 w-4" />
      : <ArrowDown className="ml-2 h-4 w-4" />;
  };

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
    const csv = Papa.unparse(sortedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'analytics-data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Analytics</CardTitle>
          <CardDescription>Detailed user data with analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-10 w-full animate-pulse bg-muted rounded"></div>
            <div className="h-64 w-full animate-pulse bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              User Analytics
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1 text-base">
              Detailed user data with advanced analytics and insights
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-primary/10 rounded-full">
              <span className="text-xs font-medium text-primary">
                {sortedData.length} Records
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enhanced Filters and Search */}
        <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-6 border">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <Input
                  placeholder="Search users by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 bg-background/50 border-2 focus:border-primary/50 transition-all duration-300"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-12 min-w-[120px] bg-background/50 border-2 focus:border-primary/50"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
              </div>
              
              <div className="relative">
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="h-12 min-w-[120px] bg-background/50 border-2 focus:border-primary/50"
                >
                  <option value="all">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="User">User</option>
                  <option value="Guest">Guest</option>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                onClick={exportToPDF}
                className="h-12 px-6 bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border-2 hover:border-primary/50 transition-all duration-300"
              >
                <FileText className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              
              <Button 
                variant="outline" 
                onClick={exportToCSV}
                className="h-12 px-6 bg-gradient-to-r from-secondary/10 to-primary/10 hover:from-secondary/20 hover:to-primary/20 border-2 hover:border-secondary/50 transition-all duration-300"
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Table */}
        <div className="bg-card/30 backdrop-blur-sm rounded-2xl border overflow-hidden">
          <Table className="relative">
            <TableHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <TableRow className="border-b-2 border-primary/10 hover:bg-transparent">
                <TableHead 
                  className="cursor-pointer hover:bg-primary/10 transition-all duration-300 font-semibold text-foreground h-14"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Name</span>
                    <div className="text-primary">{getSortIcon('name')}</div>
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-primary/10 transition-all duration-300 font-semibold text-foreground h-14"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Email</span>
                    <div className="text-primary">{getSortIcon('email')}</div>
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-primary/10 transition-all duration-300 font-semibold text-foreground h-14"
                  onClick={() => handleSort('role')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Role</span>
                    <div className="text-primary">{getSortIcon('role')}</div>
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-primary/10 transition-all duration-300 font-semibold text-foreground h-14"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Status</span>
                    <div className="text-primary">{getSortIcon('status')}</div>
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-primary/10 transition-all duration-300 font-semibold text-foreground h-14"
                  onClick={() => handleSort('lastLogin')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Last Login</span>
                    <div className="text-primary">{getSortIcon('lastLogin')}</div>
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-primary/10 transition-all duration-300 font-semibold text-foreground h-14 text-right"
                  onClick={() => handleSort('revenue')}
                >
                  <div className="flex items-center justify-end space-x-2">
                    <span>Revenue</span>
                    <div className="text-primary">{getSortIcon('revenue')}</div>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((user, index) => (
                <TableRow 
                  key={user.id} 
                  className="hover:bg-primary/5 transition-all duration-300 border-b border-border/50 group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <TableCell className="font-semibold text-foreground py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground py-4">{user.email}</TableCell>
                  <TableCell className="py-4">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                      user.role === 'Admin' ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-600 dark:text-red-400 border border-red-500/30' :
                      user.role === 'Manager' ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30' :
                      user.role === 'User' ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600 dark:text-green-400 border border-green-500/30' :
                      'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/30'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        user.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                      }`} />
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                        user.status === 'Active' 
                          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600 dark:text-green-400 border border-green-500/30'
                          : 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground py-4 font-mono text-sm">{user.lastLogin}</TableCell>
                  <TableCell className="text-right font-bold py-4">
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-lg">
                      ${user.revenue.toLocaleString()}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Enhanced Pagination */}
        <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-6 border">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-sm font-semibold text-foreground">Rows per page</p>
              <Select
                value={itemsPerPage.toString()}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-10 bg-background/50 border-2 focus:border-primary/50"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </Select>
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                <span className="font-semibold text-foreground">{Math.min(currentPage * itemsPerPage, sortedData.length)}</span> of{' '}
                <span className="font-semibold text-foreground">{sortedData.length}</span> results
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1 bg-primary/10 rounded-full">
                <span className="text-sm font-semibold text-primary">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  className="hidden h-10 w-10 p-0 lg:flex hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-10 w-10 p-0 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-10 w-10 p-0 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-10 w-10 p-0 lg:flex hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}