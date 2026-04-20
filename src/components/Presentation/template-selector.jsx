"use client"

import { useState } from "react"
import { Button } from "src/components/ui/button"
import { X } from "lucide-react"
import { slideTemplates } from "src/lib/slide-templates"
import { usePresentation } from "src/context/presentation-context"

export default function TemplateSelector() {
  const { applyTemplate, setIsTemplateSelectorOpen } = usePresentation()
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Templates" },
    { id: "title", name: "Title Slides" },
    { id: "content", name: "Content Slides" },
    { id: "data", name: "Data Slides" },
    { id: "marketing", name: "Marketing Slides" },
  ]

  const filteredTemplates =
    selectedCategory === "all"
      ? slideTemplates
      : slideTemplates.filter((template) => template.category === selectedCategory)

  return (
    <div className="fixed inset-0 bg-background/50 z-50 flex items-center justify-center">
      <div className="bg-background border rounded-lg w-[90%] max-w-5xl h-[80%] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Slide Templates</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsTemplateSelectorOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex overflow-x-auto border-b">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              className="rounded-none"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredTemplates.map((template, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
              onClick={() => {
                // Create a copy of the template with unique IDs for all elements
                const templateWithUniqueIds = {
                  ...template,
                  elements: template.elements.map((element) => ({
                    ...element,
                    id: `element-${
                      Date.now() + Math.floor(Math.random() * 1000)
                    }-${Math.random().toString(36).substring(2, 9)}`,
                  })),
                };
                applyTemplate(templateWithUniqueIds);
              }}
            >
              <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                {/* Template preview */}
                <div className="w-full h-full scale-[0.6] transform-origin-center">
                  <div
                    className="w-[960px] h-[540px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ backgroundColor: template.background }}
                  >
                    {template.elements.map((element, idx) => (
                      <div
                        key={idx}
                        className="absolute"
                        style={{
                          left: element.position.x,
                          top: element.position.y,
                          width: element.size.width,
                          height: element.size.height,
                          backgroundColor:
                            element.type === "shape"
                              ? element.properties.fill
                              : "transparent",
                          border:
                            element.type === "shape"
                              ? `${
                                  element.properties.strokeWidth || 1
                                }px solid ${
                                  element.properties.stroke || "#000"
                                }`
                              : "none",
                          borderRadius:
                            element.type === "shape" &&
                            element.properties.shapeType === "circle"
                              ? "50%"
                              : "0",
                        }}
                      >
                        {element.type === "text" && (
                          <div
                            className="w-full h-full"
                            style={{
                              fontSize: `${
                                element.properties.fontSize || 16
                              }px`,
                              fontWeight: element.properties.bold
                                ? "bold"
                                : "normal",
                              textAlign: element.properties.align || "left",
                              color: element.properties.color || "#000",
                            }}
                          >
                            {element.properties.text}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-2">
                <h3 className="font-medium">{template.title}</h3>
                <p className="text-sm text-gray-500">
                  {template.description || "Template"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
