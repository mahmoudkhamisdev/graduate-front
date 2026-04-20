"use client";

import { useState, useRef, useEffect } from "react";
import TextElement from "src/components/Presentation/elements/text-element";
import ImageElement from "src/components/Presentation/elements/image-element";
import ShapeElement from "src/components/Presentation/elements/shape-element";
import ChartElement from "src/components/Presentation/elements/chart-element";
import ElementToolbar from "src/components/Presentation/element-toolbar";
import { usePresentation } from "src/context/presentation-context";
import { useIsMobile } from "src/hooks/use-mobile";

export default function SlideView({
  slide,
  isActive,
  isPresentationMode = false,
  scale = 1,
  isThumbnail = false,
}) {
  const {
    selectedElement,
    isEditing,
    handleElementUpdate,
    handleElementMove,
    setSelectedElement,
    setIsEditing,
    isElementLocked,
  } = usePresentation();

  const isMobile = useIsMobile();
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElement, setDraggedElement] = useState(null);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const slideRef = useRef(null);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [doubleClickTimer, setDoubleClickTimer] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [touchStartTime, setTouchStartTime] = useState(0);

  const [isCurrentActive, setIsCurrentActive] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizingElement, setResizingElement] = useState(null);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });

  // Calculate responsive scale for mobile
  const getResponsiveScale = () => {
    if (isMobile && !isThumbnail) {
      // Calculate scale based on screen width with some padding
      const screenWidth = typeof window !== "undefined" ? window.innerWidth : 0;
      const maxWidth = screenWidth - 32; // 16px padding on each side
      return Math.min(1, maxWidth / 960);
    }
    return scale;
  };

  const responsiveScale = getResponsiveScale();

  // Update toolbar position when element position changes
  useEffect(() => {
    if (selectedElement) {
      updateToolbarPosition(selectedElement);
    }
  }, [selectedElement]);

  // Update toolbar position during dragging
  useEffect(() => {
    if (isDragging && draggedElement) {
      updateToolbarPosition(draggedElement);
    }
  }, [isDragging, draggedElement]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (doubleClickTimer) {
        clearTimeout(doubleClickTimer);
      }
    };
  }, [doubleClickTimer]);

  // Handle window resize for responsive scaling
  useEffect(() => {
    const handleResize = () => {
      // Force re-render to update scale
      setSelectedElement(selectedElement);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedElement, setSelectedElement]);

  const updateToolbarPosition = (element) => {
    const centerX = element.position.x + element.size.width / 2;

    // On mobile, position the toolbar at the bottom of the element instead of top
    const yPos = isMobile
      ? element.position.y + element.size.height + 20
      : element.position.y - 40;

    setToolbarPosition({
      x: centerX,
      y: yPos,
    });
  };

  // Handle clicking on the slide background to deselect elements
  const handleSlideClick = (e) => {
    setIsCurrentActive(true);
    // Only handle direct clicks on the slide background, not on elements
    if (e.target === slideRef.current) {
      setSelectedElement(null);
      setIsEditing(false);
    }
  };

  const handleElementMouseDown = (e, element) => {
    // Prevent dragging when in editing mode, presentation mode, or if element is locked
    if (
      isEditing ||
      isPresentationMode ||
      isThumbnail ||
      isElementLocked(element.id)
    )
      return;

    e.stopPropagation();

    // Only start dragging if we're not clicking on a move handle
    if (
      !e.target.closest(".move-handle") &&
      !e.target.closest(".element-toolbar")
    ) {
      // Handle double-click for move
      setClickCount((prev) => prev + 1);

      if (clickCount === 1) {
        // This is a double click
        setIsDragging(true);
        setDraggedElement(element);

        // Calculate offset from the element's top-left corner
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        setStartPosition({
          x: offsetX,
          y: offsetY,
        });

        // Reset click count
        setClickCount(0);
        if (doubleClickTimer) {
          clearTimeout(doubleClickTimer);
          setDoubleClickTimer(null);
        }
      } else {
        // This is the first click, start timer for potential double click
        const timer = setTimeout(() => {
          setClickCount(0);
        }, 300); // 300ms is typical double-click threshold

        setDoubleClickTimer(timer);
      }
    }
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e, element) => {
    if (
      isEditing ||
      isPresentationMode ||
      isThumbnail ||
      isElementLocked(element.id)
    )
      return;

    // Record touch start time for long press detection
    setTouchStartTime(Date.now());

    // Select the element
    setSelectedElement(element);
    updateToolbarPosition(element);

    // Prevent default to avoid scrolling
    e.stopPropagation();
  };

  const handleTouchMove = (e) => {
    if (
      !selectedElement ||
      isEditing ||
      isPresentationMode ||
      isThumbnail ||
      isElementLocked(selectedElement.id)
    )
      return;

    // Check if this is a long press (for dragging)
    const touchDuration = Date.now() - touchStartTime;
    if (touchDuration > 300 && !isDragging) {
      setIsDragging(true);
      setDraggedElement(selectedElement);

      // Use the first touch point
      const touch = e.touches[0];

      // Get element position relative to slide
      const slideRect = slideRef.current?.getBoundingClientRect();
      if (!slideRect) return;

      // Calculate new position
      const newX = (touch.clientX - slideRect.left) / responsiveScale;
      const newY = (touch.clientY - slideRect.top) / responsiveScale;

      // Constrain to slide boundaries
      const maxX = 960 - selectedElement.size.width;
      const maxY = 540 - selectedElement.size.height;

      const constrainedX = Math.max(0, Math.min(newX, maxX));
      const constrainedY = Math.max(0, Math.min(newY, maxY));

      // Update element position
      const updatedElement = {
        ...selectedElement,
        position: { x: constrainedX, y: constrainedY },
      };

      setDraggedElement(updatedElement);
      updateToolbarPosition(updatedElement);
    }

    // Prevent default to avoid scrolling while dragging
    if (isDragging) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    if (isDragging && draggedElement) {
      // Save the final position
      const updatedElements = slide.elements.map((el) => {
        if (el.id === draggedElement.id) {
          return {
            ...el,
            position: draggedElement.position,
          };
        }
        return el;
      });

      // Update the slide
      const updatedSlide = {
        ...slide,
        elements: updatedElements,
      };

      handleElementMove(updatedSlide);

      // Update selected element
      setSelectedElement(draggedElement);
    }

    setIsDragging(false);
    setDraggedElement(null);
  };

  const handleMoveHandleMouseDown = (e, element) => {
    if (isPresentationMode || isThumbnail || isElementLocked(element.id))
      return;

    e.stopPropagation();
    setIsDragging(true);
    setDraggedElement(element);

    // When using the move handle, we want to drag from the center of the handle
    const handleElement = e.currentTarget;
    const handleRect = handleElement.getBoundingClientRect();

    setStartPosition({
      x: handleRect.width / 2,
      y: handleRect.height / 2,
    });
  };
  const handleResizeStart = (e, element, direction) => {
    if (isPresentationMode || isThumbnail || isElementLocked(element.id))
      return;

    e.stopPropagation();
    setIsResizing(true);
    setResizingElement(element);
    setResizeDirection(direction);

    // Store initial size and mouse position
    setInitialSize({
      width: element.size.width,
      height: element.size.height,
    });

    const slideRect = slideRef.current?.getBoundingClientRect();
    if (slideRect) {
      setInitialMousePos({
        x: e.clientX,
        y: e.clientY,
      });
    }

    // Set the element as selected
    setSelectedElement(element);
  };

  const handleResizeMove = (e) => {
    if (
      !isResizing ||
      !resizingElement ||
      !resizeDirection ||
      isPresentationMode ||
      isEditing ||
      isThumbnail
    )
      return;

    const slideRect = slideRef.current?.getBoundingClientRect();
    if (!slideRect) return;

    // Calculate mouse movement delta
    const deltaX = (e.clientX - initialMousePos.x) / responsiveScale;
    const deltaY = (e.clientY - initialMousePos.y) / responsiveScale;

    // Calculate new size based on resize direction
    let newWidth = initialSize.width;
    let newHeight = initialSize.height;
    let newX = resizingElement.position.x;
    let newY = resizingElement.position.y;

    if (resizeDirection.includes("right")) {
      newWidth = Math.max(50, initialSize.width + deltaX);
    } else if (resizeDirection.includes("left")) {
      const possibleWidth = Math.max(50, initialSize.width - deltaX);
      newX = resizingElement.position.x + (initialSize.width - possibleWidth);
      newWidth = possibleWidth;
    }

    if (resizeDirection.includes("bottom")) {
      newHeight = Math.max(50, initialSize.height + deltaY);
    } else if (resizeDirection.includes("top")) {
      const possibleHeight = Math.max(50, initialSize.height - deltaY);
      newY = resizingElement.position.y + (initialSize.height - possibleHeight);
      newHeight = possibleHeight;
    }

    // Ensure element stays within slide boundaries
    const maxX = 960 - newWidth;
    const maxY = 540 - newHeight;
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    // Update the resizing element
    const updatedElement = {
      ...resizingElement,
      position: { x: newX, y: newY },
      size: { width: newWidth, height: newHeight },
    };

    setResizingElement(updatedElement);

    // Update toolbar position during resize
    updateToolbarPosition(updatedElement);
  };

  const handleResizeEnd = () => {
    if (
      isResizing &&
      resizingElement &&
      !isPresentationMode &&
      !isEditing &&
      !isThumbnail
    ) {
      // Update the element in the slide
      const updatedElements = slide.elements.map((el) => {
        if (el.id === resizingElement.id) {
          return {
            ...el,
            position: resizingElement.position,
            size: resizingElement.size,
          };
        }
        return el;
      });

      // Create updated slide with new element sizes
      const updatedSlide = {
        ...slide,
        elements: updatedElements,
      };

      // Call the handler to update the parent state
      handleElementUpdate(resizingElement);

      // Update selected element with new size
      if (selectedElement && selectedElement.id === resizingElement.id) {
        setSelectedElement(resizingElement);
      }
    }

    setIsResizing(false);
    setResizingElement(null);
    setResizeDirection(null);
  };

  const handleMouseMove = (e) => {
    if (isResizing) {
      handleResizeMove(e);
    } else if (
      isDragging &&
      draggedElement &&
      !isPresentationMode &&
      !isEditing &&
      !isThumbnail
    ) {
      // Get the slide container's position
      const slideRect = slideRef.current?.getBoundingClientRect();
      if (!slideRect) return;

      // Calculate new position relative to the slide, accounting for scale
      const newX =
        (e.clientX - slideRect.left) / responsiveScale - startPosition.x;
      const newY =
        (e.clientY - slideRect.top) / responsiveScale - startPosition.y;

      // Constrain to slide boundaries
      const maxX = 960 - draggedElement.size.width;
      const maxY = 540 - draggedElement.size.height;

      const constrainedX = Math.max(0, Math.min(newX, maxX));
      const constrainedY = Math.max(0, Math.min(newY, maxY));

      // Update the draggedElement state for visual feedback during drag
      const updatedElement = {
        ...draggedElement,
        position: { x: constrainedX, y: constrainedY },
      };

      setDraggedElement(updatedElement);

      // Update toolbar position during drag
      updateToolbarPosition(updatedElement);
    }
  };

  const handleMouseUp = () => {
    if (isResizing) {
      handleResizeEnd();
    } else if (
      isDragging &&
      draggedElement &&
      !isPresentationMode &&
      !isEditing &&
      !isThumbnail
    ) {
      // Ensure the final position is saved
      const updatedElements = slide.elements.map((el) => {
        if (el.id === draggedElement.id) {
          return {
            ...el,
            position: draggedElement.position,
          };
        }
        return el;
      });

      // Create updated slide with new element positions
      const updatedSlide = {
        ...slide,
        elements: updatedElements,
      };

      // Call the onElementMove prop to update the parent state
      handleElementMove(updatedSlide);

      // Update selected element with new position
      if (selectedElement && selectedElement.id === draggedElement.id) {
        setSelectedElement(draggedElement);
      }
    }

    setIsDragging(false);
    setDraggedElement(null);
  };

  const handleStartMove = () => {
    if (selectedElement && !isElementLocked(selectedElement.id)) {
      setIsDragging(true);
      setDraggedElement(selectedElement);
      setStartPosition({
        x: selectedElement.size.width / 2,
        y: selectedElement.size.height / 2,
      });
    }
  };

  const handleElementClick = (element) => {
    if (!isPresentationMode && !isThumbnail) {
      // Select the element
      setSelectedElement(element);

      // Update toolbar position
      updateToolbarPosition(element);
    }
  };

  const handleEditElement = () => {
    if (selectedElement) {
      setIsEditing(true);
    }
  };

  const renderElement = (element) => {
    // If this element is being resized, use the resizing element state
    const displayElement =
      isResizing && resizingElement?.id === element.id
        ? resizingElement
        : element;
    const isSelected = selectedElement?.id === element.id;
    const isCurrentlyEditing =
      isEditing && isSelected && !isPresentationMode && !isThumbnail;
    const isLocked = isElementLocked(element.id);

    switch (displayElement.type) {
      case "text":
        return (
          <TextElement
            element={displayElement}
            isSelected={isSelected}
            isEditing={isCurrentlyEditing}
            onClick={() => handleElementClick(element)}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
            onUpdate={handleElementUpdate}
          />
        );
      case "image":
        return (
          <ImageElement
            element={displayElement}
            isSelected={isSelected}
            isEditing={isCurrentlyEditing}
            onClick={() => handleElementClick(element)}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
            onUpdate={handleElementUpdate}
          />
        );
      case "shape":
        return (
          <ShapeElement
            element={displayElement}
            isSelected={isSelected}
            isEditing={isCurrentlyEditing}
            onClick={() => handleElementClick(element)}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
            onUpdate={handleElementUpdate}
          />
        );
      case "chart":
        return (
          <ChartElement
            element={displayElement}
            isSelected={isSelected}
            isEditing={isCurrentlyEditing}
            onClick={() => handleElementClick(element)}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
            onUpdate={handleElementUpdate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={slideRef}
      className={`relative bg-primary shadow-lg transition-opacity slide-content ${
        isActive || isCurrentActive ? "opacity-100" : "opacity-70"
      } mx-auto`}
      style={{
        backgroundColor: slide.background,
        width: 960 * responsiveScale,
        height: 540 * responsiveScale,
        transform: `scale(${responsiveScale})`,
        transformOrigin: "top left",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleSlideClick}
      onTouchStart={(e) => e.stopPropagation()} // Prevent slide touch from bubbling
    >
      {slide.elements.map((element) => {
        const isElementDragging = draggedElement?.id === element.id;
        const isElementResizing = resizingElement?.id === element.id;

        // Use the appropriate element state based on what's happening
        const displayElement = isElementResizing
          ? resizingElement
          : isElementDragging
          ? draggedElement
          : element;

        const elementPosition = displayElement.position;
        const elementSize = displayElement.size;
        const isLocked = isElementLocked(element.id);

        return (
          <div
            key={element.id}
            id={`element-${element.id}`}
            className={`absolute ${isLocked ? "cursor-not-allowed" : ""}`}
            style={{
              left: elementPosition.x,
              top: elementPosition.y,
              width: elementSize.width,
              height: elementSize.height,
              zIndex: element.zIndex || 1,
              cursor:
                isEditing && selectedElement?.id === element.id
                  ? "text"
                  : isLocked
                  ? "not-allowed"
                  : "move",
            }}
            onTouchStart={(e) => handleTouchStart(e, element)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {renderElement(element)}

            {/* Corner handles for moving and resizing - shown when element is selected */}
            {selectedElement?.id === element.id &&
              !isEditing &&
              !isPresentationMode &&
              !isThumbnail &&
              !isLocked && (
                <>
                  {/* Corner handles for moving and resizing */}
                  <div
                    className="absolute -top-2 -left-2 w-4 h-4 bg-primary border border-blue-500 rounded-full cursor-nw-resize z-50"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      if (e.shiftKey) {
                        handleMoveHandleMouseDown(e, element);
                      } else {
                        handleResizeStart(e, element, "top-left");
                      }
                    }}
                    title="Drag to resize (hold Shift to move)"
                  />
                  <div
                    className="absolute -top-2 -right-2 w-4 h-4 bg-primary border border-blue-500 rounded-full cursor-ne-resize z-50"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      if (e.shiftKey) {
                        handleMoveHandleMouseDown(e, element);
                      } else {
                        handleResizeStart(e, element, "top-right");
                      }
                    }}
                    title="Drag to resize (hold Shift to move)"
                  />
                  <div
                    className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary border border-blue-500 rounded-full cursor-sw-resize z-50"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      if (e.shiftKey) {
                        handleMoveHandleMouseDown(e, element);
                      } else {
                        handleResizeStart(e, element, "bottom-left");
                      }
                    }}
                    title="Drag to resize (hold Shift to move)"
                  />
                  <div
                    className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary border border-blue-500 rounded-full cursor-se-resize z-50"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      if (e.shiftKey) {
                        handleMoveHandleMouseDown(e, element);
                      } else {
                        handleResizeStart(e, element, "bottom-right");
                      }
                    }}
                    title="Drag to resize (hold Shift to move)"
                  />
                </>
              )}

            {/* Locked indicator */}
            {isLocked && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary border border-red-500 rounded-full z-50 flex items-center justify-center">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
            )}
          </div>
        );
      })}

      {/* Floating toolbar for selected element */}
      {selectedElement && !isPresentationMode && !isThumbnail && !isEditing && (
        <ElementToolbar
          element={selectedElement}
          position={toolbarPosition}
          onStartMove={handleStartMove}
          onEdit={handleEditElement}
        />
      )}

      {/* Slide title at the bottom for presentation mode */}
      {isPresentationMode && !isThumbnail && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm text-gray-500">
          {slide.title}
        </div>
      )}
    </div>
  );
}
