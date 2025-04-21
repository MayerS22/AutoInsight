/* eslint-disable react/prop-types */
"use client";
import { useNavigate } from "react-router-dom";

import {
  RadialBar,
  RadialBarChart,
  PolarRadiusAxis,
  Label,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

const ReviewsAnalysis = () => {
  const reviewData = [
    { name: "current", positive: 60, neutral: 20, negative: 20 },
  ];

  const navigate=useNavigate();

  const sentiments = {
    positive: {
      name: "Positive",
      value: reviewData[0].positive,
      color: "#22c55e",
      emoji: "😊",
      bgColor: "bg-green-100",
      textColor: "text-green-700",
    },
    neutral: {
      name: "Neutral",
      value: reviewData[0].neutral,
      color: "#facc15",
      emoji: "😐",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-700",
    },
    negative: {
      name: "Negative",
      value: reviewData[0].negative,
      color: "#ef4444",
      emoji: "😞",
      bgColor: "bg-red-100",
      textColor: "text-red-700",
    },
  };

  const dominantSentimentKey = Object.keys(sentiments).reduce(
    (maxKey, key) =>
      sentiments[key].value > sentiments[maxKey].value ? key : maxKey,
    Object.keys(sentiments)[0]
  );

  const dominantSentiment = sentiments[dominantSentimentKey];

  // Custom Tooltip for showing sentiment and percentage
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const bars = payload.filter((item) => item.value > 0);
      return (
        <div className="bg-purple-50 p-2 rounded shadow text-xs border">
          {bars.map((bar) => {
            const sentiment = sentiments[bar.dataKey];
            return (
              <div key={bar.dataKey} className="flex items-center gap-2 mb-1">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ background: sentiment.color }}
                ></span>
                <span>
                  {sentiment.emoji} {sentiment.name}: {bar.value}%
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg p-2">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Reviews Analysis</h2>
        <button onClick={()=>{navigate("/admin/reviews-analysis")}} className="mt-2 sm:mt-0 bg-purple-950 hover:bg-purple-700 text-white text-xs px-6 py-2 rounded-lg flex items-center self-start sm:self-auto">
          View
        </button>
      </div>

      <div className="flex justify-center">
        {/* Removed aspect-square and set a fixed height to reduce extra bottom padding */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-[250px] h-[220px] ">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="60%"
              outerRadius="90%"
              data={reviewData}
              startAngle={180}
              endAngle={0}
            >
              <RechartsTooltip content={<CustomTooltip />} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <>
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) - 10}
                              className="fill-foreground text-2xl font-bold"
                            >
                              {dominantSentiment.value}%
                            </tspan>
                          </text>
                          <foreignObject
                            x={viewBox.cx - 50}
                            y={(viewBox.cy || 0) + 5}
                            width="100"
                            height="40"
                          >
                            <div className="flex items-center justify-center w-full h-full">
                              <span
                                className={`inline-block px-3 py-1 text-sm rounded-full ${dominantSentiment.bgColor} ${dominantSentiment.textColor}`}
                                style={{ lineHeight: "1.5" }}
                              >
                                {dominantSentiment.emoji} {dominantSentiment.name}
                              </span>
                            </div>
                          </foreignObject>
                        </>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="negative"
                stackId="a"
                cornerRadius={5}
                fill={sentiments.negative.color}
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="neutral"
                stackId="a"
                cornerRadius={5}
                fill={sentiments.neutral.color}
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="positive"
                stackId="a"
                cornerRadius={5}
                fill={sentiments.positive.color}
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReviewsAnalysis;
