"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { PresentationProvider } from "../context/presentation-context";
import PresentationView from "../components/presentation/presentation-view";
import ElementsSidebar from "../components/sidebar/elements-sidebar";

export default function PresentationModal({ output, onClose }) {
  // Prevent scrolling of the background when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-[95vw] h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">عرض تقديمي للاستراتيجية</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <DndProvider backend={HTML5Backend}>
            <PresentationProvider initialContent={output}>
              <ElementsSidebar />
              <PresentationView isFullscreen={false} />
            </PresentationProvider>
          </DndProvider>
        </div>
      </div>
    </div>
  );
}
