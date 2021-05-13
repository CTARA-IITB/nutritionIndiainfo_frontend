import React, { useRef } from 'react';
import BarComponent from './BarComponent';
import SideNavSecond from "../SideNav/SideNavSecond";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

export const Bar = ({indicatorBar, graphTitle,graphTimeperiod, graphUnit, areaName, toggleStateBurden})=>{

    const componentRef = useRef();
    const screen=useFullScreenHandle();
    
    let barLabel=[];
    let barData=[];
    let data = [];
    var colors = [];
    let table=[];
    let options =[];
    let barUnit = graphUnit;
    let title=graphTitle +', '+barUnit

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
        data = {
            labels:barLabel,
            datasets: [{
                label: [graphTitle, barUnit,graphTimeperiod],
                data:barData,
                xAxisID:'xAxis1',
                backgroundColor: colors,
                borderColor: '#ffffff',
                borderWidth: 1
            }] 
        }

        options={
            legend:
            {
              display: false,
            },
            title: {
              display: true,
              text: [graphTitle +','+ barUnit, areaName +', '+ graphTimeperiod],
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
        }
    }

    for(var i=0;i<barLabel.length;i++){
      table.push({
        area:barLabel[i].split(";")[0],
        data:+barData[i]+" ("+graphTimeperiod+")",
      })
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