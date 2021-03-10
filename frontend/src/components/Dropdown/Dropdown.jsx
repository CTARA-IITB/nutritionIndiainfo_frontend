import React,{useState,useEffect,useRef} from "react";

import {Row, Col } from 'react-bootstrap';
import { TreeSelect,Input } from 'antd';
import { json } from 'd3';
import {SkeletonDropdown} from "../SkeletonCard";
// import { fetchAreaCode,createHierarchy } from '../../utils';
import { createHierarchy } from '../../utils';

const {Search} = Input;
export const Dropdown = ({
    tabId,
    selArea,
    selIndicator,
    selSubgroup,
    selTimeperiod,
    setSelArea,
    setAreaName,
    setSelIndicator,
    setSelSubgroup,
    setSelTimeperiod,
    setLevel,
    level,
    setAreaList,
    setIsLevelThree,
    searchRef,
    filterDropdownValue,
    setFilterDropdownValue,
    areaDropdownOpt,
    setAreaDropdownOpt,
    parentArea,
    isLevelThree,setUnit, isSelected,  setIsSelected, indicatorDropdownOpt, setIndicatorDropdownOpt,subgroupDropdownOpt, setSubgroupDropdownOpt,
    timeperiodDropdownOpt, setTimeperiodDropdownOpt, unit, areaList, setParentArea, stateID, treeRef, openDropdown, setOpenDropdown, setIndicatorSense}) =>{
    
    let tab;
    if(tabId === undefined || tabId === 'section1')
    {
      tab =8;
    }
    else if(tabId === 'section2'){
      tab=1;
    }
    else if(tabId === 'section3'){
      tab=3;
    }
    else if(tabId === 'section4'){ 
      tab=6;
    }
    //Area
    
 


  if(!areaDropdownOpt){
    return <SkeletonDropdown />
  }
  //AntDsearch expand tree

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
  console.log("E in time", e)
  setIsSelected(false);
  setSelTimeperiod(e);
  setIsSelected(true);
}

const indicatorChange = async(e) =>{
  let val = e;
  setIsSelected(false);
  setSelIndicator(e);
  let indiSense = indicatorDropdownOpt.filter(f => f.indicator_id === parseInt(val)).indi_sense;
  console.log("indisense", indiSense);
  setIndicatorSense(indiSense);
  const url_1 = await fetch(`http://localhost:8000/api/subgroup/${val}`);
  const body = await url_1.json()
  console.log("body", {val}, body);
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
  console.log("sub change", e);
  let val = e;
  setSelSubgroup(e);
  console.log("selsubgroup", selSubgroup);
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
    console.log("areaname", title);
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
  console.log("area", value);
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
                onChange={ subgroupChange }
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
                onChange={timeperiodChange }
                />
              </Col>
             
    </Row>
    )
}


