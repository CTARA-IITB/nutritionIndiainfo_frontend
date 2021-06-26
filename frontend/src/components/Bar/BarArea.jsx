import React, { useRef,useState,useEffect } from 'react';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { commaSeparated } from '../../utils';
import SideNavFirst from "../SideNav/SideNavFirst";
import {
  scaleLinear,
  scaleBand,
  max,
  select,
  axisLeft,
  axisBottom,
  descending,
} from 'd3';

export const BarArea = ({graphTitle,graphTimeperiod, graphUnit,selIndiaData,level,selArea,titleAreaName, areaName,selStateData, toggleStateBurden, selIndicator}) => {

  const screen=useFullScreenHandle();
  const svgRef = useRef();
  const trendWrapper = useRef();
  const margin = {
    left:160,
    top: 50,
    right: 80,
    bottom: 30,
  };

  const [data, setData] = useState(null);
  const [status,setStatus]=useState(null);
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
  
  //For One Decimel Precision    
  function decimalPrecision(d){
    let oneDecimel;
    if(typeof d !== 'undefined'){
      if(d>100){
        oneDecimel = d;
      }
      else {
        oneDecimel = d.toFixed(1);  
      }
      return oneDecimel;
    }
  }  
    
  useEffect(() => {
    if(level === 1){
      setStatus("By State");
      let sortedIndiaData;
      if(toggleStateBurden)
          sortedIndiaData = selIndiaData.slice().sort((a, b) => descending(a.data_value, b.data_value))
      else{
          selIndiaData = selIndiaData.filter(d => typeof d.data_value_num != 'undefined')
          sortedIndiaData = selIndiaData.slice().sort((a, b) => descending(a.data_value_num, b.data_value_num))
      }
      setData(sortedIndiaData);
    }
    else if(level === 2 || level === 3){
      setStatus("By District")
      let sortedStateData;
      if(toggleStateBurden)
          sortedStateData = selStateData.slice().sort((a, b) => descending(a.data_value, b.data_value))
      else{
          selStateData = selStateData.filter(d => typeof d.data_value_num != 'undefined')
          sortedStateData = selStateData.slice().sort((a, b) => descending(a.data_value_num, b.data_value_num))
      }
      setData(sortedStateData)
    }
  }, [toggleStateBurden]);
  
  useEffect(()=>{
    // select(".tooltipX").remove();
    let TOOLTIP_FONTSIZE;
    
    const svg = select(svgRef.current);
    let windowWidth = window.screen.width;
    let windowHeight = window.screen.height;
    
    if(windowWidth >= 480){
      windowWidth = windowWidth/2;
      windowHeight = windowHeight/2;
      TOOLTIP_FONTSIZE="12px";
    }else{
      windowWidth = windowWidth + 100;
      windowHeight = windowHeight/2;
      TOOLTIP_FONTSIZE="8px";
    }

    var tooltipX = select(".hbar_svg")
    .append("div")
    .attr("class", "tooltipX")
    .style("visibility", "hidden")
    .style("font-size",TOOLTIP_FONTSIZE)

    let { width, height } = {width:windowWidth,height:windowHeight}; 
    let innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;
    const aspect = width / height;
    let gBarTitle;

    const adjustedHeight = Math.ceil(width / aspect)*1.1;
      svg.selectAll("*").remove();
      svg.attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox",  `0 0 ${width} ${adjustedHeight}`)

    if (( toggleStateBurden == true)) {
      gBarTitle = `${graphTitle}, ${titleAreaName}, ${graphTimeperiod}`;
    }
    else{
      gBarTitle = `${graphTitle}, ${titleAreaName}, ${graphTimeperiod}`;
    }
        
    if(data && data.length >0){
      const barSize = 13;
      const dynamicRange = (barSize*data.length<innerHeight)?innerHeight:barSize*data.length;

      const yValue = d => d.area_name;
      let xValue;

      if(toggleStateBurden){
        xValue = d => d.data_value;
      }  
      else{
        xValue = d => d.data_value_num;
        graphUnit ='Number';
      }
      const bar = svg
        .attr("width", width)
        .attr("height", dynamicRange+100)
        .append("g")
        .attr("transform",`translate(${margin.left},${margin.top})`);

      const xScale = scaleLinear()
        .domain([0, max(data, xValue)])
        .range([0, innerWidth])

      const yScale = scaleBand()
        .domain(data.map(yValue))
        // .range([0,innerHeight])
        .padding(0.1)
        .range([0,dynamicRange])
          
      bar.append("text")
        .attr('x',width/2 -90)
        .attr('y',0)
        .style("text-anchor","middle")
        .style("font-size","13px")
        .style("font-weight","bold")
        .attr("dy", "-2em")
        .text(`${gBarTitle}`)

      bar.append("text")
        .attr('x',width/2 -90)
        .attr('y',0)
        .style("text-anchor","middle")
        .style("font-size","11px")
        .attr("dy", "-.5em")  
        .text(`${status}`)
          
      bar.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", innerWidth/2)
        .attr("y", dynamicRange+50)
        .text(`${graphUnit}`)
        .style('font-size',13);
    
      let chart = bar.selectAll("rect").data(data);
      const fillRect = (d) =>{
        return colorScale;
      }

      let rectHeight = d =>{
        if(data.length <= 6)
          return 20;
        else
          return yScale.bandwidth()
      }

      let rectY = d =>{
        if(data.length <= 6)
          return yScale(yValue(d)) + yScale.bandwidth()/2 - 10;
        else
          return yScale(yValue(d));
      }

      chart.enter().append("rect")
        .attr('y', d => rectY(d))
        .attr('width', d => {return xScale(xValue(d))})
        .attr('height', rectHeight )
        .attr("fill", fillRect)
        .on('mouseover', (i,d) => tooltipX.style("visibility", "visible"))
        .on('mousemove',(e,d)=>{
          return tooltipX.html(`<b>${yValue(d)}</b><br/>${commaSeparated(decimalPrecision(xValue(d)))}`).style("top", (e.pageY)+"px").style("left",(e.pageX)+"px");
        })
        .on('mouseout', ()=>tooltipX.style("visibility", "hidden"));


      chart.enter().append("text")
        .text(d => commaSeparated(decimalPrecision(xValue(d))))
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
        .attr("transform",`translate(0, ${dynamicRange})`)
        // .attr("transform", "translate(0," + (barSize*data.length) + ")")
      	.attr("class","axis")
  			.call(axisBottom(xScale).ticks(3))
        .style('font-size',11)
        
          
    }
  },[data,toggleStateBurden])
    
  const checkchange = (state,handle)=>{
    // if(trend){
    //   if(state === true){
    //     trend[0].style.height = "100vh";
    //   }
    //   else if(state === false){
    //     if(trend[0] != undefined)
    //     trend[0].style.height = "65vh";
    //   }
    // }
  }

  let table=[];
  if(data ){
    for(var i=0;i<data.length;i++){
      table.push({
        area:data[i].area_name,
        data:data[i].data_value
      })
    }
  }
     
  let title=graphTitle+ ',  '+ graphUnit+'()'

  return (
      <>
        <FullScreen  className="fullscreen_css" handle={screen}  onChange={checkchange}>
          <SideNavFirst table={table} id="svgBarArea" dataField="area" columnName="Area"  screen={screen} title={title}  componentRef={svgRef}/>
          <div className="hbar">
            <div className="hbar_svg" ref={trendWrapper}>
              <svg id="svgBarArea"  ref = {svgRef}></svg>
            </div>
          </div>
        </FullScreen>
      </>
  );
};