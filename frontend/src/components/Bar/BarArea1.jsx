import React, { useRef, useEffect,useState} from 'react';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import SideNavSecond from "../SideNav/SideNavSecond";
import {
    scaleLinear,
    scaleBand,
    max,
    select,
    axisLeft,
    axisBottom
  } from 'd3';
import { commaSeparated } from '../../utils';
import './BarArea.css'

const width = window.screen.width/2
const height = window.screen.height/2
const barSize = 13
const margin = {
    left: 160,
    top: 100,
    right: 60,
    bottom: 15,
};

function BarArea1({graphTitle,graphTimeperiod, graphUnit,selIndiaData,level,selArea,titleAreaName, areaName,selStateData, toggleStateBurden, selIndicator}) {

    const svgRef = useRef();
    const trendWrapper = useRef();
    const screen = useFullScreenHandle();
    const [data, setData] = useState(null);
    const [table,setTable] = useState(null);

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

    let barGUnit = graphUnit;

    function decimelPrecision(d){
        let oneDecimel;
        if(typeof d !== 'undefined'){
            if(toggleStateBurden === false){
                return oneDecimel = d;
            }
            else{
                oneDecimel = d.toFixed(1);  
                return oneDecimel;
            }
        }
    } 

    useEffect(()=>{
        let barData=[];
        
        if(selIndiaData && level=="1" ){
            selIndiaData.map(d=>{
                barData.push(d);
            })
        }        
        if(selStateData && (level=="2" || level=="3")){
            selIndiaData.map(d=>{
                if(+selArea===d.area_id || d.area_name!==areaName){ 
                    barData.push(d);   
                }           
            })
            selStateData.map(d=>{
               barData.push(d);
            })
        }
        
        const compareObjects=(object1, object2)=>{
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
        barData.sort((d1, d2) => {
            return compareObjects(d1, d2,)
        })
       
        setData(barData);
        console.log(barData,'')
        
    },[])
    
    useEffect(()=>{
        
        select(".tooltip3").remove();
    
        let tooltip3 = select(".trend_svg").append("div")
        .attr("class", "tooltip2")
        .style("opacity", 0);
    
        const svg = select(svgRef.current);
        let windowWidth = window.screen.width;
        let windowHeight = window.screen.height;
    
        if(windowWidth >= 480){
          windowWidth = windowWidth/2.2;
          windowHeight = windowHeight/1.7;
        }else{
          windowWidth = windowWidth + 100;
          windowHeight = windowHeight/2;
        }
        let { width, height } = {width:windowWidth,height:windowHeight}; 

        const innerHeight = height - margin.top - margin.bottom;
        const innerWidth = width - margin.left - margin.right;

        svg.selectAll("*").remove();
        const bar = svg
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform",`translate(${margin.left},${margin.top})`);

        let barTitle;
        
        if(toggleStateBurden == true){
            barTitle = `${graphTitle}, ${titleAreaName}, ${graphTimeperiod}`;
        }
        else {
            barTitle = `${graphTitle}, ${titleAreaName}, ${graphTimeperiod}`;
        }

        // if(data && data.length>0){
            let xValue;
            const yValue = d => d.area_name;
            if(toggleStateBurden)
                xValue = d => d.data_value;
            else{
                xValue = d => d.data_value_num;
                graphUnit ='Number';
            }
        // }
        const xScale = scaleLinear()
            .domain([0, max(data,xValue)])
            .range([0, innerWidth])

        const yScale = scaleBand()
            .domain(data.map(d=>{return d.area_name}))
            .range([0,innerHeight])
            .padding(0.1);;

        bar.append("text")
            .attr('x',width/2 -90)
            .attr('y',0)
            .style("text-anchor","middle")
            .style("font-size","13px")
            .style("font-weight","bold")
            .attr("dy", "-2em")
            .text(`${barTitle}`)
          
        bar.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", innerWidth/2)
            .attr("y", innerHeight + 50)
            .text(`${graphUnit}`)
            .style('font-size',13)

        let chart = bar.selectAll("rect").data(data);   

        chart.enter().append("rect")
            .attr('y', d => yScale(yValue(d)))
            .attr('width', d => {return xScale(xValue(d))})
            .attr('height', yScale.bandwidth())
            .attr("fill", colorScale)
      	    .on('mouseover', (i,d) => {
        		tooltip3.transition().duration(500).style("opacity", 1);
                tooltip3.html(`<b>${yValue(d)}</b><br/>${commaSeparated(decimelPrecision(xValue(d)))}`)
          		.style("left", width + xScale(xValue(d)) + margin.left + 30+ "px")
          		.style("top", height + yScale(yValue(d))+ margin.top +30+"px");
                })
            .on('mouseout', ()=>{tooltip3.transition().duration(500).style("opacity", 0)});
            
        chart
            .enter().append("text")
            .text(d => commaSeparated(decimelPrecision(xValue(d))))
            .attr('x', d => xScale(xValue(d)))
            .attr('y', d => yScale(yValue(d)) + (yScale.bandwidth()/2))
            .attr("font-family", "sans-serif")
            .attr("dy", ".3em")
            .attr("dx", ".3em")
            .attr("font-size", "11px")
            .attr("fill", "black")
        
        bar.append("g")
            .attr("class","axis")
            .call(axisLeft(yScale).tickSize(0))
            .style('font-size',11);	

        bar.append("g")
            .attr("transform",`translate(0, ${innerHeight})`)
            .attr("class","axis")
            .call(axisBottom(xScale).ticks(3))
            .style('font-size',11)    

    },[data,toggleStateBurden])

    const checkchange = (state,handle)=>{
        // if(bar_area){
        //   if(state === true){
        //     bar_area[0].style.height = "100vh";
        //   }
        //   else if(state === false){
        //     if(bar_area[0] != undefined)
        //     bar_area[0].style.height = "65vh";
        //   }
        // }
    }


    return (
        <>
            <FullScreen  className="fullscreen_css" handle={screen}  onChange={checkchange}>
            <SideNavSecond table={table} id="BarArea" screen={screen} timePeriod={graphTimeperiod} componentRef={svgRef} />
                <div className="bar_area" ref={trendWrapper}>
                    <svg id="BarArea" width={width} height={height+500} ref={svgRef}/>
                </div>
            </FullScreen>
        </>
    )
}
export default BarArea1
