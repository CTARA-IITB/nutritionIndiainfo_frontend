import React, { useRef } from 'react';
import BarComponent from './BarComponent';
import SideNavSecond from "../SideNav/SideNavSecond";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { commaSeparated } from '../../utils';

export const Bar = ({indicatorBar, graphTitle,graphTimeperiod, graphUnit, titleAreaName, toggleStateBurden, selIndicator})=>{

    const componentRef = useRef();
    const screen=useFullScreenHandle();

    let data = [];
    let table=[];
    let options =[];
    let barUnit = graphUnit;
    let title, findMaxVal;
    let colorScale ='#eda143';
    let lightColor = '#F7D9B3';
    let groupedData = [];
    let groupedLabel =[];
    let groupedColor = [];

    let chartTitle = graphTimeperiod.split(" ")[0];

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
    else if(selIndicator == 123 || selIndicator == 26 || selIndicator == 125){
        colorScale = '#b71c1c'; 
        lightColor = '#E2A4A4';
    }
    else{
        colorScale = '#eda143'; 
        lightColor = '#F7D9B3';
    }
    if(toggleStateBurden === false){
        barUnit = 'Number';
    }
    var j=0;
    groupedLabel[j]="Overall";
    groupedColor[j]=colorScale;
    groupedData[j++]=NaN;
    groupedLabel[j]=" ";
    groupedColor[j]="white";
    groupedData[j++]=NaN;
    
    groupedLabel[j]="Male"
    groupedColor[j]=lightColor;
    groupedData[j++]=NaN;
    groupedLabel[j]="Female"
    groupedColor[j]=lightColor;
    groupedData[j++]=NaN;
    groupedLabel[j]=" ";
    groupedColor[j]="white";
    groupedData[j++]=NaN;

    groupedLabel[j]="Low Coverage";
    groupedColor[j]=colorScale;
    groupedData[j++]=NaN;
    groupedLabel[j]="Mid Coverage";
    groupedColor[j]=colorScale;
    groupedData[j++]=NaN;
    groupedLabel[j]="High Coverage";
    groupedColor[j]=colorScale;
    groupedData[j++]=NaN;
    groupedLabel[j]=" ";
    groupedColor[j]="white";
    groupedData[j++]=NaN;

    groupedLabel[j]="No Education";
    groupedColor[j]=lightColor;
    groupedData[j++]=NaN;
    groupedLabel[j]="< 5 years completed";
    groupedColor[j]=lightColor;
    groupedData[j++]=NaN;
    groupedLabel[j]="5-9 years completed";
    groupedColor[j]=lightColor;
    groupedData[j++]=NaN;
    groupedLabel[j]="10-11 years completed";
    groupedColor[j]=lightColor;
    groupedData[j++]=NaN;
    groupedLabel[j]="12+ years completed";
    groupedColor[j]=lightColor;
    groupedData[j++]=NaN;
    groupedLabel[j]=" ";
    groupedColor[j]="white";
    groupedData[j++]=NaN;

    groupedLabel[j]="Poorest"
    groupedColor[j]=colorScale;
    groupedData[j++]=NaN;
    groupedLabel[j]="Second"
    groupedColor[j]=colorScale;
    groupedData[j++]=NaN;
    groupedLabel[j]="Middle"
    groupedColor[j]=colorScale;
    groupedData[j++]=NaN;
    groupedLabel[j]="Fourth"
    groupedColor[j]=colorScale;
    groupedData[j++]=NaN;
    groupedLabel[j]="Richest"
    groupedColor[j]=colorScale;
    groupedData[j++]=NaN;

    var hashTable = {};
    for(var i=0;i<groupedLabel.length;i++)
        hashTable[groupedLabel[i]]=i;
   
    if(indicatorBar){
        indicatorBar.map(i=>{
            
            if(i.subgroup_name==="All"){
                if(toggleStateBurden == true){
                    groupedData[hashTable["Overall"]]=i.data_value;
                }
                else{
                    groupedData[hashTable["Overall"]]=i.data_value_num;
                }
                table.push({
                    area:i.subgroup_name,
                    data:+ groupedData[hashTable["Overall"]],
                })
            }
            else if(typeof hashTable[i.subgroup_name]!=='undefined'){
                if(toggleStateBurden == true){
                    groupedData[hashTable[i.subgroup_name]]=i.data_value;
                }
                else{
                    groupedData[hashTable[i.subgroup_name]]=i.data_value_num;
                }
                table.push({
                    area:i.subgroup_name,
                    data:+ groupedData[hashTable[i.subgroup_name]],
                })
            }
        })

    //For One Decimel Precision    
    function decimelPrecision(d){
        let oneDecimel;
        if(toggleStateBurden === false){
            return oneDecimel = d;
        }
        else{
            oneDecimel = d.toFixed(1);  
            return oneDecimel;
        }
        
    } 
       
        // graph time period 

        data = {
            labels:groupedLabel,
            datasets: [{
                // label: [graphTitle, barUnit,graphTimeperiod],
                data:groupedData,
                yAxisID:'yAxis1',
                backgroundColor: groupedColor,
                borderColor: colorScale,
                borderWidth:0.5,
                barThickness: 10,
            }] 
        }
    
    //Finding maximum value of X-axis    
        let findMax = (data.datasets[0].data);

        for(let i = 0; i<findMax.length; i++ ){
            if (isNaN(findMax[i])){
                findMax[i] = 0;
            }
        };
        findMaxVal =  Math.max.apply(Math, findMax);


        options={
            plugins: {
                datalabels: {
                    color: 'black',
                    anchor: 'end',
                    align: 'end',
                    clip: 'false',
                    display: function(context) {
                        return context.dataset.data[context.dataIndex] >= 0.1; 
                    },
                    formatter: function(value) {
                        if(value == "undefined" || isNaN(value)){
                            return value;
                        }
                        else{
                            return commaSeparated(decimelPrecision(value));
                        }
                    },
                    font: {
                    size: 11,
                    },
                }
            },
            tooltips:{
                displayColors:false,
                xAlign:"right",
                bodyAlign:"center",
                bodyFont: 12,
                callbacks: {
                    label: function(context) {
                        var label = context.xLabel; 
                        label = decimelPrecision(label); 
                        return commaSeparated(label);
                    },
                },
            },
            legend:
            {
              display: false,
            },
            layout: {
                padding: {
                  top:40,  
                  bottom: 20,   
                  right: 50,
                },
              },
            scales: {
                yAxes:[{
                        id:'yAxis1',
                        type:"category",
                        ticks:{
                            padding:5,
                            fontSize: 11,
                            fontColor: "black",
                        },
                        gridLines: {
                          drawTicks:false,
                          drawOnChartArea: false,
                          color:"black",
                          zeroLineColor:'transparent'
                        },
                }],
                xAxes: [{
                    ticks: {
                        autoSkip:false,
                        fontSize: 11,
                        maxTicksLimit:4,
                        fontColor:"black",
                        beginAtZero: true,
                        suggestedMax: findMaxVal * 1.15,
                        callback: function(value) {
                            return commaSeparated(value);
                        },
                    },
                    scaleLabel: {
                        display: true,
                        labelString: barUnit,
                        fontSize: 12,
                        fontColor: "black",
                    },
                    gridLines: {
                        drawOnChartArea: false,
                        color:"black",
                    }
                }]
            }
        }
    }
   
    title=graphTitle + ', '+ titleAreaName + ', '+ chartTitle + ' ' + graphTimeperiod.split(" ")[1]; 

    let height = 165;
 
    return(
        <div>
            {/* <FullScreen  className="fullscreen_css" handle={screen}>
                <SideNavSecond table={table} id="Bar" screen={screen} title={title} timePeriod={graphTimeperiod} componentRef={componentRef} />
                <BarComponent ref={componentRef} data={data} options={options} height={height} title={title}/>
            </FullScreen>     */}
        </div>
    );
};