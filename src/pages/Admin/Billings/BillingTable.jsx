"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
import { Badge } from "src/components/ui/badge";
import { Checkbox } from "src/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import {
  RefreshCw,
  MoreHorizontal,
  ChevronDown,
  X,
  Settings2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { BaseUrlApi, ErrorMessage } from "../../../lib/api";
import { Skeleton } from "../../../components/ui/skeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

// interface User {
//   _id
//   name
//   email
//   role
//   points: number
//   isEmailVerified: boolean
//   isActive: boolean
//   createdAt
//   updatedAt
//   avatar?
// }

// interface Plan {
//   _id
//   name
//   price: number
//   currency
//   credits: number
//   description
// }

// interface Billing {
//   _id
//   user: User
//   plan: Plan
//   amount: number
//   currency
//   status
//   paymentMethod
//   createdAt
//   updatedAt
// }

export default function BillingTable() {
  const [billing, setBilling] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBilling, setSelectedBilling] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Mock data for demonstration
  const mockBilling = [
    {
      _id: "1",
      user: {
        _id: "1",
        name: "John Doe",
        email: "john@example.com",
        role: "user",
        points: 100,
        isEmailVerified: true,
        isActive: true,
        createdAt: "2025-01-01",
        updatedAt: "2025-01-01",
        avatar: "/placeholder.svg",
      },
      plan: {
        _id: "1",
        name: "Basic",
        price: 10,
        currency: "USD",
        credits: 100,
        description: "Basic plan",
      },
      amount: 10,
      currency: "USD",
      status: "completed",
      paymentMethod: "card",
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    },
    {
      _id: "2",
      user: {
        _id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "user",
        points: 200,
        isEmailVerified: true,
        isActive: true,
        createdAt: "2025-01-02",
        updatedAt: "2025-01-02",
      },
      plan: {
        _id: "2",
        name: "Professional",
        price: 50,
        currency: "USD",
        credits: 500,
        description: "Professional plan",
      },
      amount: 50,
      currency: "USD",
      status: "pending",
      paymentMethod: "paypal",
      createdAt: "2025-01-02",
      updatedAt: "2025-01-02",
    },
  ];

  const statusCounts = {
    completed: billing.filter((b) => b.status === "completed").length,
    pending: billing.filter((b) => b.status === "pending").length,
    failed: billing.filter((b) => b.status === "failed").length,
    refunded: billing.filter((b) => b.status === "refunded").length,
  };

  const loadBilling = async () => {
    try {
      const { data } = await axios.get(`${BaseUrlApi}/billing/admin/all`);
      setBilling(data.data.billings);
      console.log(data.data);
    } catch (error) {
      toast.error(ErrorMessage(error));
      // Use mock data on error
      setBilling(mockBilling);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadBilling();
  }, []);

  const refundPayment = async (id) => {
    try {
      await axios.post(`${BaseUrlApi}/billing/${id}/refund`);
      loadBilling();
      toast.success("Payment refunded successfully");
    } catch (error) {
      toast.error(ErrorMessage(error));
    }
  };

  const handleRefund = async (id) => {
    // if (confirm("Are you sure you want to refund this payment?")) {
    await refundPayment(id);
    // }
  };

  const toggleBillingSelection = (billingId) => {
    setSelectedBilling((prev) =>
      prev.includes(billingId)
        ? prev.filter((id) => id !== billingId)
        : [...prev, billingId]
    );
  };

  const toggleAllBilling = () => {
    setSelectedBilling(
      selectedBilling.length === filteredBilling.length
        ? []
        : filteredBilling.map((item) => item._id)
    );
  };

  const toggleStatusFilter = (status) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setStatusFilter([]);
    setSearchTerm("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-600 text-gray-900";
      case "pending":
        return "bg-yellow-600 text-gray-900";
      case "failed":
        return "bg-red-600 text-gray-900";
      case "refunded":
        return "bg-gray-600 text-gray-900";
      default:
        return "bg-gray-600 text-gray-900";
    }
  };

  const filteredBilling = billing.filter((item) => {
    const matchesSearch =
      item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.plan.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(item.status);

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBilling.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedBilling = filteredBilling.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  if (loading) {
    return (
      <div className="space-y-1">
        <Skeleton className={"w-full h-16 rounded-b-none"} />
        <Skeleton className={"w-full h-80 rounded-none"} />
        <Skeleton className={"w-full h-16 rounded-t-none"} />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div
        variants={itemVariants}
        className="bg-zinc-900 border border-zinc-700 rounded-lg"
      >
        {/* Header with filters */}
        <div className="p-4 border-b border-zinc-700">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <Input
                placeholder="Filter transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm bg-zinc-900 border-zinc-600 text-gray-100 placeholder:text-gray-400"
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-zinc-900 border-zinc-600 text-gray-100 hover:bg-zinc-800"
                  >
                    <Settings2 className="h-4 w-4 mr-2" />
                    Status
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-zinc-900 border-zinc-700">
                  {["completed", "pending", "failed", "refunded"].map(
                    (status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => toggleStatusFilter(status)}
                        className="text-gray-100 hover:bg-zinc-800"
                      >
                        <Checkbox
                          checked={statusFilter.includes(status)}
                          className="mr-2"
                        />
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                        <span className="ml-auto text-gray-400">
                          {statusCounts[status]}
                        </span>
                      </DropdownMenuItem>
                    )
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {(statusFilter.length > 0 || searchTerm) && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-gray-400 hover:text-gray-100 hover:bg-zinc-800"
                >
                  Reset
                  <X className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-700 hover:bg-zinc-800">
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedBilling.length === paginatedBilling.length &&
                      paginatedBilling.length > 0
                    }
                    onCheckedChange={toggleAllBilling}
                  />
                </TableHead>
                {[
                  "User",
                  "Plan",
                  "Amount",
                  "Payment Method",
                  "Status",
                  "Date",
                ].map((heading) => (
                  <TableHead key={heading} className="text-gray-400">
                    {heading}
                  </TableHead>
                ))}
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBilling.map((item, index) => (
                <motion.tr
                  key={item._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                  className="border-zinc-700 hover:bg-zinc-800"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedBilling.includes(item._id)}
                      onCheckedChange={() => toggleBillingSelection(item._id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-medium text-gray-100">
                          {item.user.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {item.user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-100">
                        {item.plan.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {item.plan.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-100">
                      ${item.amount} {item.currency.toUpperCase()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-zinc-800 text-gray-400 border-zinc-600"
                    >
                      {item.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-100 hover:bg-zinc-800"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-zinc-900 border-zinc-700"
                      >
                        {item.status === "completed" && (
                          <DropdownMenuItem
                            onClick={() => handleRefund(item._id)}
                            className="text-gray-100 hover:bg-zinc-800"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refund
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-zinc-700">
          <div className="text-sm text-gray-400">
            {selectedBilling.length} of {filteredBilling.length} row(s)
            selected.
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Rows per page</span>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={(value) => setRowsPerPage(Number(value))}
              >
                <SelectTrigger className="w-16 bg-zinc-900 border-zinc-600 text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  {[10, 20, 50].map((n) => (
                    <SelectItem
                      key={n}
                      value={n.toString()}
                      className="text-gray-100 hover:bg-zinc-800"
                    >
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="text-gray-400 hover:text-gray-100 hover:bg-zinc-800 disabled:opacity-50"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="text-gray-400 hover:text-gray-100 hover:bg-zinc-800 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="text-gray-400 hover:text-gray-100 hover:bg-zinc-800 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="text-gray-400 hover:text-gray-100 hover:bg-zinc-800 disabled:opacity-50"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
