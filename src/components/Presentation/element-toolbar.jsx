"use client";

import { Lock, Unlock, Copy, Trash2, Move, Edit } from "lucide-react";
import { usePresentation } from "src/context/presentation-context";
import { Button } from "src/components/ui/button";
import { useIsMobile } from "src/hooks/use-mobile";
import { useEffect, useState } from "react";

export default function ElementToolbar({
  element,
  position,
  onStartMove,
  onEdit,
}) {
  const {
    deleteElement,
    duplicateElement,
    isElementLocked,
    toggleElementLock,
  } = usePresentation();
  const isMobile = useIsMobile();

    const [elementSize, setElementSize] = useState({
      width: element.size.width,
      height: element.size.height,
    });

    useEffect(() => {
      setElementSize({
        width: element.size.width,
        height: element.size.height,
      });
    }, [element.size.width, element.size.height]);

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteElement(element.id);
  };

  const handleDuplicate = (e) => {
    e.stopPropagation();
    duplicateElement(element);
  };

  const handleMoveClick = (e) => {
    e.stopPropagation();
    if (!isElementLocked(element.id)) {
      onStartMove();
    }
  };

  const handleLockToggle = (e) => {
    e.stopPropagation();
    toggleElementLock(element.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit();
  };

  const locked = isElementLocked(element.id);

  return (
    <div
      className={`absolute z-50 rounded-full shadow-md flex items-center p-1 border element-toolbar bg-background ${
        isMobile ? "flex-wrap justify-center max-w-[180px]" : ""
      }`}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: "translateX(-50%)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        variant="ghost"
        size={isMobile ? "sm" : "icon"}
        className={`${isMobile ? "h-7 w-7" : "h-8 w-8"} text-main`}
        onClick={handleEdit}
        title="Edit element"
      >
        <Edit className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
      </Button>

      <Button
        variant="ghost"
        size={isMobile ? "sm" : "icon"}
        className={`${isMobile ? "h-7 w-7" : "h-8 w-8"} ${
          locked ? "text-red-500" : ""
        }`}
        onClick={handleLockToggle}
        title={locked ? "Unlock element" : "Lock element"}
      >
        {locked ? (
          <Unlock className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
        ) : (
          <Lock className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
        )}
      </Button>

      <Button
        variant="ghost"
        size={isMobile ? "sm" : "icon"}
        className={`${isMobile ? "h-7 w-7" : "h-8 w-8"} ${
          locked ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleMoveClick}
        disabled={locked}
        title="Move element"
      >
        <Move className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
      </Button>

      <Button
        variant="ghost"
        size={isMobile ? "sm" : "icon"}
        className={`${isMobile ? "h-7 w-7" : "h-8 w-8"}`}
        onClick={handleDuplicate}
        title="Duplicate element"
      >
        <Copy className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
      </Button>

      <Button
        variant="ghost"
        size={isMobile ? "sm" : "icon"}
        className={`${isMobile ? "h-7 w-7" : "h-8 w-8"} text-red-500`}
        onClick={handleDelete}
        title="Delete element"
      >
        <Trash2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
      </Button>

      <div className="px-2 text-xs text-gray-500 flex items-center">
        <span>
          {Math.round(elementSize.width)} × {Math.round(elementSize.height)}
        </span>
      </div>
    </div>
  );
}
