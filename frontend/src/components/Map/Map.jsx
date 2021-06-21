import React, { useRef, useEffect } from 'react';
import _ from 'lodash';
import useResizeObserver from "../../useResizeObserver";
import { legendColor } from 'd3-svg-legend'
import { Button } from 'react-bootstrap';
import * as turf from 'turf';
import {NFHS5} from "../../constants";

import { geoMercator, format,geoCircle ,geoPath, scaleQuantize, scaleThreshold,extent, select, schemeReds, geoCentroid, scaleOrdinal } from 'd3';
import {poissonDiscSampler} from '../../utils'
import { InfoCircleFill } from 'react-bootstrap-icons';
import { Switch } from 'antd';
import SideNavFirst from "../SideNav/SideNavFirst";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { AnimateOnChange } from 'react-animation';
import { json } from 'd3';
import "./Map.css";
import { commaSeparated } from "../../utils.js";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';


export const Map = ({ 
  boundaries, 
  selIndiaData,
  setLevel,  
  level, 
  setSelArea, 
  unit, 
  unitName, 
  selArea, 
  searchRef, 
  setFilterDropdownValue, 
  areaDropdownOpt, 
  selIndicator, 
  indicatorSense,
  isLevelThree,
  switchDisplay, setSwitchDisplay,
  selTimeperiod, parentArea, toggleState, setToggleState, setSelIndiaData, setIsLevelThree, buttonText, changeText, areaName,titleAreaName,
  selStateData, setSelStateData, selDistrictsData, areaChange,
  graphTitle,graphTimeperiod,graphUnit,
  toggleStateBurden, setToggleStateBurden, burdenbuttonText, changeBurdenText,map,
  drillDirection,setDrillDirection

}) => {
  let geometry = boundaries.new_state;
  let mapTitle;
  const svgRef = useRef();
  const svgLegRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  function removeShake() {
    let element = document.getElementById("info-msg");
    element.classList.remove("shake");
  }

  const handleClick = () => {
    setToggleState(!toggleState);
    let text = null;
    if (buttonText === 'District')
      text = 'state';
    else
      text = 'District';
    changeText(text);
  }
 
  if ((unit == 1 && toggleStateBurden == true)) {
    mapTitle = `${graphTitle}, ${titleAreaName}, ${graphTimeperiod}`;
  }
  else{
    mapTitle =  `${graphTitle}, ${titleAreaName}, ${graphTimeperiod}`;
  }

  function thresholdLabels({i, genLength, generatedLabels,labelDelimiter}) {
    if (i === 0) {
      const values = generatedLabels[i].split(` ${labelDelimiter} `)
      return `Less than ${values[1]}`
    } else if(i == 1 || i== 2 || i== 3)
    {
      const values = generatedLabels[i].split(` ${labelDelimiter} `)
      return `${values[0]} to  ${values[1] -0.1}`
    }
    else if (i === genLength -1) {
      const values = generatedLabels[i].split(` ${labelDelimiter} `)
      return ` ≥ ${values[0]}`
    }
    return generatedLabels[i]
  };


  //merge geometry and data

  function addProperties(geojson, data) {
   
    let newArr = _.map(data, function (item) {
      return {
        areacode: item.area_code,
        areaname: item.area_name,
        area_id: item.area_id,
        dataValue: item.data_value,
        dataValueNum: item.data_value_num,

      }
    });

      let mergedGeoJson = _.map(geojson, function(item) {
        return _.assign(item, _.find(newArr, ['areacode', item.properties.ID_]));
    });

    return mergedGeoJson;
  }

  function removeShake() {
    let element = document.getElementById("info-msg");
    element.classList.remove("shake");
  }
  let statusMsg = "";

  let data = selIndiaData;
  let warning;
  if (level === 1)
  {
    if (toggleState === true) {

      if (selTimeperiod === NFHS5){    // change state boundaries when timeperiod is NFHS5
        geometry = boundaries.new_state;
        warning="Administrative Boundaries as per NFHS5(2019-20)"
      }   
      else{
        geometry = boundaries.state;
        warning="Administrative Boundaries as per NFHS4(2015-16)"
      }
      
      data = selIndiaData;
    }
    else {

        if(selTimeperiod === NFHS5){
          geometry = boundaries.new_dist;
          warning="Administrative Boundaries as per NFHS5(2019-20)"

        }
        else{
          geometry = boundaries.dist;
          warning="Administrative Boundaries as per NFHS4(2015-16)"

        }
      data = selDistrictsData;
    }
    statusMsg = (toggleState)?'Click on map to select state':'';
  }
  else{
     data = selStateData;
    if(null!== selStateData && selStateData.length > 0)
    {
      if(level === 2){
        statusMsg=" Click on map to select distirct or click on back button go back to India"
      }else if(level === 3){
        statusMsg=`Click on map to select district or click back button to go back to state`
      }
    }
    if(selTimeperiod == NFHS5)
    {
      let features = boundaries.new_dist.features.filter(feature => feature.properties.NAME2_ === areaName); 
      geometry = {type: "FeatureCollection",features}
      warning=""

    }
    else{
      let features = boundaries.dist.features.filter(feature => feature.properties.NAME2_ === areaName); 
      geometry = {type: "FeatureCollection",features}
      warning="Administrative Boundaries as per NFHS4(2015-16)"
    }
  }
  select(".tooltip").remove();

  let tooltip = select(".map_svg").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  useEffect(() => {
    const svg = select(svgRef.current);

    // const legend = select(svgRef.current)
    let windowWidth = window.screen.width;
    let windowHeight = window.screen.height;

     if(windowWidth >= 480){
      windowWidth = windowWidth/2;
      windowHeight = windowHeight/2;
    }else{
      windowWidth = windowWidth+200 ;
      windowHeight = windowHeight;
    }
    const { width, height } = {width:windowWidth,height:windowHeight}; 
    

  const aspect = width / height;
    const adjustedHeight = Math.ceil(width / aspect)*1.1;
 
   console.log(width)
   
    
    svg.selectAll("*").remove();
    svg.attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox",  `0 0 ${width} ${adjustedHeight}`)

   
    let title = svg.append("text").text(`${mapTitle}`)
      .style("text-anchor","middle")
      .style("font-size","13px")
      .style("font-weight","bold")
      .attr("dy", "-2em")
.attr("class","map_title")      .attr('transform',`translate(${width/2},40)`);

      svg.append("text").text(`${warning}`)
      .style("text-anchor","middle")
      .style("font-size","11px")
      .attr("dy", "-2.5em")


      .attr('transform',`translate(${width/2},60)`);
    if(width <= 480){
      title = title.style("font-size", (width * 0.0025) + "em")
    }
    console.log(selArea)
    //  let projection = geoMercator().fitSize([width, adjustedHeight/1.1], geometry);
    let projection;
    if(selArea == 28 || selArea == 8 ){
     projection = geoMercator().fitSize([width/1.9, adjustedHeight/1.2], geometry);

    }
    else{
     projection = geoMercator().fitSize([width/1.2, adjustedHeight/1.2], geometry);
    }
    const pathGenerator = geoPath(projection);
    let geojson = geometry.features;
    let mergedGeometry = addProperties(geojson, data);
    let c2Value;
    let color_range
    if ((unit == 1 && toggleStateBurden == true) || (unit == 2))
    {
      c2Value = d => d.dataValue;
      color_range = _.map(data, d => {
        return +d.data_value
      });
    }
    else{
      c2Value = d => d.dataValueNum;
      color_range = _.map(data, d => {
        return +d.data_value_num
      }); 
    }
    
    let sum = color_range.reduce(function(a, b){
      if (isNaN(b)){
        b=0;
      }
      return a + b;
  }, 0);
    let dotVal = Math.round(sum/4000);
    let [min, max] = extent(color_range);
  
    let low;
    let medium;
    let high;
    let highest;
    let sampleCategoricalData;

    let arr20to80 = [31,11,28,6,7,37,51,42,84,23,25,32,99,100,70,76,77,78,75]
    if (selIndicator == 19 || selIndicator == 21 || selIndicator == 105) {
      low = 5.0;
      medium = 10.0;
      high = 15.0;
      highest = 20.0
      sampleCategoricalData = ["<5%", "5-9.9%", "10-14.9%", "15-19.9%", ">20%", "No Data"]

    } else if (selIndicator == 17 || selIndicator == 18 || selIndicator == 12 || selIndicator == 13) {
       low = 10.0;
       medium = 20.0;
       high = 30.0;
       highest = 40.0;
      sampleCategoricalData = ["<10%", "10-19.9%", "20-29.9%", "30-39.9%", ">40%", "No Data"]

    } else if(selIndicator == 71 || selIndicator == 26 )
    {
      low = 5.0;
      medium = 20.0;
      high = 40.0;
      highest = 60.0;
      sampleCategoricalData = ["<5%", "5-19.9%", "20-39.9%", "40-59.9%", ">60%", "No Data"]

    } else if(selIndicator == 20 || selIndicator == 108)
    {
      low = 1.0;
      medium = 2.0;
      high = 5.0;
      highest = 10.0;
      sampleCategoricalData = ["<1%", "1-1.9%", "2-4.9%", "5-9.9%", ">10%", "No Data"]

     }else if(selIndicator == 107)
    {
      low = 0.1;
      medium = 0.5;
      high = 1;
      highest = 2.5;
      sampleCategoricalData = ["<0.1%", "0.1-0.49%", "0.5-0.9%", "1-2.49%", ">2.5%", "No Data"]

    }else if(selIndicator == 89)
    {
      low = 5.0;
      medium = 10.0;
      high = 20.0;
      highest = 30.0;
      sampleCategoricalData = ["<5%", "5-9.9%", "10-19.9%", "20-29.9%", ">30%", "No Data"]

    }else if(arr20to80.includes(selIndicator))
    {
      low = 20.0;
      medium = 40.0;
      high = 60.0;
      highest = 80.0;
      sampleCategoricalData = ["<20%", "20-39.9%", "40-59.9%", "60-79.9%", ">80%", "No Data"]

    }
    
  
    let colorScale;
  let colorScale_new;
    let colorScale2;
    let arrsuw = [19,21,17,18,12,13,71,26,20,108,107,89,31,11,28,6,7,37,51,42,84,23,25,32,99,100,70,76,77,78,75]; 
    if (unit == 1  && toggleStateBurden == true)
    {
    if(indicatorSense == 'Positive')
    {
    colorScale2 = scaleThreshold().domain([low, medium, high, highest])
    .range(["#8e0000", "#fe0000", "#ffc000", "#ffff00", "#00af50"]); 
    if(typeof sampleCategoricalData != 'undefined'){
      colorScale_new = scaleOrdinal().domain(sampleCategoricalData)
      .range(["#8e0000", "#fe0000", "#ffc000", "#ffff00", "#00af50","#A9A9B0"]);
    }
    }
    else{
      colorScale2 = scaleThreshold().domain([low, medium, high, highest])
    .range(["#00af50", "#ffff00", "#ffc000", "#fe0000", "#8e0000"]); 
      if(typeof sampleCategoricalData != 'undefined'){
      colorScale_new = scaleOrdinal().domain(sampleCategoricalData)
      .range(["#00af50", "#ffff00", "#ffc000", "#fe0000", "#8e0000","#A9A9B0"]);
      }

  
    }

    let colorScale4 = scaleQuantize()
      .domain([min, max])
      .range(["#00af50", "#ffff00", "#ffc000", "#fe0000", "#8e0000"])

    let colorScale4_p = scaleQuantize()
      .domain([min, max])
      .range(["#8e0000", "#fe0000", "#ffc000", "#ffff00", "#00af50"])

      if (arrsuw.includes(selIndicator)) {
      colorScale = colorScale2;
    }
    else if (indicatorSense === 'Negative') {
      colorScale = colorScale4;
      colorScale_new = colorScale4;

    } else if (indicatorSense === 'Positive') {
      colorScale = colorScale4_p;
      colorScale_new = colorScale4_p;

    }
    
  }
  else{
      let arrObese = [91,95,104,92,96,105,21];
      if(selIndicator == 12 || selIndicator == 13)
        colorScale = '#a3c00f'; 
      else if(selIndicator == 19 || selIndicator == 20)
        colorScale = 'red'; 
      else if(selIndicator == 17 || selIndicator == 18)
        colorScale = '#039be5'; 
      else if(selIndicator == 107 || selIndicator == 108)
        colorScale = '#e35829'; 
      else  if(arrObese.includes(selIndicator))
        colorScale = '#7b1fa2'; 
      else if(selIndicator == 123 || selIndicator == 26 || selIndicator == 125)
        colorScale = '#b71c1c'; 
      else
        colorScale = '#eda143'; 

  }
    const onMouseMove = (event, d) => {
      if (typeof c2Value(d) != 'undefined') {
        tooltip.style("opacity", 0);
        tooltip.style("opacity", .9);
        tooltip.html("<b>" + d.areaname + "</b><br><b></b>" + commaSeparated(c2Value(d)))
          .style("left", event.clientX + "px")
          .style("top", event.clientY - 30 + "px")
          .style("font-size","12px");
      }
    };
    if (unit == 1  && toggleStateBurden == true)
    {  
    svg
      .selectAll(".polygon")
      .attr("width", width)
    		.attr("height", height)
      .data(mergedGeometry)
      .join("path").attr("class", "polygon")
      .style("fill", d => {
        if (unit === 2)
          return "#fff";
        else if (typeof c2Value(d) != "undefined")
          return colorScale(c2Value(d));
        else
          return "#A9A9B0";
      })
      .style("opacity", d => {
        if (d.area_id !== parseInt(selArea) && isLevelThree) {
          return ".2"
        }
      })
      .on("mousemove", (i, d) => onMouseMove(i, d))
      .on("mouseout", function (d) {
        tooltip
          .style("opacity", 0);
      })
      .on('click', (i, d) => {
        if(toggleState){
          tooltip.style('opacity', 0);
          if (typeof c2Value(d) != "undefined") {
              areaChange(d.area_id.toString());
              if(level === 1){
                // console.log("LEVEL 2");
                setLevel(2);
              }else if(level === 2){
                setLevel(3);
                // console.log("LEVEL 3"); 
                setIsLevelThree(true);
              }else if(level === 3){
                setLevel(3);
                // console.log("STILL IN LEVEL 3");
              }
  
           
            }
        }
    
      })
  
      .attr("d", feature => pathGenerator(feature))
      .attr('transform',`translate(100,50)`);

   

  

    }

    else{

      for(let i =0;i<mergedGeometry.length;i++){
        draw_circles(mergedGeometry[i]);}
      svg
      .selectAll(".polygon")
      .data(mergedGeometry)
      .join("path").attr("class", "polygon")
      .style("fill", "#fff")
      
      .attr("fill-opacity","0")
      .style("opacity", d => {
        if (d.area_id !== parseInt(selArea) && isLevelThree) {
          return ".2"
        }
      })
      .on("mousemove", (i, d) => onMouseMove(i, d))
      .on("mouseout", function (d) {
        tooltip
           
          .style("opacity", 0);
      })
  
      .on('click', (i, d) => {
        if(toggleState){
          tooltip.style('opacity', 0);

            if (typeof c2Value(d) != "undefined") {
              if(level === 1){
                areaChange(d.area_id.toString());
                setLevel(2);
                setDrillDirection(true);
              }else if(level === 2 && drillDirection){
                setIsLevelThree(true);
                areaChange(d.area_id.toString());
                setLevel(3);
              }else if(level === 3){
                areaChange(""+parentArea);
                setLevel(2);
                setDrillDirection(false);

              }else if(level === 2 && !drillDirection){
                areaChange("1");
                setLevel(1);
                setDrillDirection(true);
              }
            }
        }
    
      })
      .attr("d", feature => pathGenerator(feature))
      .attr('transform',`translate(100,50)`);

      function draw_circles(d) {
        let bounds = pathGenerator.bounds(d);
        let width_d = bounds[1][0] - bounds[0][0];
        let height_d = (bounds[1][1] - bounds[0][1])/2;
        
        let n;
        let data_value_num;
        if(unit == 2)
        {
          n = d.dataValue / (dotVal);
          data_value_num = d.dataValue
        }
        else{
          n = d.dataValueNum / (dotVal);
          data_value_num = d.dataValueNum
        }
         

        if (typeof data_value_num !== 'undefined' && data_value_num > 0 
&& isFinite(width_d) && isFinite(height_d))

        {
      
        let randomPointsOnPolygon = require('random-points-on-polygon');
         
        let points = randomPointsOnPolygon(n, d);
        for(let i =0;i<points.length;i++){
     

        }
        let r,sw;
        if(height <= 550){
        r = .8;
        }
        else if(height > 800){
          r =2;

        }else{
          r=1.5
        }
      
        svg
        .selectAll("myCircles")
        .data(points)
        .enter()
        .append("circle")
          .attr("cx", function(d){ return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0] })
          .attr("cy", function(d){ return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1] })
          .attr("r",r)
          .style("fill", colorScale)
          .style("stroke", "#4a4740")
          .style("stroke-width",.3)
          .style('stroke-opacity',1)
          .style('fill-opacity',0.8)
          .attr('transform',`translate(100,50)`)
      
        
   
        }
      
      }

    }
if(width < 680 && selArea == 1){
    svg.append("g")
      .attr("class", "legendQuant")
        .attr("transform", `translate(${width-100},${adjustedHeight-450})`)}
        else{
          svg.append("g")
          .attr("class", "legendQuant")
            .attr("transform", `translate(${width-100},${adjustedHeight- 220})`)}
        

    let formatter = format(".1f");
    let myLegend;
   
    if ((unit == 1  && toggleStateBurden == false) || unit == 2) 
    {
      
      svg.select(".legendQuant").append('text').text("1 dot =" + dotVal).style("font-size", "14px").attr("font-weight", "bold").attr("alignment-baseline","middle");
    }
    else{
       if (!arrsuw.includes(selIndicator)) {
      myLegend = legendColor()
      .labelFormat(formatter)
      .title(`${unitName}`)
      .titleWidth(180)
      .scale(colorScale_new);
    } 
    else{
      myLegend = legendColor()
      .labelFormat(formatter)
      .title(`${unitName}`)
      .titleWidth(180)
      .scale(colorScale_new);
    }

      svg.select(".legendQuant")
     
      .call(myLegend);

      
    }
    if((level == 1 && (null== selIndiaData || selIndiaData.length == 0)) || ((level == 2 || level == 3) && (null  == selStateData || selStateData.length == 0)))
     {
      svg.append("text").text("No districts data: please select another survey")
         .style("text-anchor", "middle")
         .style("font-weight","bold")
         .style("fill", "red")
         .attr('transform',`translate(${width/2}, ${height/2})`);
     }
 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit,geometry, dimensions, data, toggleStateBurden])

  let switchButton;

  if(switchDisplay && level === 1){
    switchButton = <div><Button className={`req_button ${!toggleState  && 'req_button_light'}` }  active onClick={()=>{ setToggleState(true)}}  size="sm">State Map</Button> 
    <Button className={`req_button ${toggleState  && 'req_button_light'}` } onClick={()=>{ setToggleState(false)}} size="sm">District Map</Button> </div>
  }else{
    switchButton= null;
  }
 
  const screen = useFullScreenHandle();

  const checkchange = (state,handle)=>{
    if(map){
      if(state === true){
        map[0].style.height = "100vh";
        // map[0].style.transform =translate('100','0')
      }
      else if(state === false){
        if(map[0] != undefined){}
        map[0].style.height = "60vh";

      }
    }
  }
  let table=[];
  if(data){
    for(let i=0;i<data.length;i++){
        table.push({
            area:data[i].area_name,
            data:+data[i].data_value+" ("+graphTimeperiod + ")",
        })
    }
  }

  const handleBackButton = () =>{
    if(level === 3){
      // setLevel(2);
      // console.log("LEVEL 2");
      areaChange(""+parentArea);
      // areaChange()
    }
    if(level === 2){
      // console.log("LEVEL 1"); 
      areaChange("1");
    }
  }

  let backButton;
  if(level !== 1)  
    backButton = <Button className={`toggle_button`} active onClick={handleBackButton}  size="sm"><ArrowBackIcon style={{color:'#AF5907',fontSize:'20px'}}/></Button> 

  return (
    <>
      <FullScreen className="fullscreen_css" handle={screen} onChange={checkchange}>
      <SideNavFirst table={table} id="svgMap" dataField="area" columnName="Area" screen={screen} title={mapTitle} timePeriod={graphTimeperiod} componentRef={svgRef}/>
      <div className="map" >
          
          <div  className="map_svg" ref={wrapperRef}>
            <svg  id="svgMap"  ref={svgRef} ></svg>

          </div>
    
    <div className="map_req">
      <div className="map_req_button">
        {switchButton}
        {backButton}
      </div>
      
      <div className="map_req_text">
          <div id="info-msg" className="msg">{statusMsg}</div>
      </div>
    </div>
  </div>

    </FullScreen>  
    </>
  )
};