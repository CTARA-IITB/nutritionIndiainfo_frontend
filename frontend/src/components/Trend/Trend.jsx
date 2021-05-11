import React, { useState, useEffect,useRef } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import SideNavFirst from "../SideNav/SideNavFirst";
import "./Trend.css";
import {
  scaleLinear,
  max,
  min,
  scaleTime,
  timeParse,
  timeFormat,
  line,
  select
} from 'd3';

// const width = window.screen.width/2;
// const height = window.screen.height/2;
const tickLength = 8;
const margin = {
  left: 100,
  top: 50,
  right: 50,
  bottom: 100,
};
export const Trend = ({indicatorTrend, graphTitle, graphSubgroup, graphUnit, areaName, toggleStateBurden}) => { 

  const componentRef = useRef();
  const [data, setData] = useState(null);
  const [height,setHeight] = useState(window.screen.width/2);
  const [width,setWidth] = useState(window.screen.height/2);
  const [check,setCheck] = useState(true);
  const screen = useFullScreenHandle();

  const parseTime = timeParse('%d %b %y');
	 let tooltip2 = select("body").append("div")
    .attr("class", "tooltip2")
    .style("opacity", 0);
  
    const formatTime = timeFormat('%b-%y');
    const formatTooltipTime = timeFormat('%B-%Y');
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

  useEffect(() => {
      let cleanData = [];
      indicatorTrend.map((d) => {
        if(typeof d.data_value != 'undefined'){
         	d.start_date = parseTime(d.start_date);
          d.end_date = parseTime(d.end_date);
          d["middle_date"] = new Date((d.start_date.getTime() + d.end_date.getTime())/2);
        	cleanData.push(d);
        }
      });
      setData(cleanData);
  }, []);


  if (!data) {
    return <pre>Loading...</pre>;
  }
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

const xScale = scaleTime()
  .domain([min_date, max_date])
  .range([0, innerWidth]);

const yScale = scaleLinear()
  .domain([0, max(data, (d) => d.data_value)])
  .range([innerHeight, 0]);


const xValue = d => d.middle_date;
const yValue = d => d.data_value;

const lineGenerator = line()
.x(d => xScale(xValue(d)))
.y(d => yScale(yValue(d)));
     
let xAxis = (
  <line
    x1={0}
    y1={0}
    x2={0}
    y2={innerHeight}
    stroke="#E5E5E5"
  ></line>
);

let yAxis = (
  <line
    x1={0}
    y1={innerHeight}
    x2={innerWidth}
    y2={innerHeight}
    stroke="#E5E5E5"
  ></line>)

  let heading = (
    <text x={width/2 -200} style={{ textAnchor: 'start',fontSize:"13",fontWeight:"bold" }}> 
    
    {graphTitle},  {graphUnit}, {areaName}</text>
  )
  
  let title=graphTitle+',  '+graphUnit+'('+graphSubgroup+')'
  
  const checkchange = ()=>{
    if(data!='undefined'){
        setHeight(window.screen.height);
        setWidth(window.screen.width);
        setCheck(!check)
    }
    
  }

  const setScreen = ()=>{
    setHeight(window.screen.height/2);
    setWidth(window.screen.width/2);
    setCheck(!check)
  }

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
    <FullScreen  className="fullscreen_css" handle={screen}  onChange={()=>{
      if(check)setScreen();
      else checkchange(); 
    }}>
    <SideNavFirst table={table} dataField="timeperiod" columnName="Time Period" id="trend" screen={screen} title={title}  componentRef={componentRef}/>
    <svg id="svgTrend" width={width} height={height} ref={componentRef}>
      <g
        transform={`translate(${margin.left},${margin.top})`}
      >
        <path d={lineGenerator(data)}></path>							// Draw line Graph
        {heading}
        
        {xAxis} 					//Draw x axis line
        {yAxis} 					//Draw y axis line

        {xScale.ticks().map((tickValue) => (					//Draw x axis ticks
          <g
            transform={`translate(${xScale(tickValue)}, 0)`}
            key={tickValue}
          >
         <line y1={innerHeight} y2={innerHeight+ tickLength} stroke="#E5E5E5"></line>

            <text
              dy=".9em"
              style={{ textAnchor: 'middle', fontSize:"10" }}
              y={innerHeight + 3}
            >
              {formatTime(tickValue)}
            </text>
          </g>
        ))}

        {yScale.ticks().map((tickValue) => (						//Draw y axis ticks
          <g key={tickValue}>
             <line
              x1={-tickLength}
              y1={yScale(tickValue)}
              x2={0}
              y2={yScale(tickValue)}
              stroke="#E5E5E5"
            ></line>
            <text
              x={0}
              y={yScale(tickValue)}
              style={{ textAnchor: 'end',fontSize:"10" }}
              x={-9}
              dy=".32em"
              
            >
              {tickValue}
            </text>
          </g>
        ))}

        {data.map((d) => (								//Draw Rectangle Bars
          <g key={d.timeperiod}>
          <rect
            fill="rgba(142,209,26,.5)"				
            y={yScale(d.data_value)}
            x={xScale(d.start_date)}
            height={yScale(0) - yScale(d.data_value)}
            width={
              xScale(d.end_date) - xScale(d.start_date)
            }
            
            onMouseOver={() =>{
        			tooltip2.transition().duration(500).style("opacity", 1);
              tooltip2.html(`${d.timeperiod}:${d.data_value}</br>start date:${formatTooltipTime(d.start_date)}</br>end date:${formatTooltipTime(d.end_date)}</div>`)
          		.style("left", xScale(d.middle_date) + 1000 + "px")
          		.style("top", yScale(d.data_value) + 250+"px")
             ;
              }}
            
            onMouseOut={()=>{tooltip2.transition().duration(500).style("opacity", 0)}}
          />
            <text x={xScale(d.middle_date)} 							//lable on top of bar
                 	y={yScale(d.data_value)}							
              		style={{ textAnchor: 'middle',fontSize:'12' }}
              		dy="-.2em"
              >{d.timeperiod}</text>
          </g>
        ))}
      </g>
    </svg>
    </FullScreen>
    </>
  );
}