import React, { useRef,useContext } from 'react';
import BarAreaComponent from './BarAreaComponent';
import SideNavSecond from "../SideNav/SideNavSecond";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import "chartjs-plugin-datalabels";
import Chart from 'chart.js';

export const BarArea = ({indicatorTrend,graphTitle,graphTimeperiod, graphUnit,selIndiaData,level,selArea,titleAreaName, areaName,selStateData, toggleStateBurden}) => {

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

    // remove last word  graph title i.e olds
    var lastIndex = graphTitle.lastIndexOf(" ");
    graphTitle = graphTitle.substring(0, lastIndex);
    graphTitle = graphTitle + 's'
    
    console.log(indicatorTrend,graphTimeperiod)
    if(selIndiaData && level=="1" ){

        indicatorTrend.map(i=>{
            // console.log(i.data_value,graphTimeperiod)
            if(i.timeperiod.split(" ")[0]==graphTimeperiod.split(" ")[0]){

                barLabel.push(areaName)
                if(toggleStateBurden === true){
                    barData.push(+i.data_value)
                }      
                else{
                    barData.push(+i.data_value_num)
                } 
            }    
        })
        selIndiaData.map(i=>{
            barLabel.push(i.area_name)
            if(toggleStateBurden === true){
                barData.push(+i.data_value)
            }      
            else{
                barData.push(+i.data_value_num)
            }
            
        })
        s = ' by State ';
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
        s = ' by District '
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
  
    if(level=="1"){
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
                backgroundColor:"#8e0000",
                borderColor: "#8e0000",
                borderWidth: 1
            },
            {
                data:differenceData,
                yAxisID:'yAxis1',
                backgroundColor:"#DEDEDE",
                borderColor: "#DEDEDE",
                borderWidth: 1,
                showTooltips:'false'
            }
        ]
    }
    else if(level=="2"){

         //sort label and data
         for(var i=0;i<table.length;i++){
            sortedBarLabel[i]=table[i].area;
            sortedBarData[i]=table[i].data;
            table[i].data += " ("+graphTimeperiod +")";
        }   
        datasets=[
            {
                // label: [graphTitle, barGUnit, graphTimeperiod],
                label :'',
                data:sortedBarData,
                yAxisID:'yAxis1',
                backgroundColor:"#fe0000",
                borderColor: "#fe0000",
                borderWidth: 1,
            }
        ]
    }

    // graph time period 
    let chartTitle = graphTimeperiod.split(" ")[0];
    let lastChar = chartTitle.slice(-1);
    if(/^[0-9]$/.test(lastChar)){
        chartTitle = chartTitle.slice(0, -1);
        chartTitle = chartTitle + '-' + lastChar;
    }

    data = {
        labels:sortedBarLabel,
        datasets: datasets,
    }    
    options = {
        tooltips:{
            filter: function (tooltipItem) {
                return tooltipItem.datasetIndex === 0;
            }
        },
        legend:{  
            display: false,
        },
        title:{
            display: true,
            text: [graphTitle + s,titleAreaName +' '+ chartTitle + " (" + graphTimeperiod.split(" ")[1] + ")"],
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
                    fontSize: 7,
                    fontColor:"black",
                    beginAtZero: true
                },
                gridLines: {
                    drawOnChartArea:false
                }
            }],
            animation:{
                duration: 1,
                onComplete: function() {
                    var chart = componentRef.current.chartInstance,
                    ctx = chart.ctx;
                    ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';

                    this.data.datasets.forEach(function(dataset, i) {
                        var meta = chart.controller.getDatasetMeta(i);
                        meta.data.forEach(function(bar, index) {
                            var data = dataset.data[index];
                            ctx.fillText(data, bar._model.x, bar._model.y - 5);
                        });
                    });
                }
            },
            
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