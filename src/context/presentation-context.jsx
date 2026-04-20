"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { defaultSlides } from "src/lib/default-slides";

// interface PresentationContextType {
//   // State
//   slides: Slide[]
//   currentSlideIndex: number
//   selectedElement: Element | null
//   isEditing: boolean
//   presentationTitle: string
//   isPresentationMode: boolean
//   isTemplateSelectorOpen: boolean
//   lockedElements: Set<string>

//   // History
//   canUndo: boolean
//   canRedo: boolean

//   // Actions
//   setSlides: (slides: Slide[]) => void
//   setCurrentSlideIndex: (index: number) => void
//   setSelectedElement: (element: Element | null) => void
//   setIsEditing: (isEditing: boolean) => void
//   setPresentationTitle: (title: string) => void
//   setIsPresentationMode: (isPresenting: boolean) => void
//   setIsTemplateSelectorOpen: (isOpen: boolean) => void

//   // Operations
//   handleElementClick: (element: Element) => void
//   handleElementUpdate: (updatedElement: Element) => void
//   handleElementMove: (updatedSlide: Slide) => void
//   addNewSlide: () => void
//   deleteSlide: (index: number) => void
//   moveSlide: (dragIndex: number, hoverIndex: number) => void
//   addNewElement: (elementType: string) => void
//   deleteElement: (elementId: string) => void
//   duplicateElement: (element: Element) => void
//   applyTemplate: (template: Slide) => void
//   undo: () => void
//   redo: () => void
//   importPresentation: (data: PresentationData) => void
//   toggleElementLock: (elementId: string) => void
//   isElementLocked: (elementId: string) => boolean
// }

const PresentationContext = createContext(undefined);

export function PresentationProvider({ children }) {
  const [project, setProject] = useState({});
  const [slides, setSlides] = useState(defaultSlides);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [presentationTitle, setPresentationTitle] = useState(
    "Marketing Presentation"
  );
  const [isUpdated, setIsUpdated] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [lockedElements, setLockedElements] = useState(new Set());

  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  const updateHistory = useCallback(() => {
    const currentState = {
      title: presentationTitle,
      slides: slides,
      currentSlideIndex: currentSlideIndex,
    };

    setPast((prev) => [...prev, currentState]);
    setFuture([]);
  }, [slides, currentSlideIndex, presentationTitle]);

  const undo = useCallback(() => {
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    const currentState = {
      title: presentationTitle,
      slides: slides,
      currentSlideIndex: currentSlideIndex,
    };

    setPast(newPast);
    setFuture((prev) => [currentState, ...prev]);

    setSlides(previous.slides);
    setPresentationTitle(previous.title);
    if (previous.currentSlideIndex !== undefined) {
      setCurrentSlideIndex(previous.currentSlideIndex);
    }
  }, [past, slides, presentationTitle, currentSlideIndex]);

  const redo = useCallback(() => {
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    const currentState = {
      title: presentationTitle,
      slides: slides,
      currentSlideIndex: currentSlideIndex,
    };

    setPast((prev) => [...prev, currentState]);
    setFuture(newFuture);

    setSlides(next.slides);
    setPresentationTitle(next.title);
    if (next.currentSlideIndex !== undefined) {
      setCurrentSlideIndex(next.currentSlideIndex);
    }
  }, [future, slides, presentationTitle, currentSlideIndex]);

  const handleElementClick = useCallback(
    (element) => {
      if (isPresentationMode) return;

      if (selectedElement?.id === element.id) return;

      setSelectedElement(element);
      setIsEditing(true);
    },
    [selectedElement, isPresentationMode]
  );

  const handleElementUpdate = useCallback(
    (updatedElement) => {
      if (!updatedElement) return;

      setSlides((prevSlides) => {
        const slideIndex = prevSlides.findIndex((slide) =>
          slide.elements.some((el) => el.id === updatedElement.id)
        );
        if (slideIndex === -1) return prevSlides;

        const newSlides = [...prevSlides];
        const elementIndex = newSlides[slideIndex].elements.findIndex(
          (el) => el.id === updatedElement.id
        );
        if (elementIndex === -1) return prevSlides;

        const newElements = [...newSlides[slideIndex].elements];
        newElements[elementIndex] = updatedElement;

        newSlides[slideIndex] = {
          ...newSlides[slideIndex],
          elements: newElements,
        };

        if (selectedElement && selectedElement.id === updatedElement.id) {
          setSelectedElement(updatedElement);
        }

        return newSlides;
      });

      setTimeout(() => updateHistory(), 0);
    },
    [selectedElement, updateHistory]
  );

  const deleteElement = useCallback(
    (elementId) => {
      if (!elementId) return;
      updateHistory();

      setSlides((prevSlides) => {
        const slideIndex = prevSlides.findIndex((slide) =>
          slide.elements.some((el) => el.id === elementId)
        );
        if (slideIndex === -1) return prevSlides;

        const newSlides = [...prevSlides];
        const newElements = newSlides[slideIndex].elements.filter(
          (el) => el.id !== elementId
        );
        newSlides[slideIndex] = {
          ...newSlides[slideIndex],
          elements: newElements,
        };
        return newSlides;
      });

      if (selectedElement && selectedElement.id === elementId) {
        setSelectedElement(null);
        setIsEditing(false);
      }
    },
    [selectedElement, updateHistory]
  );

  const duplicateElement = useCallback(
    (element) => {
      if (!element) return;

      updateHistory();

      setSlides((prevSlides) => {
        const slideIndex = prevSlides.findIndex((slide) =>
          slide.elements.some((el) => el.id === element.id)
        );
        if (slideIndex === -1) return prevSlides;

        const newSlides = [...prevSlides];
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 10);
        const uniqueId = `element-${timestamp}-${randomString}`;

        const duplicatedElement = {
          ...JSON.parse(JSON.stringify(element)),
          id: uniqueId,
          position: {
            x: element.position.x + 20,
            y: element.position.y + 20,
          },
        };

        newSlides[slideIndex].elements.push(duplicatedElement);
        return newSlides;
      });
    },
    [updateHistory]
  );

  const handleElementMove = useCallback(
    (updatedSlide) => {
      updateHistory();

      setSlides((prevSlides) => {
        const updatedSlides = prevSlides.map((slide) =>
          slide.id === updatedSlide.id ? updatedSlide : slide
        );
        return updatedSlides;
      });
    },
    [updateHistory]
  );

  const addNewSlide = useCallback(() => {
    updateHistory();

    const newSlide = {
      id: `slide-${Date.now()}`,
      title: `Slide ${slides.length + 1}`,
      background: "#ffffff",
      elements: [],
    };

    setSlides((prevSlides) => [...prevSlides, newSlide]);
  }, [slides.length, updateHistory]);

  const deleteSlide = useCallback(
    (index) => {
      if (slides.length <= 1) return;

      updateHistory();

      setSlides((prevSlides) => {
        const newSlides = [...prevSlides];
        newSlides.splice(index, 1);
        return newSlides;
      });

      if (currentSlideIndex >= slides.length - 1) {
        setCurrentSlideIndex(slides.length - 2);
      }
    },
    [slides.length, currentSlideIndex, updateHistory]
  );

  const moveSlide = useCallback(
    (dragIndex, hoverIndex) => {
      if (
        dragIndex < 0 ||
        dragIndex >= slides.length ||
        hoverIndex < 0 ||
        hoverIndex >= slides.length
      )
        return;

      updateHistory();

      setSlides((prevSlides) => {
        const newSlides = [...prevSlides];
        const draggedSlide = newSlides[dragIndex];
        newSlides.splice(dragIndex, 1);
        newSlides.splice(hoverIndex, 0, draggedSlide);
        return newSlides;
      });

      if (currentSlideIndex === dragIndex) {
        setCurrentSlideIndex(hoverIndex);
      } else if (
        currentSlideIndex > dragIndex &&
        currentSlideIndex <= hoverIndex
      ) {
        setCurrentSlideIndex(currentSlideIndex - 1);
      } else if (
        currentSlideIndex < dragIndex &&
        currentSlideIndex >= hoverIndex
      ) {
        setCurrentSlideIndex(currentSlideIndex + 1);
      }
    },
    [slides.length, currentSlideIndex, updateHistory]
  );

  const addNewElement = useCallback(
    (elementType) => {
      if (currentSlideIndex < 0 || currentSlideIndex >= slides.length) return;

      updateHistory();

      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 10);
      const uniqueId = `element-${timestamp}-${randomString}`;

      const newElement = {
        id: uniqueId,
        type: elementType,
        position: { x: 240, y: 200 },
        size: { width: 300, height: 100 },
        zIndex: 1,
        properties: {},
      };

      switch (elementType) {
        case "text":
          newElement.properties = {
            text: "New Text",
            fontSize: 24,
            color: "#000000",
            align: "left",
          };
          break;
        case "image":
          newElement.properties = {
            src: "/placeholder.svg?height=200&width=300",
            alt: "New Image",
            borderRadius: 0,
          };
          break;
        case "shape":
          newElement.properties = {
            shapeType: "rectangle",
            fill: "#e0e0e0",
            stroke: "#000000",
            strokeWidth: 1,
          };
          break;
        case "chart":
          newElement.properties = {
            chartType: "bar",
            data: "10,20,30,40",
            labels: "A,B,C,D",
          };
          break;
      }

      setSlides((prevSlides) => {
        const updatedSlides = [...prevSlides];
        updatedSlides[currentSlideIndex].elements.push(newElement);
        return updatedSlides;
      });

      setTimeout(() => {
        setSelectedElement(newElement);
        setIsEditing(true);
      }, 50);
    },
    [currentSlideIndex, slides.length, updateHistory]
  );

  const applyTemplate = useCallback(
    (template) => {
      updateHistory();

      setSlides((prevSlides) => {
        const updatedSlides = [...prevSlides];
        const currentSlide = updatedSlides[currentSlideIndex];

        updatedSlides[currentSlideIndex] = {
          ...currentSlide,
          background: template.background,
          elements: template.elements.map((element) => ({
            ...element,
            id: `element-${
              Date.now() + Math.floor(Math.random() * 1000)
            }-${Math.random().toString(36).substring(2, 9)}`,
          })),
        };

        return updatedSlides;
      });

      setIsTemplateSelectorOpen(false);
    },
    [currentSlideIndex, updateHistory]
  );

  const importPresentation = useCallback(
    (data) => {
      if (!data || !data.slides) return;

      updateHistory();

      setSlides(data.slides);
      if (data.title) {
        setPresentationTitle(data.title);
      }
      setCurrentSlideIndex(0);
      setSelectedElement(null);
      setIsEditing(false);
    },
    [updateHistory]
  );

  const toggleElementLock = useCallback((elementId) => {
    setLockedElements((prevLockedElements) => {
      const newLockedElements = new Set(prevLockedElements);
      if (newLockedElements.has(elementId)) {
        newLockedElements.delete(elementId);
      } else {
        newLockedElements.add(elementId);
      }
      return newLockedElements;
    });
  }, []);

  const value = {
    project,
    slides,
    currentSlideIndex,
    selectedElement,
    isEditing,
    presentationTitle,
    isPresentationMode,
    isTemplateSelectorOpen,
    lockedElements,
    isUpdated,

    canUndo: past.length > 0,
    canRedo: future.length > 0,

    setProject,
    setSlides,
    setCurrentSlideIndex,
    setSelectedElement,
    setIsEditing,
    setPresentationTitle,
    setIsPresentationMode,
    setIsTemplateSelectorOpen,
    setIsUpdated,
    
    handleElementClick,
    handleElementUpdate,
    handleElementMove,
    addNewSlide,
    deleteSlide,
    moveSlide,
    addNewElement,
    deleteElement,
    duplicateElement,
    applyTemplate,
    undo,
    redo,
    importPresentation,
    toggleElementLock,
    isElementLocked: useCallback(
      (elementId) => lockedElements.has(elementId),
      [lockedElements]
    ),
  };

  return (
    <PresentationContext.Provider value={value}>
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentation() {
  const context = useContext(PresentationContext);
  if (context === undefined) {
    throw new Error(
      "usePresentation must be used within a PresentationProvider"
    );
  }
  return context;
}
