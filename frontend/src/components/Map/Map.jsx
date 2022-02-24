import React, { useRef, useEffect,useState } from 'react';
import _ from 'lodash';
import useResizeObserver from "../../useResizeObserver";
import { legendColor } from 'd3-svg-legend'
import { Button } from 'react-bootstrap';
import {NFHS5} from "../../constants";
import { geoMercator, format ,geoPath, scaleQuantize, scaleThreshold,extent, select, scaleOrdinal } from 'd3';
import SideNavFirst from "../SideNav/SideNavFirst";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import "./Map.css";
import fmt from 'indian-number-format'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

export const Map = ({ 
  boundaries, 
  selIndiaData,
  setLevel,  
  level, 
  unit, 
  unitName, 
  selArea, 
  selLifecycle,
  selCategory,
  selIndicator, 
  indicatorSense,
  isLevelThree,
  switchDisplay, 
  selTimeperiod, 
  parentArea, 
  toggleState, 
  setToggleState, 
  setIsLevelThree, 
  areaName,
  titleAreaName,
  selStateData, 
  selDistrictsData, 
  areaChange,
  graphTitle,
  graphTimeperiod,
  graphUnit,
  toggleStateBurden
}) => {



  let geometry = boundaries.new_state;
  let mapTitle;
  const svgRef = useRef();
  const wrapperRef = useRef();
  const componentRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  let [offset,setOffset] = useState(false);
  if (((unit === 1 || unit === 4 || unit === 3 || unit === 5 || unit === 6) && toggleStateBurden === true)) {
    mapTitle = `${graphTitle}, ${titleAreaName}, ${graphTimeperiod}`;
  }
  else{
    mapTitle =  `${graphTitle}, Number, ${titleAreaName}, ${graphTimeperiod}`;
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
  
  //merge geometry and data

  function addProperties(geojson, data) {
    let newArr = _.map(data, function (item){
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

  let statusMsg = "";
  let data = selIndiaData;
  let warning;

  if (level === 1)
  {
    if (toggleState === true) {

      if (selTimeperiod === NFHS5){    // change state boundaries when timeperiod is NFHS5
        geometry = boundaries.new_state;
        warning="Administrative Boundaries as per NFHS5 2019-20"
      }   
      else{
        geometry = boundaries.state;
        warning="Administrative Boundaries as per NFHS4 2015-16"
      }
      
      data = selIndiaData;
    }
    else {

        if(selTimeperiod === NFHS5){
          geometry = boundaries.new_dist;
          warning="Administrative Boundaries as per NFHS5 2019-20"

        }
        else{
          geometry = boundaries.dist;
          warning="Administrative Boundaries as per NFHS4 2015-16"

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
        statusMsg=" Click on map to select district \n or back to return"
      }else if(level === 3){
        statusMsg=`Click on map to select district \n or back to return`
      }
    }
    if(selTimeperiod === NFHS5)
    {
      let features = boundaries.new_dist.features.filter(feature => feature.properties.NAME2_ === areaName); 
      geometry = {type: "FeatureCollection",features}
      warning="Administrative Boundaries as per NFHS5 2019-20"

    }
    else{
      let features = boundaries.dist.features.filter(feature => feature.properties.NAME2_ === areaName); 
      geometry = {type: "FeatureCollection",features}
      warning="Administrative Boundaries as per NFHS4 2015-16"
    }
  }

  let tooltip = select("#map_svg").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  let left_offset ,right_offset;
  let windowWidth = window.screen.width;
  let windowHeight = window.screen.height;

  useEffect(() => {
    const svg = select(svgRef.current);

    const legend = select(svgRef.current)
   

     if(windowWidth >= 480){
      // eslint-disable-next-line
      windowWidth = windowWidth/2;
      // eslint-disable-next-line
      windowHeight = windowHeight/2;
    }else{
      windowWidth = windowWidth+200 ;
    }
    const { width, height } = {width:windowWidth,height:windowHeight}; 
    if(offset){
      // eslint-disable-next-line
      left_offset = 0;
      // eslint-disable-next-line
      right_offset = 0;
    }else{
      left_offset = width;
      right_offset = height/2;
    }
  const aspect = width / height;
    const adjustedHeight = Math.ceil(width / aspect) + 50;
 
   
    
    svg.selectAll("*").remove();
    svg.attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox",  `0 0 ${width} ${adjustedHeight}`)

   
    let projection;
    if(selArea === 28 || selArea === 8 ){ // adjustment for daman  & diu, puducherry
     projection = geoMercator().fitSize([width/1.5, adjustedHeight/1.2], geometry);

    }
    else{
     projection = geoMercator().fitSize([width/1.1 , adjustedHeight/1.16], geometry);
    }
    const pathGenerator = geoPath(projection);
    let geojson = geometry.features;
    geojson = _.map(geojson, object => {
      return _.omit(object, ['dataValue', 'dataValueNum'])
   })
    let mergedGeometry = addProperties(geojson, data);
    let c2Value;
    let color_range
    if (((unit === 1 || unit === 4 || unit === 3 || unit === 5 || unit === 6) && toggleStateBurden === true) || (unit === 2))
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

    if(dotVal > 10000)
      dotVal = (dotVal/1000).toFixed(0) * 1000;
    else if(dotVal < 10000 && dotVal > 100)
      dotVal = (dotVal/100).toFixed(0) * 100;
    else
    dotVal = (dotVal/10).toFixed(0) * 10;

    let [min, max] = extent(color_range);
    
    let low, medium, high, highest, sampleCategoricalData;
    let colorScale, colorScale_new, colorScale2;
    
    // let arrsuw = [31,11,28,37,51,42,66,43,84,23,25,32,99,100,70,76,77,78,75,4,5,6,7,14,15,34,57,24,74,85,86, 293,304,309,329,19,21,105,17,12,13,71,26,1,29,2,62,72,239,20,108,18,107,89,53,129,131,135,137,145,148,151,154,261,267,271,298,317,326,320,234,244,245,247,248,249,250,251,252,253,254,255,256,257,258,92,96,231,321,277]; 
    let arr20to80 = [31,11,28,37,51,66,42,43,84,23,25,32,99,100,70,76,77,78,75,4,5,6,7,14,15,34,57,24,74,85,86,277,286,293,298,304,309,329,317,326,320]
    let arr5to30 = [89, 92, 96, 129, 131, 135, 137, 145, 148, 151, 154, 231, 234, 247, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 261, 267, 271,219,220,221,222,223,224,225,226,227,228]
    let arr5to20 = [19, 21, 105]
    let arr10to40 = [12, 13, 17,214, 244, 245]
    let arr5to60 = [1, 2, 26, 29, 62, 71, 72, 218,239, 248]
    let arr1to10 = [18, 20, 108]
    let arr01to25 = [107]
    let arr3to5 = [321]
    let arr5to30Num = [53]
    
    // craeting array using following above array
    let arrsuw = []
    arrsuw.push(...arr20to80);
    arrsuw.push(...arr5to30);
    arrsuw.push(...arr5to20);
    arrsuw.push(...arr10to40);
    arrsuw.push(...arr5to60);
    arrsuw.push(...arr1to10);
    arrsuw.push(...arr01to25);
    arrsuw.push(...arr3to5);
    arrsuw.push(...arr5to30Num);

    if (arr5to20.includes(selIndicator)) {
      low = 5.0;
      medium = 10.0;
      high = 15.0;
      highest = 20.0
      sampleCategoricalData = ["<5%", "5-9.9%", "10-14.9%", "15-19.9%", ">20%", "No Data"]
    }
    else if (arr10to40.includes(selIndicator)) {
      low = 10.0;
      medium = 20.0;
      high = 30.0;
      highest = 40.0;
      sampleCategoricalData = ["<10%", "10-19.9%", "20-29.9%", "30-39.9%", ">=40%", "No Data"]
    }
    else if (arr5to60.includes(selIndicator)){
      low = 5.0;
      medium = 20.0;
      high = 40.0;
      highest = 60.0;
      sampleCategoricalData = ["<5%", "5-19.9%", "20-39.9%", "40-59.9%", ">=60%", "No Data"]
    }
    else if (arr1to10.includes(selIndicator)){
      low = 1.0;
      medium = 2.0;
      high = 5.0;
      highest = 10.0;
      sampleCategoricalData = ["<1%", "1-1.9%", "2-4.9%", "5-9.9%", ">10%", "No Data"]
    }
    else if (arr01to25.includes(selIndicator)){
      low = 0.1;
      medium = 0.5;
      high = 1;
      highest = 2.5;
      sampleCategoricalData = ["<0.1%", "0.1-0.49%", "0.5-0.9%", "1-2.49%", ">2.5%", "No Data"]
    }
    else if (arr5to30.includes(selIndicator)){
      low = 5.0;
      medium = 10.0;
      high = 20.0;
      highest = 30.0;
      sampleCategoricalData = ["<5%", "5-9.9%", "10-19.9%", "20-29.9%", ">=30%", "No Data"]
    }
    else if (arr20to80.includes(selIndicator)){
      low = 20.0;
      medium = 40.0;
      high = 60.0;
      highest = 80.0;
      sampleCategoricalData = ["<20%", "20-39.9%", "40-59.9%", "60-79.9%", ">=80%", "No Data"]

    }else if(arr3to5.includes(selIndicator)){
      low = 3.0;
      medium = 4.0;
      high = 4.5;
      highest = 5.0;
      sampleCategoricalData = ["<3", "3-3.9", "4-4.4", "4.5-4.9",">5", "No Data"]
    }
    else if(arr5to30Num.includes(selIndicator)){
      low = 5.0;
      medium = 10.0;
      high = 20.0;
      highest = 30.0;
      sampleCategoricalData = ["<5", "5-9.9", "10-19.9", "20-29.9", ">=30", "No Data"]
    }
  
  if ((unit === 1 || unit === 4 || unit === 3 || unit === 5 || unit === 6) && toggleStateBurden === true) {
    if(indicatorSense === 'Positive'){
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
    }
    else if (indicatorSense === 'Positive') {
      colorScale = colorScale4_p;
      colorScale_new = colorScale4_p;
    }
  }
  else{
    let arrObese = [91,95,104,92,96,105,21];
    if(selIndicator === 12 || selIndicator === 13 || selIndicator === 244)
      colorScale = '#a3c00f'; 
    else if(selIndicator === 19 || selIndicator === 20)
      colorScale = 'red'; 
    else if(selIndicator === 17 || selIndicator === 18 || selIndicator === 245)
      colorScale = '#039be5'; 
    else if(selIndicator === 107 || selIndicator === 108)
      colorScale = '#e35829'; 
    else  if(arrObese.includes(selIndicator))
      colorScale = '#7b1fa2'; 
    else if(selIndicator === 123 || selIndicator === 26 || selIndicator === 125 || selIndicator === 248)
      colorScale = '#b71c1c'; 
    else
      colorScale = '#eda143'; 
  }

    const onMouseMove = (event, d) => {
      if (typeof c2Value(d) != 'undefined') {
        tooltip.style("opacity", 0);
        tooltip.style("opacity", .9);
        tooltip.html("<b>" + d.areaname + "</b><br><b></b>" + decimalPrecision(c2Value(d)))
          .style("left", event.clientX - left_offset+ "px")
          .style("top", event.clientY - right_offset + "px")
          .style("font-size","12px");
      }
    };
    if ((unit === 1 || unit === 4 || unit === 3 || unit === 5 || unit ===6)  && toggleStateBurden === true)
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
              //drilldown
              if(level === 1){
                setLevel(2);
              }else if(level === 2){
                setLevel(3);
                setIsLevelThree(true);
              }else if(level === 3){
                setLevel(3);
              }
  
           
            }
        }
    
      })
  
      .attr("d", feature => pathGenerator(feature))
      .attr('transform',`translate(50,60)`);

   

  

    }
    // map for burden data
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
              areaChange(d.area_id.toString());
              if(level === 1){
                setLevel(2);
              }else if(level === 2){
                setLevel(3);
                setIsLevelThree(true);
              }else if(level === 3){
                setLevel(3);
              }
  
           
            }
        }
    
      })
      .attr("d", feature => pathGenerator(feature))
      .attr('transform',`translate(50,60)`);
      
      function draw_circles(d) {
        let bounds = pathGenerator.bounds(d);
        let width_d = bounds[1][0] - bounds[0][0];
        let height_d = (bounds[1][1] - bounds[0][1])/2;
        
        let n;
        let data_value_num;
        if(unit === 2)
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
        svg
        .selectAll("myCircles")
        .data(points)
        .enter()
        .append("circle")
          .attr("cx", function(d){ return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0] })
          .attr("cy", function(d){ return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1] })
          .attr("r",1.5)
          .style("fill", colorScale)
          .style('stroke-opacity',1)
          .attr('transform',`translate(50,60)`)
      
        
   
        }
      
      }

    }
    let msg = legend.append("text")
      .style("font-size","8px")
      .attr("class", "statusmsg")
    if(width > 680){
      if(level === 2 || level === 3){
           
        msg
        .attr("transform", `translate(${width-280},${adjustedHeight- 80})`)
         }
    else{
        msg
          .attr("transform", `translate(${width-150},${adjustedHeight- 80})`)
      }
        svg.append("g")
          .attr("class", "legendQuant")
          .attr("transform", `translate(${width-(width-10)},${adjustedHeight-200})`)
        }
    else{
      if(level === 2 || level === 3){
        msg
        .attr("transform", `translate(${width-380},${adjustedHeight- 120})`)
      }
        svg.append("g")
            .attr("class", "legendQuant")
            .attr("transform", `translate(${width-(width-10)},${adjustedHeight- 160})`)
        }
            

    let formatter = format(".1f");
    let myLegend;

    if((level === 1 && (null != selIndiaData && selIndiaData.length > 0)) || ((level === 2 || level === 3) && (null  != selStateData && selStateData.length > 0)))
    {
    if (((unit === 1 || unit === 4 || unit === 3 || unit === 5 || unit === 6)  && toggleStateBurden === false) || unit === 2) 
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
  }
    if((level === 1 && (null=== selIndiaData || selIndiaData.length === 0)))
     {
      svg.append("text").text("No state data.  Please select another survey.")
         .style("text-anchor", "middle")
         .style("font-weight","bold")
         .style("fill", "red")
         .attr('transform',`translate(${width/2}, ${height/2})`);
     }
     if((level === 2 || level === 3) && (null  === selStateData || selStateData.length === 0))
     {
      svg.append("text").text("No district data.  Please select another survey.")
         .style("text-anchor", "middle")
         .style("font-weight","bold")
         .style("fill", "red")
         .attr('transform',`translate(${width/2}, ${height/2})`);
     }
 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit,geometry, dimensions, data, toggleStateBurden])

  let switchButton;

  if(switchDisplay && level === 1){
    switchButton =        <ul className="nav nav-tabs d-flex" id="myTab" role="tablist">
    <li className="nav-item">
        <a  
            href={() => false}
            className={`nav-link radius3 ${toggleState  && 'active'}` }   id="state" data-toggle="tab"  role="tab" aria-controls="state" aria-selected="true" onClick={()=>{ setToggleState(true)}}>State</a>
    </li>
    <li className="nav-item nav-item-right">
        <a 
          href={() => false}
        className={`nav-link radius1 ${!toggleState  && 'active'}` }  id="district" data-toggle="tab" role="tab" aria-controls="district" aria-selected="false" onClick={()=>{ setToggleState(false)}} style={{"width":"70px"}}>District</a>
    </li>
</ul>
  }else{
    switchButton= null;
  }
 
  const screen = useFullScreenHandle();

  let table=[];
  if(data ){
    for(var i=0;i<data.length;i++){
      if(toggleStateBurden){
        if(data[i].data_value){
          table.push({
            area:data[i].area_name,
            data:decimalPrecision(data[i].data_value)
          })
        }
      }
      else{
        if(data[i].data_value_num){
          table.push({
            area:data[i].area_name,
            data:fmt.format(data[i].data_value_num)
          })
        }
        graphUnit='Number'
      }
    }
  }

  const handleBackButton = () =>{
    if(level === 3){
      areaChange(""+parentArea);
    }
    if(level === 2){
      areaChange("1");
    }
  }

  let backButton;
  if(level !== 1)  
    backButton = <Button className={`back_button`} active onClick={handleBackButton}  size="sm"><ArrowBackIcon style={{color:'#AF5907',fontSize:'14px'}}/></Button> 

  // Change style for full screen
    const reportChange = (state, handle) => {
      setOffset(state)
      if(state === true){
        document.getElementsByClassName("my-fullscreen")[0].setAttribute('style', 'overflow: auto !important');
        if( windowWidth > 780){
          document.getElementsByClassName("my-map-title")[0].setAttribute('style', 'font-size: 1.5rem');
          document.getElementsByClassName("my-map-subtitle")[0].setAttribute('style', 'font-size: 1rem;margin-top:10px');
        }

      }else{
       document.getElementsByClassName("my-fullscreen")[0].setAttribute('style', 'overflow: hidden !important');
       document.getElementsByClassName("my-map-subtitle")[0].setAttribute('style', 'font-size: .55rem');
       document.getElementsByClassName("my-map-title")[0].setAttribute('style', 'font-size: .875rem');

      }
    }; 

  return (
    <>
      <FullScreen className="my-fullscreen w-full bg-white h-full" handle={screen} onChange={reportChange}>
      
			<div className='relative w-full h-full'>
			  <div className="block absolute w-auto max-h-max left-15 right-5" style={{zIndex:2}}>
          <SideNavFirst table={table} id="svgMap" dataField="area" columnName="Area" screen={screen} title={mapTitle} timePeriod={graphTimeperiod} componentRef={componentRef} selLifecycle={selLifecycle} selCategory ={selCategory} selIndicator={selIndicator}/>
        </div>
        <div className='relative  w-full pb-3 pt-1 pr-3' id="svgMap" ref={componentRef}>
          <div className="absolute  right-5 left-5 mx-10 w-auto top-1">
              <div className="text-center  text-xs md:text-sm  font-bold my-map-title">{`${mapTitle}`}</div>
              <div className="text-center  text-xs my-map-subtitle">{`${warning}`}</div>
              </div>
							<div id='map_svg' className=' align-middle w-full h-full' ref={wrapperRef}>
              <div className="flex flex-wrap absolute  md:left-auto md:bottom-auto right-10 top-16">
                  {switchButton}       
              </div>
              <div className="absolute left-5 top-0">
                  {backButton}        
              </div>
            <svg    ref={svgRef} 
            className="w-full bg-white border-black border-dashed object-scale-down"   alt="India State wise NFHS-5 Reports"></svg>

                <div className="absolute right-10 bottom-3  text-xs font-bold"   alt="India State wise NFHS-5 Reports">
                  {statusMsg}        
              </div>
            </div>
            </div>
  </div>
    </FullScreen>  
    </>
  )
};