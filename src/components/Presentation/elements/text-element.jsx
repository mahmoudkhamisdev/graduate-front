"use client";

import { useState, useEffect, useRef } from "react";

export default function TextElement({
  element,
  isSelected,
  isEditing,
  onClick,
  onMouseDown,
  onUpdate,
}) {
  const [localText, setLocalText] = useState(element.properties.text || "");
  const textRef = useRef(null);
  const inputRef = useRef(null);

  // Update local text when element properties change
  useEffect(() => {
    if (element.properties.text !== undefined) {
      setLocalText(element.properties.text);
    }
  }, [element.properties.text]);

  // Focus the input when editing starts
  useEffect(() => {
    if (isSelected && isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSelected, isEditing]);

  const handleTextChange = (e) => {
    // const textarea = textRef.current;
    // textarea.style.height = "auto"; // Reset height first
    // textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on scrollHeight

    const newText = e.target.value;
    setLocalText(newText);
  };

  const handleBlur = () => {
    if (onUpdate && localText !== element.properties.text) {
      const updatedElement = {
        ...element,
        properties: {
          ...element.properties,
          text: localText,
        },
      };
      onUpdate(updatedElement);
    }
  };

  const getTextStyle = () => {
    const { properties } = element;
    return {
      fontWeight: properties.bold ? "bold" : "normal",
      fontStyle: properties.italic ? "italic" : "normal",
      textDecoration: properties.underline ? "underline" : "none",
      fontSize: `${properties.fontSize || 16}px`,
      color: properties.color || "#000000",
      textAlign: properties.align || "left",
      lineHeight: properties.lineHeight || 1.5,
      fontFamily: properties.fontFamily || "Arial, sans-serif",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      resize: "none",
      border: "none",
      background: "transparent",
      padding: "0",
      margin: "0",
      // outline: "none",
    };
  };

  return (
    <div
      className={`w-full h-full cursor-pointer ${
        isSelected ? "outline outline-2 outline-blue-500 outline-offset-2" : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onMouseDown(e);
      }}
      ref={textRef}
    >
      {isSelected && isEditing ? (
        <textarea
          value={localText}
          // ref={textRef}
          onChange={handleTextChange}
          onBlur={handleBlur}
          className="w-full outline-none outline outline-2 outline-blue-500 outline-offset-2 min-h-[1.5rem] h-auto"
          style={getTextStyle()}
          placeholder="Click to edit text"
        />
      ) : (
        <textarea
          value={localText}
          readOnly
          className="w-full h-full"
          style={getTextStyle()}
          placeholder="Click to edit text"
        />
      )}
    </div>
  );
}
