"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Input } from "src/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { Switch } from "src/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "src/components/ui/dropdown-menu";
import { Plus, Edit, Trash2, Eye, MoreHorizontal, Search } from "lucide-react";
import { BaseUrlApi, ErrorMessage } from "../../../lib/api";

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

export default function TemplatesGrid() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "title",
    description: "",
    background: "#ffffff",
    isPremium: false,
    isActive: true,
    sortOrder: 1,
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (editingTemplate) {
      setFormData({
        title: editingTemplate.title,
        category: editingTemplate.category,
        description: editingTemplate.description,
        background: editingTemplate.background,
        isPremium: editingTemplate.isPremium,
        isActive: editingTemplate.isActive,
        sortOrder: editingTemplate.sortOrder,
      });
    } else {
      setFormData({
        title: "",
        category: "title",
        description: "",
        background: "#ffffff",
        isPremium: false,
        isActive: true,
        sortOrder: 1,
      });
    }
  }, [editingTemplate]);

  const loadTemplates = async () => {
    try {
      const { data } = await axios.get(`${BaseUrlApi}/templates`);
      setTemplates(data.data.templates);
    } catch (error) {
      toast.error(ErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (templateData) => {
    try {
      const { data } = await axios.post(
        `${BaseUrlApi}/templates`,
        templateData
      );
      setTemplates([...templates, data.data]);
      toast.success("Template created successfully");
    } catch (error) {
      toast.error(ErrorMessage(error));
    }
  };

  const updateTemplate = async (id, templateData) => {
    try {
      const { data } = await axios.put(
        `${BaseUrlApi}/templates/${id}`,
        templateData
      );
      loadTemplates();
      toast.success("Template updated successfully");
    } catch (error) {
      toast.error(ErrorMessage(error));
    }
  };

  const deleteTemplate = async (id) => {
    try {
      await axios.delete(`${BaseUrlApi}/templates/${id}`);
      setTemplates(templates.filter((template) => template._id !== id));
      toast.success("Template deleted successfully");
    } catch (error) {
      toast.error(ErrorMessage(error));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const templateData = {
      ...formData,
      elements: editingTemplate?.elements || [],
    };

    if (editingTemplate) {
      await updateTemplate(editingTemplate._id, templateData);
    } else {
      await createTemplate(templateData);
    }
    setDialogOpen(false);
    setEditingTemplate(null);
  };

  const handleDelete = async (id) => {
    // if (confirm("Are you sure you want to delete this template?")) {
    await deleteTemplate(id);
    // }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingTemplate(null);
    setDialogOpen(true);
  };

  const handlePreview = (template) => {
    setPreviewTemplate(template);
    setPreviewOpen(true);
  };

  const filteredTemplates = templates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center p-8">Loading...</div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Templates Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage presentation templates
            </p>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Template
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template._id}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.05 }}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                      {template.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {template.description}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-700"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handlePreview(template)}
                        className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEdit(template)}
                        className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(template._id)}
                        className="text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="w-full h-32 rounded-lg mb-4 relative overflow-hidden cursor-pointer"
                  style={{ background: template.background }}
                  onClick={() => handlePreview(template)}
                >
                  {template.elements.slice(0, 3).map((element) => (
                    <div
                      key={element.id}
                      className="absolute"
                      style={{
                        left: `${(element.position.x / 960) * 100}%`,
                        top: `${(element.position.y / 540) * 100}%`,
                        width: `${(element.size.width / 960) * 100}%`,
                        height: `${(element.size.height / 540) * 100}%`,
                        fontSize: element.properties?.fontSize
                          ? `${element.properties.fontSize / 20}px`
                          : "8px",
                        color: element.properties?.color || "#000",
                        backgroundColor:
                          element.properties?.fill || "transparent",
                        borderRadius: element.properties?.borderRadius
                          ? `${element.properties.borderRadius}px`
                          : "0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          element.properties?.align === "center"
                            ? "center"
                            : "flex-start",
                        fontWeight: element.properties?.bold
                          ? "bold"
                          : "normal",
                      }}
                    >
                      {element.type === "text" && (
                        <span className="truncate text-xs">
                          {element.properties?.text || "Text"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Badge variant="secondary">{template.category}</Badge>
                    {template.isPremium && (
                      <Badge className="bg-yellow-600 text-white">
                        Premium
                      </Badge>
                    )}
                    {!template.isActive && (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Used {template.usageCount} times
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      {/* Template Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Template" : "Add New Template"}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {editingTemplate
                ? "Update template information."
                : "Create a new presentation template."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-gray-900 dark:text-gray-100"
              >
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="text-gray-900 dark:text-gray-100"
              >
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900">
                  <SelectItem
                    value="title"
                    className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700"
                  >
                    Title
                  </SelectItem>
                  <SelectItem
                    value="content"
                    className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700"
                  >
                    Content
                  </SelectItem>
                  <SelectItem
                    value="chart"
                    className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700"
                  >
                    Chart
                  </SelectItem>
                  <SelectItem
                    value="image"
                    className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700"
                  >
                    Image
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-gray-900 dark:text-gray-100"
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
                className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="background"
                className="text-gray-900 dark:text-gray-100"
              >
                Background
              </Label>
              <Input
                id="background"
                value={formData.background}
                onChange={(e) =>
                  setFormData({ ...formData, background: e.target.value })
                }
                placeholder="#ffffff or linear-gradient(...)"
                className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="sortOrder"
                className="text-gray-900 dark:text-gray-100"
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
                className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isPremium"
                checked={formData.isPremium}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPremium: checked })
                }
              />
              <Label
                htmlFor="isPremium"
                className="text-gray-900 dark:text-gray-100"
              >
                Premium Template
              </Label>
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
                className="text-gray-900 dark:text-gray-100"
              >
                Active
              </Label>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-700"
              >
                {editingTemplate ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Template Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Template" : "Add New Template"}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {editingTemplate
                ? "Update template information."
                : "Create a new presentation template."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-gray-900 dark:text-gray-100"
              >
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="text-gray-900 dark:text-gray-100"
              >
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900">
                  <SelectItem
                    value="title"
                    className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700"
                  >
                    Title
                  </SelectItem>
                  <SelectItem
                    value="content"
                    className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700"
                  >
                    Content
                  </SelectItem>
                  <SelectItem
                    value="chart"
                    className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700"
                  >
                    Chart
                  </SelectItem>
                  <SelectItem
                    value="image"
                    className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700"
                  >
                    Image
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-gray-900 dark:text-gray-100"
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
                className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="background"
                className="text-gray-900 dark:text-gray-100"
              >
                Background
              </Label>
              <Input
                id="background"
                value={formData.background}
                onChange={(e) =>
                  setFormData({ ...formData, background: e.target.value })
                }
                placeholder="#ffffff or linear-gradient(...)"
                className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="sortOrder"
                className="text-gray-900 dark:text-gray-100"
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
                className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isPremium"
                checked={formData.isPremium}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPremium: checked })
                }
              />
              <Label
                htmlFor="isPremium"
                className="text-gray-900 dark:text-gray-100"
              >
                Premium Template
              </Label>
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
                className="text-gray-900 dark:text-gray-100"
              >
                Active
              </Label>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-700"
              >
                {editingTemplate ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Template Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.title}</DialogTitle>
          </DialogHeader>
          {previewTemplate && (
            <div className="relative w-full aspect-video bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
              <div
                className="w-full h-full relative"
                style={{ background: previewTemplate.background }}
              >
                {previewTemplate.elements.map((element) => (
                  <div
                    key={element.id}
                    className="absolute"
                    style={{
                      left: `${(element.position.x / 960) * 100}%`,
                      top: `${(element.position.y / 540) * 100}%`,
                      width: `${(element.size.width / 960) * 100}%`,
                      height: `${(element.size.height / 540) * 100}%`,
                      zIndex: element.zIndex,
                      fontSize: element.properties?.fontSize
                        ? `${(element.properties.fontSize / 960) * 100}vw`
                        : "16px",
                      color: element.properties?.color || "#000",
                      backgroundColor:
                        element.properties?.fill || "transparent",
                      borderRadius: element.properties?.borderRadius
                        ? `${element.properties.borderRadius}px`
                        : "0",
                      border: element.properties?.stroke
                        ? `${element.properties?.strokeWidth || 1}px solid ${
                            element.properties.stroke
                          }`
                        : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        element.properties?.align === "center"
                          ? "center"
                          : element.properties?.align === "right"
                          ? "flex-end"
                          : "flex-start",
                      fontWeight: element.properties?.bold ? "bold" : "normal",
                      lineHeight: element.properties?.lineHeight || 1.2,
                      whiteSpace: "pre-wrap",
                      overflow: "hidden",
                    }}
                  >
                    {element.type === "text" && (
                      <span
                        style={{
                          fontSize: `${
                            element.properties?.fontSize
                              ? element.properties.fontSize / 20
                              : 16
                          }px`,
                        }}
                      >
                        {element.properties?.text || "Text"}
                      </span>
                    )}
                    {element.type === "shape" &&
                      element.properties?.shapeType === "rectangle" && (
                        <div className="w-full h-full" />
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {previewTemplate && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <strong>Category:</strong> {previewTemplate.category}
              </p>
              <p>
                <strong>Description:</strong> {previewTemplate.description}
              </p>
              <p>
                <strong>Usage Count:</strong> {previewTemplate.usageCount}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
