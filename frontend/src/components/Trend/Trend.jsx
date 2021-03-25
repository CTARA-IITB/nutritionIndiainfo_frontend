import React, { useState, useEffect } from "react";
import {Line} from 'react-chartjs-2';
import { json } from 'd3';

export const Trend = ({indicatorTrend, setIndicatorTrend, selIndicator, selSubgroup, selArea, graphTitle, graphSubgroup, graphUnit, areaName}) => { 
      
    let trendLabel=[];
    let trendData=[];
    useEffect(() => {
        const url_1 = `http://localhost:8000/api/getIndicatorTrend/${selIndicator}/${selSubgroup}/${selArea}`;
        json(url_1).then(indicatorTrend => {
          setIndicatorTrend(indicatorTrend)
        })
      }, [selIndicator, selSubgroup, selArea])

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
                  <Line data={datal} options = {{
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
                        fontSize: 7,
                        fontColor:"black",
                        minRotation: 0,
                     }
                       }],
                       yAxes: [{
                         gridLines: {
                           drawOnChartArea:false
                       },
                       ticks: {
                        fontSize: 8,
                        fontColor:"black",
                        padding: 10,
                     }
                     }]
   
                   }
   
                  }}
                 />
               )
     }