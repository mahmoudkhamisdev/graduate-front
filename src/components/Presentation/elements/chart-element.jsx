"use client";

import { useEffect, useRef } from "react";

export default function ChartElement({
  element,
  isSelected,
  isEditing,
  onClick,
  onMouseDown,
  onUpdate,
}) {
  const canvasRef = useRef(null);
  const { properties } = element;

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Parse data and labels
    const data = (properties.data || "10,20,30").split(",").map(Number);
    const labels = (properties.labels || "A,B,C").split(",");

    // Set chart colors
    const colors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#8AC249",
      "#EA5F89",
      "#00D8B6",
      "#FFB6C1",
    ];

    // Draw chart based on type
    switch (properties.chartType) {
      case "bar":
        drawBarChart(ctx, data, labels, colors, canvas.width, canvas.height);
        break;
      case "line":
        drawLineChart(ctx, data, labels, colors, canvas.width, canvas.height);
        break;
      case "pie":
        drawPieChart(ctx, data, labels, colors, canvas.width, canvas.height);
        break;
      default:
        drawBarChart(ctx, data, labels, colors, canvas.width, canvas.height);
    }
  }, [properties]);

  const drawBarChart = (ctx, data, labels, colors, width, height) => {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = chartWidth / data.length - 10;

    // Find max value for scaling
    const maxValue = Math.max(...data);

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = "#000";
    ctx.stroke();

    // Draw bars
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight;
      const x = padding + index * (barWidth + 10);
      const y = height - padding - barHeight;

      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw label
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.fillText(
        labels[index] || "",
        x + barWidth / 2,
        height - padding + 15
      );

      // Draw value
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
    });
  };

  const drawLineChart = (ctx, data, labels, colors, width, height) => {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Find max value for scaling
    const maxValue = Math.max(...data);

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = "#000";
    ctx.stroke();

    // Draw line
    ctx.beginPath();
    data.forEach((value, index) => {
      const x = padding + index * (chartWidth / (data.length - 1));
      const y = height - padding - (value / maxValue) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Draw point
      ctx.fillStyle = colors[0];
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw label
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.fillText(labels[index] || "", x, height - padding + 15);

      // Draw value
      ctx.fillText(value.toString(), x, y - 10);
    });

    ctx.strokeStyle = colors[0];
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawPieChart = (ctx, data, labels, colors, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 40;

    // Calculate total
    const total = data.reduce((sum, value) => sum + value, 0);

    // Draw pie slices
    let startAngle = 0;
    data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();

      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();

      // Draw label
      const labelAngle = startAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${labels[index] || ""} (${value})`, labelX, labelY);

      startAngle += sliceAngle;
    });
  };

  return (
    <div
      className={`w-full h-full cursor-pointer ${
        isSelected ? "outline outline-2 outline-blue-500 outline-offset-2" : ""
      }`}
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      <canvas
        ref={canvasRef}
        width={element.size.width}
        height={element.size.height}
        className="w-full h-full"
      />
    </div>
  );
}
