import React from 'react'
import { PieChart } from '@mui/x-charts/PieChart';


export default function CustomPieChart(props) {
  return (
<PieChart
colors={['red', 'blue', 'green']} // Use palette
width={props.width ? props.width:115}
height={props.height ? props.height:115}
slotProps={{ legend: { hidden: true } }}
  series={[
    {
      data: props.data ? props.data :
      [
        { value: 60, color: '#3992F5',label: 'series A'  },
        { value: 15, color: '#FFB126',label: 'series B' },
        { value: 25, color: '#77D2B7',label: 'series C' },
      ],

      innerRadius: 56,
      outerRadius: 42,
      paddingAngle: 3,
      cornerRadius: 5,
      startAngle: 180,
      endAngle:-180,
      cx: 53,
      cy: 54,
      
    }]}
/>

  )
}
