import React, { useState, useEffect } from "react";
import {Line} from 'react-chartjs-2';
import { json } from 'd3';

export const Trend = ({indicatorTrend, graphTitle, graphSubgroup, graphUnit, areaName, toggleStateBurden}) => { 
    let trendLabel=[];
    let trendData=[];
      if(indicatorTrend)
      { 
      indicatorTrend.map(i=>{
        trendLabel.push(i.timeperiod.timeperiod)
        if(toggleStateBurden === true)
        {
          trendData.push(+i.data_value)
        }
        else{
          trendData.push(+i.data_value_num)
        }   
      })
      }
      let trendUnit = graphUnit;
      if(toggleStateBurden === false)
      {
        trendUnit = 'Number';
      }
     
     
      let  datal= {
        labels:trendLabel,
        datasets: [{
        label: [graphTitle, trendUnit, graphSubgroup],
        fill: false,
        lineTension:0,
        borderWidth:3,
        borderColor:'rgb(106, 166, 41)',
        data:trendData
        }]
       
      }
    
    return (
                 <Line data={datal} options = {{
                   legend:
                   {
                     display: false,
                   },
                    title: {
                     display: true,
                     text: [graphTitle+','+trendUnit+','+graphSubgroup, 'TrendData'+ ', '+ areaName],
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