import React, { useState, useEffect } from "react";
import {Bar} from 'react-chartjs-2';
import { json } from 'd3';

export const BarGraph = ({indicatorBar, graphTitle, 
  graphTimeperiod, graphUnit, areaName}) => { 
      
    let barLabel=[];
    let barData=[];
    let datab = [];
      if(indicatorBar)
      {
        indicatorBar.map(i=>{
          barLabel.push(i.subgroup.subgroup_name+";"+i.subgroup.sub_category)
          barData.push(+i.data_value)
        })
        var colors = []
        for(var i = 0; i < barLabel.length; i++){
          if(barLabel[i].split(";")[1] === 'null')
          {
            colors[i] = 'rgb(0,153,255)';
          }
          else  if(barLabel[i].split(";")[1] === 'Sex')
          {
            colors[i] = 'rgb(254,225,211)';
          }
          else  if(barLabel[i].split(";")[1] === 'Location')
          {
            colors[i] = 'rgb(251,161,167)';
          }
          else  if(barLabel[i].split(";")[1] === 'Caste')
          {
            colors[i] = 'rgb(247,104,161)';
          }
          else  if(barLabel[i].split(";")[1] === 'Wealth Index')
          {
            colors[i] = 'rgb(230,23,173)';
          }
          
        }
        datab = {
              labels:barLabel,
              datasets: [{
              label: [graphTitle, graphUnit],
              data:barData,
              xAxisID:'xAxis1',
              //backgroundColor: "rgb(255, 99, 132)"
              backgroundColor: colors,
              borderColor: '#ffffff',
              borderWidth: 1
              }]
        }
      }
    
    return (
        <Bar data={datab}  options={{
            legend:
            {
              display: false,
            },
            title: {
              display: true,
              text: [graphTitle +','+ graphUnit, areaName +', '+ graphTimeperiod],
              fontColor: "black",
          },
            scales: {
              xAxes:[{
                id:'xAxis1',
                type:"category",
                ticks:{
                  callback:function(label){
                    var subgroup = label.split(";")[0];
                    return subgroup;
                  }
                },
                gridLines: {
                  drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
  
              },
              {
                id:'xAxis2',
                type:"category",
                gridLines: {
                  drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
                ticks:{
                  minRotation: 0,
                  callback:function(label){
                    var subgroup = label.split(";")[0];
                    var type = label.split(";")[1];
                    if(subgroup === "Rural" || subgroup === "Female"  || subgroup ==="ST" || subgroup === "Middle"){
                      return type
                    }
                    else
                    return ""
                  }  
                },
                gridLines: {
                  drawOnChartArea:false
              }
              }],
              yAxes: [{
                ticks: {
                  beginAtZero: true
                },
                gridLines: {
                  drawOnChartArea:false
              }
              }]
            }
          }}
        />    
        )
     }