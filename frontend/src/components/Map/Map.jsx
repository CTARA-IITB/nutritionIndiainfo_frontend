import React,{useState,useRef,useEffect} from 'react';
// import { geoMercator, format, geoPath, scaleQuantize, scaleSequential,extent,select,interpolateOrRd } from 'd3';
import _ from 'lodash';
import useResizeObserver from "../../useResizeObserver";
import { legendColor } from 'd3-svg-legend'
import { Row, Col } from 'react-bootstrap';
import { geoMercator, precisionFixed, format, geoPath, scaleQuantize, scaleThreshold,extent,select,interpolateRdYlGn, interpolateReds, scaleLinear, schemeReds, schemeRdYlGn, formatPrefix } from 'd3';

import { InfoCircleFill } from 'react-bootstrap-icons';

import "./Map.css";



export const Map = ({geometry, data, onMapClick,setLevel,level,setSelArea,unit,unitName}) =>{
const svgRef = useRef();
const svgLegRef = useRef();
const wrapperRef = useRef();
const dimensions = useResizeObserver(wrapperRef);
const [colorScale,setColorScale] = useState();


let color_range = _.map(data, d =>{
  return +d.data_value
});
let [min,max] = extent(color_range);
let comp = (max - min)/3;
let low = min + comp;
let high = max - comp;

// const colorScale1 = scaleQuantize().domain([min, max])
//   .range(["rgb(0, 128, 0)","rgb(255,255,0)", "rgb(255, 0, 0)"]);


const colorScale1 = scaleQuantize().domain([min, max])
  .range(["rgb(0, 128, 0)","rgb(255,255,0)", "rgb(255, 0, 0)"]);


// const colorScale3 = scaleSequential().domain([max,min])
//   .interpolator(interpolateOrRd);


// const colorScale3 = scaleSequential().domain([max,min])
//   .interpolator(interpolateReds);

const colorScale3 = scaleQuantize().domain([min, max]).range(schemeReds[5]);

// const colorScale = scaleSequential(interpolateRdYlGn).domain()

//merge geometry and data

function addProperties(geojson,data){
  let newArr = _.map(data, function(item) {
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


let tooltip = select("body").append("div") 
.attr("class", "tooltip")       
.style("opacity", 0);


useEffect(() => {
  const svg = select(svgRef.current);
  const legend = select(svgLegRef.current)
  const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();
  const projection = geoMercator().fitSize([width, height], geometry);

  const pathGenerator = geoPath(projection);
  let mergedGeometry = addProperties(geometry.features,data);
  let c1Value  = d => d.data_value;
  let c2Value  = d => d.dataValue;
  
  // let colorScale = scaleOrdinal();
  // colorScale.domain(c2Value)
  //     .range("red","yellow", "green");
  let colorScale;
  if(unit === 2){
    colorScale = colorScale3;
  }else{
    colorScale = colorScale1;
  }

  
  
  let colorScale2 = (v) =>{
    if (typeof v != "undefined") {
        let selectedColor;
          if (v < low) {selectedColor =  "#24562B";}//matte green
          else if (v >= low && v <= high) {selectedColor =  "#FFE338";}//matte yellow
          else if (v > high) {selectedColor =  "#B2022F";} //matte red
        return selectedColor;
    }
    else {
      return "#A9A9B0";
    }
  };

 

  const onMouseMove = (event,d) =>{	
    if(typeof d.dataValue != 'undefined'){
      // tooltip.style("opacity", .9);
      tooltip.style("opacity",0)	;	
      tooltip.style("opacity", .9);		
      tooltip.html("<b>"+d.areaname+"</b><br><b>Value:</b>"+d.dataValue)
      .style("left", event.clientX + "px")
      .style("top",  event.clientY - 30 + "px");	
    }
  };

 

  svg
    .selectAll(".polygon")
    .data(mergedGeometry)
    .join("path").attr("class", "polygon")
    .style("fill", d =>{
      if (typeof c2Value(d) != "undefined")
        return colorScale(c2Value(d))
      else
        return "#A9A9B0";
    })
    .on("mousemove", (i,d) => onMouseMove(i,d))
    .on("mouseout", function(d) {   
      tooltip
      // .transition()    
      // .duration(500)    
      .style("opacity", 0); 
    }).on('click',(i,d) =>{
      let id = d.area_id
      tooltip.remove();
      if(level == 1){
        
        if(typeof c2Value(d) != "undefined"){
          setSelArea(''+d.area_id);
          setLevel(2);
          onMapClick(d.areaname);
        }
      }else if(level == 2){
        setSelArea("1");  //india
        setLevel(1);
      }
      // tooltip.style('opacity',1);
  })
  // .transition().duration(1000)
  .attr("d" ,feature => pathGenerator(feature));
  

    legend.append("g")
  .attr("class", "legendQuant")
  .attr("transform", "translate(20,20)");

  // let myLegend = legendColor()
  //   .labelFormat(format(".2f"))
  //   .title(`Legend (${unitName})`)
  let formatter;
  if(unit === 2){
  //formatter = format(',.0f');
  formatter = format('.2s');
  }
  else
  {
    // var p = Math.max(0, precisionFixed(0.05) - 2);
    // formatter= format("." + p + "%");
    formatter = format(".2f");
  }

  let myLegend = legendColor()
     .labelFormat(formatter)
    .title(`Legend (in ${unitName})`)
    .titleWidth(200)
    .scale(colorScale);

    legend.select(".legendQuant")
    .call(myLegend);
    
}, [geometry, dimensions, data,unit])



return ( 
  <>
  <Col xs={12} lg={8}>
<div ref={wrapperRef}  style={{ marginBottom: "2rem" }}>
  <svg className = "svg-map" ref={svgRef} ></svg>
</div>
</Col>
<Col className="">
  <Row>
  <svg className = "svg-legend" ref={svgLegRef}></svg>
  </Row>
  <Row>
  <span><InfoCircleFill color="lightgreen" size={25} className="mr-2" />Click on Map to Drill down to District level</span>
  </Row>

</Col>
</>
)};
