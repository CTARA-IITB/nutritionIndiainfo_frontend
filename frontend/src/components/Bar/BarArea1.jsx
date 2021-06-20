import React, { useRef, useEffect,useState} from 'react';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import SideNavSecond from "../SideNav/SideNavSecond";
import * as d3 from 'd3';
import './BarArea.css'

const width = window.screen.width/2
const height = window.screen.height/2
const barSize = 13
const margin = {
    left: 160,
    top: 120,
    right: 60,
    bottom: 15,
};

function BarArea1({graphTitle,graphTimeperiod, graphUnit,selIndiaData,level,selArea,titleAreaName, areaName,selStateData, toggleStateBurden, selIndicator}) {

    const svgRef = useRef();
    const screen = useFullScreenHandle();
    const [data, setData] = useState(null);
    const [table,setTable] = useState(null);

    const innerHeight =  height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right -165

    let stateDataValue,stateAreaName;
    let colorScale ='#eda143';

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
    else if(selIndicator == 123 || selIndicator == 26 || selIndicator == 125)
      colorScale = '#b71c1c'; 
    else
      colorScale = '#eda143'; 

    let barGUnit = graphUnit;

    useEffect(()=>{

        let cleanData = [];
        let barLabel=[];
        let barData=[];
        let cleanTable = [];
        
        if(selIndiaData && level=="1" ){
        
            selIndiaData.map(i=>{
                if(toggleStateBurden === true){
                    if(!isNaN(i.data_value)){
                        barLabel.push(i.area_name)
                        barData.push(+i.data_value)
                    }
                }      
                else{
                    if(!isNaN(i.data_value_num)){
                        barLabel.push(i.area_name)
                        barData.push(+i.data_value_num)
                    }
                }
                
            })
        }        
        if(selStateData && (level=="2" || level=="3")){
            for(let j=0;j<selIndiaData.length;j++){
    
                if(+selArea===selIndiaData[j].area_id && selIndiaData[j].area_name!==areaName){ 
    
                    if(toggleStateBurden === true){
                        if(!isNaN(selIndiaData[j].data_value)){
                            stateDataValue=selIndiaData[j].data_value;
                            stateAreaName=selIndiaData[j].area_name;
                        }
                        
                    }
                    else{
                        if(!isNaN(selIndiaData[j].data_value_num)){
                            stateDataValue=selIndiaData[j].data_value_num;
                            stateAreaName=selIndiaData[j].area_name;
                        }
                    }
                   
                    barLabel.push(stateAreaName)
                    barData.push(stateDataValue)
                }           
            }
            selStateData.map(i=>{
                if(i.area_name!==areaName){
                    if(toggleStateBurden === true){
                        if(!isNaN(i.data_value)){
                            barLabel.push(i.area_name)
                            barData.push(+i.data_value)
                        }
                    }      
                    else{
                        if(!isNaN(i.data_value_num)){
                            barLabel.push(i.area_name)
                            barData.push(+i.data_value_num)
                        }
                    }
                }
            })
        }     
            
        if(toggleStateBurden === false)
        barGUnit = 'Number';

        // table details    
        for(var i=0;i<barLabel.length;i++){
            cleanTable.push({
                area:barLabel[i],
                data:+barData[i],
            })
        }   
        // sort the table
        const compareObjects=(object1, object2, key)=>{
            const obj1 = object1.data
            const obj2 = object2.data

            if (obj1 < obj2) {
            return -1
            }
            if (obj1 > obj2) {
            return 1
            }
            return 0
        }
        cleanTable.sort((d1, d2) => {
            return compareObjects(d1, d2,)
        })

        cleanTable.map(i=>{
            cleanData.push({
                area:i.area,
                data:+i.data
            })
        })
        setTable(cleanTable);
        setData(cleanData);

    },[])   
    
    useEffect(()=>{
        if(data){
            console.log(data)
            const svg = d3.select(svgRef.current)

            var x = d3.scaleLinear().range([0, innerWidth]);
            var y = d3.scaleBand();


            const g = svg.append('g')
                        .attr('transform',`translate(${margin.left},${margin.top})`)

            x.domain([0, d3.max(data, function(d) { return d.data; })]);
            y.domain(data.map(function(d) { return d.area; })).padding(0.2)
                .range([barSize*data.length, 0]);


            g.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (barSize*data.length) + ")")
                .call(d3.axisBottom(x).ticks(5).tickFormat(function(d) { return parseInt(d / 1000); }).tickSizeInner([-innerHeight]));

            g.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(y));

            g.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("fill", colorScale)
                .attr("class", "bar")
                .attr("x", 0)
                .attr("height", y.bandwidth())
                .attr("y", function(d) { return y(d.area); })
                //.attr("font-size",".5px")
                .attr("width", function(d) { return x(d.data); })
        }    

    },[data,toggleStateBurden])

    const checkchange = (state,handle)=>{
        // if(bar_area){
        //   if(state === true){
        //     bar_area[0].style.height = "100vh";
        //   }
        //   else if(state === false){
        //     if(bar_area[0] != undefined)
        //     bar_area[0].style.height = "65vh";
        //   }
        // }
    }


    return (
        <>
            <FullScreen  className="fullscreen_css" handle={screen}  onChange={checkchange}>
            <SideNavSecond table={table} id="BarArea" screen={screen} timePeriod={graphTimeperiod} componentRef={svgRef} />
                <div className="bar_area">
                    <svg id="BarArea" width={width} height={height+500} ref={svgRef}/>
                </div>
            </FullScreen>
        </>
    )
}
export default BarArea1
