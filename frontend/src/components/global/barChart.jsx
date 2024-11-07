import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ chartData, min, max, title, yTitle, xTitle }) => {
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: min,
        max: max,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: yTitle,
        },
      },
      x: {
        title: {
          display: true,
          text: xTitle,
          padding: { top: 20 }, // Add padding above the x-axis title
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          align: 'end', // Align labels to the end for more space
          padding: 10, // Add padding around the labels
        },
      },
    },
    animation: {
      duration: 300,
    },
  };
  

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}> 
      {/* Add max-width for larger screens, and allow full width for mobile */}
      <div style={{ position: 'relative', height: '400px' }}>
        {/* Set a height for the chart to ensure it doesn't collapse */}
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
