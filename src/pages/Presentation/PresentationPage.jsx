"use client";

import { useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Sidebar from "src/components/Presentation/sidebar";
import SlideView from "src/components/Presentation/slide-view";
import Toolbar from "src/components/Presentation/toolbar";
import ElementCreator from "src/components/Presentation/element-creator";
import PresentationMode from "src/components/Presentation/presentation-mode";
import TemplateSelector from "src/components/Presentation/template-selector";
import { usePresentation } from "src/context/presentation-context";
import { downloadJSON, uploadJSON } from "src/lib/file-utils";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { BaseUrlApi, ErrorMessage } from "../../lib/api";
import { Skeleton } from "src/components/ui/skeleton";
import { defaultSlides } from "../../lib/default-slides";
import { slideTemplates } from "./../../lib/slide-templates";
import { askAgiant } from "src/lib/ai-agent";
import { useAuth } from "../../context/AuthContext";

// Track previous value
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function PresentationPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const content = location?.state?.content;
  const { user } = useAuth();

  const {
    slides,
    setSlides,
    project,
    setProject,
    currentSlideIndex,
    isPresentationMode,
    isTemplateSelectorOpen,
    setIsUpdated,
    presentationTitle,
    setCurrentSlideIndex,
    importPresentation,
    setPresentationTitle,
  } = usePresentation();

  const slideViewRef = useRef(null);
  const slideRefs = useRef([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingProject, setLoadingProject] = useState(true);
  const prevSlides = usePrevious(slides);

  const isPresentationPublic =
    project?.isPublic && project?.user?._id !== user?._id;

  // Scroll handler
  useEffect(() => {
    if (isPresentationMode) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const slideHeight = window.innerHeight;
      const newIndex = Math.floor(scrollPosition / slideHeight);

      if (
        newIndex !== currentSlideIndex &&
        newIndex >= 0 &&
        newIndex < slides.length
      ) {
        setCurrentSlideIndex(newIndex);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    currentSlideIndex,
    slides.length,
    isPresentationMode,
    setCurrentSlideIndex,
  ]);

  // Scroll to newly added slide
  useEffect(() => {
    if (slides.length > 0 && (project.content || content)) {
      const lastSlideRef = slideRefs.current[slides.length - 1];
      if (lastSlideRef) {
        lastSlideRef.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [slides.length]);

  // Export / Import / PDF
  useEffect(() => {
    const handleExport = () => {
      const presentationData = {
        title: presentationTitle,
        slides: slides,
        currentSlideIndex: currentSlideIndex,
      };
      downloadJSON(presentationData, presentationTitle);
    };

    const handleImport = async (e) => {
      try {
        const file = e.detail.file;
        if (file) {
          const presentationData = await uploadJSON(file);
          importPresentation(presentationData);
        }
      } catch (error) {
        console.error("Error importing presentation:", error);
        alert("Failed to import presentation. Please check the file format.");
      }
    };

    const handleExportPDF = () => {
      alert("Preparing PDF for download...");
      import("html2canvas").then((html2canvasModule) => {
        const html2canvas = html2canvasModule.default;

        import("jspdf").then((jsPDFModule) => {
          const jsPDF = jsPDFModule.default;
          const pdf = new jsPDF("l", "mm", "a4");
          const slidesToRender = document.querySelectorAll(".slide-container");

          const renderSlides = async () => {
            for (let i = 0; i < slidesToRender.length; i++) {
              const slide = slidesToRender[i];
              slide.style.display = "flex";

              const canvas = await html2canvas(
                slide.querySelector(".slide-content"),
                { scale: 2, useCORS: true, allowTaint: true },
              );

              const imgData = canvas.toDataURL("image/jpeg", 1.0);
              if (i > 0) pdf.addPage();

              const imgProps = pdf.getImageProperties(imgData);
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = pdf.internal.pageSize.getHeight();
              const ratio = Math.min(
                pdfWidth / imgProps.width,
                pdfHeight / imgProps.height,
              );
              const imgWidth = imgProps.width * ratio;
              const imgHeight = imgProps.height * ratio;
              const x = (pdfWidth - imgWidth) / 2;
              const y = (pdfHeight - imgHeight) / 2;

              pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);
              if (i !== currentSlideIndex) slide.style.display = "";
            }

            pdf.save(
              `${presentationTitle.replace(/\s+/g, "-").toLowerCase()}.pdf`,
            );
          };

          renderSlides();
        });
      });
    };

    window.addEventListener("presentation-export", handleExport);
    window.addEventListener("presentation-import", handleImport);
    window.addEventListener("presentation-export-pdf", handleExportPDF);

    return () => {
      window.removeEventListener("presentation-export", handleExport);
      window.removeEventListener("presentation-import", handleImport);
      window.removeEventListener("presentation-export-pdf", handleExportPDF);
    };
  }, [slides, presentationTitle, currentSlideIndex, importPresentation]);

  const conversationContextRef = useRef([]);

  const extractSlides = (text) => {
    let cleanedText = text
      .replace(/```(?:json)?\n?/g, "")
      .replace(/```/g, "")
      .replace(/\/\/.*$/gm, "")
      .trim();

    const arrayStartIndex = cleanedText.indexOf("[");
    const arrayEndIndex = cleanedText.lastIndexOf("]");

    if (arrayStartIndex !== -1 && arrayEndIndex > arrayStartIndex) {
      cleanedText = cleanedText.substring(arrayStartIndex, arrayEndIndex + 1);
    }

    try {
      const parsedArray = JSON.parse(cleanedText);
      if (Array.isArray(parsedArray)) {
        return parsedArray.filter(
          (slide) => slide && slide.id && slide.template,
        );
      }
    } catch (e) {
      const extractedSlides = [];
      let openBraces = 0,
        startPos = -1,
        inString = false,
        escapeNext = false;

      for (let i = 0; i < cleanedText.length; i++) {
        const char = cleanedText[i];

        if (char === '"' && !escapeNext) inString = !inString;
        if (char === "\\" && !escapeNext) {
          escapeNext = true;
          continue;
        } else {
          escapeNext = false;
        }

        if (!inString) {
          if (char === "{") {
            if (openBraces === 0) startPos = i;
            openBraces++;
          } else if (char === "}") {
            openBraces--;
            if (openBraces === 0 && startPos !== -1) {
              const slideJson = cleanedText.substring(startPos, i + 1);
              try {
                const slide = JSON.parse(slideJson);
                if (slide && slide.id && slide.template) {
                  extractedSlides.push(slide);
                }
              } catch {}
              startPos = -1;
            }
          }
        }
      }

      return extractedSlides;
    }

    return [];
  };

  const getProject = async () => {
    setPresentationTitle("Loading...");
    try {
      const { data } = await axios.get(`${BaseUrlApi}/projects/${id}`);
      setSlides(data.data.project?.slides ?? []);
      setPresentationTitle(data.data.project?.projectName);
      setProject(data.data.project);
      setLoadingProject(false);
    } catch (error) {
      navigate("/dashboard", { replace: true });
      toast.error(ErrorMessage(error));
    }
  };

  const updateSlides = async (slides) => {
    setIsUpdated(true);
    try {
      await axios.put(`${BaseUrlApi}/projects/${id}/slides`, { slides });
    } catch (error) {
      toast.error(ErrorMessage(error));
    } finally {
      setIsUpdated(false);
    }
  };

  const generateSlides = async () => {
    setIsGenerating(true);
    setSlides([]);

    const prompt = `
Create a presentation based on this plan:
${project.content || content}

Generate more than 15 slides using the provided templates and structure.
Use these default slides as reference:
${JSON.stringify(defaultSlides)}

Use these templates:
${JSON.stringify(slideTemplates)}

IMPORTANT: Return ONLY a valid JSON array of slide objects with unique IDs like { id: "slide-1", title: "Title", content: "..." }
`;

    toast.loading(`Generating Slides...`, {
      id: `generate-slides`,
      duration: Infinity,
    });

    try {
      const fullResponse = await askAgiant(prompt);
      const extractedSlides = extractSlides(fullResponse);

      if (extractedSlides.length > 0) {
        const slidesWithIds = extractedSlides.map((slide, index) => ({
          ...slide,
          id: slide.id || `slide-${Date.now()}-${index}`,
        }));
        setSlides(slidesWithIds);
        toast.message(`Generated ${slidesWithIds.length} slides 🚀`, {
          id: `generate-slides`,
          duration: Infinity,
        });
      } else {
        toast.error("No slides generated, using default slides");
        setSlides(defaultSlides);
      }
    } catch (error) {
      console.error("Error generating slides:", error);
      toast.error("Failed to generate slides, using default slides");
      setSlides(defaultSlides);
    }

    toast.dismiss(`generate-slides`);
    toast.success("Slides Generated Successfully 🎉");
    setIsGenerating(false);
  };

  // Trigger slide generation after project/content is ready
  useEffect(() => {
    if ((project?.content || content) && !loadingProject) {
      generateSlides();
    } else {
      getProject();
    }
  }, [project?.content, content, loadingProject]);

  // Autosave functionality
  const autosaveTimeoutRef = useRef(null);
  useEffect(() => {
    const isSlidesChanged =
      JSON.stringify(slides) !== JSON.stringify(prevSlides);

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    if (
      slides.length > 0 &&
      !isGenerating &&
      !loadingProject &&
      isSlidesChanged
    ) {
      autosaveTimeoutRef.current = setTimeout(() => {
        updateSlides(slides);
      }, 500);
    }

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
        autosaveTimeoutRef.current = null;
      }
    };
  }, [slides, isGenerating]);

  if (isPresentationMode) return <PresentationMode />;

  return (
    <div className="flex h-screen overflow-hidden relative">
      {loadingProject ? (
        <div className="h-full w-1/5 border flex flex-col gap-4 items-center pt-20 px-5">
          <Skeleton className="w-full h-1/4" />
          <Skeleton className="w-full h-1/4" />
          <Skeleton className="w-full h-1/4" />
        </div>
      ) : (
        <Sidebar isPresentationMode={isPresentationPublic} />
      )}

      <div className="flex flex-col flex-1 overflow-hidden pt-14">
        <div className="flex-1 overflow-auto" ref={slideViewRef}>
          <div className="min-h-full">
            {loadingProject ? (
              <div className="h-screen w-full flex flex-col items-center justify-center gap-10">
                <Skeleton className="w-3/4 h-3/4" />
              </div>
            ) : (
              slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="h-screen w-full flex items-center justify-center slide-container"
                  style={{ scrollSnapAlign: "start" }}
                  ref={(el) => (slideRefs.current[index] = el)}
                >
                  <SlideView
                    isPresentationMode={isPresentationPublic}
                    slide={slide}
                    isActive={index === currentSlideIndex}
                    scale={1}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {!isPresentationPublic && !loadingProject && <Toolbar />}
      <ElementCreator isPresentationMode={isPresentationPublic} />
      {isTemplateSelectorOpen && <TemplateSelector />}
    </div>
  );
}

export default function Home() {
  return (
    <DndProvider backend={HTML5Backend}>
      <PresentationPage />
    </DndProvider>
  );
}
