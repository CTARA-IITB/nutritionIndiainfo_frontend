import React, { useState, useEffect, useRef } from 'react';
import { TreeSelect } from 'antd';
import {
  setVisulaizationData,
  populateCategoryDropdown,
  populateDropdowns,
  API,
  token,
} from '../../utils';
import { useParams } from 'react-router-dom';
import { Trend } from '../../components/Trend/Trend';
import { feature } from 'topojson';
import { SkeletonCard, SkeletonDropdown } from '../SkeletonCard';
import { Map } from '../../components/Map/Map';
import { BarArea } from '../../components/Bar/BarArea';
import { Bar } from '../../components/Bar/Bar';
import { EARLY_CHILDHOOD } from '../../constants';

import './Dropdown.css';
import './bootstrap.min.css';
import './tailwind.min.css';
import './dashboard.css';
import './responsive.css';

// dropdown images
import adolescene from './images/lifecycle/Adolescene.png';
import wora from './images/lifecycle/Women-of-Reproductive-Age.png';
import pregnancy from './images/lifecycle/Pregnancy.png';
import delivery from './images/lifecycle/DeliveryPNC.png';
import early_childhood from './images/lifecycle/Early-Childhood.png';
import school_age from './images/lifecycle/School-Age-.png';
import iicon from './images/i-con5.png';
import { NotFound } from '../../NotFound';

export const Dropdown = () => {
  let areaData = require('../../data/areaList.json');
  let country = require('../../data/areaListHierarchy.json');
  let statesID = [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
    23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 4440, 6821,
  ];
  let { queryLifecycle } = useParams();
  const arrayLifecycle = [1, 2, 3, 4, 5, 6];
  const arrayCategory = [1, 2, 3];
  if (typeof queryLifecycle === 'undefined') queryLifecycle = EARLY_CHILDHOOD;
  const [selLifecycle, setSelLifecycle] = useState(parseInt(queryLifecycle));

  let selLifeycleImg;
  switch (selLifecycle) {
    case 1:
      selLifeycleImg = adolescene;
      break;
    case 2:
      selLifeycleImg = wora;
      break;
    case 3:
      selLifeycleImg = pregnancy;
      break;
    case 4:
      selLifeycleImg = delivery;
      break;
    case 5:
      selLifeycleImg = early_childhood;
      break;
    case 6:
      selLifeycleImg = school_age;
      break;
    default:
      break;
  }

  let { queryCategory } = useParams();
  if (typeof queryCategory === 'undefined') queryCategory = 1;
  const [selCategory, setSelCategory] = useState(parseInt(queryCategory));

  let { queryIndicator } = useParams();
  if (typeof queryIndicator === 'undefined') {
    queryIndicator = null;
  }

  const [httpStatusCode, setHttpStatusCode] = useState(null);
  const [httpStatusMsg, setHttpStatusMsg] = useState(null);
  const [selIndicator, setSelIndicator] = useState(null);

  const iniSelArea = '1'; //india
  const [selArea, setSelArea] = useState(iniSelArea);
  const [indicatorDropdownOpt, setIndicatorDropdownOpt] = useState([]);
  const [selTimeperiod, setSelTimeperiod] = useState();
  const [unit, setUnit] = useState(1);
  const [areaDropdownOpt, setAreaDropdownOpt] = useState(null);
  const [timeperiodDropdownOpt, setTimeperiodDropdownOpt] = useState([]);

  const [lifecycledDropdownOpt, setLifecycleDropdownOpt] = useState([]);
  const [categorydDropdownOpt, setCategoryDropdownOpt] = useState([]);
  const [stateID, setStateID] = useState(null);
  const [indicatorSense, setIndicatorSense] = useState('Negative');
  const [isSelected, setIsSelected] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const treeRef = useRef();
  const [areaName, setAreaName] = useState('India');
  const [titleAreaName, setTitleAreaName] = useState('India');
  const [level, setLevel] = useState(1);
  const [areaList, setAreaList] = useState(null);
  const [isLevelThree, setIsLevelThree] = useState(false);
  // const searchRef = useRef();
  // const [filterDropdownValue, setFilterDropdownValue] = useState([]);
  const [parentArea, setParentArea] = useState(null);
  const [indicatorTrend, setIndicatorTrend] = useState(null);
  const [indicatorBar, setIndicatorBar] = useState(null);
  const [selIndiaData, setSelIndiaData] = useState(null);
  const [boundaries, setBoundaries] = useState(null);
  const [graphTitle, setGraphTitle] = useState(
    'Prevalence of stunting in under-five year olds'
  );
  const [graphSubgroup, setGraphSubgroup] = useState('All');
  const [graphTimeperiod, setGraphTimeperiod] = useState('NFHS5 2019-20');
  const [graphUnit, setGraphUnit] = useState('Percent');
  const [switchDisplay, setSwitchDisplay] = useState(true);
  const [toggleState, setToggleState] = useState(true);
  // const [buttonText, setButtonText] = useState("District");
  const [selStateData, setSelStateData] = useState(null);
  const [selDistrictsData, setSelDistrictsData] = useState(null);
  // const changeText = (text) => setButtonText(text);
  // const [burdenbuttonText, setBurdenButtonText] = useState("Burden");
  // const changeBurdenText = (text) => setBurdenButtonText(text);
  const [toggleStateBurden, setToggleStateBurden] = useState(true);
  const [note, setNote] = useState(null);
  const [selBurden, setSelBurden] = useState('1');

  const lifecycleData = [
    { title: 'Adolescence', value: 1 },
    { title: 'Women of Reproductive Age', value: 2 },
    { value: 3, title: 'Pregnancy' },
    { value: 4, title: 'Delivery PNC' },
    { value: 5, title: 'Early childhood' },
    { value: 6, title: 'School age' },
  ];
  // const [drillDirection,setDrillDirection] = useState(true);
  //let burdenIndicators = [12, 13, 17, 18, 19, 20, 29, 107, 108, 53, 62];
  let burdenIndicators = [34, 43, 47, 36, 37, 51, 42, 63, 56, 31, 78, 66];

  useEffect(() => {
    async function populateTabData() {
      setIsSelected(false);
      setToggleState(true);
      setToggleStateBurden(true);
      setLifecycleDropdownOpt(lifecycleData);
      await populateCategoryDropdown(selLifecycle, setCategoryDropdownOpt);
      let catVal = selCategory;
      if (selLifecycle === 1 || selLifecycle === 6) {
        if (selCategory === 2) catVal = 1;
      } else if (selLifecycle === 4) {
        if (selCategory === 1) catVal = 2;
      }

      await populateDropdowns(
        selLifecycle,
        catVal,
        setIndicatorDropdownOpt,
        setSelIndicator,
        setUnit,
        setGraphTitle,
        setGraphUnit,
        selArea,
        parentArea,
        level,
        isLevelThree,
        setIndicatorBar,
        setIndicatorTrend,
        setSelIndiaData,
        setSelStateData,
        setSwitchDisplay,
        setSelDistrictsData,
        setTimeperiodDropdownOpt,
        setSelTimeperiod,
        setGraphTimeperiod,
        setIndicatorSense,
        setNote,
        queryIndicator,
        setHttpStatusCode,
        setHttpStatusMsg
      );
      setIsSelected(true);
    }
    populateTabData();
  }, []);

  // useEffect(() => {
  // const url_4 = 'http://13.234.11.176/api/area';
  // const solr_url_4 = `${API}/api/api/v1/url_4d`;
  // console.log(solr_url_4);
  // const solr_url_4 = "${solr_domain}/solr/${solr_core}/select?fl=value:area_id%2Ccode:area_code%2Ctitle:area_name&group.field=area_id&group.main=true&group=true&omitHeader=true&q=*%3A*&rows=7000&sort=area_id%20asc";
  // json(solr_url_4).then( options =>{
  // const [country,statesID] = createHierarchy(areaData.result.docs);
  // })

  //disabled createHierarchy to improve performance
  // let areaData = require('../../data/areaList.json');
  // let country = require('../../data/areaListHierarchy.json');
  // let statesID = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 4440, 6821];
  // setStateID(statesID)
  // setAreaDropdownOpt(country);
  // setAreaList(areaData.result.docs);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  useEffect(() => {
    async function fetchData() {
      //disabled createHierarchy to improve performance
      setStateID(statesID);
      setAreaDropdownOpt(country);
      setAreaList(areaData.result.docs);

      // const jsonIndianstate =
      // 'https://gist.githubusercontent.com/AnimeshN/b705d4f1a910a16013348e6743d597f4/raw/13ff136e1cd3a90b2fcca370158960dddf74fbee/india_state_old.json';
      // const jsonIndiaDistrict = 'https://gist.githubusercontent.com/AnimeshN/9b27088c28f134b51983f1a25012474e/raw/7d551013cc70a2b4f08bc1bebd092f3e53a9ceca/india_district_old_v2.json';

      // const jsonNewIndianstate = 'https://gist.githubusercontent.com/AnimeshN/88ca1582aae1960b739339013a43a228/raw/5a0a4ef6e454afcda1cf5de43fc24ed5bd2ddf53/india-state_26may.json';
      // const jsonNewIndiaDistrict = 'https://gist.githubusercontent.com/AnimeshN/125da85ce3704409cb25dd53c0d86e98/raw/0117055a2adf7df234b4830b3f09f0b4c572a41c/india_new_dist.json';

      const stateTopology = require('../../data/boundaries/nfhs4/jsonIndianstate.json');
      const districtTopology = require('../../data/boundaries/nfhs4/jsonIndiaDistrict.json');
      const newStateTopology = require('../../data/boundaries/nfhs5/jsonNewIndianstate.json');
      const newDistrictTopology = require('../../data/boundaries/nfhs5/jsonNewIndiaDistrict.json');
      // const newDistrictTopology = require('../../data/boundaries/nfhs5/India_district_30sep2021_topo.json')

      const stateObject = stateTopology.objects.india_state_old;
      const districtObject = districtTopology.objects.india_district_old_v2;
      const newStateObject = newStateTopology.objects['india-state_26may'];
      const newDistrictObject =
        newDistrictTopology.objects['india_new_dist (1)'];
      // const newDistrictObject = newDistrictTopology.objects["India_district_30sep2021"];

      setBoundaries({
        state: feature(stateTopology, stateObject),
        dist: feature(districtTopology, districtObject),
        new_state: feature(newStateTopology, newStateObject),
        new_dist: feature(newDistrictTopology, newDistrictObject),
      });
    }
    fetchData();
  }, []);

  if (!areaDropdownOpt) {
    return <SkeletonDropdown />;
  }
  const dataList = [];
  const generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { value, title } = node;
      dataList.push({ value, title });
      if (node.children) {
        generateList(node.children);
      }
    }
  };
  generateList(areaDropdownOpt);
  const lifecycleChange = async (e) => {
    let val = parseInt(e.target.value);
    setIsSelected(false);
    setSelLifecycle(val);
    setToggleState(true);

    let selCat = 1;
    if (val === 1 || val === 6) {
      setCategoryDropdownOpt([
        { value: 1, title: 'Manifestation' },
        { value: 3, title: 'Determinants' },
      ]);
    } else if (val === 2) {
      setCategoryDropdownOpt([
        { value: 1, title: 'Manifestation' },
        { value: 2, title: 'Interventions' },
        { value: 3, title: 'Determinants' },
      ]);
    } else if (val === 3) {
      setCategoryDropdownOpt([
        { value: 1, title: 'Manifestation' },
        { value: 2, title: 'Interventions' },
        { value: 3, title: 'Determinants' },
      ]);
    } else if (val === 4) {
      setCategoryDropdownOpt([
        { value: 2, title: 'Interventions' },
        { value: 3, title: 'Determinants' },
      ]);
      selCat = 2;
    } else if (val === 5) {
      setCategoryDropdownOpt([
        { value: 1, title: 'Manifestation' },
        { value: 2, title: 'Interventions' },
        { value: 3, title: 'Determinants' },
      ]);
    }
    setSelCategory(selCat);
    await populateDropdowns(
      val,
      selCat,
      setIndicatorDropdownOpt,
      setSelIndicator,
      setUnit,
      setGraphTitle,
      setGraphUnit,
      selArea,
      parentArea,
      level,
      isLevelThree,
      setIndicatorBar,
      setIndicatorTrend,
      setSelIndiaData,
      setSelStateData,
      setSwitchDisplay,
      setSelDistrictsData,
      setTimeperiodDropdownOpt,
      setSelTimeperiod,
      setGraphTimeperiod,
      setIndicatorSense,
      setNote,
      null,
      setHttpStatusCode,
      setHttpStatusMsg
    );
    setSelBurden('1');
    setToggleStateBurden(true);
    setIsSelected(true);
  };

  const categoryChange = async (e) => {
    let val = parseInt(e.target.value);
    setIsSelected(false);
    setSelCategory(val);
    await populateDropdowns(
      selLifecycle,
      val,
      setIndicatorDropdownOpt,
      setSelIndicator,
      setUnit,
      setGraphTitle,
      setGraphUnit,
      selArea,
      parentArea,
      level,
      isLevelThree,
      setIndicatorBar,
      setIndicatorTrend,
      setSelIndiaData,
      setSelStateData,
      setSwitchDisplay,
      setSelDistrictsData,
      setTimeperiodDropdownOpt,
      setSelTimeperiod,
      setGraphTimeperiod,
      setIndicatorSense,
      setNote,
      null,
      setHttpStatusCode,
      setHttpStatusMsg
    );
    setSelBurden('1');
    setToggleStateBurden(true);
    setIsSelected(true);
    setToggleState(true);
  };

  const indicatorChange = async (e) => {
    let val = parseInt(e.target.value);
    setIsSelected(false);
    setToggleState(true);
    if (burdenIndicators.includes(val)) {
      setSelBurden('1');
      setToggleStateBurden(true);
    }
    setSelIndicator(val);
    let indiObject = indicatorDropdownOpt.filter((f) => f.value === val)[0];
    let indiSense;
    let indiName;
    let indiNotes;
    // console.log(indiObject)
    if (indiObject) {
      let indiSense = indiObject.indi_sense;
      let indiName = indiObject.indicator_name;
      let indiNotes = indiObject.notes;
      setGraphTitle(indiName);
      setIndicatorSense(indiSense);
      setNote(indiNotes);
      setUnit(indiObject.unit_id);
      setGraphUnit(indiObject.unit_name);
    }
    let solr_url;
    // solr_url = await fetch(`${solr_domain}/solr/${solr_core}/select?fl=title:timeperiod%2Cvalue:timeperiod_id&sort=timeperiod_id%20desc&fq=lifecycle_id%3A${selLifeycle}%20OR%20lifecycle_id%3A7&fq=category_id%3A${selCategory}&fq=indicator_id%3A${val}&fq=subgroup_id%3A6&fq=area_id%3A${selArea}&q=*%3A*&group=true&group.field=timeperiod_id&group.limit=1&group.main=true&omitHeader=true`);
    solr_url = await fetch(
      `${API}/api/v1/url_1d?selCategory=${selCategory}&selLifecycle=${selLifecycle}&area_id=${selArea}&selIndicator=${val}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    const solr_body_1 = await solr_url.json();
    let flag = false;
    let timeValue = selTimeperiod;
    if (solr_url.status != 200) {
      setHttpStatusCode(solr_url.status);
      setHttpStatusMsg(solr_body_1.message);
    }
    if (solr_url.status === 200) {
      setTimeperiodDropdownOpt(solr_body_1.result.docs);
      if (solr_body_1.result.docs) {
        solr_body_1.result.docs.forEach((timeperiod) => {
          if (timeperiod.value === selTimeperiod) {
            flag = true;
          }
        });
        if (!flag) {
          if (typeof solr_body_1.result.docs[0] !== 'undefined') {
            // added this condition to resolve issue when UT data not present for CNNS Obesity in 10-14 year old
            timeValue = solr_body_1.result.docs[0].value;
            setSelTimeperiod(solr_body_1.result.docs[0].value);
            setGraphTimeperiod(solr_body_1.result.docs[0].title);
          } else {
            setSelTimeperiod('');
            setGraphTimeperiod('');
            timeValue = '';
          }
        }
      }
    }
    // const url_3 = await fetch(`http://13.234.11.176/getUnit/${val}/6`);
    // const solr_url_3 = await fetch(`${solr_domain}/solr/${solr_core}/select?fl=unit_id%2Cunit_name%2Cindicator_id&fq=indicator_id%3A${val}&fq=subgroup_id%3A6&group.field=unit_id&group.main=true&group=true&omitHeader=true&q=*%3A*`);
    // const solr_url_3 = await fetch(`${API}api/api/v1/url_3d?val=${val}` , {
    //   headers:{
    //     Authorization:`${token}`
    //   }
    // })
    // const solr_body_3 = await solr_url_3.json()

    if (timeValue != '')
      await setVisulaizationData(
        val,
        timeValue,
        selArea,
        parentArea,
        level,
        isLevelThree,
        setIndicatorBar,
        setIndicatorTrend,
        setSelIndiaData,
        setSelStateData,
        setSwitchDisplay,
        setSelDistrictsData,
        setHttpStatusCode,
        setHttpStatusMsg
      );
    setIsSelected(true);
  };

  const timeperiodChange = async (e) => {
    let val = parseInt(e.target.value);
    setIsSelected(false);
    setToggleState(true);
    if (burdenIndicators.includes(selIndicator)) {
      setSelBurden('1');
      setToggleStateBurden(true);
    }
    setSelTimeperiod(val);
    let timePeriodName = timeperiodDropdownOpt.filter((f) => f.value === val)[0]
      .title;
    setGraphTimeperiod(timePeriodName);
    await setVisulaizationData(
      selIndicator,
      val,
      selArea,
      parentArea,
      level,
      isLevelThree,
      setIndicatorBar,
      setIndicatorTrend,
      setSelIndiaData,
      setSelStateData,
      setSwitchDisplay,
      setSelDistrictsData,
      setHttpStatusCode,
      setHttpStatusMsg
    );
    setIsSelected(true);
  };

  const areaChange = async (e) => {
    let value = e;
    let newLevel = 1;
    let levelThree = false;
    setIsSelected(false);
    setToggleState(true);
    if (burdenIndicators.includes(selIndicator)) {
      setSelBurden('1');
      setToggleStateBurden(true);
    }
    if (value === '1') {
      setLevel(1);
      setIsLevelThree(false);
      levelThree = false;
    } else if (stateID.indexOf(parseInt(value)) !== -1) {
      setIsLevelThree(false);
      levelThree = false;
      newLevel = 2;
      setLevel(2);
    } else {
      newLevel = 3;
      setLevel(3);
    }
    setSelArea(value);
    let title = areaList.filter((f) => f.area_id === parseInt(value))[0]
      .area_name;
    setAreaName(title);
    setTitleAreaName(title);
    treeRef.current.blur();

    let areaParentId;
    if (newLevel === 3) {
      areaParentId = areaList.filter((f) => f.area_id === parseInt(value))[0]
        .area_parent_id; // loop 1
      let parentName = areaList.filter((f) => f.area_id === areaParentId)[0]
        .area_name; //loop 2  later optimise this
      setAreaName(parentName);
      setParentArea(areaParentId);
      setIsLevelThree(true);
      levelThree = true;
      setLevel(2);
      newLevel = 2;
    }
    let solr_url;
    // solr_url = await fetch(`${solr_domain}/solr/${solr_core}/select?fl=title:timeperiod%2Cvalue:timeperiod_id&sort=timeperiod_id%20desc&fq=lifecycle_id%3A${selLifeycle}%20OR%20lifecycle_id%3A7&fq=category_id%3A${selCategory}&fq=indicator_id%3A${selIndicator}&fq=subgroup_id%3A6&fq=area_id%3A${value}&q=*%3A*&group=true&group.field=timeperiod_id&group.limit=1&group.main=true&omitHeader=true`);

    solr_url = await fetch(
      `${API}/api/v1/url_1d?selCategory=${selCategory}&selLifecycle=${selLifecycle}&area_id=${value}&selIndicator=${selIndicator}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    let solr_body_1 = await solr_url.json();
    let flag = false;
    let timeValue = selTimeperiod;
    if (solr_url.status != 200) {
      setHttpStatusCode(solr_url.status);
      setHttpStatusMsg(solr_body_1.message);
    }
    if (solr_url.status === 200) {
      solr_body_1 = solr_body_1.result.docs;
      setTimeperiodDropdownOpt(solr_body_1);
      if (solr_body_1) {
        solr_body_1.forEach((timeperiod) => {
          if (timeperiod.value === selTimeperiod) {
            flag = true;
          }
        });

        if (!flag) {
          if (typeof solr_body_1[0] !== 'undefined') {
            // added this condition to resolve issue when UT data not present for CNNS Obesity in 10-14 year old
            timeValue = solr_body_1[0].value;
            setSelTimeperiod(solr_body_1[0].value);
            setGraphTimeperiod(solr_body_1[0].title);
          } else {
            setSelTimeperiod('');
            setGraphTimeperiod('');
            timeValue = '';
          }
        }
      }
    }
    if (timeValue != '')
      await setVisulaizationData(
        selIndicator,
        timeValue,
        value,
        areaParentId,
        newLevel,
        levelThree,
        setIndicatorBar,
        setIndicatorTrend,
        setSelIndiaData,
        setSelStateData,
        setSwitchDisplay,
        setSelDistrictsData,
        setHttpStatusCode,
        setHttpStatusMsg
      );
    setIsSelected(true);
  };

  // const onChange = (e) =>{
  //   setIsSelected(false);
  //   let { value } = e.target;
  //   value = value.charAt(0).toUpperCase() + value.slice(1);
  //   if(value === ""){
  //     setOpenDropdown(false);
  //     setFilterDropdownValue(areaDropdownOpt)
  //   }
  //   else{
  //     setOpenDropdown(true);
  //     const expandedKeys = dataList
  //     .map((item) => {
  //       if (item.title.indexOf(value) > -1) {
  //         return item;
  //       }
  //       return null;
  //     }).filter((item, i, self) => item && self.indexOf(item) === i);

  //     setFilterDropdownValue(expandedKeys)
  //   }
  //   setIsSelected(true);
  // }
  if (!boundaries || !boundaries.state || !boundaries.new_state) {
    return <div> </div>;
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

  let burdenDropdown;
  if (!burdenIndicators.includes(selIndicator)) {
    burdenDropdown = (
      <ul className='nav nav-tabs d-flex' id='myTab' role='tablist'>
        <li className='nav-item'>
          <a
            className={`nav-link radius2 ${toggleStateBurden && 'active '}`}
            id='Prevalence'
            data-toggle='tab'
            role='tab'
            aria-controls='Prevalence'
            aria-selected='true'
            onClick={() => {
              setSelBurden('1');
              setToggleStateBurden(true);
            }}
          >
            Prevalence
          </a>
        </li>
        <li className='nav-item nav-item-right'>
          <a
            className={`nav-link radius ${!toggleStateBurden && 'active '}`}
            id='Burden'
            data-toggle='tab'
            role='tab'
            aria-controls='Burden'
            aria-selected='false'
            onClick={() => {
              setSelBurden('2');
              setToggleStateBurden(false);
            }}
          >
            Burden
          </a>
        </li>
      </ul>
    );

    // burdenDropdown =
    //     <Col>

    // <ToggleButtonGroup type="checkbox" value={selBurden} onChange={burdenChange}>
    //   <ToggleButton className={`tg_button ${!toggleStateBurden  && 'tg_button_light'}` } value={1}>Prevalence</ToggleButton>
    //   <ToggleButton className={`tg_button ${toggleStateBurden  && 'tg_button_light'}` } value={2}>Burden</ToggleButton>
    // </ToggleButtonGroup>
    //     </Col>
  } else {
    burdenDropdown = (
      <ul className='nav nav-tabs d-flex' id='myTab' role='tablist'>
        <li className='nav-item'>
          <a
            className='nav-link radius2'
            id='Prevalence'
            data-toggle='tab'
            role='tab'
            aria-controls='Prevalence'
            aria-selected='true'
          >
            Prevalence
          </a>
        </li>
        <li className='nav-item nav-item-right'>
          <a
            className='nav-link radius '
            id='Burden'
            data-toggle='tab'
            role='tab'
            aria-controls='Burden'
            aria-selected='false'
          >
            Burden
          </a>
        </li>
      </ul>
    );

    //   <ToggleButtonGroup type="checkbox" >
    //   <ToggleButton className='tg_button tg_button_light' value={1}>Prevalence</ToggleButton>
    //   <ToggleButton className='tg_button tg_button_light' value={2}>Burden</ToggleButton>
    // </ToggleButtonGroup>
  }

  if (httpStatusCode === 400 || httpStatusCode === 404) {
    return (
      <NotFound httpStatusCode={httpStatusCode} httpStatusMsg={httpStatusMsg} />
    );
  }

  return (
    <>
      <header
        id='main_menu'
        className='p-2 flex flex-wrap
                  justify-between lg:top-0  bg-white lg:sticky z-40'
      >
        <div
          className='row w-100 p-4 for-mobile i-for-mobile-div1'
          style={{ margin: 0 }}
        >
          <div className='col-6 col-lg-5 col-md-6 p-3 for-mobile-1 '>
            <div className='d-flex top-15' style={{ position: 'relative' }}>
              <img src={selLifeycleImg} className='lifecycle-img' />
              <div className='select-lifecycle-parent'>
                <div className='select-lifecycle-child'>
                  <select
                    className='select-lifecycle'
                    value={selLifecycle}
                    onChange={lifecycleChange}
                  >
                    {lifecycleData.map((opt) => (
                      <option key={opt.value + opt.title} value={opt.value}>
                        {opt.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='select-lifecycle-cat-child'>
                  <select
                    className='select-category'
                    value={selCategory}
                    onChange={categoryChange}
                  >
                    {categorydDropdownOpt.map((opt) => (
                      <option key={opt.value + opt.title} value={opt.value}>
                        {opt.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-lg-6 col-md-12 p-3 for-mobile-3 '>
            <div className='row'>
              <div className='col-6 col-lg-3 p-2'>
                <div>
                  <select
                    className='select-border w-100 mt-1'
                    value={selIndicator}
                    onChange={indicatorChange}
                  >
                    {indicatorDropdownOpt.map((opt) => (
                      <option key={opt.value + opt.title} value={opt.value}>
                        {opt.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='col-6 col-lg-3 p-2 '>
                <div className='toogle-button w-full mt-1'>
                  {burdenDropdown}
                  {/* <ul className="nav nav-tabs d-flex" id="myTab" role="tablist">
			                        <li className="nav-item">
			                            <a className="nav-link active" id="Prevalence" data-toggle="tab"  role="tab" aria-controls="Prevalence" aria-selected="true">Prevalence</a>
			                        </li>
			                        <li className="nav-item">
			                            <a className="nav-link radius" id="Burden" data-toggle="tab" role="tab" aria-controls="Burden" aria-selected="false">Burden</a>
			                        </li>
		                    	</ul> */}
                </div>
              </div>
              <div className='col-6 col-lg-3 p-2'>
                <div>
                  <TreeSelect
                    showSearch
                    className='w-100 mt-1'
                    virtual={true}
                    // style={{ width: '100%' }}
                    value={selArea}
                    onFocus={() => setOpenDropdown(true)}
                    onBlur={() => setOpenDropdown(false)}
                    // dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    showSearch={true}
                    treeData={areaDropdownOpt}
                    treeDefaultExpandAll={false}
                    // keepChildrenOnSearch = {true}
                    ref={treeRef}
                    open={openDropdown}
                    filterTreeNode
                    treeNodeFilterProp='title'
                    onChange={areaChange}
                  />

                  {/* <select className="select-border w-100">
									<option>Select a region</option>
									<option>Adolescence</option>
								</select> */}
                </div>
              </div>
              <div className='col-6 col-lg-3 p-2'>
                <div>
                  <select
                    className='select-border w-100 mt-1'
                    value={selTimeperiod}
                    onChange={timeperiodChange}
                  >
                    {timeperiodDropdownOpt.map((opt) => (
                      <option key={opt.value + opt.title} value={opt.value}>
                        {opt.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className='col-6 col-lg-1 col-md-6 p-3 for-mobile-2 i-for-mobile-div3 -mt-6 md:mt-0'>
            <div className='i-class'>
              <a href='/reports/referenceDocuments' target='_blank'>
                <img src={iicon} className='i-icon' title="Visit reference documents for data used on this website" />
              </a>
            </div>
          </div>
        </div>
        {/* <div className="row w-100 p-4" style={{margin: 0}}>
			<div className="col-12 col-lg-6 col-md-12 p-3">
				<img src="images/img1.png" className="img-map"/>
			</div>
			<div className="col-12 col-lg-6 col-md-12 p-3">
				<img src="images/img2.png" className="img-map"/>
			</div>
			<div className="col-12 col-lg-6 col-md-12 p-3">
				<img src="images/img3.png" className="img-map"/>
			</div>
			<div className="col-12 col-lg-6 col-md-12 p-3">
				<img src="images/img4.png" className="img-map"/>
			</div>
		</div> */}
      </header>

      {/* Nakul sir style  */}

      <section id='main_dashboard_container' className='flex flex-col'>
        <section
          id='top_dashboard_row'
          className='flex md:flex-wrap-reverse flex-wrap-reverse'
        >
          <div className='flex w-full md:w-1/2'>
            {isSelected & (selTimeperiod !== '') ? (
              <Trend
                indicatorTrend={indicatorTrend}
                graphTitle={graphTitle}
                graphSubgroup={graphSubgroup}
                graphUnit={graphUnit}
                titleAreaName={titleAreaName}
                graphTimeperiod={graphTimeperiod}
                toggleStateBurden={toggleStateBurden}
                selLifecycle={selLifecycle}
                selCategory={selCategory}
                selIndicator={selIndicator}
                note={note}
              />
            ) : selTimeperiod !== '' ? (
              <SkeletonCard />
            ) : (
              <div id='msg'>No data: please select another area</div>
            )}
          </div>

          <div className=' flex w-full md:w-1/2'>
            {isSelected & (selTimeperiod !== '') ? (
              <Map
                boundaries={boundaries}
                selIndiaData={selIndiaData}
                // setSelIndiaData ={setSelIndiaData}
                setLevel={setLevel}
                level={level}
                // setSelArea={setSelArea}
                unit={unit}
                unitName={graphUnit}
                selArea={selArea}
                // searchRef={searchRef}
                // setFilterDropdownValue={setFilterDropdownValue}
                // areaDropdownOpt={areaDropdownOpt}
                selLifecycle={selLifecycle}
                selCategory={selCategory}
                selIndicator={selIndicator}
                indicatorSense={indicatorSense}
                isLevelThree={isLevelThree}
                switchDisplay={switchDisplay}
                setSwitchDisplay={setSwitchDisplay}
                selTimeperiod={selTimeperiod}
                parentArea={parentArea}
                toggleState={toggleState}
                setToggleState={setToggleState}
                setIsLevelThree={setIsLevelThree}
                // buttonText = {buttonText}
                // changeText = {changeText}
                selStateData={selStateData}
                // setSelStateData = {setSelStateData}
                selDistrictsData={selDistrictsData}
                areaChange={areaChange}
                graphTitle={graphTitle}
                graphTimeperiod={graphTimeperiod}
                graphUnit={graphUnit}
                areaName={areaName}
                titleAreaName={titleAreaName}
                toggleStateBurden={toggleStateBurden}
                // setToggleStateBurden={setToggleStateBurden}
                // burdenbuttonText={burdenbuttonText}
                // changeBurdenText={changeBurdenText}
                // drillDirection = {drillDirection}
                // setDrillDirection ={setDrillDirection}
              />
            ) : selTimeperiod !== '' ? (
              <SkeletonCard />
            ) : (
              <div id='msg'>No data: please select another area</div>
            )}
          </div>
        </section>

        <section id='bottom_dashboard_row' className='flex flex-wrap'>
          <div className=' flex w-full md:w-1/2'>
            {isSelected & (selTimeperiod !== '') ? (
              <BarArea
                indicatorTrend={indicatorTrend}
                graphTitle={graphTitle}
                graphTimeperiod={graphTimeperiod}
                graphUnit={graphUnit}
                selIndiaData={selIndiaData}
                level={level}
                selArea={selArea}
                titleAreaName={titleAreaName}
                areaName={areaName}
                selStateData={selStateData}
                toggleStateBurden={toggleStateBurden}
                selLifecycle={selLifecycle}
                selCategory={selCategory}
                selIndicator={selIndicator}
              />
            ) : selTimeperiod !== '' ? (
              <SkeletonCard />
            ) : (
              <div id='msg'>No data: please select another area</div>
            )}
          </div>

          <div className='flex w-full md:w-1/2'>
            {isSelected & (selTimeperiod !== '') ? (
              <Bar
                indicatorBar={indicatorBar}
                setIndicatorBar={setIndicatorBar}
                selIndicator={selIndicator}
                selTimeperiod={selTimeperiod}
                selArea={selArea}
                graphTimeperiod={graphTimeperiod}
                graphTitle={graphTitle}
                graphUnit={graphUnit}
                titleAreaName={titleAreaName}
                toggleStateBurden={toggleStateBurden}
                selLifecycle={selLifecycle}
                selCategory={selCategory}
                selIndicator={selIndicator}
              />
            ) : selTimeperiod !== '' ? (
              <SkeletonCard />
            ) : (
              <div id='msg'>No data: please select another area</div>
            )}
          </div>
        </section>
      </section>
    </>
  );
};
