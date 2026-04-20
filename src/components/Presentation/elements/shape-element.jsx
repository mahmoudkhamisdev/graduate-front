"use client";

export default function ShapeElement({
  element,
  isSelected,
  isEditing,
  onClick,
  onMouseDown,
  onUpdate,
}) {
  const { properties } = element;

  const shapeStyle = {
    width: "100%",
    height: "100%",
    backgroundColor: properties.fill || "#000000",
    border: `${properties.strokeWidth || 1}px solid ${
      properties.stroke || "#000000"
    }`,
    borderRadius:
      properties.shapeType === "circle"
        ? "50%"
        : properties.shapeType === "rectangle"
        ? `${properties.borderRadius || 0}px`
        : "0",
  };

  const renderTriangle = () => {
    if (properties.shapeType !== "triangle") return null;

    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        <polygon
          points="50,10 90,90 10,90"
          fill={properties.fill || "#000000"}
          stroke={properties.stroke || "#000000"}
          strokeWidth={properties.strokeWidth || 1}
        />
      </svg>
    );
  };

  return (
    <div
      className={`w-full h-full cursor-pointer ${
        isSelected ? "outline outline-2 outline-blue-500 outline-offset-2" : ""
      }`}
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      {properties.shapeType === "triangle" ? (
        renderTriangle()
      ) : (
        <div style={shapeStyle}></div>
      )}
    </div>
  );
}
