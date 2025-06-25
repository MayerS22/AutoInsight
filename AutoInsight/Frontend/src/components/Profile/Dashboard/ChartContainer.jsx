/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-chart-matrix';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';

// Register matrix components
Chart.register(MatrixController, MatrixElement);

const ChartContainer = ({ title, type, data, className = '' }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const chartId = useRef(`chart-${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    // Clear any existing chart before doing anything
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    // Only create a new chart if we have a valid canvas reference
    const canvas = chartRef.current;
    if (!canvas) return;

    // Small delay to ensure any DOM updates are complete
    const timer = setTimeout(() => {
      try {
        // Create appropriate chart based on type
        if (type === 'bar') {
          createBarChart(canvas);
        } else if (type === 'pie') {
          createPieChart(canvas);
        } else if (type === 'histogram') {
          createHistogramChart(canvas);
        } else if (type === 'kde') {
          createKDEChart(canvas);
        } else if (type === 'correlation') {
          createCorrelationMatrix(canvas);
        } else if (type === 'forecast') {
          createForecastChart(canvas);
        }
      } catch (error) {
        console.error("Error creating chart:", error);
      }
    }, 0);

    // Clean up on unmount or before re-render
    return () => {
      clearTimeout(timer);
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data, type]);

  // Create bar chart for both ecommerce and education domains
  // Supports filters: 5, 10, 15, 20 items
  const createBarChart = (canvas) => {
    const ctx = canvas.getContext('2d');
    
    // Generate colors for each bar - using darker purple shades
    const colors = data.categories.map((_, index) => {
      // Generate shades between dark and light purple
      const hue = 270; // Purple hue
      const lightness = 70 - (index * 30 / data.categories.length); // From lighter to darker
      return `hsla(${hue}, 70%, ${lightness}%, 0.8)`;
    });

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.categories,
        datasets: [{
          label: data.column,
          data: data.values,
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('0.8', '1')),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw;
                const category = data.categories[context.dataIndex];
                const tooltipLines = [];
                
                // Basic count and percentage
                let percentage = 0;
                if (data.percentages && data.percentages.length > context.dataIndex) {
                  percentage = data.percentages[context.dataIndex];
                } else if (data.total_values) {
                  percentage = (value / data.total_values) * 100;
                }
                tooltipLines.push(`Count: ${value}`);
                tooltipLines.push(`Percentage: ${percentage.toFixed(1)}%`);
                
                // Growth data if available
                if (data.growth_data && data.growth_data[category] !== undefined) {
                  const growth = data.growth_data[category];
                  const growthText = growth >= 0 ? 
                    `Growth: +${growth.toFixed(1)}%` : 
                    `Decline: ${growth.toFixed(1)}%`;
                  tooltipLines.push(growthText);
                }
                
                // Customer info if available
                if (data.customer_info && data.customer_info[category]) {
                  tooltipLines.push('');
                  tooltipLines.push('Top Customers:');
                  const customers = data.customer_info[category];
                  Object.entries(customers).slice(0, 3).forEach(([name, count], i) => {
                    tooltipLines.push(`${i+1}. ${name.substring(0, 15)}: ${count}`);
                  });
                }
                
                // Related metrics if available
                if (data.related_metrics) {
                  for (const [metric, values] of Object.entries(data.related_metrics)) {
                    if (values[category] !== undefined) {
                      tooltipLines.push('');
                      tooltipLines.push(`Avg ${metric}: ${values[category].toFixed(2)}`);
                    }
                  }
                }
                
                return tooltipLines;
              }
            }
          },
          legend: {
            display: false
          },
          title: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Count'
            }
          },
          x: {
            title: {
              display: true,
              text: data.column
            }
          }
        }
      }
    });
  };

  // Create pie chart for both ecommerce and education domains
  // Used for categorical columns with few unique values (≤ 5)
  const createPieChart = (canvas) => {
    const ctx = canvas.getContext('2d');
    
    // Generate colors for each slice - using darker purple shades
    const colors = data.categories.map((_, index) => {
      // Generate shades between dark and light purple
      const hue = 270; // Base purple
      const lightness = 75 - (index * 50 / data.categories.length); // From lighter to darker
      return `hsla(${hue}, 70%, ${lightness}%, 0.8)`;
    });

    chartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.categories,
        datasets: [{
          data: data.values,
          backgroundColor: colors,
          borderColor: 'white',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.label}: ${value} (${percentage}%)`;
              }
            }
          },
          legend: {
            position: 'right',
            labels: {
              boxWidth: 15
            }
          }
        }
      }
    });
  };

  // Create histogram chart for both education and ecommerce domains
  const createHistogramChart = (canvas) => {
    const ctx = canvas.getContext('2d');
    
    // Prepare histogram data for Chart.js
    const bins = [];
    for (let i = 0; i < data.bins.length - 1; i++) {
      const binStart = data.bins[i];
      const binEnd = data.bins[i + 1];
      // Use approximate values for bin labels
      bins.push(`${Math.round(binStart)} - ${Math.round(binEnd)}`);
    }

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: bins,
        datasets: [{
          label: 'Frequency',
          data: data.frequencies,
          backgroundColor: 'rgba(88, 24, 173, 0.6)',
          borderColor: 'rgba(88, 24, 173, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              title: (context) => context[0].label,
              label: (context) => {
                const tooltipLines = [];
                tooltipLines.push(`Frequency: ${context.raw}`);
                
                // Add percentage if total values available
                if (data.stats && data.stats.mean) {
                  const totalFreq = data.frequencies.reduce((a, b) => a + b, 0);
                  const percentage = (context.raw / totalFreq) * 100;
                  tooltipLines.push(`Percentage: ${percentage.toFixed(1)}%`);
                }
                
                // Add bin range details
                const binRangeIndex = context.dataIndex;
                if (data.bins && binRangeIndex < data.bins.length - 1) {
                  const binStart = data.bins[binRangeIndex];
                  const binEnd = data.bins[binRangeIndex + 1];
                  tooltipLines.push(`Range: ${binStart.toFixed(2)} - ${binEnd.toFixed(2)}`);
                }
                
                return tooltipLines;
              },
              afterLabel: () => {
                // Add statistical information
                if (data.stats) {
                  const stats = data.stats;
                  return [
                    '',
                    `Mean: ${stats.mean.toFixed(2)}`,
                    `Median: ${stats.median.toFixed(2)}`,
                    `Std Dev: ${stats.std.toFixed(2)}`,
                    `Distribution: ${data.distribution_type || 'Unknown'}`
                  ];
                }
                return [];
              }
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Frequency'
            }
          },
          x: {
            title: {
              display: true,
              text: data.column // Remove the bins count from the title
            },
            ticks: {
              // Show fewer ticks for readability
              maxTicksLimit: 10,
              autoSkip: true
            }
          }
        }
      }
    });
    
    // Add annotation showing outliers if available
    if (data.outliers && data.outliers.count > 0) {
      const outliersElement = document.createElement('div');
      outliersElement.className = 'text-xs text-gray-600 mt-2 ml-2';
      outliersElement.textContent = `Outliers: ${data.outliers.count} values (${data.outliers.percentage.toFixed(1)}%) outside normal range`;
      
      const canvasContainer = canvas.parentNode;
      canvasContainer.appendChild(outliersElement);
    }
  };

  // Create KDE chart for both education and ecommerce domains
  const createKDEChart = (canvas) => {
    const ctx = canvas.getContext('2d');
    
    // Format x values to be approximate
    const formattedXValues = data.x_values.map(val => parseFloat(val).toFixed(1));
    
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: formattedXValues,
        datasets: [{
          label: 'Density',
          data: data.y_values,
          borderColor: 'rgba(76, 29, 149, 1)',
          backgroundColor: 'rgba(124, 58, 237, 0.2)',
          pointRadius: 0,
          borderWidth: 2,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              title: (context) => `${data.column} = ${parseFloat(context[0].label)}`,
              label: (context) => `Density: ${context.raw.toFixed(4)}`
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Density'
            }
          },
          x: {
            title: {
              display: true,
              text: data.column
            },
            ticks: {
              // Display fewer x-axis ticks with rounded values
              maxTicksLimit: 8,
              callback: function(value) {
                // Round values to 1 decimal place
                return parseFloat(this.getLabelForValue(value)).toFixed(1);
              }
            }
          }
        }
      }
    });
  };

  // Create correlation matrix for both education and ecommerce domains
  const createCorrelationMatrix = (canvas) => {
    const ctx = canvas.getContext('2d');
    
    // Prepare correlation data for the matrix chart
    const { columns, data: correlationData } = data;
    
    // Create dataset for matrix chart - ensure all cell combinations are included
    const matrixData = [];
    
    // Generate all cell combinations for the correlation matrix
    for (let i = 0; i < columns.length; i++) {
      for (let j = 0; j < columns.length; j++) {
        // Find the correlation value for this cell
        const cellData = correlationData.find(
          item => 
            (item.x === columns[i] && item.y === columns[j]) || 
            (item.x === columns[j] && item.y === columns[i])
        );
        
        // If cell data exists, add it to matrix data
        if (cellData) {
          matrixData.push({
            x: i,
            y: j,
            v: cellData.x === columns[i] && cellData.y === columns[j] 
              ? cellData.correlation 
              : cellData.correlation // Value is the same for both directions
          });
        } else if (i === j) {
          // Add 1.0 for diagonal (self-correlation)
          matrixData.push({
            x: i,
            y: j,
            v: 1.0
          });
        } else {
          // Add 0 for missing correlations
          matrixData.push({
            x: i,
            y: j,
            v: 0
          });
        }
      }
    }

    // Create the color scale based on the provided image
    const getCorrelationColor = (value) => {
      // Match exact colors from the image
      if (value >= 1.0) return 'rgb(237, 233, 254)';      // Lightest purple for 1.0
      if (value >= 0.75) return 'rgb(226, 220, 255)';     // Very light purple for ~0.75
      if (value >= 0.5) return 'rgb(206, 200, 240)';      // Light purple for ~0.5
      if (value >= 0.25) return 'rgb(186, 171, 230)';     // Medium-light purple for ~0.25
      if (value >= 0.0) return 'rgb(166, 144, 220)';      // Medium purple for ~0.0
      if (value >= -0.25) return 'rgb(138, 104, 200)';    // Medium-dark purple for ~-0.25
      if (value >= -0.5) return 'rgb(110, 63, 170)';      // Dark purple for ~-0.5
      if (value >= -0.75) return 'rgb(78, 37, 125)';      // Very dark purple for ~-0.75
      return 'rgb(46, 16, 96)';                          // Darkest purple for -1.0
    };

    // Create gradient for legend
    const createColorScale = (ctx) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 256);
      gradient.addColorStop(0, 'rgb(46, 16, 96)');      // -1.0 (bottom)
      gradient.addColorStop(0.125, 'rgb(78, 37, 125)');  // -0.75
      gradient.addColorStop(0.25, 'rgb(110, 63, 170)');  // -0.5
      gradient.addColorStop(0.375, 'rgb(138, 104, 200)'); // -0.25
      gradient.addColorStop(0.5, 'rgb(166, 144, 220)');  // 0
      gradient.addColorStop(0.625, 'rgb(186, 171, 230)'); // 0.25
      gradient.addColorStop(0.75, 'rgb(206, 200, 240)');  // 0.5
      gradient.addColorStop(0.875, 'rgb(226, 220, 255)'); // 0.75
      gradient.addColorStop(1, 'rgb(237, 233, 254)');    // 1.0 (top)
      return gradient;
    };

    chartInstance.current = new Chart(ctx, {
      type: 'matrix',
      data: {
        datasets: [{
          label: 'Correlation Matrix',
          data: matrixData,
          backgroundColor: context => {
            const value = context.dataset.data[context.dataIndex].v;
            return getCorrelationColor(value);
          },
          borderColor: 'white',
          borderWidth: 1,
          width: ({chart}) => (chart.chartArea || {}).width / columns.length - 1,
          height: ({chart}) => (chart.chartArea || {}).height / columns.length - 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            right: 50 // Add space for the color scale
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: () => '',
              label: (context) => {
                const dataPoint = context.dataset.data[context.dataIndex];
                const value = dataPoint.v;
                const x = columns[dataPoint.x];
                const y = columns[dataPoint.y];
                const strength = dataPoint.strength || 
                  (Math.abs(value) > 0.7 ? "Strong" : 
                   Math.abs(value) > 0.3 ? "Moderate" : "Weak");
                const relationship = dataPoint.relationship || 
                  (value > 0 ? "Positive" : 
                   value < 0 ? "Negative" : "None");
                
                const tooltipLines = [
                  `${y} vs ${x}: ${value.toFixed(2)}`,
                  `Strength: ${strength}`,
                  `Relationship: ${relationship}`
                ];
                
                // Add interpretation
                if (strength === "Strong" && relationship === "Positive") {
                  tooltipLines.push(`When ${x} increases, ${y} also tends to increase significantly.`);
                } else if (strength === "Strong" && relationship === "Negative") {
                  tooltipLines.push(`When ${x} increases, ${y} tends to decrease significantly.`);
                } else if (strength === "Moderate" && relationship === "Positive") {
                  tooltipLines.push(`When ${x} increases, ${y} tends to increase somewhat.`);
                } else if (strength === "Moderate" && relationship === "Negative") {
                  tooltipLines.push(`When ${x} increases, ${y} tends to decrease somewhat.`);
                }
                
                return tooltipLines;
              }
            }
          },
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Correlation Matrix Analysis',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 10
            }
          },
          // Add custom plugin to draw the color scale
          beforeDraw: (chart) => {
            const ctx = chart.ctx;
            const chartArea = chart.chartArea;
            
            // Draw the gradient legend at the right side
            const gradient = createColorScale(ctx);
            const legendWidth = 20;
            const legendHeight = chartArea.bottom - chartArea.top;
            const legendX = chartArea.right + 15;
            
            // Draw the gradient rectangle
            ctx.fillStyle = gradient;
            ctx.fillRect(legendX, chartArea.top, legendWidth, legendHeight);
            
            // Draw border around the gradient
            ctx.strokeStyle = 'rgba(0,0,0,0.1)';
            ctx.lineWidth = 1;
            ctx.strokeRect(legendX, chartArea.top, legendWidth, legendHeight);
            
            // Draw labels for the gradient
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'black';
            ctx.font = '12px Arial';
            
            // Add value labels
            const labelValues = [1.0, 0.75, 0.5, 0.25, 0.0, -0.25, -0.5, -0.75, -1.0];
            labelValues.forEach((value, index) => {
              const y = chartArea.top + (index * legendHeight / (labelValues.length - 1));
              ctx.fillText(value.toFixed(2), legendX + legendWidth + 5, y);
            });
          }
        },
        scales: {
          x: {
            type: 'category',
            labels: columns,
            offset: true,
            ticks: {
              display: true,
              autoSkip: false,
              maxRotation: 90,
              minRotation: 0,
              font: {
                weight: 'bold',
                size: 11
              }
            },
            grid: {
              display: false
            },
            title: {
              display: true,
              text: 'Row ID',
              font: {
                weight: 'bold'
              },
              padding: {
                top: 10
              }
            }
          },
          y: {
            type: 'category',
            labels: columns,
            offset: true,
            reverse: true,
            ticks: {
              display: true,
              font: {
                weight: 'bold',
                size: 11
              }
            },
            grid: {
              display: false
            },
            title: {
              display: true,
              text: 'Row ID',
              font: {
                weight: 'bold'
              },
              padding: {
                bottom: 10
              }
            }
          }
        }
      }
    });
    
    // After rendering, add the correlation text inside each cell
    chartInstance.current.afterRender = () => {
      const meta = chartInstance.current.getDatasetMeta(0);
      if (!meta.data || meta.data.length === 0) return;
      
      matrixData.forEach((item, index) => {
        if (index >= meta.data.length) return;
        
        const element = meta.data[index];
        const value = item.v;
        const textValue = value.toFixed(2);
        
        // Get cell center
        const x = element.x;
        const y = element.y;
        
        // Set text style
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Choose text color based on background darkness
        const isDark = Math.abs(value) > 0.5;
        ctx.fillStyle = isDark ? 'white' : 'black';
        
        // Draw text
        ctx.fillText(textValue, x, y);
      });
    };
  };

  // Create forecast chart for both education and ecommerce domains
  // Supports filters: 6, 9, 12, 18, 24 months
  const createForecastChart = (canvas) => {
    const ctx = canvas.getContext('2d');

    // Get data from the data object
    const historicalDates = data.dates;
    const historicalValues = data.historical_values;
    const forecastDates = data.forecast_dates; 
    const forecastValues = data.forecast_values;
    const lowerBounds = data.forecast_lower;
    const upperBounds = data.forecast_upper;

    // Calculate the split point between historical and forecast data
    const historicalLength = historicalDates.length;
    
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [...historicalDates, ...forecastDates],
        datasets: [
          {
            label: 'Historical',
            data: [...historicalValues, ...Array(forecastDates.length).fill(null)],
            borderColor: 'rgba(124, 58, 237, 1)',
            backgroundColor: 'rgba(124, 58, 237, 0.2)',
            pointRadius: 3,
            borderWidth: 2
          },
          {
            label: 'Forecast',
            data: [...Array(historicalLength).fill(null), ...forecastValues],
            borderColor: 'rgba(139, 92, 246, 1)',
            backgroundColor: 'rgba(139, 92, 246, 0.2)',
            pointRadius: 3,
            borderWidth: 2
          },
          {
            label: 'Upper Bound',
            data: [...Array(historicalLength).fill(null), ...upperBounds],
            borderColor: 'rgba(167, 139, 250, 0.7)',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            pointRadius: 0,
            borderWidth: 1
          },
          {
            label: 'Lower Bound',
            data: [...Array(historicalLength).fill(null), ...lowerBounds],
            borderColor: 'rgba(167, 139, 250, 0.7)',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            pointRadius: 0,
            borderWidth: 1,
            fill: {
              target: '+1',
              above: 'rgba(167, 139, 250, 0.1)'
            }
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              title: (context) => context[0].label,
              label: (context) => {
                const value = context.raw;
                if (value === null) return '';
                
                // Show rounded values in tooltips
                const tooltipLines = [`${context.dataset.label}: ${Math.round(value)}`];
                
                // Add accuracy information for forecast points
                if (context.dataset.label === 'Forecast' && data.metrics && data.metrics.accuracy) {
                  tooltipLines.push(`Forecast Accuracy: ${data.metrics.accuracy.toFixed(1)}%`);
                }
                
                // Add upper and lower bounds for forecast points
                if (context.dataset.label === 'Forecast') {
                  const index = context.dataIndex - historicalLength;
                  if (index >= 0 && index < lowerBounds.length) {
                    tooltipLines.push(`Lower: ${Math.round(lowerBounds[index])}`);
                    tooltipLines.push(`Upper: ${Math.round(upperBounds[index])}`);
                  }
                }
                
                return tooltipLines;
              }
            }
          },
          legend: {
            labels: {
              filter: (item) => !['Upper Bound', 'Lower Bound'].includes(item.text)
            }
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: data.column
            },
            ticks: {
              // Round y-axis values
              callback: function(value) {
                return Math.round(value);
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            },
            ticks: {
              maxTicksLimit: 12, // Show fewer x-axis date labels
              autoSkip: true
            }
          }
        }
      }
    });
    
    // Add forecast metrics and insights if available
    if (data.metrics || data.insights) {
      // Create container for forecast insights
      const insightsContainer = document.createElement('div');
      insightsContainer.className = 'text-xs text-gray-700 mt-3 p-2 bg-purple-50 rounded';
      
      // Add metrics first if available
      if (data.metrics) {
        const metricsDiv = document.createElement('div');
        metricsDiv.className = 'mb-1';
        metricsDiv.innerHTML = `<span class="font-medium">Accuracy:</span> ${data.metrics.accuracy.toFixed(1)}%`;
        insightsContainer.appendChild(metricsDiv);
      }
      
      // Add trend analysis if available
      if (data.trend_analysis) {
        const trendDiv = document.createElement('div');
        trendDiv.className = 'mb-1';
        trendDiv.innerHTML = `<span class="font-medium">Trend:</span> ${data.trend_analysis.trend} (${data.trend_analysis.trend_percentage.toFixed(1)}%)`;
        insightsContainer.appendChild(trendDiv);
      }
      
      // Add insights if available
      if (data.insights) {
        const insightsDiv = document.createElement('div');
        insightsDiv.className = 'text-xs mt-1';
        
        // Split insights into separate paragraphs
        const insightParagraphs = data.insights.split('\n');
        insightParagraphs.forEach(insight => {
          if (insight.trim()) {
            const p = document.createElement('p');
            p.className = 'mb-1';
            p.textContent = insight;
            insightsDiv.appendChild(p);
          }
        });
        
        insightsContainer.appendChild(insightsDiv);
      }
      
      // Add to DOM after a small delay to ensure chart is rendered
      setTimeout(() => {
        const canvasContainer = canvas.parentNode;
        canvasContainer.appendChild(insightsContainer);
      }, 100);
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-100 overflow-hidden ${className}`}>
      <div className="p-4 ">
        <h3 className="text-lg font-semibold">{title}</h3>
        {type === 'bar' && data.top_category && (
          <div className="mt-1 text-xs text-gray-600">
            Top Category: <span className="font-medium">{data.top_category}</span> 
            ({data.top_category_count} - {data.top_category_percentage?.toFixed(1)}%)
          </div>
        )}
      </div>
      <div className="p-2 h-[300px]">
        <canvas id={chartId.current} ref={chartRef}  />
      </div>
      <div className="p-2 flex justify-end items-center ">  
        {data.insights && (
          <div className="text-sm text-gray-600 cursor-help group relative ">
            <span>View Insights</span>
            <div className="absolute z-10 right-0 bottom-full mb-2 w-64 bg-white border rounded shadow-lg hidden group-hover:block p-3">
              <p className="text-xs text-gray-800">{data.insights}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartContainer;