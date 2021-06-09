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
    let groupedData = [];
    let groupedLabel =[];
    let groupedColor = [];
    

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

    if(toggleStateBurden === false){
        barUnit = 'Number';
    }

    if(indicatorBar){
        indicatorBar.map(i=>{
            
            if(i.subgroup_id===6){
                barLabel.push({
                   subgroup_name: i.subgroup_name,
                   subgroup_id : i.subgroup_id,
                })
                colors.push(colorScale)
                if(toggleStateBurden == true){
                    barData.push(+i.data_value)
                }
                else{
                    barData.push(+i.data_value_num)
                }
            }
            else if(i.subgroup_id>=14 && i.subgroup_id<=15){
                barLabel.push({
                    subgroup_name: i.subgroup_name,
                    subgroup_id : i.subgroup_id,
                })
                colors.push(lightColor)
                if(toggleStateBurden == true){
                    barData.push(+i.data_value)
                }
                else{
                    barData.push(+i.data_value_num)
                }
            }
            else if(i.subgroup_id>=8 && i.subgroup_id<=12){
                barLabel.push({
                    subgroup_name: i.subgroup_name,
                    subgroup_id : i.subgroup_id,
                })
                colors.push(colorScale)
                if(toggleStateBurden == true){
                    barData.push(+i.data_value)
                }
                else{
                    barData.push(+i.data_value_num)
                }
            }
            else if(i.subgroup_id>=18 && i.subgroup_id<=22){
                barLabel.push({
                    subgroup_name: i.subgroup_name,
                    subgroup_id : i.subgroup_id,
                })
                colors.push(lightColor)
                if(toggleStateBurden == true){
                    barData.push(+i.data_value)
                }
                else{
                    barData.push(+i.data_value_num)
                }
            }
        })

        var j=0;
        let flag=false,check=false;
        let subgroupId = [6,15,14,23,24,25,18,19,20,21,22,10,12,9,8,11];
        let colorCode = [colorScale,lightColor,lightColor,colorScale,colorScale,colorScale,lightColor,lightColor,lightColor,lightColor,lightColor,colorScale,colorScale,colorScale,colorScale,colorScale]
        if(barLabel.length>0){
            var k=0;
            while(k<subgroupId.length){
                for(var i=0;i<barLabel.length;i++){
                    if(subgroupId[k]===23){
                        groupedLabel[j]="Low Coverage";
                        groupedColor[j]=colorCode[k];
                        groupedData[j++]=0;
                        groupedLabel[j]="Mid Coverage";
                        groupedColor[j]=colorCode[k+1];
                        groupedData[j++]=0;
                        groupedLabel[j]="High Coverage";
                        groupedColor[j]=colorCode[k+2];
                        groupedData[j++]=0;
                        groupedLabel[j]=" ";
                        groupedColor[j]="white";
                        groupedData[j++]=0;
                        flag=true;
                        break;
                    }
                    if(barLabel[i].subgroup_id===subgroupId[k]){
                        if(subgroupId[k]===6)
                            groupedLabel[j]="Overall";
                        else  
                            groupedLabel[j]=barLabel[i].subgroup_name; 
                        groupedColor[j]=colorCode[k];
                        groupedData[j++]=barData[i];
                        table.push({
                            area:groupedLabel[groupedLabel.length-1],
                            data:+groupedData[groupedData.length-1],
                        })
                        if(subgroupId[k]===6 ||subgroupId[k]===14|| subgroupId[k]===22){
                            groupedLabel[j]=" ";
                            groupedColor[j]="white";
                            groupedData[j++]=0;
                        }
                        check=true;
                        break;
                    }
                }
                if(flag){
                    flag=false;
                    k+=3;
                    continue;
                }
                if(check){
                    check=false;
                    k++;
                    continue;
                }
                if(check===false && subgroupId[k]===18){
                    groupedLabel[j]="No Education";
                    groupedColor[j]=lightColor;
                    groupedData[j++]=0;
                    groupedLabel[j]="<5 years completed";
                    groupedColor[j]=lightColor;
                    groupedData[j++]=0;
                    groupedLabel[j]="5-9 years completed";
                    groupedColor[j]=lightColor;
                    groupedData[j++]=0;
                    groupedLabel[j]="10-11 years completed";
                    groupedColor[j]=lightColor;
                    groupedData[j++]=0;
                    groupedLabel[j]="12+ years completed";
                    groupedColor[j]=lightColor;
                    groupedData[j++]=0;
                    groupedLabel[j]=" ";
                    groupedColor[j]="white";
                    groupedData[j++]=0;
                    k+=5;
                    continue;
                }  
                k++;    
            }
        }      
        else{
            groupedLabel[j]="Overall";
            groupedColor[j]=colorScale;
            groupedData[j++]=0;
            groupedLabel[j]=" ";
            groupedColor[j]="white";
            groupedData[j++]=0;
            
            groupedLabel[j]="Male"
            groupedColor[j]=lightColor;
            groupedData[j++]=0;
            groupedLabel[j]="Female"
            groupedColor[j]=lightColor;
            groupedData[j++]=0;
            groupedLabel[j]=" ";
            groupedColor[j]="white";
            groupedData[j++]=0;

            groupedLabel[j]="Low Coverage";
            groupedColor[j]=colorScale;
            groupedData[j++]=0;
            groupedLabel[j]="Mid Coverage";
            groupedColor[j]=colorScale;
            groupedData[j++]=0;
            groupedLabel[j]="High Coverage";
            groupedColor[j]=colorScale;
            groupedData[j++]=0;
            groupedLabel[j]=" ";
            groupedColor[j]="white";
            groupedData[j++]=0;

            groupedLabel[j]="No Education";
            groupedColor[j]=lightColor;
            groupedData[j++]=0;
            groupedLabel[j]="<5 years completed";
            groupedColor[j]=lightColor;
            groupedData[j++]=0;
            groupedLabel[j]="5-9 years completed";
            groupedColor[j]=lightColor;
            groupedData[j++]=0;
            groupedLabel[j]="10-11 years completed";
            groupedColor[j]=lightColor;
            groupedData[j++]=0;
            groupedLabel[j]="12+ years completed";
            groupedColor[j]=lightColor;
            groupedData[j++]=0;
            groupedLabel[j]=" ";
            groupedColor[j]="white";
            groupedData[j++]=0;

            groupedLabel[j]="Poorest"
            groupedColor[j]=colorScale;
            groupedData[j++]=0;
            groupedLabel[j]="Second"
            groupedColor[j]=colorScale;
            groupedData[j++]=0;
            groupedLabel[j]="Middle"
            groupedColor[j]=colorScale;
            groupedData[j++]=0;
            groupedLabel[j]="Fourth"
            groupedColor[j]=colorScale;
            groupedData[j++]=0;
            groupedLabel[j]="Richest"
            groupedColor[j]=colorScale;
            groupedData[j++]=0;
        }
       
        // graph time period 
        let chartTitle = graphTimeperiod.split(" ")[0];
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

        options={
            tooltips:{
                displayColors:false,
                bodyAlign:"center",
                callbacks: {
                    label: function(context) {
                        var label = context.xLabel; 
                        return label.toLocaleString("en-IN");
                    }
                },
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
                        beginAtZero: true,
                        callback: function(value) {
                            return value.toLocaleString("en-IN");
                        }
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