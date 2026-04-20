"use client";

import { useState } from "react";
import { Button } from "src/components/ui/button";
import {
  Plus,
  Type,
  ImageIcon,
  Square,
  BarChart,
  Download,
  FileText,
  Maximize2,
} from "lucide-react";
import { usePresentation } from "src/context/presentation-context";

export default function ElementCreator({ isPresentationMode }) {
  const { addNewElement, setIsPresentationMode } = usePresentation();
  const [isOpen, setIsOpen] = useState(false);

  const handleAddElement = (elementType) => {
    addNewElement(elementType);
    setIsOpen(false);
  };

  const handleExport = () => {
    // We'll handle this in the page component
    window.dispatchEvent(new CustomEvent("presentation-export"));
  };

  const handleExportPDF = () => {
    // We'll handle this in the page component
    window.dispatchEvent(new CustomEvent("presentation-export-pdf"));
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen &&
        (!isPresentationMode ? (
          <div className="absolute bottom-16 right-0 bg-background rounded-lg shadow-lg p-2 flex flex-col space-y-2 mb-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center justify-start"
              onClick={() => handleAddElement("text")}
            >
              <Type className="h-4 w-4 mr-2" />
              Add Text
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center justify-start"
              onClick={() => handleAddElement("image")}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Add Image
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center justify-start"
              onClick={() => handleAddElement("shape")}
            >
              <Square className="h-4 w-4 mr-2" />
              Add Shape
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center justify-start"
              onClick={() => handleAddElement("chart")}
            >
              <BarChart className="h-4 w-4 mr-2" />
              Add Chart
            </Button>
          </div>
        ) : (
          <div className="absolute bottom-16 right-0 bg-background rounded-lg shadow-lg p-2 flex flex-col space-y-2 mb-2">
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
              onClick={handleExportPDF}
            >
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        ))}

      <Button
        size="icon"
        className={`h-12 w-12 rounded-full shadow-lg ${
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-main hover:bg-main/80"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Plus
          className={`h-6 w-6 transition-transform ${
            isOpen ? "rotate-45" : ""
          }`}
        />
      </Button>
    </div>
  );
}
