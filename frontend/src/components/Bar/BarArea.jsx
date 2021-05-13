import React, { useRef } from 'react';
import BarAreaComponent from './BarAreaComponent';
import SideNavSecond from "../SideNav/SideNavSecond";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

export const BarArea = ({graphTitle,graphTimeperiod, graphUnit,selIndiaData,level,selArea,areaName,selStateData, toggleStateBurden}) => {

    const componentRef = useRef();
    const screen=useFullScreenHandle();

    let barLabel=[];
    let barData=[];
    let data = [];
    let options = [];
    let stateDataValue;
    let stateAreaName;
    let color;
    let table=[];
    let title;

    if(selIndiaData && level=="1"){

        selIndiaData.map(i=>{
            barLabel.push(i.area_name)
            if(toggleStateBurden === true){
                barData.push(+i.data_value)
            }      
            else{
                barData.push(+i.data_value_num)
            }
            color= 'rgb(142, 209, 25)'   
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
            color=' rgb(142, 209, 25)'    
        })
    }           
    let barGUnit = graphUnit;
    
    if(toggleStateBurden === false)
        barGUnit = 'Number';  

    data = {
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
    options = {
        legend:{  
            display: false,
        },
        title:{
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
            }],
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

    for(var i=0;i<barLabel.length;i++){
        table.push({
            area:barLabel[i],
            data:+barData[i]+" ("+graphTimeperiod+")",
        })
    }   

    title=graphTitle +', '+barGUnit; 

    return (
        <div>
            <FullScreen  className="fullscreen_css" handle={screen}>
                <SideNavSecond table={table} id="BarArea" screen={screen} title={title} timePeriod={graphTimeperiod} componentRef={componentRef} />
                <BarAreaComponent ref={componentRef} id="BarArea" data={data} options={options}/>
            </FullScreen>    
        </div>
    );
};