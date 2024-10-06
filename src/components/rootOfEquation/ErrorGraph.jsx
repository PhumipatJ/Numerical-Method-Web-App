import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

function ErrorGraph({ xData, yData }) {

  const formatValue = (value) => value.toFixed(20);
  
  return (
    <LineChart
      xAxis={[
        { 
          data: xData, 
        }
      ]}
      series={[
        {
          data: yData.map(formatValue),
          label: 'Error (%)',
          color: '#5045e5',
        }
      ]}
      width={1000}
      height={300}
    />
  );
}

export default ErrorGraph;
