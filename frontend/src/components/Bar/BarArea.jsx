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
    let sortedBarLabel =[];
    let sortedBarData = [];

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

    data = {
        labels:sortedBarLabel,
        datasets: [{
            // label: [graphTitle, barGUnit, graphTimeperiod],
            data:sortedBarData,
            yAxisID:'yAxis1',
            backgroundColor:color,
            borderColor: "rgb(142, 209, 25)",
            borderWidth: 1
        }]
    }    
    options = {
        //maintainAspectRatio : false,
        legend:{  
            display: false,
        },
        title:{
            display: true,
            text: [graphTitle +','+ barGUnit, areaName +','+ graphTimeperiod],
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
            }],
            xAxes: [{
                ticks: {
                    fontSize: 7,
                    fontColor:"black",
                    beginAtZero: true
                },
                gridLines: {
                    drawOnChartArea:true
                }
            }]
        } 
    }
    // title of table
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