import React, { useRef,useEffect} from 'react';
import BarAreaComponent from './BarAreaComponent';
import SideNavSecond from "../SideNav/SideNavSecond";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
// import { commaSeparated } from "../../utils.js"
import Chart from 'chart.js';
import { commaSeparated } from '../../utils';

export const BarArea = ({graphTitle,graphTimeperiod, graphUnit,selIndiaData,level,selArea,titleAreaName, areaName,selStateData, toggleStateBurden, selIndicator}) => {

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
    let maxWidth;
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
    else if(selIndicator == 123 || selIndicator == 26 || selIndicator == 125)
      colorScale = '#b71c1c'; 
    else
      colorScale = '#eda143'; 

   
    
    if(selIndiaData && level=="1" ){
        
        selIndiaData.map(i=>{
            if(toggleStateBurden === true){
                if(!isNaN(i.data_value)){
                    barLabel.push(i.area_name)
                    barData.push(+i.data_value)
                }
            }      
            else{
                if(!isNaN(i.data_value_num)){
                    barLabel.push(i.area_name)
                    barData.push(+i.data_value_num)
                }
            }
            
        })
    }        
    if(selStateData && (level=="2" || level=="3")){
        for(let j=0;j<selIndiaData.length;j++){

            if(+selArea===selIndiaData[j].area_id && selIndiaData[j].area_name!==areaName){ 

                if(toggleStateBurden === true){
                    if(!isNaN(selIndiaData[j].data_value)){
                        stateDataValue=selIndiaData[j].data_value;
                        stateAreaName=selIndiaData[j].area_name;
                    }
                    
                }
                else{
                    if(!isNaN(selIndiaData[j].data_value_num)){
                        stateDataValue=selIndiaData[j].data_value_num;
                        stateAreaName=selIndiaData[j].area_name;
                    }
                }
               
                barLabel.push(stateAreaName)
                barData.push(stateDataValue)
            }           
        }
        selStateData.map(i=>{
            if(i.area_name!==areaName){
                if(toggleStateBurden === true){
                    if(!isNaN(i.data_value)){
                        barLabel.push(i.area_name)
                        barData.push(+i.data_value)
                    }
                }      
                else{
                    if(!isNaN(i.data_value_num)){
                        barLabel.push(i.area_name)
                        barData.push(+i.data_value_num)
                    }
                }
            }
        })
    }           
    let barGUnit = graphUnit;
    
    if(toggleStateBurden === false)
        barGUnit = 'Number';  

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
    
    datasets=[
        {
            // label: [graphTitle, barGUnit, graphTimeperiod],
            label :'',
            data:sortedBarData,
            yAxisID:'yAxis1',
            backgroundColor:colorScale,
            borderColor: colorScale,
            borderWidth: 1,
            // barThickness: 6,
        },
    ]

    // graph time period 
    let chartTitle = graphTimeperiod.split(" ")[0];
    
    data = {
        labels:sortedBarLabel,
        datasets: datasets,
    }  

    //Condition for Varying Bar Width
    if (datasets[0].data.length <= 6 ){
        maxWidth = 20;
    };

    options = {
        showDatapoints:true,
        responsive:true,
        maintainAspectRatio:false,
        tooltips:{
            displayColors:false,
            xAlign:"right",
            bodyAlign:"center",
            callbacks: {
                label: function(context) {
                    var label = context.xLabel; 
                    label = decimelPrecision(label); 
                    return commaSeparated(label);
                },
                // labelTextColor: function(context) {
                //     return 'white';
                // }
            },
            padding:10,
            backgroundColor: 'black',
            filter: function (tooltipItem) {
                return tooltipItem.datasetIndex === 0;
            }
        },
        legend:{  
            display: false,
        },
        layout: {
            padding: {
              top:40,  
              bottom: 20,  
              right: 70,
            },
          },
        scales: {
            yAxes:[{
                offset: true,
                stacked: true,
                barThickness: maxWidth,
                id:'yAxis1',
                type:"category",
                ticks:{
                    padding:5,
                    fontSize: 11,
                    fontColor: "black",
                    callback:function(label){
                        var subgroup = label.split(";")[0];
                        return subgroup;
                    }
                },
                gridLines: {
                    drawTicks:false,
                    drawOnChartArea: false, 
                    color:"black",
                    zeroLineColor:'transparent'
                },
            }],
            xAxes: [{
                stacked: true,
                ticks: {
                    // fontSize: 11,
                    fontColor:"black",
                    beginAtZero: true,
                    callback: function(value) {
                        return commaSeparated(value);
                    }
                },
                scaleLabel: {
                    display: true,
                    labelString: barGUnit,
                    fontSize: 12,
                    fontColor: "black",
                },
                gridLines: {
                    drawOnChartArea:false,
                    color:"black",
                }
            }],
        } 
    }

    Chart.plugins.register({
        // id: 'p1',
        afterDraw: function(chartInstance) {
          if (chartInstance.config.options.showDatapoints) {
            var helpers = Chart.helpers;
            var ctx = chartInstance.chart.ctx;
            var fontColor = helpers.getValueOrDefault(chartInstance.config.options.showDatapoints.fontColor, chartInstance.config.options.defaultFontColor);
      
            // render the value of the chart above the bar
            ctx.font = Chart.helpers.fontString(11, 'normal', 'Helvetica Neue');
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = "black";
            ctx.fontWeight = 'none';
            chartInstance.data.datasets.forEach(function (dataset) {
                for (var i = 0; i < dataset.data.length; i++) {
                    var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
                    // var scaleMax = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._yScale.maxHeight;
                    var yPos =  model.y + 7;
                    var xPos = model.x + 28;
                    // console.log(dataValue, "DV");

                    var dataValue = (dataset.data[i]);
                    ctx.fillText(dataValue, xPos, yPos);
                }
            });
          }
        }
    });


    // title of table
    title=graphTitle + ', '+ titleAreaName + ', '+ chartTitle + ' ' + graphTimeperiod.split(" ")[1]; 
    // graph height
    let calculatedHeight=data.labels.length*15;
    calculatedHeight = (calculatedHeight < 450)?450:calculatedHeight;

    return (
        <div>
            <FullScreen  className="fullscreen_css" handle={screen}>
                <SideNavSecond table={table} id="BarArea" screen={screen} title={title} timePeriod={graphTimeperiod} componentRef={componentRef} />
                <div className="barAreaTitle">
                    <small style={{textAlign:'center',fontWeight:"bold",fontSize:"13px"}}>{title}</small>
                </div>
                <BarAreaComponent ref={componentRef} id="BarArea" data={data} options={options} calculatedHeight={calculatedHeight}/>
            </FullScreen>    
        </div>
    );
};