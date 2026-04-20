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
import { Checkbox } from "src/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "src/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog";
import { Label } from "src/components/ui/label";
import { Textarea } from "src/components/ui/textarea";
import { Switch } from "src/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  ChevronDown,
  X,
  Settings2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Check,
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

export default function PlansTable() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    currency: "USD",
    credits: 0,
    description: "",
    isActive: true,
    sortOrder: 1,
    features: [{ text: "", checked: true }],
  });

  const statusCounts = {
    active: plans.filter((p) => p.isActive).length,
    inactive: plans.filter((p) => !p.isActive).length,
  };

  useEffect(() => {
    loadPlans();
  }, []);

  useEffect(() => {
    if (editingPlan) {
      setFormData({
        name: editingPlan.name,
        price: editingPlan.price,
        currency: editingPlan.currency,
        credits: editingPlan.credits,
        description: editingPlan.description,
        isActive: editingPlan.isActive,
        sortOrder: editingPlan.sortOrder,
        features: editingPlan.features.map((f) => ({
          text: f.text,
          checked: f.checked,
        })),
      });
    } else {
      setFormData({
        name: "",
        price: 0,
        currency: "USD",
        credits: 0,
        description: "",
        isActive: true,
        sortOrder: 1,
        features: [{ text: "", checked: true }],
      });
    }
  }, [editingPlan]);

  const loadPlans = async () => {
    try {
      const { data } = await axios.get(`${BaseUrlApi}/plans/admin/all`);
      setPlans(data.data.plans);
    } catch (error) {
      toast.error(ErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const createPlan = async (planData) => {
    try {
      const { data } = await axios.post(`${BaseUrlApi}/plans`, planData);
      loadPlans();
      toast.success("Plan created successfully");
    } catch (error) {
      toast.error(ErrorMessage(error));
    }
  };

  const updatePlan = async (id, planData) => {
    try {
      const { data } = await axios.put(`${BaseUrlApi}/plans/${id}`, planData);
      loadPlans();
      toast.success("Plan updated successfully");
    } catch (error) {
      toast.error(ErrorMessage(error));
    }
  };

  const deletePlan = async (id) => {
    try {
      await axios.delete(`${BaseUrlApi}/plans/${id}`);
      setPlans(plans.filter((plan) => plan._id !== id));
      toast.success("Plan deleted successfully");
    } catch (error) {
      toast.error(ErrorMessage(error));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingPlan) {
      await updatePlan(editingPlan._id, formData);
    } else {
      await createPlan(formData);
    }
    setDialogOpen(false);
    setEditingPlan(null);
  };

  const handleDelete = async (id) => {
    // if (confirm("Are you sure you want to delete this plan?")) {
    await deletePlan(id);
    // }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingPlan(null);
    setDialogOpen(true);
  };

  const togglePlanSelection = (planId) => {
    setSelectedPlans((prev) =>
      prev.includes(planId)
        ? prev.filter((id) => id !== planId)
        : [...prev, planId]
    );
  };

  const toggleAllPlans = () => {
    setSelectedPlans(
      selectedPlans.length === filteredPlans.length
        ? []
        : filteredPlans.map((plan) => plan._id)
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

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { text: "", checked: true }],
    });
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const updateFeature = (index, field, value) => {
    const updatedFeatures = formData.features.map((feature, i) =>
      i === index ? { ...feature, [field]: value } : feature
    );
    setFormData({ ...formData, features: updatedFeatures });
  };

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter.length === 0 ||
      (statusFilter.includes("active") && plan.isActive) ||
      (statusFilter.includes("inactive") && !plan.isActive);

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPlans.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedPlans = filteredPlans.slice(
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
        className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg"
      >
        {/* Header with filters */}
        <div className="p-4 border-b border-gray-200 dark:border-zinc-700">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <Input
                placeholder="Filter plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-600 dark:placeholder:text-gray-400"
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  >
                    <Settings2 className="h-4 w-4 mr-2" />
                    Status
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700">
                  {["active", "inactive"].map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => toggleStatusFilter(status)}
                      className="text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-zinc-800"
                    >
                      <Checkbox
                        checked={statusFilter.includes(status)}
                        className="mr-2"
                      />
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                      <span className="ml-auto text-gray-600 dark:text-gray-400">
                        {statusCounts[status]}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {(statusFilter.length > 0 || searchTerm) && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-zinc-800"
                >
                  Reset
                  <X className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-zinc-800"
              >
                <Settings2 className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button
                onClick={handleAdd}
                className="bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-700"
              >
                Add Plan
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800">
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedPlans.length === paginatedPlans.length &&
                      paginatedPlans.length > 0
                    }
                    onCheckedChange={toggleAllPlans}
                  />
                </TableHead>
                {["Plan", "Price", "Credits", "Features", "Status"].map(
                  (text) => (
                    <TableHead
                      key={text}
                      className="text-gray-600 dark:text-gray-400"
                    >
                      {text === "Status" ? (
                        <div className="flex items-center gap-1">
                          {text}
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      ) : (
                        text
                      )}
                    </TableHead>
                  )
                )}
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPlans.map((plan, index) => (
                <motion.tr
                  key={plan._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                  className="border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedPlans.includes(plan._id)}
                      onCheckedChange={() => togglePlanSelection(plan._id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {plan.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {plan.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900 dark:text-white">
                      ${plan.price} {plan.currency}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {plan.credits}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {plan.features.slice(0, 3).map((feature) => (
                        <div
                          key={feature._id}
                          className="flex items-center space-x-2 text-sm"
                        >
                          {feature.checked ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <X className="h-3 w-3 text-red-500" />
                          )}
                          <span
                            className={
                              feature.checked
                                ? "text-gray-600 dark:text-gray-300"
                                : "text-gray-500 dark:text-gray-500"
                            }
                          >
                            {feature.text}
                          </span>
                        </div>
                      ))}
                      {plan.features.length > 3 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{plan.features.length - 3} more features
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          plan.isActive ? "bg-green-500" : "bg-gray-500"
                        }`}
                      />
                      <span className="text-gray-600 dark:text-gray-400">
                        {plan.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-zinc-800"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700"
                      >
                        <DropdownMenuItem
                          onClick={() => handleEdit(plan)}
                          className="text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-zinc-800"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-200 dark:bg-zinc-700" />
                        <DropdownMenuItem
                          onClick={() => handleDelete(plan._id)}
                          className="text-red-400 hover:text-red-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                        >
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

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-zinc-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedPlans.length} of {filteredPlans.length} row(s) selected.
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Rows per page
              </span>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={(value) => setRowsPerPage(Number(value))}
              >
                <SelectTrigger className="w-16 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700">
                  {[10, 20, 50].map((n) => (
                    <SelectItem
                      key={n}
                      value={n.toString()}
                      className="text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800"
                    >
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center gap-1">
              {[1, currentPage - 1, currentPage + 1, totalPages].map(
                (pg, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(pg)}
                    disabled={pg === currentPage}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50"
                  >
                    {pg === 1 && <ChevronsLeft className="h-4 w-4" />}
                    {pg === totalPages && <ChevronsRight className="h-4 w-4" />}
                    {pg !== 1 && pg !== totalPages && pg !== currentPage && pg}
                  </Button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Plan Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? "Edit Plan" : "Add New Plan"}
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                {editingPlan
                  ? "Update plan information and features."
                  : "Create a new subscription plan."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-gray-600 dark:text-gray-400"
                  >
                    Plan Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="price"
                    className="text-gray-600 dark:text-gray-400"
                  >
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                    className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="currency"
                    className="text-gray-600 dark:text-gray-400"
                  >
                    Currency
                  </Label>
                  <Input
                    id="currency"
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                    required
                    className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="credits"
                    className="text-gray-600 dark:text-gray-400"
                  >
                    Credits
                  </Label>
                  <Input
                    id="credits"
                    type="number"
                    value={formData.credits}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        credits: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    required
                    className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-gray-600 dark:text-gray-400"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="sortOrder"
                  className="text-gray-600 dark:text-gray-400"
                >
                  Sort Order
                </Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sortOrder: Number.parseInt(e.target.value) || 1,
                    })
                  }
                  className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-600 dark:text-gray-400">
                    Features
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFeature}
                    className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </div>

                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={feature.text}
                      onChange={(e) =>
                        updateFeature(index, "text", e.target.value)
                      }
                      placeholder="Feature description"
                      className="flex-1 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white"
                    />
                    <Switch
                      checked={feature.checked}
                      onCheckedChange={(checked) =>
                        updateFeature(index, "checked", checked)
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      disabled={formData.features.length === 1}
                      className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label
                  htmlFor="isActive"
                  className="text-gray-600 dark:text-gray-400"
                >
                  Active
                </Label>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-white dark:bg-zinc-700 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-600"
                >
                  {editingPlan ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>
    </motion.div>
  );
}
