import React, { useState, useEffect } from "react";
import {Bar} from 'react-chartjs-2';
import { json } from 'd3';

const BarGraph = ({indicatorBar, graphTitle, 
  graphTimeperiod, graphUnit, areaName,height}) => { 
      
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
              label: [graphTitle, graphUnit,graphTimeperiod],
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
        <Bar data={datab} height={height} width={500} options={{
          responsive: true, 
          maintainAspectRatio: false,
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
                  fontSize: 11,
                  fontColor: "black",
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
                  fontSize: 9,
                  fontColor:"black",
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
                  fontSize: 8,
                  fontColor:"black",
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
   
  const BarGraphArea = ({indicatorBar, graphTitle, 
      graphTimeperiod, graphUnit,selIndiaData,level,
      unit,unitName,selArea,selIndicator,indicatorSense, 
      isLevelThree,selSubgroup,selTimeperiod,areaName,
      selStateData}) => { 

        let barLabel=[];
        let barData=[];
        let datab = [];
        let stateDataValue,stateAreaName;
        let color;

        if(selIndiaData && level=="1")
          {
            selIndiaData.map(i=>{
              barLabel.push(i.area.area_name)
              barData.push(+i.data_value)
              color= 'rgb(142, 209, 25)'
             })
          }        
        if(selStateData && level=="2")
          {
            for(let j=0;j<selIndiaData.length;j++){
              if(+selArea===selIndiaData[j].area.area_id)
              { 
                stateDataValue=selIndiaData[j].data_value
                stateAreaName=selIndiaData[j].area.area_name
                barLabel.push(stateAreaName)
                barData.push(stateDataValue)
              }           
            }
            selStateData.map(i=>{
              barLabel.push(i.area.area_name)
              barData.push(+i.data_value)
              color=' rgb(142, 209, 25)'
            })
          }           
          if(level==="3")
          {
            console.log(selStateData[0].area.area_name,"state,distrrr")
            // for(let j=0;j<selIndiaData.length;j++){
            //   if(+selArea===selIndiaData[j].area.area_id)
            //   { 
            //     stateDataValue=selIndiaData[j].data_value
            //     stateAreaName=selIndiaData[j].area.area_name
            //     barLabel.push(stateAreaName)
            //     barData.push(stateDataValue)
            //     color='rbg(114, 54, 117)'
            //   }           
            // }
            // selStateData.map(i=>{
            //   barLabel.push(i.area.area_name)
            //   barData.push(+i.data_value)
 
            // })
          }              
 
            datab = {
                  labels:barLabel,
                  datasets: [{
                  label: [graphTitle, graphUnit, graphTimeperiod],
                  data:barData,
                  xAxisID:'xAxis1',
                  //backgroundColor: "rgb(255, 99, 132)"
                  backgroundColor:color,
                  borderColor: "rgb(142, 209, 25)",
                  borderWidth: 1
                  }]
            }
        
        
        return (
            <Bar data={datab}  options={{
                legend:
                {
                  display: false,
                },
                title: {
                  display: true,
                  text: [graphTitle +','+ graphUnit, areaName +','+ graphTimeperiod],
                  fontColor: "black",
                },
                scales: {
                  xAxes:[{
                    id:'xAxis1',
                    type:"category",
                    ticks:{
                      fontSize: 11,
                      fontColor: "black",
                      callback:function(label){
                        var subgroup = label.split(";")[0];
                        return subgroup;
                      }
                    },
                    gridLines: {
                      drawOnChartArea: false, // only want the grid lines for one axis to show up
                    },
      
                  },
              ],
                  yAxes: [{
                    ticks: {
                      fontSize: 7,
                      fontColor:"black",
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
         export { BarGraph, BarGraphArea }