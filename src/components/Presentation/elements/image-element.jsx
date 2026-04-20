"use client"


export default function ImageElement({
  element,
  isSelected,
  isEditing,
  onClick,
  onMouseDown,
  onUpdate,
}) {
  const { properties } = element

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: `${properties.borderRadius || 0}%`,
    opacity: (properties.opacity || 100) / 100,
    border: properties.border ? `${properties.borderWidth || 1}px solid ${properties.borderColor || "#000"}` : "none",
    pointerEvents: "none", // This prevents the image from capturing mouse events
  }

  return (
    <div
      className={`w-full h-full cursor-pointer ${isSelected ? "outline outline-2 outline-blue-500 outline-offset-2" : ""}`}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
        onMouseDown(e)
      }}
    >
      <img
        src={properties.src || "/placeholder.svg?height=200&width=300"}
        alt={properties.alt || "Image"}
        style={imageStyle}
        draggable={false}
      />
    </div>
  )
}
