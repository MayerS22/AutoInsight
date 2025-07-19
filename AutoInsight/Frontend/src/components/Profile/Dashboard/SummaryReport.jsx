/* eslint-disable react/prop-types */

const SummaryReport = ({ chartData, domain }) => {
  // Generate insights for categorical data
  const generateCategoryInsights = (data, columnName) => {
    if (!data || !data.categories || !data.values) return null;
    
    const total = data.values.reduce((sum, val) => sum + val, 0);
    const maxIndex = data.values.indexOf(Math.max(...data.values));
    const maxValue = data.categories[maxIndex];
    const maxCount = data.values[maxIndex];
    const percentage = ((maxCount / total) * 100).toFixed(1);
    
    let actionText = '';
    if (percentage > 50) {
      actionText = "This category represents a dominant student group. Ensure engagement continues.";
    } else if (percentage > 20) {
      actionText = "This group is stable. Look for opportunities to boost performance.";
    } else {
      actionText = "This category has lower engagement. Develop strategies to support this group.";
    }
    
    return {
      column: columnName,
      topValue: maxValue,
      count: maxCount,
      percentage,
      action: actionText
    };
  };

  // Generate report data
  const generateReportData = () => {
    const reportItems = [];
    
    // Process bar charts
    if (chartData.bar_graph && chartData.bar_graph.length > 0) {
      chartData.bar_graph.forEach(chart => {
        const insight = generateCategoryInsights(chart, chart.column);
        if (insight) reportItems.push(insight);
      });
    }
    
    // Process pie charts
    if (chartData.pie_chart && chartData.pie_chart.length > 0) {
      chartData.pie_chart.forEach(chart => {
        const insight = generateCategoryInsights(chart, chart.column);
        if (insight) reportItems.push(insight);
      });
    }
    
    return reportItems;
  };

  const reportData = generateReportData();
  
  const getReportTitle = () => {
    return domain === 'education' 
      ? 'STUDENT PERFORMANCE REPORT'
      : 'BUSINESS INSIGHTS REPORT';
  };
  
  const getReportDescription = () => {
    return domain === 'education'
      ? 'This report highlights key trends in student performance to help improve learning outcomes.'
      : 'This report highlights key trends in business data to help improve sales and operational decisions.';
  };
  
  const getRecommendations = () => {
    if (domain === 'education') {
      return [
        'Focus on underperforming groups to enhance support and resources.',
        'Encourage high-performing students to mentor peers and share study techniques.',
        'Continuously monitor attendance and participation to prevent disengagement.'
      ];
    } else {
      return [
        'Focus on top-selling products and categories to maintain market advantage.',
        'Improve engagement with underperforming segments through targeted campaigns.',
        'Monitor regional variations to identify growth opportunities and address challenges.'
      ];
    }
  };
  
  const getSummary = () => {
    return domain === 'education'
      ? 'This report provides insights into student engagement and performance. Use this data to refine teaching strategies and offer tailored support. Empower students through data-driven decisions to foster growth and academic success.'
      : 'This report provides insights into business performance and customer behavior. Use this data to optimize inventory, marketing strategies, and customer targeting. Make data-driven decisions to increase profitability and drive business growth.';
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6 mb-8 max-h-[800px] overflow-y-auto">
        <h2 className="text-lg font-bold text-purple-900 mb-2">{getReportTitle()}</h2>
        <p className="text-gray-600 mb-6">{getReportDescription()}</p>

        {/* Insights for each category */}
        {reportData.map((item, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-md font-semibold text-purple-800">{item.column} Insights</h3>
            <p className="text-sm">
              - Most Common: {item.topValue} ({item.count} times, {item.percentage}% of total)
            </p>
            <p className={`text-sm ${item.percentage > 50 ? 'text-purple-600' : item.percentage > 20 ? 'text-purple-500' : 'text-purple-400'}`}>
              - {item.action}
            </p>
          </div>
        ))}

        {/* Key Recommendations */}
        <div className="my-6">
          <h3 className="text-md font-bold text-purple-900 mb-2">KEY RECOMMENDATIONS</h3>
          <ul className="text-sm text-gray-700">
            {getRecommendations().map((rec, index) => (
              <li key={index} className="mb-1">- {rec}</li>
            ))}
          </ul>
        </div>

        {/* Summary */}
        <div className="mt-6">
          <h3 className="text-md font-bold text-purple-900 mb-2">SUMMARY</h3>
          <p className="text-sm text-gray-700">{getSummary()}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryReport; 