import React,{useState,useEffect,useRef} from "react";

import {Row, Col } from 'react-bootstrap';
import { TreeSelect,Input } from 'antd';
import { json } from 'd3';
import {SkeletonDropdown} from "../SkeletonCard";
import { createHierarchy } from '../../utils';
import { useParams } from "react-router-dom";
import Cards  from "../../components/Cards/Cards";
import { useData, useDataDistrict, useDataState, useNewBoundaries ,useNewDistrictBoundaries} from '../UseData'
import { feature } from 'topojson';

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
  const [isSelected , setIsSelected] = useState(true);
  const [openDropdown,setOpenDropdown] = useState(false);
  const treeRef = useRef();
  const [areaName, setAreaName] = useState('IND');
  const [level, setLevel] = useState(1);
  const [areaList, setAreaList] = useState(null);
  const [isLevelThree, setIsLevelThree] = useState(false);
  const searchRef = useRef();
  const [filterDropdownValue, setFilterDropdownValue] = useState([]);
  const [parentArea, setParentArea] = useState(null);
  const [indicatorDetail, setIndicatorDetail] = useState(null);
  const [boundaries, setBoundaries] = useState(null);


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
        const url_3 = `http://localhost:8000/api/getUnit/${selIndicator}`;
        json(url_3).then(unit => {
          setUnit(unit[0].unit)
        })
        const url_5 = `http://localhost:8000/api/getIndicatorDetails/${tab}/${selArea}`;
        json(url_5).then(indicatorDetail => {
          setIndicatorDetail(indicatorDetail)
          })
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

        useEffect(() => {
          const url = 'http://localhost:8000/api/indicator/'+tab;
          json(url).then( options =>{
            setIndicatorDropdownOpt(options);
            setSelIndicator(options[0].value)
          } )
          const url_1 = `http://localhost:8000/api/subgroup/${indiVal}`;
          json(url_1).then(options => {
            setSubgroupDropdownOpt(options);
            setSelSubgroup(options[0].value);
          })
         const  url_2 = `http://localhost:8000/api/timeperiod/${indiVal}/${selSubgroup}/1`;
          json(url_2).then( options =>{
            setTimeperiodDropdownOpt(options);
            setSelTimeperiod(options[0].value)
          } )
          const url_3 = `http://localhost:8000/api/getUnit/${indiVal}`;
          json(url_3).then(unit => {
            setUnit(unit[0].unit)
          })
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [id])

        // const boundaries = useData();
        // const newBoundaries = useNewBoundaries();
        // const Dboundaries = useDataDistrict();
        // const NewDboundaries = useNewDistrictBoundaries();
        // console.log("NEWDBOUND",NewDboundaries)
        // const stateBoundary = useDataState(areaName, Dboundaries);
        // const newDistrictBoundaries = useDataState(areaName, NewDboundaries)

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
        console.log(boundaries)

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
        const timeperiodChange = async(e) =>{
          let val = e;
          setIsSelected(false);
          setSelTimeperiod(e);
          setIsSelected(true);
        }

     
        const indicatorChange = async(e) =>{
          let val = e;
          setIsSelected(false);
          setSelIndicator(e);
          let indiSense = indicatorDropdownOpt.filter(f => f.indicator_id === parseInt(val)).indi_sense;
          setIndicatorSense(indiSense);
          const url_1 = await fetch(`http://localhost:8000/api/subgroup/${val}`);
          const body = await url_1.json()
          setSubgroupDropdownOpt(body);
          setSelSubgroup(body[0].value);
          let url;
            // data is getting fetched when subdistrict is selected and timeperiod get changing so added this if logic
            if(isLevelThree)
            url = await fetch(`http://localhost:8000/api/timeperiod/${val}/${selSubgroup}/${parentArea}`);
            else
            url = await fetch(`http://localhost:8000/api/timeperiod/${val}/${selSubgroup}/${selArea}`);
            const body_1 = await url.json()
              setTimeperiodDropdownOpt(body_1);
              let flag = false;
              if(body_1){
                body_1.forEach(timeperiod => {
                  if(timeperiod.value === parseInt(selTimeperiod)){
                    flag = true;
                  }
                });
                if(!flag) setSelTimeperiod(body_1[0].value)
            } 
            const url_3 = await fetch(`http://localhost:8000/api/getUnit/${val}/${selSubgroup}`);
            const body_3 = await url_3.json()
            setUnit(body_3[0].unit)
            setIsSelected(true);
        }
        
        const subgroupChange = async(e) =>{
          let val = e;
          setSelSubgroup(e);
          setIsSelected(false);
          let url;
            // data is getting fetched when subdistrict is selected and timeperiod get changing so added this if logic
            if(isLevelThree)
            url = await fetch(`http://localhost:8000/api/timeperiod/${selIndicator}/${val}/${parentArea}`);
            else
            url = await fetch(`http://localhost:8000/api/timeperiod/${selIndicator}/${val}/${selArea}`);
            const body_1 = await url.json()
              setTimeperiodDropdownOpt(body_1);
              let flag = false;
              if(body_1){
                body_1.forEach(timeperiod => {
                  if(timeperiod.value === parseInt(selTimeperiod)){
                    flag = true;
                  }
                });
                if(!flag) setSelTimeperiod(body_1[0].value)
            } 
          setIsSelected(true);
        }

        const areaChange = async(e) => {
          let value = e
          setIsSelected(false);
            if(value === "1"){
                setLevel(1)
                setIsLevelThree(false);
            }
            else if(stateID.indexOf(parseInt(value)) !== -1){
                setIsLevelThree(false);
                setLevel(2)
            }
            else setLevel(3);
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
              if(body_1){
                body_1.forEach(timeperiod => {
                  if(timeperiod.value === parseInt(selTimeperiod)){
                    flag = true;
                  }
                });
                if(!flag) setSelTimeperiod(body_1[0].value)
            } 
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
          
        }
   
    return (
      <>
      <Row className=' mt-3 '>
      <Col>
            <span className="dropdown-title">Select Area</span>
            <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange}  ref={searchRef}/>

            <TreeSelect
                // showSearch
                // filterTreeNode={filterTree}
                // treeNodeFilterProp ={'value'}
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
                treeNodeFilterProp
                onChange={ indicatorChange }
                />
            </Col>

              
                <Col>
            <span className="dropdown-title">Select subgroup</span>

                <TreeSelect
                className='dropdown'
                virtual={false}
                style={{ width: '100%' }}
                value={selSubgroup}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={subgroupDropdownOpt}
                onChange={ subgroupChange}
                />
                </Col>
        
              <Col>
            <span className="dropdown-title"> Select timeperiod</span>

                <TreeSelect
                className='dropdown'
                virtual={false}
                style={{ width: '100%' }}
                value={selTimeperiod}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={timeperiodDropdownOpt}
                onChange={value => setSelTimeperiod(value) }
                />
              </Col>
             
    </Row>
 
    
    <div className="layout">
  <div className="layout__body">
    <div className="layout__body__left">
            <div className="layout__body__left__cards">
    <Cards indicatorDetail = {indicatorDetail} setIndicatorDetail = {setIndicatorDetail} selArea ={selArea}
    tab = {tab} setSelIndicator = {setSelIndicator} boundaries = {boundaries}/>
    </div>
    </div>
    </div>
    </div>
   </>
    )
}