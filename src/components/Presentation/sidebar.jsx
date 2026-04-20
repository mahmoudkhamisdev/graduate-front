"use client";

import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
} from "src/components/ui/sidebar";
import { Button } from "src/components/ui/button";
import { Plus, Trash2, GripVertical, ArrowLeft, ChevronLeft } from "lucide-react";
import { usePresentation } from "src/context/presentation-context";
import SlideView from "src/components/Presentation/slide-view";
import { useIsMobile } from "src/hooks/use-mobile";
import { SecondaryButton } from "../common/Customs/SecondaryButton";
import { useNavigate } from "react-router-dom";

// Update the SlideThumbnail component to fix drag and drop
const SlideThumbnail = ({
  slide,
  index,
  isActive,
  onClick,
  onDelete,
  onMove,
  isMobile,
  isPresentationMode,
}) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: "SLIDE",
    item: () => ({ type: "SLIDE", id: slide.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "SLIDE",
    hover(item, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;

      // Time throttling to prevent too many updates
      const now = Date.now();
      if (window.lastMoveTime && now - window.lastMoveTime < 100) return;
      window.lastMoveTime = now;

      // Call the move function to update the slides array
      onMove(dragIndex, hoverIndex);

      // Update the index for the dragged item
      item.index = hoverIndex;
    },
  });

  // Connect the drag and drop refs
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`relative group ${isDragging ? "opacity-50" : "opacity-100"}`}
      style={{ cursor: "move" }}
    >
      <SidebarMenuItem>
        <div className="flex flex-col w-full p-2">
          {/* Custom menu button that doesn't use a button element */}
          <div
            className={`flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
              isActive
                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                : ""
            }`}
            onClick={onClick}
          >
            <div className="flex items-center w-full">
              {!isPresentationMode && (
                <GripVertical className="h-4 w-4 text-gray-500 mr-2" />
              )}
              <span className="truncate">{slide.title}</span>
              {!isPresentationMode && (
                <div
                  className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-gray-200 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </div>
              )}
            </div>
          </div>

          {/* Slide thumbnail preview */}
          <div
            className="w-full aspect-video border rounded overflow-hidden bg-white relative mt-2"
            onClick={onClick}
            style={{ maxWidth: isMobile ? "100%" : "240px" }}
          >
            <div
              className="transform scale-[0.25] origin-top-left"
              style={{ width: 960, height: 540 }}
            >
              <SlideView
                slide={slide}
                isActive={false}
                isPresentationMode={true}
                isThumbnail={true}
              />
            </div>
          </div>
        </div>
      </SidebarMenuItem>
    </div>
  );
};

export default function Sidebar({ isPresentationMode }) {
  const {
    slides,
    currentSlideIndex,
    presentationTitle,
    setCurrentSlideIndex,
    setPresentationTitle,
    addNewSlide,
    deleteSlide,
    moveSlide,
  } = usePresentation();

  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSlideClick = (index) => {
    setCurrentSlideIndex(index);

    // Smooth scroll to the slide
    const slideElements = document.querySelectorAll(".slide-container");
    if (slideElements[index]) {
      slideElements[index].scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <SidebarProvider className="w-fit">
      <ShadcnSidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <SecondaryButton
              onClick={() => navigate(-1)}
              size="icon"
            >
              <ChevronLeft className="h-4 w-4" />
            </SecondaryButton>
            <h2 className="text-lg font-semibold truncate">
              {presentationTitle}
            </h2>
          </div>
          <SidebarTrigger className="absolute right-4 top-4 md:hidden" />
        </SidebarHeader>

        <SidebarSeparator />

        <SidebarContent>
          {!isPresentationMode && (
            <div className="p-2">
              <Button
                onClick={addNewSlide}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
                <span>Add Slide</span>
              </Button>
            </div>
          )}

          <SidebarMenu>
            {slides.map((slide, index) => (
              <SlideThumbnail
                key={slide.id}
                slide={slide}
                index={index}
                isActive={index === currentSlideIndex}
                onClick={() => handleSlideClick(index)}
                onDelete={() => deleteSlide(index)}
                onMove={moveSlide}
                isMobile={isMobile}
                isPresentationMode={isPresentationMode}
              />
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <div className="text-xs text-gray-500">{slides.length} slides</div>
        </SidebarFooter>
      </ShadcnSidebar>
    </SidebarProvider>
  );
}
