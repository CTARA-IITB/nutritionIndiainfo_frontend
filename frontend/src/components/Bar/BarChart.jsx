import React,{useEffect,useRef} from 'react';
import Chart from 'chart.js';
import SideNavSecond from "../SideNav/SideNavSecond";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

const height = window.screen.height/2;
const width = window.screen.width/2;
const margin = {
    left: 100,
    top: 80,
    right: 50,
    bottom: 150,
};
const BarChart = ({graphTitle,graphTimeperiod, graphUnit,selIndiaData,level,selArea,areaName,
    selStateData, toggleStateBurden}) =>{
    
    const componentRef =  useRef();

    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;    

    let barLabel=[];
    let barData=[];
    let datab = [];
    let color;
    let stateDataValue,stateAreaName;

    if(selIndiaData && level=="1"){

        selIndiaData.map(i=>{
            barLabel.push(i.area_name)
            if(toggleStateBurden === true){
                barData.push(+i.data_value)
            }      
            else{
                barData.push(+i.data_value_num)
            }
              
        })
    }        
    if(selStateData && level=="2"){

        for(let j=0;j<selIndiaData.length;j++){

            if(+selArea===selIndiaData[j].area_id){ 

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
            barLabel.push(i.area_name)
            if(toggleStateBurden === true)
                barData.push(+i.data_value)
            else
                barData.push(+i.data_value_num)
        })
    }           
    let barGUnit = graphUnit;
    
    if(toggleStateBurden === false)
        barGUnit = 'Number';
          
    datab = {
        labels:barLabel,
        datasets: [{
            label: [graphTitle, barGUnit, graphTimeperiod],
            data:barData,
            xAxisID:'xAxis1',
            backgroundColor:color,
            borderColor: "rgb(142, 209, 25)",
            borderWidth: 1
        }]
    }  

    let table=[];
    for(var i=0;i<barLabel.length;i++){
      table.push({
        area:barLabel[i],
        data:+barData[i]+" ("+graphTimeperiod+")",
      })
    }    
    const screen=useFullScreenHandle();
    let title=graphTitle +', '+barGUnit;

    useEffect(() => {
        const ctx = document.getElementById("BarChart");
        new Chart(ctx,{
            type:'bar',
            data:datab,
            options:{
                legend:
                {
                  display: false,
                },
                title: {
                  display: true,
                  text: [graphTitle +','+ barGUnit, areaName +','+ graphTimeperiod],
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
            }
        })
    })

    return (
       <div>
            <FullScreen  className="fullscreen_css" handle={screen}>
            <SideNavSecond table={table} id="BarChart" screen={screen} title={title} timePeriod={graphTimeperiod} componentRef={componentRef} />
            <canvas id="BarChart" ref={componentRef} width={innerWidth} height={innerHeight+100}></canvas>
            </FullScreen>
       </div>
    );
}
export default BarChart;