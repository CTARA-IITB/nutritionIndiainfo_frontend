import React, { useRef } from 'react';
import BarComponent from './BarComponent';
import SideNavSecond from "../SideNav/SideNavSecond";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

export const Bar = ({indicatorBar, graphTitle,graphTimeperiod, graphUnit, titleAreaName, toggleStateBurden})=>{

    const componentRef = useRef();
    const screen=useFullScreenHandle();
    
    let barLabel=[];
    let barData=[];
    let data = [];
    var colors = [];
    let table=[];
    let options =[];
    let barUnit = graphUnit;
    let title=graphTitle +', '+barUnit;
    let sortedBarData =[];
    let sortedBarLabel = [];

    // remove last word  graph title i.e olds
    var lastIndex = graphTitle.lastIndexOf(" ");
    graphTitle = graphTitle.substring(0, lastIndex);
    graphTitle = graphTitle + 's'

    if(toggleStateBurden === false){
        barUnit = 'Number';
    }

    if(indicatorBar){
        indicatorBar.map(i=>{
            barLabel.push(i.subgroup_name+";"+i.sub_category)
        if(toggleStateBurden == true){
            barData.push(+i.data_value)
        }
        else{
            barData.push(+i.data_value_num)
        }
        })
    
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

        // table details
        for(var i=0;i<barLabel.length;i++){
            table.push({
              area:barLabel[i].split(";")[0],
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
        
         // graph time period 
        let chartTitle = graphTimeperiod.split(" ")[0];
        let lastChar = chartTitle.slice(-1);
        if(/^[0-9]$/.test(lastChar)){
            chartTitle = chartTitle.slice(0, -1);
            chartTitle = chartTitle + '-' + lastChar;
        }

        data = {
            labels:sortedBarLabel,
            datasets: [{
                // label: [graphTitle, barUnit,graphTimeperiod],
                data:sortedBarData,
                yAxisID:'yAxis1',
                backgroundColor: colors,
                borderColor: '#ffffff',
                borderWidth: 1,
            }] 
        }

        options={
            legend:
            {
              display: false,
            },
            title: {
              display: true,
              text: [graphTitle +' '+ 'by background characteristic', titleAreaName +' '+chartTitle + " (" + graphTimeperiod.split(" ")[1] + ")"],
              fontColor: "black",
            },
            scales: {
                yAxes:[{
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
                },
                {
                    id:'yAxis2',
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
                xAxes: [{
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