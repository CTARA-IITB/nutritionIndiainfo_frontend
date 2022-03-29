import React, { useRef,useState,useEffect } from 'react';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import SideNavFirst from "../SideNav/SideNavFirst";
import {
  scaleLinear,
  scaleBand,
  max,
  select,
  axisLeft,
  axisBottom
} from 'd3';
import fmt from 'indian-number-format'
import './Bar.css'

export const Bar = ({indicatorBar, graphTitle,graphTimeperiod, graphUnit,titleAreaName, toggleStateBurden, selLifecycle,selCategory,selIndicator})=>{
  const screen = useFullScreenHandle();
  let status = "By Background Characteristics";
  const listofSubgroup = ["Overall"," ","Male","Female","  ","Urban","Rural","   ","No Education","< 5 years completed","5-9 years completed","10-11 years completed","12+ years completed","    ","Poorest","Second","Middle","Fourth","Richest"];
  const svgRef = useRef()
  const componentRef = useRef();
  const [fullscreen,setFullscreen] = useState(false);

  const margin = {
    left:120,
    top: 70,
    right: 70,
    bottom: 60,
  };
  const [data, setData] = useState(null);
   
  let colorScale ='#eda143';
  let lightColor = '#F7D9B3';
  let arrObese = [91,95,104,92,96,105,21];
  let gBarTitle = `${graphTitle}, ${titleAreaName}, ${graphTimeperiod}`;

  if(selIndicator === 12 || selIndicator === 13 || selIndicator === 244){
    colorScale = '#a3c00f'; 
    lightColor = '#DAE59F';
  }
  else if(selIndicator === 19 || selIndicator === 20){
    colorScale = '#e53935'; 
    lightColor = '#F4AFAE';
  }
  else if(selIndicator === 17 || selIndicator === 18 || selIndicator === 245){
    colorScale = '#039be5'; 
    lightColor = '#9AD7F4';
  }
  else if(selIndicator === 107 || selIndicator === 108){
    colorScale = '#e53935'; 
    lightColor = '#F4AFAE';
  }
  else  if(arrObese.includes(selIndicator)){
    colorScale = '#7b1fa2'; 
    lightColor = '#CAA5D9';
  }
  else if(selIndicator === 123 || selIndicator === 26 || selIndicator === 125 || selIndicator === 1 || selIndicator === 71 || selIndicator === 239 || selIndicator === 248){
    colorScale = '#b71c1c'; 
    lightColor = '#E2A4A4';
  }
  else{
    colorScale = '#eda143'; 
    lightColor = '#F7D9B3';
  }
 //For One Decimel Precision    
 function decimalPrecision(d){
  let oneDecimel;
  if(typeof d !== 'undefined'){
    if(graphUnit !== 'Percent'){
      oneDecimel = fmt.format(d);
    }
    else { 
      oneDecimel =fmt.formatFixed(d, 1)
    }
    return oneDecimel;
  }
}  

  useEffect(() => {
  
    let cleanData = [];
    cleanData = indicatorBar.map(d =>{
      if(d.subgroup_name === "All"){
        d.subgroup_name = "Overall";
      }
      return d;
    }).filter(d => listofSubgroup.includes(d.subgroup_name))
    setData(cleanData);
    // eslint-disable-next-line
  }, []);

  
  gBarTitle = `${graphTitle}, ${titleAreaName}, ${graphTimeperiod}`;
 
  let windowWidth = window.screen.width;
  let windowHeight = window.screen.height;
  useEffect(()=>{
    select(".tooltipGBar").remove();
    let TOOLTIP_FONTSIZE;

    const svg = select(svgRef.current);
    

    if(windowWidth >= 480){
      // eslint-disable-next-line
      windowWidth = windowWidth/2;
      // eslint-disable-next-line
      windowHeight = windowHeight/2;
      TOOLTIP_FONTSIZE="12px";
    }else{
      TOOLTIP_FONTSIZE="8px";
      windowWidth = windowWidth + 100;
      windowHeight = windowHeight/2;
    }

    var tooltipGBar = select("#gbar_svg")
    .append("div")
    .attr("class", "tooltipGBar")
    .style("visibility", "hidden")
    .style("font-size",TOOLTIP_FONTSIZE)
    let { width, height } = {width:windowWidth,height:windowHeight}; 
       
    let innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;
    const aspect = width / height;

    const adjustedHeight = Math.ceil(width / aspect);
      svg.selectAll("*").remove();
      svg.attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox",  `0 0 ${width} ${adjustedHeight}`)

    const bar = svg.append("g")
                  .attr("transform",`translate(${margin.left},${margin.top})`);
    

        
    if(data && data.length >0){

      const yValue = d => d.subgroup_name;
      let xValue,maxVal;

      if(toggleStateBurden){
        xValue = d => d.data_value;
        maxVal = max(data, (d) => xValue(d));
      }  
      else{
        xValue = d => d.data_value_num;
        maxVal = max(data, (d) => xValue(d));
        // eslint-disable-next-line
        graphUnit ='Number';
      }

      const xScale = scaleLinear()
        .domain([0, maxVal])
        .range([0, innerWidth])
    
      const yScale = scaleBand()
        .domain(listofSubgroup)
        .range([0,innerHeight])
        .padding(0.1);
          
          
      bar.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", innerWidth/2)
        .attr("y", innerHeight + 50)
        .text(`${graphUnit}`)
        .style('font-size',13);
      
      let chart = bar.selectAll("rect").data(data);
      
      const fillRect = (d) =>{
        let darkSubgroup = ["Overall","Rural","Urban", "Poorest","Second","Middle","Fourth","Richest"]
        if(darkSubgroup.includes(d.subgroup_name))
          return colorScale;
        else
          return lightColor;
      }
      let TOOLTIP_TOP_OFFSET,TOOLTIP_LEFT_OFFSET;
      if(fullscreen){
        TOOLTIP_TOP_OFFSET = .6 * height;
        TOOLTIP_LEFT_OFFSET = 0;

      }
      else{
        TOOLTIP_TOP_OFFSET = 1.5 * height;
        TOOLTIP_LEFT_OFFSET = width;
      }
      
      chart.enter().append("rect")
      	.attr('y', d => yScale(yValue(d)))
      	.attr('width', d => {return xScale(xValue(d))})
      	.attr('height', yScale.bandwidth())
        .attr("fill", fillRect)
        .on('mouseover', (i,d) => tooltipGBar.style("visibility", "visible"))
        .on('mousemove',(e,d)=>{
          return tooltipGBar.html(`<b>${yValue(d)}</b><br/>${decimalPrecision(xValue(d))}`).style("top", (e.pageY) - TOOLTIP_TOP_OFFSET+"px").style("left",(e.pageX) - TOOLTIP_LEFT_OFFSET +"px");
        })
        .on('mouseout', ()=>tooltipGBar.style("visibility", "hidden"));
        

      chart.enter().append("text")
        .text(d => decimalPrecision(xValue(d)))
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
        .call(axisBottom(xScale).ticks(3)
        .tickFormat(function (d) {
          return fmt.format(d);
        }))
        .style('font-size',11)
    }
  },[data,toggleStateBurden,fullscreen])



  let table=[];
  if(data ){
    for(var i=0;i<data.length;i++){
      if(toggleStateBurden){
        if(data[i].data_value){
          table.push({
            subgroup:data[i].subgroup_name,
            data:decimalPrecision(data[i].data_value)
          })
        }
      }
      else{
        if(data[i].data_value_num){
          table.push({
            subgroup:data[i].subgroup_name,
            data:fmt.format(data[i].data_value_num)
          })
        }
      }
    }
  }

  // Change style for full screen

  const reportChange = (state, handle) => {
    setFullscreen(state);
    if(state === true){
      if( windowWidth > 780){
        document.getElementsByClassName("my-bar-title")[0].setAttribute('style', 'font-size: 1.5rem');
        document.getElementsByClassName("my-bar-subtitle")[0].setAttribute('style', 'font-size: 1rem;margin-top:10px');
      }
    }else{
     document.getElementsByClassName("my-bar-subtitle")[0].setAttribute('style', 'font-size: .55rem');
     document.getElementsByClassName("my-bar-title")[0].setAttribute('style', 'font-size: .875rem');

    }
  }; 

  return(
    <>
      <FullScreen  className="w-full bg-white h-full" handle={screen} onChange={reportChange}>
				<div className='relative w-full h-full'>
					<div className="block absolute w-full max-h-max right-5" style={{zIndex:1}}>
            <SideNavFirst table={table} id="svgBar" dataField="subgroup" columnName="Subgroup"  screen={screen} title={gBarTitle}  componentRef={ componentRef} selLifecycle={selLifecycle} selCategory ={selCategory} selIndicator={selIndicator}/>
          </div>
          <div className='relative  w-full pb-3 pt-1 pr-3 ' id="svgBar" ref={ componentRef}>
          <div className="absolute   right-5 left-5 mx-10 w-auto top-1">
            <div className="text-center  text-xs md:text-sm  font-bold my-bar-title">{`${gBarTitle}`}</div>
            <div className="text-center   text-xs my-bar-subtitle">{`${status}`}</div>
           </div>

            <div id="gbar_svg" className='block align-middle w-full h-full' >
              <svg ref = {svgRef} className="w-full  bg-white  border-black border-dashed object-scale-down"></svg>
            </div>
          </div>
        </div>
      </FullScreen>
    </>
  );
};