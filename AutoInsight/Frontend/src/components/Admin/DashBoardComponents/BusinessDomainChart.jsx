/* eslint-disable no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { fetchDomainCount } from "../Services/Admin_API.js";

const BusinessDomainChart = () => {
  const [domainData, setDomainData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [hoveredSection, setHoveredSection] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(true);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const fetchDomainData = async () => {
      try {
        setLoading(true);
        const data = await fetchDomainCount();
        //console.log("Domain data received:", data);
        setDomainData(data);
        setFetchError(null);
      } catch (err) {
        console.error("Error fetching domain data:", err);
        setDomainData({ ecommerce: 80, education: 20 });
        setFetchError("Using fallback domain data due to API error.");
      } finally {
        setLoading(false);
      }
    };

    fetchDomainData();
  }, []);

  const sections = domainData
    ? (() => {
        const ecommerceCount = domainData.ecommerce || 0;
        const educationCount = domainData.education || 0;
        const totalCount = ecommerceCount + educationCount;

        if (totalCount === 0) {
          return [
            { id: "empty", label: "No Data", percentage: 100, color: "#B495F1" }
          ];
        }

        return [
          {
            id: "ecommerce",
            label: "Ecommerce",
            percentage: (ecommerceCount / totalCount) * 100,
            color: "#B495F1"
          },
          {
            id: "education",
            label: "Education",
            percentage: (educationCount / totalCount) * 100,
            color: "#E9D7FD"
          }
        ];
      })()
    : [
        { id: "ecommerce", label: "Ecommerce", percentage: 80, color: "#E9D7FD" },
        { id: "education", label: "Education", percentage: 20, color: "#E5E7EB" }
      ];

  useEffect(() => {
    let animationFrame;
    let startTime = null;
    const duration = 1000;

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
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [domainData]);

  const calculateLabelPosition = (percentage, startPercentage, progress = 1) => {
    const totalDegrees = 360;
    const startAngle = (startPercentage / 100) * totalDegrees;
    const angle = startAngle + ((percentage / 100) * totalDegrees * progress) / 2;
    const radians = (angle - 90) * (Math.PI / 180);

    const radius = percentage === 100 ? 0 : 6;
    const x = 16 + radius * Math.cos(radians);
    const y = 16 + radius * Math.sin(radians);
    return { x, y };
  };

  const generatePiePaths = () => {
    let cumulativePercentage = 0;
    const total = sections.reduce((sum, section) => sum + section.percentage, 0);
    const progress = isAnimating ? animationProgress : 1;

    return sections.map((section) => {
      const normalizedPercentage = (section.percentage / total) * 100;
      const startPercentage = cumulativePercentage;
      cumulativePercentage += normalizedPercentage;

      const animatedPercentage = normalizedPercentage * progress;
      const animatedEndPercentage = startPercentage + animatedPercentage;

      if (normalizedPercentage === 100) {
        const path = `M16,16 m-16,0 a16,16 0 1,0 32,0 a16,16 0 1,0 -32,0`;
        const labelOpacity = progress > 0.7 ? (progress - 0.7) / 0.3 : 0;

        return {
          ...section,
          path,
          labelPosition: { x: 16, y: 16 },
          startPercentage,
          labelOpacity
        };
      }

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

  const getSegmentStyle = (id) => {
    return {
      transformOrigin: "center",
      transform: hoveredSection === id ? "scale(1.05)" : "scale(1)",
      transition: "transform 0.3s cubic-bezier(.4,2,.6,1)"
    };
  };

  const hasNoData = domainData &&
    ((domainData.ecommerce || 0) === 0 && (domainData.education || 0) === 0);

  return (
    <div className="flex flex-col bg-white rounded-lg relative">
      <div className="pb-0 mb-4">
        <h3 className="text-lg font-bold">Most Used Business Domain</h3>
        <p className="text-sm text-gray-500">January - June 2025</p>
        {fetchError && (
          <p className="text-xs text-amber-600 mt-1">{fetchError}</p>
        )}
      </div>

      <div className="flex-1 pb-0">
        <div className="flex justify-center p-4">
          <div
            className="relative w-full max-w-xs aspect-square"
            onMouseMove={handleMouseMove}
            style={{ minWidth: 0, overflow: "visible" }}
          >
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : hasNoData ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm">No domain data available</p>
              </div>
            ) : (
              <svg
                className="w-full h-full"
                viewBox="0 0 32 32"
                preserveAspectRatio="xMidYMid meet"
                style={{ overflow: "visible" }}
              >
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
                {pieData.map((section) => {
                  if (section.percentage === 0 || section.id === "empty") return null;

                  const labelColor =
                    section.id === "education" ? "#3B0764" : (section.color === "#E5E7EB" ? "#374151" : "white");

                  if (section.percentage === 100) {
                    return (
                      <text
                        key={`label-${section.id}`}
                        x="16"
                        y="16"
                        fontSize="3"
                        fill={labelColor}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        opacity={section.labelOpacity}
                        className="transition-opacity duration-300"
                      >
                        {section.label}
                      </text>
                    );
                  }

                  const { x, y } = section.labelPosition;

                  return (
                    <text
                      key={`label-${section.id}`}
                      x={x}
                      y={y}
                      fontSize="1.8"
                      fill={labelColor}
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
            )}
          </div>
        </div>
      </div>

      {!loading && !hasNoData && (
        <div className="flex flex-wrap justify-center gap-4 mt-2 mb-4">
          {sections.map((section) => (
            <div
              key={`legend-${section.id}`}
              className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-white transition-colors cursor-pointer"
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: section.color }}
              />
              <span className="text-sm text-gray-700">
                {section.label}: {section.percentage.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessDomainChart;
