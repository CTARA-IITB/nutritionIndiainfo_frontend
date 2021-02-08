import React,{useRef,useEffect} from 'react';
// import { geoMercator, format, geoPath, scaleQuantize, scaleSequential,extent,select,interpolateOrRd } from 'd3';
import _ from 'lodash';
import useResizeObserver from "../../useResizeObserver";
import { legendColor } from 'd3-svg-legend'
import { Row, Col } from 'react-bootstrap';
// import { geoMercator, precisionFixed, format, geoPath, scaleQuantize, scaleThreshold,extent,select,interpolateRdYlGn, interpolateReds, scaleLinear, schemeReds, schemeRdYlGn, formatPrefix } from 'd3';
import { geoMercator, format, geoPath, scaleQuantize,extent,select, schemeReds,geoCentroid,scaleOrdinal } from 'd3';

import { InfoCircleFill } from 'react-bootstrap-icons';
import { Switch } from 'antd';
import { AnimateOnChange } from 'react-animation';

import "./Map.css";



export const Map = ({geometry, data, onMapClick,setLevel,level,setSelArea,unit,unitName,selArea,isLevelThree,setIsLevelThree,handleClick,searchRef,setFilterDropdownValue,areaDropdownOpt, selIndicator}) =>{
const svgRef = useRef();
const svgLegRef = useRef();
const wrapperRef = useRef();
const dimensions = useResizeObserver(wrapperRef);
// const [colorScale,setColorScale] = useState();
console.log("selIndicator", selIndicator);
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

let color_range = _.map(data, d =>{
  return +d.data_value
});
let [min,max] = extent(color_range);
// let comp = (max - min)/3;
// let low = min + comp;
// let high = max - comp;

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

let low = 10.0;
let medium= 20.0;
let high= 30.0;
if(selIndicator == 12)
{
  low = 20.0;
  medium = 30.0;
  high = 40.0;
} else if(selIndicator == 19)
{
   low = 5.0;
   medium = 10.0;
   high = 15.0;
}



let colorScale2 = (v) =>{
  if (typeof v != "undefined") {
      let selectedColor;
        if (v < low) {selectedColor =  "#24562B";}//matte green
        else if (v >= low && v < medium) {selectedColor =  "#FFE338";}//matte yellow
        else if (v >= medium && v < high) {selectedColor =  "#E26313";} //matte orange
        else if (v >= high) {selectedColor =  "#B2022F";} //matte red
      return selectedColor;
  }
  else {
    return "#A9A9B0";
  }
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
  let mergedGeometry = addProperties(geometry.features,data);


  // let c1Value  = d => d.data_value;
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
          if(unit === 2)
            return "#fff";
          else
          return colorScale2(c2Value(d))
      })
    // .style("fill", d =>{
    //   if (typeof c2Value(d) != "undefined")
    //     return colorScale(c2Value(d))
    //   else
    //     return "#A9A9B0";
    // })
    .style("opacity",d =>{
      if(d.area_id !== parseInt(selArea) && isLevelThree){
        return ".2"
      }
    })
    .on("mousemove", (i,d) => onMouseMove(i,d))
    .on("mouseout", function(d) {   
      tooltip
      // .transition()    
      // .duration(500)    
      .style("opacity", 0); 
    }).on('click',(i,d) =>{
      setIsLevelThree(false);
      // let id = d.area_id
      tooltip.style('opacity',0);
      if(level === 1){
        
        if(typeof c2Value(d) != "undefined"){
          setSelArea(''+d.area_id);
          setLevel(2);
          onMapClick(d.areaname);
        }
      }else if(level === 2){
        setSelArea("1");  //india
        setLevel(1);
        searchRef.current.state.value="";  //reset search to
        setFilterDropdownValue(areaDropdownOpt); //reset dorpdown values
      }
      // tooltip.style('opacity',1);
  })
  // .transition().duration(1000)
  .attr("d" ,feature => pathGenerator(feature));

console.log('>>>',svg.selectAll(".geoCentroid"))
svg  
    .selectAll(".geoCentroid").remove();

  // bubbles for numeric unit values
if(unit === 2){
  svg  
    .selectAll(".geoCentroid").remove();
  var centroids_obj = [];
  var features = geometry.features;

  var centroids = features.map(function (feature){
    return [geoCentroid(feature),feature.properties.ID_];
  });
  //centroid_obj is like merged geometry for polygon
  
var len = centroids.length;
for (var i = 0; i < len; i++) {
  centroids_obj.push({
        latitude: centroids[i][0][0],
        longitude: centroids[i][0][1],
        area_id: centroids[i][1],
        area_name: '',
        data_value:''
    });
}


var len1 = data.length;
for(var i=0; i<len1;i++){
    for(var j=0;j<len;j++){
      if(data[i].area.area_code==centroids_obj[j].area_id){
          centroids_obj[j].area_name=data[i].area.area_name;
          centroids_obj[j].data_value=data[i].data_value;
          
      }
}
}
let c3value = d=> d.data_value;

let color_range_bubble_ = _.map(centroids_obj, d =>{
  return +d.data_value
});
let [min_b,max_b] = extent(color_range_bubble_);

//wasting
var color0 = scaleOrdinal()
.domain([min_b,max_b])
.range([ "#faafb3","#f76870","#f53d47","#9c1017"])

//stunting
var color1 = scaleOrdinal()
.domain([min_b,max_b])
.range([ "#d4f5a6","#b7fa5a","#6cad11","#3a5219"])


//underweight
var color2 = scaleOrdinal()
.domain([min_b,max_b])
.range([ "#c6e2f7","#5cb6fa","#1c69a3","#0b436e"])

//overwieght
var color3 = scaleOrdinal()
.domain([min_b,max_b])
.range([ "#dbb3f2","#c17aeb","#8b34bf","#321345"])

//everythin else
let color4= scaleOrdinal()
    .domain([min,max])
    .range([ "#24562B","#FFE338","#B2022F","#7d0a1f"])

let color_b;
if(selIndicator==156){
  color_b=color1;
}else if(selIndicator==160){
  color_b=color0;
}else if(selIndicator==158){
  color_b=color2;
}else if(selIndicator==167){
  color_b=color3;
}else{
  color_b=color4;
}


// var color = scaleOrdinal()
// .domain([min_b,max_b])
// .range([ "#faafb3","#f76870","#f53d47","#9c1017"])

console.log(centroids_obj)
  svg  
    .selectAll(".geoCentroid")
    .data(centroids_obj)
    .enter().append("circle")
      .attr("class", "geoCentroid")
      .style("fill", function(d){ return color_b(d.data_value) })
      .style("opacity",0.5)
      .attr("r",function (d) { return (Math.cbrt(d.data_value/100)); })
		  .attr("cx", d =>projection([d.latitude,d.longitude])[0])
		  .attr("cy", d =>projection([d.latitude,d.longitude])[1])
      .on("mousemove", (i,d) => onMouseMove(i,d))
      .on("mouseout", function(d) {   
        tooltip   
        .style("opacity", 0); 
      }).on('click',(i,d) =>{
        setIsLevelThree(false);
        tooltip.style('opacity',0);
        if(level === 1){
          
          if(typeof c3value(d) != "undefined"){
            setSelArea(''+d.area_code);
            setLevel(2);
            onMapClick(d.area_name);
          }
        }else if(level === 2){
          setSelArea("1");  //india
          setLevel(1);
          searchRef.current.state.value="";  //reset search to
          setFilterDropdownValue(areaDropdownOpt); //reset dorpdown values
        }
        // tooltip.style('opacity',1);
    })
}
  
    
  

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
    .titleWidth(180)
    .scale(colorScale);

    legend.select(".legendQuant")
    .call(myLegend);
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [geometry, dimensions, data,unit])



return ( 
  <>
  <Col xs={12} lg={8}>
<div ref={wrapperRef}  style={{ marginBottom: "2rem" }}>
  <svg className = "svg-map" ref={svgRef} ></svg>
</div>
</Col>
<Col className="d-flex-column align-content-center align-content-center ">
<Row>
  <Switch className="mb-2"size="large" checkedChildren="District Level" unCheckedChildren="State Level" onClick={handleClick} />
  </Row>
  <Row>
  <svg className = "svg-legend" ref={svgLegRef}></svg>
  </Row>
  <Row>

{/* <AnimateOnChange  durationOut="500">
<span className='d-flex'><InfoCircleFill color="lightgreen" size={18}  /><div id="info-msg" >{statusMsg}</div></span>  
{/* <div><h1>{level}</h1></div> */}
{/* </AnimateOnChange> */} 

  </Row>
  

</Col>
</>
)};
