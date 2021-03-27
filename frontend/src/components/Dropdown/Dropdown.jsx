import React,{useState,useEffect,useRef} from "react";
import {Row, Col } from 'react-bootstrap';
import { TreeSelect,Input } from 'antd';
import { json } from 'd3';
import { createHierarchy, setVisulaizationData, setCardData, populateDropdowns } from '../../utils';
import { useParams } from "react-router-dom";
import Cards  from "../../components/Cards/Cards";
import {Trend}  from "../../components/Trend/Trend";
import {BarGraph, BarGraphArea}  from "../../components/BarGraph/BarGraph";
import { feature } from 'topojson';
import { SkeletonCard, SkeletonDropdown, SkeletonMapCard } from "../SkeletonCard";
import { Map } from "../../components/Map/Map";
import "./Dropdown.css";
const {Search} = Input;
export const Dropdown = ({}) =>{
  let { id } = useParams();
  const iniSelArea = '1';  //india
  const [selArea, setSelArea] = useState(iniSelArea);
  const iniSelIndicator = '12';
  const [selIndicator, setSelIndicator] = useState(iniSelIndicator);
  const iniSelSubgroup = '6';  //All
  const [selSubgroup, setSelSubgroup] = useState(iniSelSubgroup);
  const iniSelTimeperiod = '22';  //NHHS5
  const [selTimeperiod, setSelTimeperiod] = useState(iniSelTimeperiod);
  const [unit, setUnit] = useState(1);
  const [areaDropdownOpt, setAreaDropdownOpt] = useState(null);
  const [indicatorDropdownOpt, setIndicatorDropdownOpt] = useState([]);
  const [timeperiodDropdownOpt, setTimeperiodDropdownOpt] = useState([]);
  const [subgroupDropdownOpt, setSubgroupDropdownOpt] = useState([]);
  const [stateID,setStateID] = useState(null);
  const [indicatorSense, setIndicatorSense] = useState('Negative');
  const [isSelected , setIsSelected] = useState(false);
  const [openDropdown,setOpenDropdown] = useState(false);
  const treeRef = useRef();
  const [areaName, setAreaName] = useState('India');
  const [level, setLevel] = useState(1);
  const [areaList, setAreaList] = useState(null);
  const [isLevelThree, setIsLevelThree] = useState(false);
  const searchRef = useRef();
  const [filterDropdownValue, setFilterDropdownValue] = useState([]);
  const [parentArea, setParentArea] = useState(null);
  const [indicatorDetail, setIndicatorDetail] = useState(null);
  const [indicatorTrend, setIndicatorTrend] = useState(null);
  const[indicatorBar, setIndicatorBar]= useState(null);
  const[selIndiaData, setSelIndiaData]= useState(null);
  const [boundaries, setBoundaries] = useState(null);
  const [graphTitle, setGraphTitle] = useState("Prevalence of stunting in under-five year olds");
  const [graphSubgroup, setGraphSubgroup] = useState('All');
  const [graphTimeperiod, setGraphTimeperiod] = useState('NFHS5 2019-20');
  const [graphUnit, setGraphUnit] = useState('Percent');
  const [switchDisplay,setSwitchDisplay] = useState(true);
  const [toggleState, setToggleState] = useState(true);
  const [buttonText, setButtonText] = useState("District");
  const [selStateData, setSelStateData] = useState(null);
  const changeText = (text) => setButtonText(text);




  // let boundaries;
  // let newBoundaries;
  // let Dboundaries;
  // let NewDboundaries;


    let tab =8;
    let indiVal ='12'

      if(id === undefined || id === 'section1')
      {
        tab =8;
        indiVal ='12';
      }
      else if(id === 'section2'){
        tab=1;
        indiVal = '2';  
      }
      else if(id === 'section3'){
        tab=3;
        indiVal = '74';
      }
      else if(id === 'section4'){ 
        tab=6;
        indiVal = '56';
      }

      useEffect(() => {
      async function populateTabData()
      {
        setIsSelected(false);
        let subVal = '6';
        await populateDropdowns(tab, indiVal, subVal, setIndicatorDropdownOpt, setSubgroupDropdownOpt, setSelIndicator, setSelSubgroup, setUnit, setGraphTitle, setGraphSubgroup, setGraphUnit)
        let timeVal = selTimeperiod;
        const  url_2 = await fetch(`http://localhost:8000/api/timeperiod/${indiVal}/${subVal}/${selArea}`);
        const body_2 = await url_2.json();
        setTimeperiodDropdownOpt(body_2);
        setSelTimeperiod(body_2[0].value);
        timeVal = body_2[0].value;
        setGraphTimeperiod(body_2[0].title);
        await setVisulaizationData(indiVal, subVal, timeVal, selArea, parentArea, level, isLevelThree, setIndicatorBar, setIndicatorTrend, setSelIndiaData, setSelStateData, setSwitchDisplay);
        await setCardData(tab, selArea, setIndicatorDetail)
        setIsSelected(true);
      }
      populateTabData();
      }, [id])


      useEffect(() => {
        const url_4 = 'http://localhost:8000/api/area';
        json(url_4).then( options =>{
        const [country,statesID] = createHierarchy(options);
        setStateID(statesID)
        setAreaDropdownOpt(country);
        setAreaList(options);  
        })
        const url = 'http://localhost:8000/api/indicator/'+tab;
        json(url).then( options =>{
          setIndicatorDropdownOpt(options);
        } )
        const url_1 = `http://localhost:8000/api/subgroup/${selIndicator}`;
        json(url_1).then(options => {
          setSubgroupDropdownOpt(options);
        })
        const  url_2 = `http://localhost:8000/api/timeperiod/${selIndicator}/${selSubgroup}/1`;
        json(url_2).then( options =>{
          setTimeperiodDropdownOpt(options);
        } )
        const url_3 = `http://localhost:8000/api/getUnit/${selIndicator}/${selSubgroup}`;
        json(url_3).then(unit => {
          setUnit(unit[0].unit.unit_id)
        })
        const url_5 = `http://localhost:8000/api/getIndicatorDetails/${tab}/${selArea}`;
        json(url_5).then(indicatorDetail => {
          setIndicatorDetail(indicatorDetail)
          })
        const url_6 = `http://localhost:8000/api/getIndicatorTrend/${selIndicator}/${selSubgroup}/${selArea}`;
        json(url_6).then(indicatorTrend => {
            setIndicatorTrend(indicatorTrend)
          })
        const url_7 = `http://localhost:8000/api/getIndicatorBar/${selIndicator}/${selTimeperiod}/${selArea}`;
        json(url_7).then( options =>{
            setIndicatorBar(options);
          })
        const  url_8 = `http://localhost:8000/api/indiaMap/${selIndicator}/${selSubgroup}/${selTimeperiod}/2`
          json(url_8).then(data => {
            setSelIndiaData(data);
          })
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

        useEffect(() => {
          async function fetchData(){

            const jsonIndianstate =
            'https://gist.githubusercontent.com/AnimeshN/b705d4f1a910a16013348e6743d597f4/raw/13ff136e1cd3a90b2fcca370158960dddf74fbee/india_state_old.json';
            const jsonIndiaDistrict = 'https://gist.githubusercontent.com/AnimeshN/9b27088c28f134b51983f1a25012474e/raw/7d551013cc70a2b4f08bc1bebd092f3e53a9ceca/india_district_old_v2.json';
        
    
            const jsonNewIndianstate = 'https://gist.githubusercontent.com/AnimeshN/95d3e079cd1933a0fae19bf3b99b9eec/raw/d0b9a50879e7fb01816cd4ae578219abeb4ec0ac/india_state_nfhs5.json';
            const jsonNewIndiaDistrict = 'https://gist.githubusercontent.com/AnimeshN/262881c21197aa8da0524550b128d639/raw/ffd5cb39d90469934c1072ab7399c16e823fc82e/india_district_new_v3.json';   

            const stateTopology = await json(jsonIndianstate);
            const districtTopology = await json(jsonIndiaDistrict);
            const newStateTopology = await json(jsonNewIndianstate);
            const newDistrictTopology = await json(jsonNewIndiaDistrict);

            const stateObject = stateTopology.objects.india_state_old;
            const districtObject = districtTopology.objects.india_district_old_v2;
            const newStateObject = newStateTopology.objects.india_state_nfhs5;
            const newDistrictObject = newDistrictTopology.objects.india_district_new_v3;
            
            setBoundaries({
              'state':feature(stateTopology,stateObject),
              'dist':feature(districtTopology,districtObject),
              'new_state': feature(newStateTopology,newStateObject),
              'new_dist':feature(newDistrictTopology,newDistrictObject)
            });
          }
          fetchData(); 
        }, []);

        if(!areaDropdownOpt){
          return <SkeletonDropdown />
        }
        const dataList = [];
        const generateList = (data) => {
          for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const { value , title} = node;
            dataList.push({ value, title});
            if (node.children) {
              generateList(node.children);
            }
          }
        };
        generateList(areaDropdownOpt)
     
        const indicatorChange = async(e) =>{
          let val = e;
          setIsSelected(false);
          setSelIndicator(e);
          let indiSense = indicatorDropdownOpt.filter(f => f.value === val)[0].indi_sense;
          let indiName = indicatorDropdownOpt.filter(f => f.value === val)[0].title;
          setGraphTitle(indiName);
          setIndicatorSense(indiSense);
          const url_1 = await fetch(`http://localhost:8000/api/subgroup/${val}`);
          const body = await url_1.json()
          setSubgroupDropdownOpt(body);
          setSelSubgroup(body[0].value);
          setGraphSubgroup(body[0].title);
          let url;
            // data is getting fetched when subdistrict is selected and timeperiod get changing so added this if logic
            if(isLevelThree)
            url = await fetch(`http://localhost:8000/api/timeperiod/${val}/${selSubgroup}/${parentArea}`);
            else
            url = await fetch(`http://localhost:8000/api/timeperiod/${val}/${selSubgroup}/${selArea}`);
            const body_1 = await url.json()
              setTimeperiodDropdownOpt(body_1);
              let flag = false;
              let timeValue = selTimeperiod;
              if(body_1){
                body_1.forEach(timeperiod => {
                  if(timeperiod.value === parseInt(selTimeperiod)){
                    flag = true;
                  }
                });
                if(!flag){
                  timeValue = body_1[0].value;
                  setSelTimeperiod(body_1[0].value);
                  setGraphTimeperiod(body_1[0].title);
                }
            } 
            const url_3 = await fetch(`http://localhost:8000/api/getUnit/${val}/${selSubgroup}`);
            const body_3 = await url_3.json()
            console.log(body_3);
            setUnit(body_3[0].unit.unit_id);
            setGraphUnit(body_3[0].unit.unit_name);
            console.log("ius", val, body[0].value, timeValue, selArea, parentArea, level);
            await setVisulaizationData(val, body[0].value, timeValue, selArea, parentArea, level, isLevelThree, setIndicatorBar, setIndicatorTrend, setSelIndiaData, setSelStateData, setSwitchDisplay);
            setIsSelected(true);
        }

       
 
        const subgroupChange = async(e) =>{
          let val = e;
          setIsSelected(false);
          setSelSubgroup(e);
          let subName = subgroupDropdownOpt.filter(f => f.value === val)[0].title;
          setGraphSubgroup(subName);
          let url;
            // data is getting fetched when subdistrict is selected and timeperiod get changing so added this if logic
            if(isLevelThree)
            url = await fetch(`http://localhost:8000/api/timeperiod/${selIndicator}/${val}/${parentArea}`);
            else
            url = await fetch(`http://localhost:8000/api/timeperiod/${selIndicator}/${val}/${selArea}`);
            const body_1 = await url.json()
              setTimeperiodDropdownOpt(body_1);
              let flag = false;
              let timeValue = selTimeperiod;
              if(body_1){
                body_1.forEach(timeperiod => {
                  if(timeperiod.value === parseInt(selTimeperiod)){
                    flag = true;
                  }
                });
                if(!flag) {
                  timeValue = body_1[0].value;
                  setSelTimeperiod(body_1[0].value);
                  setGraphTimeperiod(body_1[0].title);
                }
            } 
          await setVisulaizationData(selIndicator, val, timeValue, selArea, parentArea, level, isLevelThree, setIndicatorBar, setIndicatorTrend, setSelIndiaData, setSelStateData, setSwitchDisplay);
          setIsSelected(true);
        }

        const timeperiodChange = async(e) =>{
          let val = e;
          setIsSelected(false);
          setSelTimeperiod(e);
          await setVisulaizationData(selIndicator, selSubgroup, val, selArea, parentArea, level, isLevelThree, setIndicatorBar, setIndicatorTrend, setSelIndiaData, setSelStateData, setSwitchDisplay);
          setIsSelected(true);
        }

        const areaChange = async(e) => {
          let value = e
          let newLevel = 1;
          let levelThree = false;
          setIsSelected(false);
            if(value === "1"){
                setLevel(1)
                setIsLevelThree(false);
                levelThree = false;
                
            }
            else if(stateID.indexOf(parseInt(value)) !== -1){
                setIsLevelThree(false);
                levelThree = false;
                newLevel = 2;
                setLevel(2)
            }
            else {
              newLevel = 3;
              setLevel(3);
            }
            setSelArea(value);
            let title = areaList.filter(f => f.area_id === parseInt(value))[0].area_name;
            setAreaName(title);
            treeRef.current.blur()
        
        
          let areaParentId;
          if (level === 3) {
        
            areaParentId = areaList.filter(f => f.area_id === parseInt(selArea))[0].area_parent_id; // loop 1
            let parentName = areaList.filter(f => f.area_id === areaParentId)[0].area_name;  //loop 2  later optimise this
            setAreaName(parentName);
            setParentArea(areaParentId);
            setIsLevelThree(true);
            levelThree = true;
            setLevel(2);
          }
          let url;
            // data is getting fetched when subdistrict is selected and timeperiod get changing so added this if logic
            if(isLevelThree)
            url = await fetch(`http://localhost:8000/api/timeperiod/${selIndicator}/${selSubgroup}/${areaParentId}`);
            else
            url = await fetch(`http://localhost:8000/api/timeperiod/${selIndicator}/${selSubgroup}/${value}`);
            const body_1 = await url.json()
        
              setTimeperiodDropdownOpt(body_1);
              let flag = false;
              let timeValue = selTimeperiod;
              if(body_1){
                body_1.forEach(timeperiod => {
                  if(timeperiod.value === parseInt(selTimeperiod)){
                    flag = true;
                  }
                });
                if(!flag) {
                  timeValue = body_1[0].value;
                  setSelTimeperiod(body_1[0].value);
                  setGraphTimeperiod(body_1[0].title);
                }
            } 
            await setVisulaizationData(selIndicator, selSubgroup, timeValue, value, areaParentId, newLevel, levelThree, setIndicatorBar, setIndicatorTrend, setSelIndiaData, setSelStateData, setSwitchDisplay);
            await setCardData(tab, value, setIndicatorDetail)
            setIsSelected(true);
        
        }

        const onChange = (e) =>{
          setIsSelected(false);
          let { value } = e.target;
          value = value.charAt(0).toUpperCase() + value.slice(1);
          if(value === ""){
            setOpenDropdown(false);
            setFilterDropdownValue(areaDropdownOpt)
          }
          else{
            setOpenDropdown(true);
            const expandedKeys = dataList
            .map((item) => {
              if (item.title.indexOf(value) > -1) {
                return item;
              }
              return null;
            }).filter((item, i, self) => item && self.indexOf(item) === i);
        
            setFilterDropdownValue(expandedKeys)
          }
          setIsSelected(true);
        }
        if (!boundaries || !boundaries.state  || !boundaries.new_state) {
          return <div><SkeletonDropdown /><Row><SkeletonCard /><SkeletonMapCard /> </Row> </div>
        }
      
       
   
    return (
      <>
      <Row className=' mt-3 mb-3'>
      <Col>
            <span className="dropdown-title">Select Area</span>
            {/* <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange}  ref={searchRef}/> */}

            <TreeSelect
                showSearch
                // filterTreeNode={filterTree}
                className='dropdown'
                virtual={false}
                style={{ width: '100%' }}
                value={selArea}
                onFocus={()=>setOpenDropdown(true)}
                onBlur={() => setOpenDropdown(false)}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={(filterDropdownValue.length !==0)?filterDropdownValue:areaDropdownOpt}
                treeDefaultExpandAll={false}
                ref = {treeRef}
                open={openDropdown}
                treeNodeFilterProp ='title'
                onChange={areaChange}
              />
            </Col>

            <Col>
            <span className="dropdown-title">Select Indicator</span>

            <TreeSelect
                showSearch
                // onSearch={onSearch}
                optionFilterProp="children"
                className='dropdown'
                virtual={false}
                style={{ width: '100%' }}
                value={selIndicator}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={indicatorDropdownOpt}
                filterTreeNode
                treeNodeFilterProp ='title'
                onChange={ indicatorChange }
                />
            </Col>

              
                <Col>
            <span className="dropdown-title">Select subgroup</span>

                <TreeSelect
                showSearch
                className='dropdown'
                virtual={false}
                style={{ width: '100%' }}
                value={selSubgroup}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={subgroupDropdownOpt}
                treeNodeFilterProp ='title'
                onChange={ subgroupChange}
                />
                </Col>
        
              <Col>
            <span className="dropdown-title"> Select timeperiod</span>

                <TreeSelect
                showSearch
                className='dropdown'
                virtual={false}
                style={{ width: '100%' }}
                value={selTimeperiod}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={timeperiodDropdownOpt}
               // onChange={value => setSelTimeperiod(value) }
               treeNodeFilterProp ='title'
               onChange={timeperiodChange}
                />
              </Col>
             
    </Row>
 
    
    <div className="layout">
  <div className="layout__body">
    <div className="layout__body__left">
            <div className="layout__body__left__cards">
            {isSelected? <Cards indicatorDetail = {indicatorDetail} setIndicatorDetail = {setIndicatorDetail} selArea ={selArea}
    tab = {tab} setSelIndicator = {setSelIndicator} boundaries = {boundaries}/> : null}
    </div>

    </div>
    <div className="layout__body__right">
    <div className="layout__body__right__r1">
        <div className="layout__body__right__r1__map">

        {isSelected? <Map boundaries={boundaries} 
              selIndiaData={selIndiaData} 
              setSelIndiaData ={setSelIndiaData}
              setLevel={setLevel} 
              level={level} 
              setSelArea={setSelArea} 
              unit={unit} 
              unitName={graphUnit} 
              selArea={selArea} 
              searchRef={searchRef} 
              setFilterDropdownValue={setFilterDropdownValue} 
              areaDropdownOpt={areaDropdownOpt} 
              selIndicator={selIndicator}
              indicatorSense={indicatorSense} 
              isLevelThree = {isLevelThree}
              switchDisplay = {switchDisplay}
              setSwitchDisplay = {setSwitchDisplay}
              selSubgroup = {selSubgroup}
              selTimeperiod = {selTimeperiod}
              parentArea = {parentArea}
              toggleState = {toggleState}
              setToggleState = {setToggleState}
              setSelIndiaData = {setSelIndiaData}
              setIsLevelThree = {setIsLevelThree}
              buttonText = {buttonText}
              changeText = {changeText}
              areaName = {areaName}
              selStateData = {selStateData}
              setSelStateData = {setSelStateData}
              /> : null}

        </div>
        <div className="layout__body__right__r1__trend">
        {isSelected?
      <Trend indicatorTrend = {indicatorTrend}
      setIndicatorTrend = {setIndicatorTrend}
      unit = {unit}
      selTimeperiod = {selTimeperiod}
      selIndicator = {selIndicator}
      selSubgroup = {selSubgroup}
      selArea = {selArea}
      graphTitle = {graphTitle}
      graphSubgroup = {graphSubgroup}
      graphUnit = {graphUnit}
      areaName = {areaName}/>: null}
        </div>
    </div>

    <div className="layout__body__right__r2">
    <div className="layout__body__right__r2__bar1">
    {isSelected? <BarGraphArea 
      indicatorBar = {indicatorBar}
      graphTitle = {graphTitle}
      graphTimeperiod = {graphTimeperiod}
      graphUnit = {graphUnit}
      selIndiaData={selIndiaData} 
      level={level} 
      unit={unit} 
      unitName={graphUnit} 
      selArea={selArea} 
      selIndicator={selIndicator}
      isLevelThree = {isLevelThree}
      selSubgroup = {selSubgroup}
      selTimeperiod = {selTimeperiod}
      areaName = {areaName}
      selStateData = {selStateData}/>: null}
    </div>
    <div className="layout__body__right__r2__bar2">
    {isSelected? <BarGraph indicatorBar = {indicatorBar}
      setIndicatorBar = {setIndicatorBar}
      selIndicator = {selIndicator}
      selTimeperiod = {selTimeperiod}
      selArea = {selArea}
      graphTitle = {graphTitle}
      graphTimeperiod = {graphTimeperiod}
      graphUnit = {graphUnit}
      areaName = {areaName}/>: null}
    </div>
  
    </div>
    {/* <div className="layout__body__left__trend">
      
      </div> */}

    {/* <div className="layout__body__right__map">
  
            </div> */}
    {/* <div className="layout__body__right__bar">
 
      </div> */}
      </div>
    </div>
    </div>
   </>
    )
}