import React, { useRef, useEffect } from 'react';
// import { geoMercator, format, geoPath, scaleQuantize, scaleSequential,extent,select,interpolateOrRd } from 'd3';
import _ from 'lodash';
import useResizeObserver from "../../useResizeObserver";
import { legendColor } from 'd3-svg-legend'
import { Row, Col } from 'react-bootstrap';
// import { geoMercator, precisionFixed, format, geoPath, scaleQuantize, scaleThreshold,extent,select,interpolateRdYlGn, interpolateReds, scaleLinear, schemeReds, schemeRdYlGn, formatPrefix } from 'd3';
import { geoMercator, range, legendHelpers, format, geoPath, scaleQuantize,scaleThreshold, extent, select, schemeReds, geoCentroid, scaleOrdinal } from 'd3';

import { InfoCircleFill } from 'react-bootstrap-icons';
import { Switch } from 'antd';
import { AnimateOnChange } from 'react-animation';

import "./Map.css";



export const Map = ({ 
  geometry, 
  data, 
  onMapClick, 
  setLevel, 
  level, 
  setSelArea, 
  unit, 
  unitName, 
  selArea, 
  isLevelThree, 
  setIsLevelThree, 
  handleClick, 
  searchRef, 
  setFilterDropdownValue, 
  areaDropdownOpt, 
  selIndicator, 
  indicatorSense ,
  switchDisplay,
  toggleState
}) => {
  console.log(geometry);
  const svgRef = useRef();
  const svgLegRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  // const [colorScale,setColorScale] = useState();
  function removeShake() {
    var element = document.getElementById("info-msg");
    element.classList.remove("shake");
  }

  // let statusMsg;
  // if(level === data[0].area.area_level)
  // {
  //   document.getElementById("info-msg").className += " shake";
  //   setTimeout(removeShake,3000);
  //   statusMsg ="No data: please select another survey";
  // }
  // else if(level === 1){
  //   statusMsg ="Click on Map to Drill down to District level";
  // }
  // else{
  //   statusMsg ="Click on Map to go back to India Map";
  // }

  let color_range = _.map(data, d => {
    return +d.data_value
  });

  let sum = color_range.reduce(function(a, b){
    return a + b;
}, 0);

  let dotVal = Math.round(sum/4000);
  console.log("sum", sum, dotVal);

  let [min, max] = extent(color_range);
  

  const colorScale3 = scaleQuantize().domain([min, max]).range(schemeReds[5]);

  // const colorScale = scaleSequential(interpolateRdYlGn).domain()

  //merge geometry and data

  function addProperties(geojson, data) {
    let newArr = _.map(data, function (item) {
      return {
        areacode: item.area.area_code,
        areaname: item.area.area_name,
        area_id: item.area.area_id,
        dataValue: parseFloat(item.data_value),
      }
    });

    let mergedGeoJson = _(newArr)
      .keyBy('areacode')
      .merge(_.keyBy(geojson, 'properties.ID_'))
      .values()
      .value();

    return mergedGeoJson;
  }

  let low;
  let medium;
  let high;
  if (selIndicator == 12 || selIndicator == 13) {
    low = 20.0;
    medium = 30.0;
    high = 40.0;
  } else if (selIndicator == 19 || selIndicator == 20) {
    low = 5.0;
    medium = 10.0;
    high = 15.0;
  } else if (selIndicator == 17 || selIndicator == 18) {
     low = 10.0;
     medium = 20.0;
     high = 30.0;
  }



  // let colorScale2 = (v) => {
  //   if (typeof v != "undefined") {
  //     let selectedColor;
  //     if (v < low) { selectedColor = "#24562B"; }//matte green
  //     else if (v >= low && v < medium) { selectedColor = "#FFE338"; }//matte yellow
  //     else if (v >= medium && v < high) { selectedColor = "#E26313"; } //matte orange
  //     else if (v >= high) { selectedColor = "#B2022F"; } //matte red
  //     return selectedColor;
  //   }
  //   else {
  //     return "#A9A9B0";
  //   }
  // };
  function thresholdLabels({i, genLength, generatedLabels,labelDelimiter}) {
    console.log("ts", i, genLength, generatedLabels,labelDelimiter);
    if (i === 0) {
      const values = generatedLabels[i].split(` ${labelDelimiter} `)
      return `Less than ${values[1]}`
    } else if (i === genLength - 1) {
      const values = generatedLabels[i].split(` ${labelDelimiter} `)
      return `${values[0]} or more`
    }
    return generatedLabels[i]
  };

  let tooltip = select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


  useEffect(() => {
    const svg = select(svgRef.current);
    const legend = select(svgLegRef.current)
    const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();
    const projection = geoMercator().fitSize([width, height], geometry);

    const pathGenerator = geoPath(projection);
    let mergedGeometry = addProperties(geometry.features, data);


    // let c1Value  = d => d.data_value;
    let c2Value = d => d.dataValue;

    let colorScale;
  
    let colorScale2 = scaleThreshold().domain([low, medium, high])
    .range(["#24562B", "#FFE338", "#E26313", "#B2022F"]); 

    let colorScale4 = scaleQuantize()
      .domain([min, max])
      .range(["#24562B", "#FFE338", "#B2022F", "#7d0a1f"])

    let colorScale4_p = scaleQuantize()
      .domain([min, max])
      .range(["#7d0a1f", "#B2022F", "#FFE338", "#24562B"])

    let arrsuw = ['12', '19', '17', '18', '20', '13'];
    if (arrsuw.includes(selIndicator)) {
      colorScale = colorScale2;
    }
    else if (indicatorSense[0].type === 'Negative') {
      colorScale = colorScale4;

    } else if (indicatorSense[0].type === 'Positive') {
      colorScale = colorScale4_p;

    }



    // if (typeof c2Value != "undefined"){
    //   if(selIndicator === 12 || selIndicator === 19){
    //     colorScale = colorScale2;
    //   }
    //   else if(indicatorSense[0].type === 'Negative'){
    //     colorScale = colorScale4;

    //   }else if(indicatorSense[0].type ==='Positive'){
    //     colorScale = colorScale4_p;

    //   }
    // }else
    //     return colorScale="#A9A9B0";


    const onMouseMove = (event, d) => {
      if (typeof d.dataValue != 'undefined') {
        // tooltip.style("opacity", .9);
        tooltip.style("opacity", 0);
        tooltip.style("opacity", .9);
        tooltip.html("<b>" + d.areaname + "</b><br><b>Value:</b>" + d.dataValue)
          .style("left", event.clientX + "px")
          .style("top", event.clientY - 30 + "px");
      }
    };



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
      }).on('click', (i, d) => {
        if(toggleState){
          setIsLevelThree(false);
          // let id = d.area_id
          tooltip.style('opacity', 0);
          if (level === 1) {
  
            if (typeof c2Value(d) != "undefined") {
              setSelArea('' + d.area_id);
              setLevel(2);
              onMapClick(d.areaname);
            }
          } else if (level === 2) {
            setSelArea("1");  //india
            setLevel(1);
            searchRef.current.state.value = "";  //reset search to
            setFilterDropdownValue(areaDropdownOpt); //reset dorpdown values
          }
        }
    
      })
      // .transition().duration(1000)
      .attr("d", feature => pathGenerator(feature));

    svg.selectAll(".points").remove();

    // bubbles for numeric unit values
   
    if (unit === 2) {

      svg.selectAll('clipPath').remove();
      svg.selectAll('points').remove();
      svg.selectAll('*').remove();

      svg
      .selectAll(".polygon")
      .data(mergedGeometry)
      .join("path").attr("class", "polygon")
      .style("fill", "#fff")
      .attr("d", feature => pathGenerator(feature));

      svg.selectAll(".mask")
      .data(mergedGeometry)
      .enter()
      .append("clipPath")
      .attr("class","mask")
      .attr("id",function(d){return d.areacode;})
      .append("path")
      .attr("d", feature => pathGenerator(feature));

      svg.selectAll(".points")
        .data(mergedGeometry)
        .enter()
        .append("g")
        .attr("class","points")
        .attr("clip-path", function(d){return "url(#"+d.areacode+")";})
        .each(draw_circles);

      function draw_circles(d) {
        //console.log("d",d);
        let bounds = pathGenerator.bounds(d);
        let width_d = bounds[1][0] - bounds[0][0];
        let height_d = bounds[1][1] - bounds[0][1];
        let x = bounds[0][0];
        let y = bounds[0][1];
      

        let p = d.properties.AREA_ / (width_d * height_d);
        let p_ = d.properties.AREA_
        let n = d.dataValue / dotVal;

        if (typeof d.dataValue !== 'undefined')
        {
        var points = createPoints(width_d, height_d, p_, n);

        // console.log("points", min, d.dataValue, n,  points.length);

        for(var i=0; i< points.length; i++)
        {
          select(this).append("circle")
          .attr("r", 1)
          .attr("cx", x+points[i][0])
          .attr("cy", y+points[i][1])
          .attr("fill", 'red');

        }
        }
      }
      function createPoints(width, height, area, n)
      {
        // var area = width * height * p;
        //var radius = 10;
        var radius = Math.sqrt(area / (15*n));
        //  console.log("widthher",width, height, area, radius);
         var sample = poissonDiscSampler(width, height, radius);
         for (var data = [], d; d = sample();) { data.push(d); }
         return data;
      
      }
      
      
      function poissonDiscSampler(width, height, radius) {
              var k = 30, // maximum number of samples before rejection
                  radius2 = radius * radius,
                  R = 0.1 * radius2,
                  cellSize = radius * Math.SQRT1_2,
                  gridWidth = Math.ceil(width / cellSize),
                  gridHeight = Math.ceil(height / cellSize),
                  grid = new Array(gridWidth * gridHeight),
                  queue = [],
                  queueSize = 0,
                  sampleSize = 0;
      
              return function() {
                if (!sampleSize) return sample(Math.random() * width, Math.random() * height);
      
                // Pick a random existing sample and remove it from the queue.
                while (queueSize) {
                  var i = Math.random() * queueSize | 0,
                      s = queue[i];
      
                  // Make a new candidate between [radius, 2 * radius] from the existing sample.
                  for (var j = 0; j < k; ++j) {
                    var a = 2 * Math.PI * Math.random(),
                        r = Math.sqrt(Math.random() * R + radius2),
                        x = s[0] + r * Math.cos(a),
                        y = s[1] + r * Math.sin(a);
      
                    // Reject candidates that are outside the allowed extent,
                    // or closer than 2 * radius to any existing sample.
                    if (0 <= x && x < width && 0 <= y && y < height && far(x, y)) return sample(x, y);
                  }
      
                  queue[i] = queue[--queueSize];
                  queue.length = queueSize;
                }
              };
      
              function far(x, y) {
                var i = x / cellSize | 0,
                    j = y / cellSize | 0,
                    i0 = Math.max(i - 2, 0),
                    j0 = Math.max(j - 2, 0),
                    i1 = Math.min(i + 3, gridWidth),
                    j1 = Math.min(j + 3, gridHeight);
      
                for (j = j0; j < j1; ++j) {
                  var o = j * gridWidth;
                  for (i = i0; i < i1; ++i) {
                    if (s = grid[o + i]) {
                      var s,
                          dx = s[0] - x,
                          dy = s[1] - y;
                      if (dx * dx + dy * dy < radius2) return false;
                    }
                  }
                }
      
                return true;
              }
      
              function sample(x, y) {
                var s = [x, y];
                queue.push(s);
                grid[gridWidth * (y / cellSize | 0) + (x / cellSize | 0)] = s;
                ++sampleSize;
                ++queueSize;
                return s;
              }
            }
    }


    legend.selectAll("*").remove();
    legend.append("g")
      .attr("class", "legendQuant")
      .attr("transform", "translate(20,20)");


    let formatter;
    if (unit === 2) {
      //formatter = format(',.0f');
      formatter = format('.2s');
    }
    else {
      formatter = format(".1f");
    }

    let myLegend;
    if(unit === 2)
    {
      legend.select(".legendQuant").append('text').text("1 dot =" + dotVal);
    }
    else{
       if (!arrsuw.includes(selIndicator)) {
      myLegend = legendColor()
      .labelFormat(formatter)
      .title(`Legend (in ${unitName})`)
      .titleWidth(180)
      .scale(colorScale);
    } 
    else{
      myLegend = legendColor()
      .labelFormat(formatter)
      .title(`Legend (in ${unitName})`)
      .titleWidth(180)
      .labels(thresholdLabels)
      .scale(colorScale);
    }
      legend.select(".legendQuant")
      .call(myLegend);
      
    }

   
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geometry, dimensions, data, unit])

  let switchButton;
  if(switchDisplay && level === 1){
    switchButton = <Switch className="mb-2" size="large" checkedChildren="District Level" unCheckedChildren="State Level" onClick={handleClick} />
  }else{
    switchButton= null;
  }
  


  return (
    <>
      <div className="map">
        <div ref={wrapperRef} className="map__svg">
          <svg className="svg-map" ref={svgRef} ></svg>
        </div>
        <div className="map__requirements">
          
              <div className="map__requirements__switch">
              {switchButton}
            </div>
          
          
          <div className="map__requirements__legend">
            <svg className="svg-legend" ref={svgLegRef}></svg>
          </div>
        </div>

      </div>

    </>
  )
};