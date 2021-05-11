import {axisBottom,axisLeft,select,max,scaleLinear,scaleBand,bandwidth, sort}from 'd3';
import React, { useRef, useEffect } from 'react';
import './Bar.css'

const width = window.screen.width/2
const height = window.screen.height/2
const barSize = 30;  
const  barPadding=2.2
const margin = {
    left: 160,
    top: 30,
    right: 60,
    bottom: 15,
};

export const BarGraphArea=({ graphTitle,graphTimeperiod, graphUnit,selIndiaData,level,selArea, selStateData, toggleStateBurden})=>{
    const svgRef = useRef();

    //const innerHeight = height - margin.top - margin.bottom;
    const innerHeight = height+180
    const innerWidth = width - margin.left - margin.right 
    
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
      
    data.reverse();

    useEffect(()=>{
       
        const svg = select(svgRef.current)

        const xValue = d => d.data
        const yValue = d => d.area

        const xScale = scaleLinear()
            .domain([0, max(data, xValue)])
            .range([0, innerWidth-140]);

        //const yScale = d3.scaleBand().range([bar_height * data.length, 0]).padding(0.1); yScale.domain(data.map(yValue))   
        const yScale=scaleBand()
            .range([0,innerHeight])   
            .padding(1.5) 
            .domain(data.map(yValue))
            //.range([barSize*data.length, 0]);

        const yAxis = axisLeft(yScale)    
        const xAxis = axisBottom(xScale)
                   

        const g = svg.append('g')
                    .attr('transform',`translate(${margin.left},${margin.top})`)

        g.append('g').call(yAxis);
        g.append('line')
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", innerHeight)
            .style("stroke-width", 1)
            .style("stroke", "black");

        g.append('g').call(xAxis)
            .attr('transform',`translate(0,${innerHeight})`)

        // g.selectAll('rect').data(data)
        //     .enter().append('rect')
        //     .attr('y',d => yScale(yValue(d)))
        //     .attr('width',d => xScale(xValue(d)))
        //     .attr('height',yScale.bandwidth())

        let bar = g.selectAll('.bar')
            .data(data)
            .enter()
            .append('g')

        bar.append('rect')
            //.attr('y',d => yScale(yValue(d)))
            .attr("class", "bar")
            .attr('y',(d,i) => i*(innerHeight/data.length ))
            .attr('width',d => xScale(xValue(d)))
            //.attr('height',yScale.bandwidth())
            .attr("height", innerHeight / data.length - barPadding)
           
            
        // bar.append('text')
        //     .text(d => d.area)
        //     .attr('x',d => xScale(xValue(d)))
        //     .attr('y',d => yScale(yValue(d))+yScale.bandwidth()/2)
        //     .attr("font-family" , "sans-serif")
        //     .attr("font-size" , "9.5px")
        //     .attr("fill" , "black")
        //     .attr("text-anchor", "middle");

    },[data])
    return (
        <div className="chart">
            <svg width={width} height={height+250} ref={svgRef}>
               
            </svg>
        </div>
    )
}