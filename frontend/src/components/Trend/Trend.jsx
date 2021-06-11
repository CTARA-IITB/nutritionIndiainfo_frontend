import React, { useState, useEffect,useRef } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import SideNavFirst from "../SideNav/SideNavFirst";
// import commaSeparated from "../../utils.js";
import "./Trend.css";
import {
  scaleLinear,
  max,
  min,
  scaleTime,
  timeParse,
  timeFormat,
  line,
  select,
  axisLeft,
  axisBottom
} from 'd3';

const tickLength = 8;
const margin = {
  left: 100,
  top: 50,
  right: 50,
  bottom: 150,
};


const useResizeObserver = ref => {
  const [dimensions, setDimensions] = useState(null);
  // console.log(typeof ref.current != 'undefined')
  useEffect(() => {
  if(typeof ref.current != 'undefined'){
    const observeTarget = ref.current;

    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        setDimensions(entry.contentRect);
      });
    });
    resizeObserver.observe(observeTarget);
    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }

  
  }, [ref.current]);
  return dimensions;
};
export const Trend = ({indicatorTrend, graphTitle, graphSubgroup, graphUnit, titleAreaName, toggleStateBurden,trend, selIndicator}) => { 

  const [data, setData] = useState(null);
  const svgRef = useRef();
  
  const [check,setCheck] = useState(true);

  const trendWrapper = useRef();
  const dimensions = useResizeObserver(trendWrapper);
  // console.log(trendWrapper)
  // console.log(dimensions)
  const screen = useFullScreenHandle();
  let colorScale;

  let arrObese = [91,95,104,92,96,105,21];
  if(selIndicator == 12 || selIndicator == 13)
    colorScale = '#a3c00f80'; 
  else if(selIndicator == 19 || selIndicator == 20)
    colorScale = '#e5393580'; 
  else if(selIndicator == 17 || selIndicator == 18)
    colorScale = '#039be580'; 
  else if(selIndicator == 107 || selIndicator == 108)
    colorScale = '#e5393580'; 
  else  if(arrObese.includes(selIndicator))
    colorScale = '#7b1fa280'; 
  else if(selIndicator == 123 || selIndicator == 124 || selIndicator == 125)
    colorScale = '#b71c1c80'; 
  else
    colorScale = '#eda14380'; 

  const parseTime = timeParse('%d-%b-%y');

	 
    const formatTime = timeFormat('%b-%y');
    const formatTooltipTime = timeFormat('%B-%Y');
    const formatTitleTime = timeFormat('%Y');


    

  useEffect(() => {
      let cleanData = [];
      indicatorTrend.map((d) => {
        if(typeof d.data_value != 'undefined'){
         	d.start_date = parseTime(d.start_date);
          d.end_date = parseTime(d.end_date);
          d["middle_date"] = new Date((d.start_date.getTime() + d.end_date.getTime())/2);
          d["timeperiod"] = d.timeperiod.split(" ")[0];
        	cleanData.push(d);
        }
      });
      

      cleanData = cleanData.sort(function (a, b) {  // sort the data according to start date.. specifically for AHS
        return a.start_date - b.start_date;
      });

      setData(cleanData);
  }, []);

  useEffect(()=>{
    select(".tooltip2").remove();

    let tooltip2 = select(".trend_svg").append("div")
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

    
    let { width, height } = dimensions||{width:windowWidth,height:windowHeight}; 
    // const width =500;
    // const height = 500;
    // const { width, height } = [,]; 
    // || trendWrapper.current.getBoundingClientRect();
   
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;
    svg.selectAll("*").remove();
    const bar = svg
        .attr("width", width)
    		.attr("height", height)
      	.append("g")
    		.attr("transform",`translate(${margin.left},${margin.top})`);
    
    

    if(data && data.length >0){

      let listofDate = [];
      data.map((d) => {
        listofDate.push(d.start_date);
        listofDate.push(d.end_date);
      });

      let min_d =  min(listofDate);
      let min_year = min_d.getFullYear();
      let min_month = min_d.getMonth();
      let min_day = min_d.getDate();
      let min_date = new Date(min_year, min_month-3, min_day);

      let max_d =  max(listofDate);
      let max_year = max_d.getFullYear();
      let max_month = max_d.getMonth();
      let max_day = max_d.getDate();
      let max_date = new Date(max_year, max_month+6, max_day);

      const xValue = d => d.middle_date;
      let yValue;
      if(toggleStateBurden)
        yValue = d => d.data_value;
      else
      {
      yValue = d => d.data_value_num;
      graphUnit ='Number';
      }

      const xScale = scaleTime()
    		.domain([min_date, max_date])
    		.range([0, innerWidth])
      
    	const yScale = scaleLinear()
   	 		.domain([0, max(data, (d) => yValue(d))])
    		.range([innerHeight, 0]);
      
       bar.append("text")
        .attr('x',width/2 -90)
        .attr('y',0)
        .style("text-anchor","middle")
        .style("font-size","13px")
        .style("font-weight","bold")
        .attr("dy", "-2em")
        .text(`${graphTitle},${graphUnit},${titleAreaName} ${formatTitleTime(min_date)}-${formatTitleTime(max_date)}`)
      
        
      bar.append("g")
      	.attr("class","axis")
        .call(axisLeft(yScale)
        .tickFormat(function (d) {
          // if ((d / 100000) >= 1) {
          //     d = d / 100000 + " Lakh";
          // }
          return commaSeparated(d);
      }))
        // (formatUnit))
        .style('font-size',12);
			
      let xaxis = bar.append("g")
      .attr("transform",`translate(0, ${innerHeight})`)
      	.attr("class","axis")
        .call(axisBottom(xScale).tickFormat(tick => formatTime(tick))).selectAll("text")
        .style('font-size',12)
        .attr("dx", () => {
          if(width <= 480)
           return "1.9em"
        })
        .attr("transform", () => {
          if(width <= 480)
          return "rotate(45)"
        });
        
        
      	
      
      bar.selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
        .attr("x", d => xScale(d.start_date))
        .attr("y", d => yScale(yValue(d)))
        .attr("width", d => xScale(d.end_date) - xScale(d.start_date))
        .attr("height", d => yScale(0) - yScale(yValue(d)))
        .attr("fill", colorScale)
      	.on('mouseover', (i,d) => {
        			tooltip2.transition().duration(500).style("opacity", 1);
              tooltip2.html(`<b>${d.timeperiod}</b> : ${commaSeparated(yValue(d))}</br><b>Start date</b> : ${formatTooltipTime(d.start_date)}</br><b>End date</b> : ${formatTooltipTime(d.end_date)}</div>`)
          		.style("left", xScale(d.middle_date) + 50 + "px")
          		.style("top", yScale(yValue(d)) + 100+"px");
              })
     .on('mouseout', ()=>{tooltip2.transition().duration(500).style("opacity", 0)});
      
      const lineGenerator = line()
    		.x(d => xScale(xValue(d)))
    		.y(d => yScale(yValue(d)));
    
    	bar.append('path')
    		.attr("d", lineGenerator(data))
      	.attr("class","trend-line")
      
      bar.selectAll("mytext").data(data).enter().append("text")
        .attr("x", function(d) { return xScale(xValue(d)); })
        .attr("y", d => yScale(yValue(d)))
        .attr("dy", "-.2em")
      	.style("text-anchor","middle")
      	.style("font-size","10px")
        .text(function(d) { return d.timeperiod; });
    }else{


      bar.append("text")
      .attr('x',width/2 -90)
      .attr('y',0)
      .style("text-anchor","middle")
      .style("font-size","13px")
      .style("font-weight","bold")
      .attr("dy", "-2em")
      .text(`${graphTitle},${graphUnit},${titleAreaName}`)

      // bar.append("text")
      // .attr("x",innerWidth/2)
      // .attr("y",innerHeight/2)
      // .attr("dx","-.4em")
      // .text("No data: please select another survey")
      // .style("text-anchor","middle")
      // .style("font-size","10px")
      // .style("font-weight","bold")
    }
    
    function commaSeparated(x) {
      return x.toLocaleString("en-IN");
  }
   
   
      
  },[data,dimensions,trendWrapper.current,toggleStateBurden])



  if (!data) {
    return <pre>Loading...</pre>;
  }
  let title=graphTitle+',  '+graphUnit+'('+graphSubgroup+')'

 
  
  const checkchange = (state,handle)=>{
    if(trend){
      if(state === true){
        trend[0].style.height = "100vh";
      }
      else if(state === false){
        if(trend[0] != undefined)
        trend[0].style.height = "50vh";
      }
    }
  }

  // const setScreen = ()=>{
  //   setHeight(window.screen.height/2);
  //   setWidth(window.screen.width/2);
  //   setCheck(!check)
  // }

  let table=[];
  if(data ){
    for(var i=0;i<data.length;i++){
      table.push({
        timeperiod:data[i].timeperiod,
        data:+data[i].data_value
      })
    }
  }


  return (
    <>
    <FullScreen  className="fullscreen_css" handle={screen}  onChange={checkchange}>
    <SideNavFirst table={table} id="svgTrend" dataField="timeperiod" columnName="Time Period"  screen={screen} title={title}  componentRef={svgRef}/>
    <div className="trend">
      <div className="trend_svg" ref={trendWrapper}>
      <svg id="svgTrend" width="100%" height="130%" ref = {svgRef}></svg>
    </div>
    </div>
    </FullScreen>
    </>
  );
}