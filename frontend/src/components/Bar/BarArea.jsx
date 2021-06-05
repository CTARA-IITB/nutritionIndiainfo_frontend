import React, { useRef,useContext } from 'react';
import BarAreaComponent from './BarAreaComponent';
import SideNavSecond from "../SideNav/SideNavSecond";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import "chartjs-plugin-datalabels";

export const BarArea = ({indicatorTrend,graphTitle,graphTimeperiod, graphUnit,selIndiaData,level,selArea,titleAreaName, areaName,selStateData, toggleStateBurden, selIndicator}) => {

    const componentRef = useRef();
    const screen=useFullScreenHandle();

    let barLabel=[];
    let barData=[];
    let data = [];
    let options = [];
    let stateDataValue;
    let stateAreaName;
    let datasets = [];
    let table=[];
    let title;
    let sortedBarLabel =[];
    let sortedBarData = [];
    let differenceData = [];
    let s;
    let colorScale ='#eda143';

    let arrObese = [91,95,104,92,96,105,21];
    if(selIndicator == 12 || selIndicator == 13)
      colorScale = '#a3c00f'; 
    else if(selIndicator == 19 || selIndicator == 20)
      colorScale = '#e53935'; 
    else if(selIndicator == 17 || selIndicator == 18)
      colorScale = '#039be5'; 
    else if(selIndicator == 107 || selIndicator == 108)
      colorScale = '#e53935'; 
    else  if(arrObese.includes(selIndicator))
      colorScale = '#7b1fa2'; 
    else if(selIndicator == 123 || selIndicator == 124 || selIndicator == 125)
      colorScale = '#b71c1c'; 
    else
      colorScale = '#eda143'; 

    if(selIndiaData && level=="1" ){

        selIndiaData.map(i=>{
            barLabel.push(i.area_name)
            if(toggleStateBurden === true){
                barData.push(+i.data_value)
            }      
            else{
                barData.push(+i.data_value_num)
            }
            
        })
        // s = ' by State ';
    }        
    if(selStateData && level=="2"){

        for(let j=0;j<selIndiaData.length;j++){

            if(+selArea===selIndiaData[j].area_id && selIndiaData[j].area_name!==areaName){ 

                if(toggleStateBurden === true){
                    stateDataValue=selIndiaData[j].data_value
                }
                else{
                    stateDataValue=selIndiaData[j].data_value_num
                }
                stateAreaName=selIndiaData[j].area_name
                barLabel.push(stateAreaName)
                barData.push(stateDataValue)
            }           
        }
        selStateData.map(i=>{
            if(i.area_name!==areaName){
                barLabel.push(i.area_name)
                if(toggleStateBurden === true)
                    barData.push(+i.data_value)
                else
                    barData.push(+i.data_value_num) 
            }
        })
        // s = ' by District '
    }           
    let barGUnit = graphUnit;
    
    if(toggleStateBurden === false)
        barGUnit = 'Number';  

    // table details    
    for(var i=0;i<barLabel.length;i++){
        table.push({
            area:barLabel[i],
            data:+barData[i],
        })
    }   
    // sort the table
    const compareObjects=(object1, object2, key)=>{
        const obj1 = object1.data
        const obj2 = object2.data

        if (obj1 < obj2) {
          return -1
        }
        if (obj1 > obj2) {
          return 1
        }
        return 0
    }
    table.sort((d1, d2) => {
        return compareObjects(d1, d2,)
    })
  
    // reverse the table
    table.reverse();
    //sort label and data
    for(var i=0;i<table.length;i++){
        sortedBarLabel[i]=table[i].area;
        sortedBarData[i]=table[i].data;
        table[i].data += " ("+graphTimeperiod +")";
    }   
    for(var i=0;i<sortedBarData.length;i++){
        differenceData[i]=sortedBarData[0]-sortedBarData[i];
    } 
    datasets=[
        {
            // label: [graphTitle, barGUnit, graphTimeperiod],
            label :'',
            data:sortedBarData,
            yAxisID:'yAxis1',
            backgroundColor:colorScale,
            borderColor: colorScale,
            borderWidth: 1
        },
    ]

    // graph time period 
    let chartTitle = graphTimeperiod.split(" ")[0];
    
    data = {
        labels:sortedBarLabel,
        datasets: datasets,
    }    
    options = {
        tooltips:{
            displayColors:false,
            bodyAlign:"center",
            padding:10,
            filter: function (tooltipItem) {
                return tooltipItem.datasetIndex === 0;
            }
        },
        legend:{  
            display: false,
        },
        title:{
            display: true,
            text: [`${graphTitle}, ${barGUnit},${titleAreaName},${chartTitle} ${graphTimeperiod.split(" ")[1]}`],
            fontColor: "black",
        },
        scales: {
            yAxes:[{
                stacked: true,
                id:'yAxis1',
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
            }],
            xAxes: [{
                stacked: true,
                ticks: {
                    // fontSize: 11,
                    fontColor:"black",
                    beginAtZero: true,
                    callback: function(value) {
                        return value.toLocaleString("en-IN");
                    }
                },
                gridLines: {
                    drawOnChartArea:false
                }
            }],
            datalabels: {
                anchor :'end',
                align :'top',
                // and if you need to format how the value is displayed...
                callback: function(value, context) {
                    return 0;
                }
            }
        } 
    }
    // title of table
    title=graphTitle +', '+barGUnit; 
    return (
        <div>
            <FullScreen  className="fullscreen_css" handle={screen}>
                <SideNavSecond table={table} id="BarArea" screen={screen} title={title} timePeriod={graphTimeperiod} componentRef={componentRef} />
                <BarAreaComponent ref={componentRef} id="BarArea" data={data} options={options} />
            </FullScreen>    
        </div>
    );
};