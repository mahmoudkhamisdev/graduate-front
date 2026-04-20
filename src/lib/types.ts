export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Element {
  id: string
  type: "text" | "image" | "shape" | "chart"
  position: Position
  size: Size
  zIndex?: number
  properties: {
    [key: string]: any
    text?: string
    fontSize?: number
    color?: string
    bold?: boolean
    italic?: boolean
    underline?: boolean
    align?: "left" | "center" | "right"
    shapeType?: "rectangle" | "circle" | "triangle"
    fill?: string
    stroke?: string
    strokeWidth?: number
    src?: string
    alt?: string
    borderRadius?: number
    opacity?: number
    chartType?: "bar" | "line" | "pie"
    data?: string
    labels?: string
  }
}

export interface Slide {
  id: string
  title: string
  background: string
  elements: Element[]
}

export interface PresentationData {
  title: string
  slides: Slide[]
  currentSlideIndex?: number
}
