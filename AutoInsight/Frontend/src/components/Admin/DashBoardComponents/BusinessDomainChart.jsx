"use client";

import React, { useState, useEffect } from "react";

const BusinessDomainChart = () => {
  const [hoveredSection, setHoveredSection] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(true);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Dynamic data for the chart
  const sections = [
    { id: "ecommerce", label: "Ecommerce", percentage: 80, color: "#7C3AED" },
    { id: "education", label: "Education", percentage: 20, color: "#E5E7EB" }
  ];

  // Animation effect when component mounts
  useEffect(() => {
    let animationFrame;
    let startTime = null;
    const duration = 1000; // 1 second animation

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setAnimationProgress(progress);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    setIsAnimating(true);
    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  // Calculate positions for labels based on the pie chart angles - fixed label positioning
  const calculateLabelPosition = (percentage, startPercentage, progress = 1) => {
    const totalDegrees = 360;
    const startAngle = (startPercentage / 100) * totalDegrees;
    const angle = startAngle + ((percentage / 100) * totalDegrees * progress) / 2;
    const radians = (angle - 90) * (Math.PI / 180);
    const radius = 6; // Reduced radius for labels
    const x = 16 + radius * Math.cos(radians);
    const y = 16 + radius * Math.sin(radians);
    return { x, y };
  };

  // Calculate the SVG paths for pie slices with animation
  const generatePiePaths = () => {
    let cumulativePercentage = 0;
    const total = sections.reduce((sum, section) => sum + section.percentage, 0);
    const progress = isAnimating ? animationProgress : 1;

    return sections.map(section => {
      const normalizedPercentage = (section.percentage / total) * 100;
      const startPercentage = cumulativePercentage;
      cumulativePercentage += normalizedPercentage;

      const animatedPercentage = normalizedPercentage * progress;
      const animatedEndPercentage = startPercentage + animatedPercentage;

      const startAngle = (startPercentage / 100) * 2 * Math.PI;
      const endAngle = (animatedEndPercentage / 100) * 2 * Math.PI;

      const startX = 16 + 16 * Math.sin(startAngle);
      const startY = 16 - 16 * Math.cos(startAngle);
      const endX = 16 + 16 * Math.sin(endAngle);
      const endY = 16 - 16 * Math.cos(endAngle);

      const largeArcFlag = animatedPercentage > 50 ? 1 : 0;

      const path = `M16 16 L${startX} ${startY} A16 16 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

      const labelOpacity = progress > 0.7 ? (progress - 0.7) / 0.3 : 0;
      const labelPos = calculateLabelPosition(normalizedPercentage, startPercentage, progress);

      return {
        ...section,
        path,
        labelPosition: labelPos,
        startPercentage,
        labelOpacity
      };
    });
  };

  const pieData = generatePiePaths();

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Active segment scale and shadow animation with neutral shadow
  const getSegmentStyle = (id) => {
    if (hoveredSection === id) {
      return {
        transformOrigin: "center",
        transform: "scale(1.08) translate(-1.2px, -1.2px)",
        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0))",
        transition: "transform 0.3s cubic-bezier(.4,2,.6,1), filter 0.3s cubic-bezier(.4,2,.6,1)"
      };
    }
    return {
      transformOrigin: "center",
      transform: "scale(1)",
      filter: "none",
      transition: "transform 0.3s cubic-bezier(.4,2,.6,1), filter 0.3s cubic-bezier(.4,2,.6,1)"
    };
  };

  return (
    <div className="flex flex-col bg-white rounded-lg relative">
      {/* Header */}
      <div className="pb-0 mb-4">
        <h3 className="text-lg font-bold">Most Used Business Domain</h3>
        <p className="text-sm text-gray-500">January - June 2024</p>
      </div>

      {/* Content */}
      <div className="flex-1 pb-0">
        <div className="flex justify-center p-4">
          <div
            className="relative w-full max-w-xs aspect-square"
            onMouseMove={handleMouseMove}
            style={{ minWidth: 0 }}
          >
            <svg className="w-full h-full" viewBox="0 0 32 32" preserveAspectRatio="xMidYMid meet">
              {pieData.map((section) => (
                <React.Fragment key={section.id}>
                  <path
                    d={section.path}
                    fill={section.color}
                    onMouseEnter={() => setHoveredSection(section.id)}
                    onMouseLeave={() => setHoveredSection(null)}
                    className="cursor-pointer"
                    style={getSegmentStyle(section.id)}
                  />
                </React.Fragment>
              ))}

              {/* Labels */}
              {pieData.map((section) => {
                const midPercentage = section.startPercentage + (section.percentage / 2);
                const totalPercentage = sections.reduce((sum, s) => sum + s.percentage, 0);
                const angle = (midPercentage / totalPercentage) * 2 * Math.PI - Math.PI / 2;
                const labelRadius = 8;
                const x = 16 + labelRadius * Math.cos(angle);
                const y = 16 + labelRadius * Math.sin(angle);

                return (
                  <text
                    key={`label-${section.id}`}
                    x={x}
                    y={y}
                    fontSize="1.8"
                    fill={section.color === "#E5E7EB" ? "#374151" : "white"}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    opacity={section.labelOpacity}
                    className="transition-opacity duration-300"
                  >
                    {section.label}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Hover Information */}
      {hoveredSection && (
        <div
          className="absolute bg-white p-2 rounded shadow-md border border-gray-200 text-sm z-50 flex items-center gap-2 animate-fadeIn"
          style={{
            left: `clamp(10px, ${hoverPosition.x}px, calc(100% - 120px))`,
            top: `clamp(10px, ${hoverPosition.y}px, calc(100% - 40px))`,
            transform: 'translate(-50%, -100%)',
            transition: 'all 0.2s ease-in-out',
            maxWidth: "200px",
            pointerEvents: "none"
          }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: sections.find(s => s.id === hoveredSection)?.color }}
          />
          <span className="font-medium">
            {sections.find(s => s.id === hoveredSection)?.percentage}%
          </span>
          <span className="text-gray-600">
            {sections.find(s => s.id === hoveredSection)?.label}
          </span>
        </div>
      )}

      {/* Animation style */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @media (max-width: 640px) {
          .max-w-xs {
            max-width: 100vw !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BusinessDomainChart;