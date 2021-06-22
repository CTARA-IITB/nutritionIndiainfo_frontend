import React, { useRef,useState,useEffect } from 'react';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import SideNav from "../SideNav/SideNav";
import {
  scaleLinear,
  scaleBand,
  max,
  select,
  axisLeft,
  axisBottom
} from 'd3';
import { commaSeparated } from '../../utils';

export const Bar = ({indicatorBar, graphTitle,graphTimeperiod, graphUnit, titleAreaName, toggleStateBurden, selIndicator})=>{

  const screen = useFullScreenHandle();
  const listofSubgroup = ["Overall"," ","Male","Female","  ","Low Coverage","Mild Coverage","High Coverage","   ","No Education","< 5 years completed","5-9 years completed","10-11 years completed","12+ years completed","    ","Poorest","Second","Middle","Fourth","Richest"];
  const svgRef = useRef();
  const trendWrapper = useRef();
  const margin = {
    left:160,
    top: 50,
    right: 80,
    bottom: 50,
  };
  const [data, setData] = useState(null);
   
  let colorScale ='#eda143';
  let lightColor = '#F7D9B3';
  let arrObese = [91,95,104,92,96,105,21];

  if(selIndicator == 12 || selIndicator == 13){
      colorScale = '#a3c00f'; 
      lightColor = '#DAE59F';
  }
  else if(selIndicator == 19 || selIndicator == 20){
      colorScale = '#e53935'; 
      lightColor = '#F4AFAE';
  }
  else if(selIndicator == 17 || selIndicator == 18){
      colorScale = '#039be5'; 
      lightColor = '#9AD7F4';
  }
  else if(selIndicator == 107 || selIndicator == 108){
      colorScale = '#e53935'; 
      lightColor = '#F4AFAE';
  }
  else  if(arrObese.includes(selIndicator)){
      colorScale = '#7b1fa2'; 
      lightColor = '#CAA5D9';
  }
  else if(selIndicator == 123 || selIndicator == 26 || selIndicator == 125){
      colorScale = '#b71c1c'; 
      lightColor = '#E2A4A4';
  }
  else{
      colorScale = '#eda143'; 
      lightColor = '#F7D9B3';
  }
    
  //For One Decimel Precision    
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

    useEffect(() => {
          let cleanData = [];
          cleanData = indicatorBar.map(d =>{
          if(d.subgroup_name === "All"){
              d.subgroup_name = "Overall";
          }
            return d;
          }).filter(d => listofSubgroup.includes(d.subgroup_name))
          setData(cleanData);
      }, []);


      useEffect(()=>{
        select(".tooltip4").remove();
    
        let tooltip4 = select(".trend_svg").append("div")
        .attr("class", "tooltip2")
        .style("opacity", 0);
    
        const svg = select(svgRef.current);
        let windowWidth = window.screen.width;
        let windowHeight = window.screen.height;
    
        if(windowWidth >= 480){
          windowWidth = windowWidth/2;
          windowHeight = windowHeight/2;
        }else{
          windowWidth = windowWidth + 100;
          windowHeight = windowHeight/2;
        }
        let { width, height } = {width:windowWidth,height:windowHeight}; 
       
        let innerHeight = height - margin.top - margin.bottom;
        const innerWidth = width - margin.left - margin.right;
        const aspect = width / height;
        const adjustedHeight = Math.ceil(width / aspect)*1.1;
              svg.selectAll("*").remove();
              svg.attr("preserveAspectRatio", "xMinYMin meet")
              .attr("viewBox",  `0 0 ${width} ${adjustedHeight}`)
        const bar = svg
                .append("g")
                .attr("transform",`translate(${margin.left},${margin.top})`);
        
        
    let gBarTitle;
    if (( toggleStateBurden == true)) {
        gBarTitle = `${graphTitle}, ${titleAreaName}, ${graphTimeperiod}`;
        }
        else{
        gBarTitle =  `${graphTitle}, ${titleAreaName}, ${graphTimeperiod}`;
        }
        
        if(data && data.length >0){
    
          
        const yValue = d => d.subgroup_name;
        let xValue;
          if(toggleStateBurden)
            xValue = d => d.data_value;
          else
          {
          xValue = d => d.data_value_num;
          graphUnit ='Number';
          }

          const xScale = scaleLinear()
          .domain([0, max(data, xValue)])
          .range([0, innerWidth])
    
      const yScale = scaleBand()
              .domain(listofSubgroup)
          .range([0,innerHeight])
        .padding(0.1);;
          
           bar.append("text")
            .attr('x',width/2 -90)
            .attr('y',0)
            .style("text-anchor","middle")
            .style("font-size","13px")
            .style("font-weight","bold")
            .attr("dy", "-2em")
            .text(`${gBarTitle}`)
          

            bar.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", innerWidth/2)
            .attr("y", innerHeight + 50)
            .text(`${graphUnit}`)
            .style('font-size',13);
   
            
      let chart = bar.selectAll("rect").data(data);
      
      const fillRect = (d) =>{
        let darkSubgroup = ["Overall","Low Coverage","Mild Coverage","High Coverage","Poorest","Second","Middle","Fourth","Richest"]
        if(darkSubgroup.includes(d.subgroup_name))
          return colorScale;
        else
          return lightColor;
      }
      chart.enter().append("rect")
      	.attr('y', d => yScale(yValue(d)))
      	.attr('width', d => {return xScale(xValue(d))})
      	.attr('height', yScale.bandwidth())
        .attr("fill", fillRect)
      	.on('mouseover', (i,d) => {
        			tooltip4.transition().duration(500).style("opacity", 1);
              tooltip4.html(`<b>${yValue(d)}</b><br/>${commaSeparated(decimelPrecision(xValue(d)))}`)
          		.style("left", width + xScale(xValue(d)) + margin.left -60+ "px")
          		.style("top", height + yScale(yValue(d))+ margin.top +140+"px");
              })
     .on('mouseout', ()=>{tooltip4.transition().duration(500).style("opacity", 0)});

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
        }
        
       
    
       
          
      },[data,toggleStateBurden])


    const checkchange = (state,handle)=>{
        // if(gbar){
        //   if(state === true){
        //     gbar[0].style.height = "100vh";
        //   }
        //   else if(state === false){
        //     if(gbar[0] != undefined)
        //     gbar[0].style.height = "65vh";
        //   }
        // }
      }

      
  let table=[];
  if(data ){
    for(var i=0;i<data.length;i++){
      table.push({
        subgroup:data[i].subgroup_name,
        data:+data[i].data_value
      })
    }
  }

  let title=graphTitle+ ',  '+ graphUnit+'()'

 
    return(
        <>
        <FullScreen  className="fullscreen_css" handle={screen}  onChange={checkchange}>
        <SideNav table={table} id="svgGBar" dataField="subgroup" columnName="Subgroup"  screen={screen} title={title}  componentRef={svgRef}/>
        <div className="gbar">
          <div className="gbar_svg" ref={trendWrapper}>
          <svg id="svgGBar"   ref = {svgRef}></svg>
        </div>
        </div>
        </FullScreen>
        </>
    );
};