import React, { useState, useEffect } from 'react';
import Navbar from "../components/global/navbar";
import BarChart from '../components/global/barChart';

const RatingInsight = ({ title, data, maxCount }) => {
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    if(data){
      const objData = maxCount ? {
        labels: data.map(item => item.name), // X-axis labels (food item names)
        datasets: [
          {
            label: 'Favorites', // Label for the dataset
            data: data.map(item => item.count), // Y-axis data (ratings)
            backgroundColor: 'rgba(75, 192, 192, 0.6)', // Bar color
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      }
      : {
        labels: data.map(item => item.name), // X-axis labels (food item names)
        datasets: [
          {
            label: 'Ratings', // Label for the dataset
            data: data.map(item => item.rating), // Y-axis data (ratings)
            backgroundColor: 'rgba(75, 192, 192, 0.6)', // Bar color
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      }
      setChartData(objData)
    }
  }, [data])

  return (
    <div>
      <h2 className='ml-2'>{title}</h2>
      <div style={{ width: '80%', margin: '0 auto', height: "100vh" }}>
        {chartData && <BarChart 
            chartData={chartData}
            min={0}
            max={maxCount? maxCount : 6}
            title={maxCount? "Favorite by Food Item" : 'Favorite Ratings by Food Item'}
            yTitle={maxCount? "Favorite" : 'Ratings'}
            xTitle={'Food Items'}
        />}
      </div>
    </div>
  );
};

export default RatingInsight;
