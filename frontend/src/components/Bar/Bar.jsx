import React, { useRef } from 'react';
import BarComponent from './BarComponent';
import SideNavSecond from "../SideNav/SideNavSecond";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

export const Bar = ({indicatorBar, graphTitle,graphTimeperiod, graphUnit, titleAreaName, toggleStateBurden, selIndicator})=>{
    const componentRef = useRef();
    const screen=useFullScreenHandle();
    
    let barLabel = [];
    let barData=[];
    let data = [];
    var colors = [];
    let table=[];
    let options =[];
    let barUnit = graphUnit;
    let title=graphTitle +', '+barUnit;
    let colorScale ='#eda143';
    let lightColor = '#F7D9B3';

    let arrObese = [91,95,104,92,96,105,21];
        if(selIndicator == 12 || selIndicator == 13){
          colorScale = '#a3c00f'; 
          lightColor = '#DAE59F';
         }
        else if(selIndicator == 19 || selIndicator == 20){
          colorScale = '#e53935'; 
          lightColor = '#F4AFAE';
        }
        else if(selIndicator == 17 || selIndicator == 18){
          colorScale = '#039be5'; 
          lightColor = '#9AD7F4';
        }
        else if(selIndicator == 107 || selIndicator == 108){
          colorScale = '#e53935'; 
          lightColor = '#F4AFAE';
        }
        else  if(arrObese.includes(selIndicator)){
          colorScale = '#7b1fa2'; 
          lightColor = '#CAA5D9';
        }
        else if(selIndicator == 123 || selIndicator == 124 || selIndicator == 125){
          colorScale = '#b71c1c'; 
          lightColor = '#E2A4A4';
        }
        else{
          colorScale = '#eda143'; 
          lightColor = '#F7D9B3';
        }

    // remove last word  graph title i.e olds
    // var lastIndex = graphTitle.lastIndexOf(" ");
    // graphTitle = graphTitle.substring(0, lastIndex);
    // graphTitle = graphTitle + 's'

    if(toggleStateBurden === false){
        barUnit = 'Number';
    }

    if(indicatorBar){
        indicatorBar.map(i=>{
            if(i.subgroup_name==='All'){
                barLabel.push(i.subgroup_name)
                colors.push(colorScale)
                if(toggleStateBurden == true){
                    barData.push(+i.data_value)
                }
                else{
                    barData.push(+i.data_value_num)
                }
                table.push({
                    area:barLabel[barLabel.length-1],
                    data:+barData[barData.length-1],
                })
            }
            else if(i.subgroup_name==='Male' || i.subgroup_name==='Female'){
                barLabel.push(i.subgroup_name)
                colors.push(lightColor)
                if(toggleStateBurden == true){
                    barData.push(+i.data_value)
                }
                else{
                    barData.push(+i.data_value_num)
                }
                table.push({
                    area:barLabel[barLabel.length-1],
                    data:+barData[barData.length-1],
                })
            }
            else if(i.subgroup_name==='Poorest' || i.subgroup_name==='Middle' || i.subgroup_name==='Second' || i.subgroup_name==='Fourth' || i.subgroup_name==='Richest'){
                barLabel.push(i.subgroup_name)
                colors.push(colorScale)
                if(toggleStateBurden == true){
                    barData.push(+i.data_value)
                }
                else{
                    barData.push(+i.data_value_num)
                }
                table.push({
                    area:barLabel[barLabel.length-1],
                    data:+barData[barData.length-1],
                })
            }
        })

        // graph time period 
        let chartTitle = graphTimeperiod.split(" ")[0];
        let lastChar = chartTitle.slice(-1);
        if(/^[0-9]$/.test(lastChar)){
            chartTitle = chartTitle.slice(0, -1);
            chartTitle = chartTitle + '-' + lastChar;
        }

        data = {
            labels:barLabel,
            datasets: [{
                // label: [graphTitle, barUnit,graphTimeperiod],
                data:barData,
                yAxisID:'yAxis1',
                backgroundColor: colors,
                borderColor: colorScale,
                borderWidth:0.5,
                barThickness: 10,
            }] 
        }

        options={
            tooltips:{
                displayColors:false,
                bodyAlign:"center"
            },
            legend:
            {
              display: false,
            },
            title: {
              display: true,
              text: [`${graphTitle}, ${barUnit},${titleAreaName},${chartTitle} ${graphTimeperiod.split(" ")[1]}`],
              fontColor: "black",
            },
            scales: {
                yAxes:[
                    {
                        id:'yAxis1',
                        type:"category",
                        ticks:{
                            fontSize: 11,
                            fontColor: "black",
                        },
                        gridLines: {
                        drawOnChartArea: false, // only want the grid lines for one axis to show up
                        },
                    },
                   
                ],
                xAxes: [{
                    ticks: {
                        // fontSize: 8,
                        fontColor:"black",
                        beginAtZero: true
                    },
                    gridLines: {
                        drawOnChartArea:true,
                        color:'#C1C1C1'
                    }
                }]
            }
        }
    }
    return(
        <div>
            <FullScreen  className="fullscreen_css" handle={screen}>
                <SideNavSecond table={table} id="Bar" screen={screen} title={title} timePeriod={graphTimeperiod} componentRef={componentRef} />
                <BarComponent ref={componentRef} id="Bar" data={data} options={options}/>
            </FullScreen>    
        </div>
    );
};