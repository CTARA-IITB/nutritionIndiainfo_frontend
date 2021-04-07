import React, { useState, useEffect } from "react";
import {Line} from 'react-chartjs-2';
import { json } from 'd3';

export const Trend = ({indicatorTrend, graphTitle, graphSubgroup, graphUnit, areaName,height}) => { 
    let trendLabel=[];
    let trendData=[];
      if(indicatorTrend)
      {
      indicatorTrend.map(i=>{
        trendLabel.push(i.timeperiod.timeperiod)
        trendData.push(+i.data_value)
      })
      }
     
      let  datal= {
        labels:trendLabel,
        datasets: [{
        label: [graphTitle, graphUnit, graphSubgroup],
        fill: false,
        lineTension:0,
        borderWidth:3,
        borderColor:'rgb(106, 166, 41)',
        data:trendData
        }]
       
      }
    
    return (
                 <Line data={datal} height={height} width={500} options = {{
                  responsive: true, 
                  maintainAspectRatio: false,
                   legend:
                   {
                     display: false,
                   },
                    title: {
                     display: true,
                     text: [graphTitle+','+graphUnit+','+graphSubgroup, 'TrendData'+ ', '+ areaName],
                     fontColor: "black",
                 },
                   scales: {
                       xAxes: [{
                         offset: true,
                         gridLines: {
                           drawOnChartArea:false
                       },
                       ticks: {
                         minRotation: 0,
                     }
                       }],
                       yAxes: [{
                         gridLines: {
                           drawOnChartArea:false
                       },
                       ticks: {
                         padding: 10,
                     }
                     }]
   
                   }
   
                  }}
                 />
               )
     }