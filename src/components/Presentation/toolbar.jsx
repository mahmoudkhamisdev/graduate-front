"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/components/ui/tabs";
import { Slider } from "src/components/ui/slider";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImageIcon,
  Square,
  Circle,
  Triangle,
  BarChart,
  Download,
  Upload,
  Type,
  Palette,
  Maximize2,
  Undo2,
  Redo2,
  Layout,
  FileText,
  Edit,
  Eye,
  Settings,
  Plus,
  Trash2,
  Share2,
  Copy,
  Menu,
  Wand2,
  CloudLightningIcon,
  Loader2,
  LucideUploadCloud,
  LockKeyholeIcon,
  LockKeyholeOpenIcon,
} from "lucide-react";
import { usePresentation } from "src/context/presentation-context";
import { useIsMobile } from "src/hooks/use-mobile";
import { encodeToBase64 } from "src/lib/encoding-utils";
import { Sheet, SheetContent, SheetTrigger } from "src/components/ui/sheet";
import { toast } from "sonner";
import axios from "axios";
import { BaseUrlApi, ErrorMessage } from "../../lib/api";
import { useParams } from "react-router-dom";

export default function Toolbar() {
  const {
    project,
    isUpdated,
    setIsUpdated,
    selectedElement,
    isEditing,
    presentationTitle,
    handleElementUpdate,
    setIsEditing,
    setIsPresentationMode,
    setIsTemplateSelectorOpen,
    setPresentationTitle,
    canUndo,
    canRedo,
    undo,
    redo,
    addNewElement,
    deleteElement,
    duplicateElement,
  } = usePresentation();
  const { id: presentationId } = useParams();

  const fileInputRef = useRef(null);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("text");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [shareError, setShareError] = useState("");
  const shareLinkRef = useRef(null);
  const prevSelectedElementRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Set the appropriate tab when the selected element changes
  useEffect(() => {
    if (selectedElement) {
      // Only update the tab if the selected element has changed
      if (prevSelectedElementRef.current !== selectedElement.id) {
        setActiveTab(selectedElement.type);
        prevSelectedElementRef.current = selectedElement.id;
      }
    } else {
      prevSelectedElementRef.current = null;
    }
  }, [selectedElement]);

  const handleTextUpdate = (property, value) => {
    if (!selectedElement || selectedElement.type !== "text") return;

    // Create a deep copy of the element to ensure we're not modifying the original reference
    const updatedElement = JSON.parse(JSON.stringify(selectedElement));
    updatedElement.properties[property] = value;

    // Immediately update the element
    handleElementUpdate(updatedElement);
  };

  const handleShapeUpdate = (property, value) => {
    if (!selectedElement || selectedElement.type !== "shape") return;

    // Create a deep copy of the element to ensure we're not modifying the original reference
    const updatedElement = JSON.parse(JSON.stringify(selectedElement));
    updatedElement.properties[property] = value;

    // Immediately update the element
    handleElementUpdate(updatedElement);
  };

  const handleImageUpdate = (property, value) => {
    if (!selectedElement || selectedElement.type !== "image") return;

    // Create a deep copy of the element to ensure we're not modifying the original reference
    const updatedElement = JSON.parse(JSON.stringify(selectedElement));
    updatedElement.properties[property] = value;

    // Immediately update the element
    handleElementUpdate(updatedElement);
  };

  const handleChartUpdate = (property, value) => {
    if (!selectedElement || selectedElement.type !== "chart") return;

    // Create a deep copy of the element to ensure we're not modifying the original reference
    const updatedElement = JSON.parse(JSON.stringify(selectedElement));
    updatedElement.properties[property] = value;

    // Immediately update the element
    handleElementUpdate(updatedElement);
  };

  const handleStyleUpdate = (property, value) => {
    if (!selectedElement) return;

    // Create a deep copy of the element to ensure we're not modifying the original reference
    const updatedElement = JSON.parse(JSON.stringify(selectedElement));

    if (property === "width" || property === "height") {
      updatedElement.size[property] = value;
    } else {
      updatedElement[property] = value;
    }

    // Immediately update the element
    handleElementUpdate(updatedElement);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // We'll handle this in the page component
        window.dispatchEvent(
          new CustomEvent("presentation-import", {
            detail: { file },
          }),
        );
      } catch (error) {
        console.error("Error importing presentation:", error);
        alert("Failed to import presentation. Please check the file format.");
      }
    }
  };

  const handleExport = () => {
    // We'll handle this in the page component
    window.dispatchEvent(new CustomEvent("presentation-export"));
  };

  const handleExportPDF = () => {
    // We'll handle this in the page component
    window.dispatchEvent(new CustomEvent("presentation-export-pdf"));
  };

  const handleDeleteElement = () => {
    if (selectedElement) {
      deleteElement(selectedElement.id);
    }
  };

  const handleDuplicateElement = () => {
    if (selectedElement) {
      duplicateElement(selectedElement);
    }
  };

  // Update Title
  const { id } = useParams();
  const updatePresentation = async (value) => {
    setIsUpdated(true);
    try {
      await axios.put(`${BaseUrlApi}/projects/${id}`, {
        projectName: value,
      });
    } catch (error) {
      toast.error(ErrorMessage(error));
    } finally {
      setIsUpdated(false);
    }
  };

  // On Change Title
  const debounceRef = useRef(null);
  const PresentationTitleChange = (e) => {
    const value = e.target.value;
    setPresentationTitle(value);

    // Clear the previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set a new timeout to call update after 1s of inactivity
    debounceRef.current = setTimeout(() => {
      updatePresentation(value);
    }, 1000);
  };

  // Share / UnShare
  const [isPublic, setIsPublic] = useState(false);
  useEffect(() => {
    if (project) setIsPublic(project?.isPublic);
  }, [project]);

  const [loadingShare, setLoadingShare] = useState(false);
  const [btnShareTitle, setBtnShareTitle] = useState(false);
  // Share Project
  const ShareProject = async () => {
    setLoadingShare(true);
    try {
      const { data } = await axios.put(
        `${BaseUrlApi}/projects/${presentationId}/share`,
        {
          isPublic: !isPublic,
        },
      );
      setIsPublic(data.data?.project?.isPublic);
      if (data.data?.project?.isPublic) {
        toast.success("Presentation is now public!");
        navigator.clipboard.writeText(shareLink);
      } else {
        toast.warning("Presentation is now private!");
      }
    } catch (error) {
      toast.error(ErrorMessage(error));
    } finally {
      setLoadingShare(false);
    }
  };

  useEffect(() => {
    if (!loadingShare && isPublic) {
      setBtnShareTitle("Copied");
      setTimeout(() => {
        setBtnShareTitle("Public");
      }, 2000);
    }
    if (!isPublic) setBtnShareTitle("Private");
  }, [loadingShare, isPublic]);

  // Generate share link
  const generateShareLink = () => {
    setIsShareOpen(true);

    try {
      setShareError(""); // Clear any previous errors

      // Use the custom encoding function instead of btoa
      const link = `${window.location.origin}/presentation/${presentationId}`;
      setShareLink(link);

      // Focus and select the link for easy copying
      setTimeout(() => {
        if (shareLinkRef.current) {
          shareLinkRef.current.focus();
          shareLinkRef.current.select();
        }
      }, 100);
    } catch (error) {
      setShareError(
        "Failed to generate share link. The presentation may be too large.",
      );
      setIsShareOpen(true);
    }
  };

  // Mobile menu content
  const MobileMenuContent = () => (
    <div className="flex flex-col space-y-2 p-4">
      <h3 className="font-medium mb-2">Presentation Tools</h3>

      <Button
        variant="ghost"
        size="sm"
        className="justify-start"
        onClick={undo}
        disabled={!canUndo}
      >
        <Undo2 className="h-4 w-4 mr-2" />
        Undo
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="justify-start"
        onClick={redo}
        disabled={!canRedo}
      >
        <Redo2 className="h-4 w-4 mr-2" />
        Redo
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="justify-start"
        onClick={() => setIsPresentationMode(true)}
      >
        <Maximize2 className="h-4 w-4 mr-2" />
        Present
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="justify-start"
        onClick={() => setIsTemplateSelectorOpen(true)}
      >
        <Layout className="h-4 w-4 mr-2" />
        Templates
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="justify-start"
        onClick={handleExport}
      >
        <Download className="h-4 w-4 mr-2" />
        Export JSON
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="justify-start"
        onClick={handleImportClick}
      >
        <Upload className="h-4 w-4 mr-2" />
        Import JSON
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="justify-start"
        onClick={handleExportPDF}
      >
        <FileText className="h-4 w-4 mr-2" />
        Export PDF
      </Button>

      <Popover open={isShareOpen} onOpenChange={setIsShareOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start"
            onClick={generateShareLink}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Presentation
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={`${isMobile ? "w-[calc(100vw-32px)]" : "w-80"} p-4`}
        >
          <h3 className="font-medium mb-2">Share Presentation</h3>
          <div className="space-y-2">
            {shareError ? (
              <div className="text-red-500 text-sm">{shareError}</div>
            ) : (
              <>
                <p className="text-sm text-gray-500">
                  Copy this link to share your presentation:
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    ref={shareLinkRef}
                    value={shareLink}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(shareLink);
                      alert("Link copied to clipboard!");
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <h3 className="font-medium mt-4 mb-2">Add Elements</h3>

      <Button
        variant="ghost"
        size="sm"
        className="justify-start"
        onClick={() => addNewElement("text")}
      >
        <Type className="h-4 w-4 mr-2" />
        Add Text
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="justify-start"
        onClick={() => addNewElement("image")}
      >
        <ImageIcon className="h-4 w-4 mr-2" />
        Add Image
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="justify-start"
        onClick={() => addNewElement("shape")}
      >
        <Square className="h-4 w-4 mr-2" />
        Add Shape
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="justify-start"
        onClick={() => addNewElement("chart")}
      >
        <BarChart className="h-4 w-4 mr-2" />
        Add Chart
      </Button>
    </div>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-sm border-b shadow-sm">
      <div className="px-2 md:px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left section - Title and basic controls */}
          <div className="flex items-center space-x-2">
            {isMobile ? (
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                  <MobileMenuContent />
                </SheetContent>
              </Sheet>
            ) : null}

            <Input
              value={presentationTitle}
              onChange={PresentationTitleChange}
              className={`${
                isMobile ? "w-32 text-sm" : "w-40 md:w-60"
              } font-medium`}
            />

            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={undo}
                disabled={!canUndo}
                title="Undo"
              >
                <Undo2 className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={redo}
                disabled={!canRedo}
                title="Redo"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {isUpdated ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" /> Saving...
                  </>
                ) : (
                  <>
                    <LucideUploadCloud className="w-5 h-5" /> Saved
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Center section - Element controls */}
          <div className="flex items-center space-x-1">
            {/* Add element button */}
            {!isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" title="Add Element">
                    <Plus className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start"
                      onClick={() => addNewElement("text")}
                    >
                      <Type className="h-4 w-4 mr-2" />
                      Add Text
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start"
                      onClick={() => addNewElement("image")}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Add Image
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start"
                      onClick={() => addNewElement("shape")}
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Add Shape
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start"
                      onClick={() => addNewElement("chart")}
                    >
                      <BarChart className="h-4 w-4 mr-2" />
                      Add Chart
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Edit/View toggle */}
            <Button
              variant={isEditing ? "default" : "outline"}
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
              title={isEditing ? "View Mode" : "Edit Mode"}
            >
              {isEditing ? (
                <Eye className="h-4 w-4" />
              ) : (
                <Edit className="h-4 w-4" />
              )}
            </Button>

            {/* Templates button */}
            {!isMobile && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsTemplateSelectorOpen(true)}
                title="Templates"
              >
                <Layout className="h-4 w-4" />
              </Button>
            )}

            {/* Present button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsPresentationMode(true)}
              title="Present"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>

            {/* Element manipulation buttons - only shown when an element is selected */}
            {selectedElement && !isMobile && (
              <>
                {/* Duplicate element button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDuplicateElement}
                  title="Duplicate Element"
                >
                  <Copy className="h-4 w-4" />
                </Button>

                {/* Delete element button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDeleteElement}
                  title="Delete Element"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Right section - File operations */}
          <div className="flex items-center space-x-1">
            <div className="hidden md:flex items-center space-x-1">
              <Button
                variant="outline"
                size="icon"
                onClick={handleExport}
                title="Export JSON"
              >
                <Download className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={handleImportClick}
                title="Import JSON"
              >
                <Upload className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={handleExportPDF}
                title="Export PDF"
              >
                <FileText className="h-4 w-4" />
              </Button>

              <Popover open={isShareOpen} onOpenChange={setIsShareOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={generateShareLink}
                    title="Share Presentation"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className={`${
                    isMobile ? "w-[calc(100vw-32px)]" : "w-80"
                  } p-4`}
                >
                  <div className="flex items-center gap-2 justify-between mb-2">
                    <h3 className="font-medium">Share Presentation</h3>
                    {isPublic ? (
                      <LockKeyholeOpenIcon className="size-4 text-green-500" />
                    ) : (
                      <LockKeyholeIcon className="size-4 text-red-500" />
                    )}
                  </div>

                  <div className="space-y-2">
                    {shareError ? (
                      <div className="text-red-500 text-sm">{shareError}</div>
                    ) : (
                      <>
                        <p className="text-sm text-gray-500">
                          Copy this link to share your presentation:
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Input
                            ref={shareLinkRef}
                            value={shareLink}
                            readOnly
                            className="flex-1"
                            disabled={!isPublic}
                          />
                          <Button
                            variant={!isPublic ? "destructive" : "default"}
                            onClick={ShareProject}
                            disabled={loadingShare}
                          >
                            {loadingShare ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              btnShareTitle
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Settings menu for mobile */}
            {!isMobile && (
              <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2">
                  <div className="flex flex-col space-y-1">
                    <div className="md:hidden">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={undo}
                        disabled={!canUndo}
                      >
                        <Undo2 className="h-4 w-4 mr-2" />
                        Undo
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={redo}
                        disabled={!canRedo}
                      >
                        <Redo2 className="h-4 w-4 mr-2" />
                        Redo
                      </Button>
                    </div>
                    <div className="md:hidden">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={handleExport}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export JSON
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={handleImportClick}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Import JSON
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={handleExportPDF}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={generateShareLink}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Presentation
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".json"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Element editing controls - only shown when an element is selected */}
        {selectedElement && isEditing && (
          <div className="border-t py-2 overflow-x-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="inline-flex">
                <TabsTrigger
                  value="text"
                  disabled={selectedElement.type !== "text"}
                >
                  <Type className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Text</span>
                </TabsTrigger>
                <TabsTrigger
                  value="shape"
                  disabled={selectedElement.type !== "shape"}
                >
                  <Square className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Shape</span>
                </TabsTrigger>
                <TabsTrigger
                  value="image"
                  disabled={selectedElement.type !== "image"}
                >
                  <ImageIcon className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Image</span>
                </TabsTrigger>
                <TabsTrigger
                  value="chart"
                  disabled={selectedElement.type !== "chart"}
                >
                  <BarChart className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Chart</span>
                </TabsTrigger>
                <TabsTrigger value="style">
                  <Palette className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Style</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="mt-2">
                {selectedElement.type === "text" && (
                  <div className="flex flex-wrap gap-2 items-center">
                    <Input
                      value={selectedElement.properties.text || ""}
                      onChange={(e) => handleTextUpdate("text", e.target.value)}
                      className="w-40 sm:w-64"
                      onBlur={(e) => {
                        // Ensure the text is updated on blur
                        handleTextUpdate("text", e.target.value);
                      }}
                    />

                    <div className="flex space-x-1">
                      <Button
                        variant={
                          selectedElement.properties.bold
                            ? "default"
                            : "outline"
                        }
                        size="icon"
                        onClick={() =>
                          handleTextUpdate(
                            "bold",
                            !selectedElement.properties.bold,
                          )
                        }
                        type="button"
                      >
                        <Bold className="h-4 w-4" />
                      </Button>

                      <Button
                        variant={
                          selectedElement.properties.italic
                            ? "default"
                            : "outline"
                        }
                        size="icon"
                        onClick={() =>
                          handleTextUpdate(
                            "italic",
                            !selectedElement.properties.italic,
                          )
                        }
                        type="button"
                      >
                        <Italic className="h-4 w-4" />
                      </Button>

                      <Button
                        variant={
                          selectedElement.properties.underline
                            ? "default"
                            : "outline"
                        }
                        size="icon"
                        onClick={() =>
                          handleTextUpdate(
                            "underline",
                            !selectedElement.properties.underline,
                          )
                        }
                        type="button"
                      >
                        <Underline className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex space-x-1">
                      <Button
                        variant={
                          selectedElement.properties.align === "left"
                            ? "default"
                            : "outline"
                        }
                        size="icon"
                        onClick={() => handleTextUpdate("align", "left")}
                        type="button"
                      >
                        <AlignLeft className="h-4 w-4" />
                      </Button>

                      <Button
                        variant={
                          selectedElement.properties.align === "center"
                            ? "default"
                            : "outline"
                        }
                        size="icon"
                        onClick={() => handleTextUpdate("align", "center")}
                        type="button"
                      >
                        <AlignCenter className="h-4 w-4" />
                      </Button>

                      <Button
                        variant={
                          selectedElement.properties.align === "right"
                            ? "default"
                            : "outline"
                        }
                        size="icon"
                        onClick={() => handleTextUpdate("align", "right")}
                        type="button"
                      >
                        <AlignRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Size:</span>
                      <Slider
                        value={[selectedElement.properties.fontSize || 16]}
                        min={8}
                        max={72}
                        step={1}
                        className="w-24 sm:w-32"
                        onValueChange={(value) => {
                          const fontSize = value[0];
                          handleTextUpdate("fontSize", fontSize);
                        }}
                      />
                      <span className="text-sm">
                        {selectedElement.properties.fontSize || 16}px
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Color:</span>
                      <Input
                        type="color"
                        value={selectedElement.properties.color || "#000000"}
                        onChange={(e) =>
                          handleTextUpdate("color", e.target.value)
                        }
                        className="w-10 h-10 p-1"
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="shape" className="mt-2">
                {selectedElement.type === "shape" && (
                  <div className="flex flex-wrap gap-2 items-center">
                    <div className="flex space-x-1">
                      <Button
                        variant={
                          selectedElement.properties.shapeType === "rectangle"
                            ? "default"
                            : "outline"
                        }
                        size="icon"
                        onClick={() =>
                          handleShapeUpdate("shapeType", "rectangle")
                        }
                      >
                        <Square className="h-4 w-4" />
                      </Button>

                      <Button
                        variant={
                          selectedElement.properties.shapeType === "circle"
                            ? "default"
                            : "outline"
                        }
                        size="icon"
                        onClick={() => handleShapeUpdate("shapeType", "circle")}
                      >
                        <Circle className="h-4 w-4" />
                      </Button>

                      <Button
                        variant={
                          selectedElement.properties.shapeType === "triangle"
                            ? "default"
                            : "outline"
                        }
                        size="icon"
                        onClick={() =>
                          handleShapeUpdate("shapeType", "triangle")
                        }
                      >
                        <Triangle className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Fill:</span>
                      <Input
                        type="color"
                        value={selectedElement.properties.fill || "#000000"}
                        onChange={(e) =>
                          handleShapeUpdate("fill", e.target.value)
                        }
                        className="w-10 h-10 p-1"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Border:</span>
                      <Input
                        type="color"
                        value={selectedElement.properties.stroke || "#000000"}
                        onChange={(e) =>
                          handleShapeUpdate("stroke", e.target.value)
                        }
                        className="w-10 h-10 p-1"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Width:</span>
                      <Slider
                        value={[selectedElement.properties.strokeWidth || 1]}
                        min={0}
                        max={10}
                        step={1}
                        className="w-24 sm:w-32"
                        onValueChange={(value) => {
                          const strokeWidth = value[0];
                          handleShapeUpdate("strokeWidth", strokeWidth);
                        }}
                      />
                      <span className="text-sm">
                        {selectedElement.properties.strokeWidth || 1}px
                      </span>
                    </div>

                    {selectedElement.properties.shapeType === "rectangle" && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Radius:</span>
                        <Slider
                          value={[selectedElement.properties.borderRadius || 0]}
                          min={0}
                          max={50}
                          step={1}
                          className="w-24 sm:w-32"
                          onValueChange={(value) => {
                            const borderRadius = value[0];
                            handleShapeUpdate("borderRadius", borderRadius);
                          }}
                        />
                        <span className="text-sm">
                          {selectedElement.properties.borderRadius || 0}px
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="image" className="mt-2">
                {selectedElement.type === "image" && (
                  <div className="flex flex-wrap gap-2 items-center">
                    <Input
                      value={selectedElement.properties.src || ""}
                      onChange={(e) => handleImageUpdate("src", e.target.value)}
                      placeholder="Image URL"
                      className="w-40 sm:w-64"
                    />

                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Radius:</span>
                      <Slider
                        value={[selectedElement.properties.borderRadius || 0]}
                        min={0}
                        max={50}
                        step={1}
                        className="w-24 sm:w-32"
                        onValueChange={(value) => {
                          const borderRadius = value[0];
                          handleImageUpdate("borderRadius", borderRadius);
                        }}
                      />
                      <span className="text-sm">
                        {selectedElement.properties.borderRadius || 0}%
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Opacity:</span>
                      <Slider
                        value={[selectedElement.properties.opacity || 100]}
                        min={0}
                        max={100}
                        step={1}
                        className="w-24 sm:w-32"
                        onValueChange={(value) => {
                          const opacity = value[0];
                          handleImageUpdate("opacity", opacity);
                        }}
                      />
                      <span className="text-sm">
                        {selectedElement.properties.opacity || 100}%
                      </span>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="chart" className="mt-2">
                {selectedElement.type === "chart" && (
                  <div className="flex flex-wrap gap-2 items-center">
                    <div className="flex space-x-1">
                      <Button
                        variant={
                          selectedElement.properties.chartType === "bar"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleChartUpdate("chartType", "bar")}
                      >
                        <BarChart className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Bar</span>
                      </Button>

                      <Button
                        variant={
                          selectedElement.properties.chartType === "line"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleChartUpdate("chartType", "line")}
                      >
                        <BarChart className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Line</span>
                      </Button>

                      <Button
                        variant={
                          selectedElement.properties.chartType === "pie"
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleChartUpdate("chartType", "pie")}
                      >
                        <Circle className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Pie</span>
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Data:</span>
                      <Input
                        value={selectedElement.properties.data || ""}
                        onChange={(e) =>
                          handleChartUpdate("data", e.target.value)
                        }
                        placeholder="CSV data (e.g. 10,20,30)"
                        className="w-40 sm:w-64"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Labels:</span>
                      <Input
                        value={selectedElement.properties.labels || ""}
                        onChange={(e) =>
                          handleChartUpdate("labels", e.target.value)
                        }
                        placeholder="CSV labels (e.g. A,B,C)"
                        className="w-40 sm:w-64"
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="style" className="mt-2">
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Z-Index:</span>
                    <Slider
                      value={[selectedElement.zIndex || 1]}
                      min={1}
                      max={10}
                      step={1}
                      className="w-24 sm:w-32"
                      onValueChange={(value) => {
                        const zIndex = value[0];
                        handleStyleUpdate("zIndex", zIndex);
                      }}
                    />
                    <span className="text-sm">
                      {selectedElement.zIndex || 1}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Width:</span>
                    <Slider
                      value={[selectedElement.size.width]}
                      min={10}
                      max={960}
                      step={1}
                      className="w-24 sm:w-32"
                      onValueChange={(value) => {
                        const width = value[0];
                        handleStyleUpdate("width", width);
                      }}
                    />
                    <span className="text-sm">
                      {selectedElement.size.width}px
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Height:</span>
                    <Slider
                      value={[selectedElement.size.height]}
                      min={10}
                      max={540}
                      step={1}
                      className="w-24 sm:w-32"
                      onValueChange={(value) => {
                        const height = value[0];
                        handleStyleUpdate("height", height);
                      }}
                    />
                    <span className="text-sm">
                      {selectedElement.size.height}px
                    </span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
