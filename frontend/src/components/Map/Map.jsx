
import React, { useRef, useEffect } from 'react';
// import { geoMercator, format, geoPath, scaleQuantize, scaleSequential,extent,select,interpolateOrRd } from 'd3';
import _ from 'lodash';
import useResizeObserver from "../../useResizeObserver";
import { legendColor } from 'd3-svg-legend'
import { Button } from 'react-bootstrap';
// import { geoMercator, precisionFixed, format, geoPath, scaleQuantize, scaleThreshold,extent,select,interpolateRdYlGn, interpolateReds, scaleLinear, schemeReds, schemeRdYlGn, formatPrefix } from 'd3';
import { geoMercator, format, geoPath, scaleQuantize, scaleThreshold,extent, select, schemeReds, geoCentroid, scaleOrdinal } from 'd3';
import {poissonDiscSampler} from '../../utils'
import { InfoCircleFill } from 'react-bootstrap-icons';
import { Switch } from 'antd';
import SideNavFirst from "../SideNav/SideNavFirst";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { AnimateOnChange } from 'react-animation';
import { json } from 'd3';
import "./Map.css";



export const Map = ({ 
  boundaries, 
  selIndiaData,  
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
  toggleStateBurden, setToggleStateBurden, burdenbuttonText, changeBurdenText,map

}) => {
  // console.log("toggleStateBurden", toggleStateBurden);
  let geometry = boundaries.new_state;
  let mapTitle;
  const svgRef = useRef();
  const svgLegRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  // const [colorScale,setColorScale] = useState();
  function removeShake() {
    var element = document.getElementById("info-msg");
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

  // const burdenClick = () => {
  //   setToggleStateBurden(!toggleStateBurden); 
  //   let text = null;
  //   if (burdenbuttonText === 'Burden')
  //   {
  //     text = 'Prevalence';
  //   }
  //   else
  //   {
  //     text = 'Burden';
  //   }

  //     changeBurdenText(text);
  // }

 
  if (toggleStateBurden === true) {
    mapTitle = graphTitle + ","+ graphUnit +","+titleAreaName +","+ graphTimeperiod + `${"\n"}`;
  }
  else{
    mapTitle = graphTitle + ","+ "Number" +","+titleAreaName +","+ graphTimeperiod;
  }

  function thresholdLabels({i, genLength, generatedLabels,labelDelimiter}) {
    // console.log("legend", i, genLength, generatedLabels,labelDelimiter);
    if (i === 0) {
      const values = generatedLabels[i].split(` ${labelDelimiter} `)
      return `Less than ${values[1]}`
    } else if(i == 1)
    {
      const values = generatedLabels[i].split(` ${labelDelimiter} `)
      return `${values[0]} to  ${values[1] -0.1}`
    }else if(i == 2)
    {
    const values = generatedLabels[i].split(` ${labelDelimiter} `)
    return `${values[0]} to  ${values[1] -0.1}`
    }
    else if(i == 3)
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

    // let mergedGeoJson = _(newArr)
    //   .keyBy('areacode')
    //   .merge(_.keyBy(geojson, 'properties.ID_'))
    //   .values()
    //   .value();
      let mergedGeoJson = _.map(geojson, function(item) {
        return _.assign(item, _.find(newArr, ['areacode', item.properties.ID_]));
    });

    return mergedGeoJson;
  }

  function removeShake() {
    var element = document.getElementById("info-msg");
    element.classList.remove("shake");
  }
  let statusMsg;

  let data = selIndiaData;
  let warning;
  if (level === 1)
  {
    if (toggleState === true) {

      if (selTimeperiod === 22){    // change state boundaries when timeperiod is NFHS5
        geometry = boundaries.new_state;
        warning=""
      }   
      else{
        geometry = boundaries.state;
        warning="Administrative Boundaries as per NFHS4(2015-16)"
      }
      
      data = selIndiaData;
    }
    else {

        if(selTimeperiod === 22){
          geometry = boundaries.new_dist;
          warning=""

        }
        else{
          geometry = boundaries.dist;
          warning="Administrative Boundaries as per NFHS4(2015-16)"

        }
      data = selDistrictsData;
    }
    statusMsg ="Click on Map to Drill down to District level";
  }
  else{
    
    if(null!== selStateData && selStateData.length > 0)
    {
      data = selStateData;
      statusMsg ="Click on Map to go back to India Map";
    if(selTimeperiod == 22)
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
  else{
    // console.log("testst", document.getElementById("info-msg"));
    //   document.getElementById("info-msg").className += " shake";
        //   setTimeout(removeShake,3000);
      if (selTimeperiod === 22) // change state boundaries when timeperiod is NFHS5
        geometry = boundaries.new_state;
      else
        geometry = boundaries.state;
      statusMsg ="No data: please select another survey";

  }
  }
  select(".tooltip").remove();

  let tooltip = select(".map_svg").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  useEffect(() => {
    const svg = select(svgRef.current);
    const legend = select(svgRef.current)

  

    const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();
    svg.selectAll('*').remove();

    let title = svg.append("text").text(`${mapTitle}`)
      .style("text-anchor","middle")
      .style("font-size","13px")
      .style("font-weight","bold")
      .attr("dy", "-2em")
      .attr('transform',`translate(${width/2},40)`);

      svg.append("text").text(`${warning}`)
      .style("text-anchor","middle")
      .style("font-size","10px")
      .attr("dy", "-2.5em")


      .attr('transform',`translate(${width/2},60)`);
    if(width <= 480){
      title = title.style("font-size", (width * 0.0025) + "em")
    }
    const projection = geoMercator().fitSize([width, height], geometry);

    const pathGenerator = geoPath(projection);
    let geojson = geometry.features;
    let mergedGeometry = addProperties(geometry.features, data);
 

    let c2Value;
    let color_range
    if (toggleStateBurden === true) 
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
      return a + b;
  }, 0);
    let dotVal = Math.round(sum/4000);
    let [min, max] = extent(color_range);
  
    let low;
    let medium;
    let high;
    let highest;
    let arr20to80 = [31,11,28,6,7,37,51,42,84]
    if (selIndicator == 19 || selIndicator == 21) {
      low = 5.0;
      medium = 10.0;
      high = 15.0;
      highest = 20.0
    } else if (selIndicator == 17 || selIndicator == 18 || selIndicator == 12 || selIndicator == 13) {
       low = 10.0;
       medium = 20.0;
       high = 30.0;
       highest = 40.0;
    } else if(selIndicator == 71 || selIndicator == 124 )
    {
      low = 5.0;
      medium = 20.0;
      high = 40.0;
      highest = 60.0;
    } else if(selIndicator == 20 || selIndicator == 108)
    {
      low = 1.0;
      medium = 2.0;
      high = 5.0;
      highest = 10.0;
     }else if(selIndicator == 107)
    {
      low = 0.1;
      medium = 0.5;
      high = 1;
      highest = 2.5;
    }else if(selIndicator == 89)
    {
      low = 5.0;
      medium = 10.0;
      high = 20.0;
      highest = 30.0;
    }else if(arr20to80.includes(selIndicator))
    {
      low = 20.0;
      medium = 40.0;
      high = 60.0;
      highest = 80.0;
    }
    
    
    
    let colorScale;
  
    let colorScale2 = scaleThreshold().domain([low, medium, high, highest])
    .range(["#00af50", "#ffff00", "#ffc000", "#fe0000", '#8e0000']); 

    let colorScale4 = scaleQuantize()
      .domain([min, max])
      .range(["#DAF7A6", "#FFE338", "#FF0000", "#B2022F"])

    let colorScale4_p = scaleQuantize()
      .domain([min, max])
      .range(["#B2022F", "#FF0000", "#FFE338", "#DAF7A6"])

      let arrsuw = [19,21,17,18,12,13,71,124,20,108,107,89,31,11,28,6,7,37,51,42,84];
    if (toggleStateBurden === true)
    { 
          if (arrsuw.includes(selIndicator)) {
          colorScale = colorScale2;
        }
        else if (indicatorSense === 'Negative') {
          colorScale = colorScale4;

        } else if (indicatorSense === 'Positive') {
          colorScale = colorScale4_p;

        }
      }
  else{
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
        else if(selIndicator == 123 || selIndicator == 124 || selIndicator == 125)
          colorScale = '#b71c1c'; 
        else
          colorScale = '#eda143'; 
  }
     
    

    const onMouseMove = (event, d) => {
      if (typeof c2Value(d) != 'undefined') {
        // tooltip.style("opacity", .9);
        tooltip.style("opacity", 0);
        tooltip.style("opacity", .9);
        tooltip.html("<b>" + d.areaname + "</b><br><b>Value:</b>" + c2Value(d))
          .style("left", event.clientX + "px")
          .style("top", event.clientY - 30 + "px");
      }
    };
    // if(unit !== 2)
    if (toggleStateBurden === true)
    {  
    svg
      .selectAll(".polygon")
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
      // .style("fill", d =>{
      //   if (typeof c2Value(d) != "undefined")
      //     return colorScale(c2Value(d))
      //   elsevalue
      //     return "#A9A9B0";
      // })
      .style("opacity", d => {
        if (d.area_id !== parseInt(selArea) && isLevelThree) {
          return ".2"
        }
      })
      .on("mousemove", (i, d) => onMouseMove(i, d))
      .on("mouseout", function (d) {
        tooltip
          // .transition()    
          // .duration(500)    
          .style("opacity", 0);
      })
      .on('click', (i, d) => {
        if(toggleState){
          setIsLevelThree(false);
          // let id = d.area_id
          tooltip.style('opacity', 0);
          if (level === 1) {

            if (typeof c2Value(d) != "undefined") {
              areaChange(d.area_id.toString());
              // setSelArea('' + d.area_id);
              // setLevel(2);
              // onMapClick(d.areaname);
            }
          } else if (level === 2) {
            areaChange("1");
            // setSelArea("1");  //india
            // setLevel(1);
            // searchRef.current.state.value = "";  //reset search to
            // setFilterDropdownValue(areaDropdownOpt); //reset dorpdown values
          }
        }
    
      })
      // .transition().duration(1000)
      .attr("d", feature => pathGenerator(feature))
      .attr('transform',`translate(0,50)`);

   

  

    }

    // bubbles for numeric unit values
    // console.log(unit)
    // if (unit === 2) {
    else{

      svg
      .selectAll(".polygon")
      .data(mergedGeometry)
      .join("path").attr("class", "polygon")
      .style("fill", "#fff")
      .on("mousemove", (i, d) => onMouseMove(i, d))
      .on("mouseout", function (d) {
        tooltip
          // .transition()    
          // .duration(500)    
          .style("opacity", 0);
      })
      .on('click', (i, d) => {
        if(toggleState){
          setIsLevelThree(false);
          // let id = d.area_id
          tooltip.style('opacity', 0);
          if (level === 1) {

            if (typeof c2Value(d) != "undefined") {
              areaChange(d.area_id.toString());
              // setSelArea('' + d.area_id);
              // setLevel(2);
              // onMapClick(d.areaname);
            }
          } else if (level === 2) {
            areaChange("1");
            // setSelArea("1");  //india
            // setLevel(1);
            // searchRef.current.state.value = "";  //reset search to
            // setFilterDropdownValue(areaDropdownOpt); //reset dorpdown values
          }
        }
    
      })
      .attr("d", feature => pathGenerator(feature))
      .attr('transform',`translate(0,50)`);


      svg.selectAll(".mask")
      .data(mergedGeometry)
      .enter()
      .append("clipPath")
      .attr("class","mask")
      .attr("id",function(d){return d.areacode;})
      .append("path")
      .attr("d", pathGenerator)
      // .attr('transform',`translate(0,50)`);
  

   svg.selectAll(".points")
    .data(mergedGeometry)
    .enter()
    .append("g")
    .attr("class","points")
    .attr("clip-path", function(d){return "url(#"+d.areacode+")";})
    .each(draw_circles)
    .attr('transform',`translate(0,50)`);


      function draw_circles(d) {
        let bounds = pathGenerator.bounds(d);
        let width_d = bounds[1][0] - bounds[0][0];
        let height_d = bounds[1][1] - bounds[0][1];
        let x = bounds[0][0];
        let y = bounds[0][1];

        let p = d.properties.AREA_ / (width_d * height_d);
        let p_ = d.properties.AREA_
        // let n = d.dataValue / (dotVal);
        let n = d.dataValueNum / (dotVal);

        if(dotVal > d.dataValueNum)
        {
          n = 1;
        }
        if (typeof d.dataValueNum !== 'undefined' && d.dataValueNum > 0 
&& isFinite(width_d) && isFinite(height_d))

        {
        var points = createPoints(width_d, height_d, p_, n);
        for(var i=0; i< points.length; i++)
        {
          select(this).append("circle")
          .attr("r", 2)
          .attr("cx", x+points[i][0])
          .attr("cy", y+points[i][1])
          .attr("fill", colorScale);

        }
        }
      
      }
      function createPoints(width, height, area, n)
      {
        // var area = width * height * p;
        //var radius = 10;
        var radius;
        if(level === 1 || null === selStateData || selStateData.length === 0)
        {
          radius = Math.sqrt(area / (10*n));
        }
        else{
          radius = Math.sqrt(area / (1.62*n));
        }
         var sample = poissonDiscSampler(width, height, radius);
         for (var data = [], d; d = sample();) { data.push(d); }
         return data;
      
      }
      
    }

    // legend.selectAll("*").remove();
    legend.append("g")
      .attr("class", "legendQuant")
        .attr("transform", `translate(${width-150},${height-80})`)

    let formatter;
    if (toggleStateBurden === true) {
      //formatter = format(',.0f');
      formatter = format('.2s');
    }
    else {
      formatter = format(".1f");
    }

    let myLegend;
   
    if (toggleStateBurden === false) 
    {
      legend.select(".legendQuant").append('text').text("1 dot =" + dotVal);
    }
    else{
       if (!arrsuw.includes(selIndicator)) {
      myLegend = legendColor()
      .labelFormat(formatter)
     // .title('Legend')
      .title(`Legend (in ${unitName})`)
      .titleWidth(180)
      .scale(colorScale);
    } 
    else{
      myLegend = legendColor()
      .labelFormat(formatter)
      //.title('Legend')
      .title(`Legend (in ${unitName})`)
      .titleWidth(180)
      .labels(thresholdLabels)
      .scale(colorScale);
    }

      legend.select(".legendQuant")
      .call(myLegend);

      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit,geometry, dimensions, data, toggleStateBurden])

  let switchButton;

  if(switchDisplay && level === 1){
    switchButton = <div><Button className="req_button" active onClick={()=>{ setToggleState(true)}}  size="sm">State Map</Button> 
    <Button className="req_button" onClick={()=>{ setToggleState(false)}} size="sm">District Map</Button> </div>
  }else{
    switchButton= null;
  }
 
  const screen = useFullScreenHandle();

  const checkchange = (state,handle)=>{
    if(map){
      if(state === true){
        map[0].style.height = "100vh";
      }
      else if(state === false){
        if(map[0] != undefined)
        map[0].style.height = "50vh";
      }
    }
  }
  let table=[];
  if(data){
    for(var i=0;i<data.length;i++){
        table.push({
            area:data[i].area_name,
            data:+data[i].data_value+" ("+graphTimeperiod + ")",
        })
    }
  }

  return (
    <>
      <FullScreen className="fullscreen_css" handle={screen} onChange={checkchange}>
      <SideNavFirst table={table} id="svgMap" dataField="area" columnName="Area" screen={screen} title={mapTitle} timePeriod={graphTimeperiod} componentRef={svgRef}/>
      <div className="map">
        {/* <div className="map_area"> */}
          {/* <div className="map_title">
            <small style={{textAlign:'center',fontWeight:"bold",fontSize:"13px"}}>{mapTitle}</small>
          </div> */}
          <div  className="map_svg" ref={wrapperRef}>
            <svg  id="svgMap" width="100%" height="130%"  ref={svgRef} ></svg>

            {/* <svg  width="100%" height="30%"  ref={svgLegRef}></svg> */}
          </div>
        {/* </div> */}
    
    <div className="map_req">
      <div className="map_req_button">
        {switchButton}
        
      </div>
      
      {/* <div className="map_req_legend">
      </div> */}
      <div className="map_req_text">
          <div id="info-msg" className="msg"></div>
      </div>
    </div>
  </div>

    </FullScreen>  
    </>
  )
};    