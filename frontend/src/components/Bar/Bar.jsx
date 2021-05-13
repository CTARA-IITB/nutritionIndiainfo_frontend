import React, { useRef, useEffect } from 'react';
//import {axisBottom,axisLeft,select,max,scaleLinear,scaleBand,bandwidth, sort}from 'd3';
import * as d3 from 'd3';
import './Bar.css'

const width = window.screen.width/2
const height = window.screen.height/2
const barSize = 7
const margin = {
    left: 160,
    top: 30,
    right: 60,
    bottom: 15,
};

function Bar({ graphTitle,graphTimeperiod, graphUnit,selIndiaData,level,selArea, selStateData, toggleStateBurden}) {

    const svgRef = useRef();

    const innerHeight =  height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right -165

    let barLabel=[];
    let barData=[];
    let data = [];
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

    for(var i=0;i<barLabel.length;i++){
        data.push({
            area:barLabel[i],
            data:+barData[i],
        })
    }

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
    data.sort((d1, d2) => {
        return compareObjects(d1, d2,)
    })

    //data.reverse();

    useEffect(()=>{
        const svg = d3.select(svgRef.current)

        var x = d3.scaleLinear().range([0, innerWidth]);
        var y = d3.scaleBand();

        const g = svg.append('g')
                    .attr('transform',`translate(${margin.left},${margin.top})`)

        x.domain([0, d3.max(data, function(d) { return d.data; })]);
        y.domain(data.map(function(d) { return d.area; })).padding(0.2)
            .range([barSize*data.length, 0]);


        g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (barSize*data.length) + ")")
            .call(d3.axisBottom(x).ticks(5).tickFormat(function(d) { return parseInt(d / 1000); }).tickSizeInner([-innerHeight]));

        g.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y));

        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("height", y.bandwidth())
            .attr("y", function(d) { return y(d.area); })
            //.attr("font-size",".5px")
            .attr("width", function(d) { return x(d.data); })
    })
    return (
        <div>
            <svg width={width} height={height+500} ref={svgRef}/>
        </div>
    )
}

export default Bar
