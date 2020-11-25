import React,{useState,useRef,useEffect} from 'react';
import { geoMercator, format, geoPath, scaleQuantize, scaleSequential,extent,select,interpolateRdYlGn } from 'd3';
import _ from 'lodash';
import useResizeObserver from "../../useResizeObserver";
import { legendColor } from 'd3-svg-legend'

import "./Map.css";



export const Map = ({geometry, data, onMapClick,setLevel,level,setSelArea,unit}) =>{

const svgRef = useRef();
const wrapperRef = useRef();
const dimensions = useResizeObserver(wrapperRef);


let color_range = _.map(data, d =>{
  return +d.data_value
});
let [min,max] = extent(color_range);
let comp = (max - min)/3;
let low = min + comp;
let high = max - comp;



const colorScale1 = scaleQuantize().domain([min, max])
  .range(["rgb(0, 128, 0)","rgb(255,255,0)", "rgb(255, 0, 0)"]);


const colorScale3 = scaleSequential().domain([max,min])
  .interpolator(interpolateRdYlGn);


const [colorScale,setColorScale] = useState();



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


  // colorLegendG.call(colorLegend, {
  //   colorScale,
  //   circleRadius: 8,
  //   spacing: 20,
  //   textOffset: 12,
  //   backgroundRectWidth: 235
  // });

  //OnMouseOver

  const onMouseOver = (event,d) =>{	
    if(typeof d.dataValue != 'undefined'){
      tooltip.transition().duration(200).style("opacity", .9);		
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
    .on("mouseover", (i,d) => onMouseOver(i,d))
    .on("mouseout", function(d) {   
      tooltip.transition()    
      .duration(500)    
      .style("opacity", 0);
         }).on('click',(i,d) =>{
      let id = d.area_id

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
      tooltip.style('opacity',0);
  })
  // .transition().duration(1000)
  .attr("d" ,feature => pathGenerator(feature));
  

    svg.append("g")
  .attr("class", "legendQuant")
  .attr("transform", "translate(20,20)");

  let legend = legendColor()
    .labelFormat(format(".2f"))
    .title("Legend")
    .titleWidth(100)
    .scale(colorScale);

  svg.select(".legendQuant")
    .call(legend);
    
}, [geometry, dimensions, data,unit])



return ( 
<div ref={wrapperRef}  style={{ marginBottom: "2rem" }}>
  <svg className = "svg-map" ref={svgRef}></svg>
</div>
)};
