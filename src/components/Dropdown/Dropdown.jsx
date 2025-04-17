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
import { SkeletonDropdown, SkeletonQuadrant } from '../SkeletonCard';
import { Map } from '../../components/Map/Map';
import { BarArea } from '../../components/Bar/BarArea';
import { Bar } from '../../components/Bar/Bar';
import {
  ADOLESCENCE,
  WORA,
  PREGNANCY,
  DELIVERY_PNC,
  EARLY_CHILDHOOD,
  SCHOOL_AGE,
  INDIA,
} from '../../constants';
import { MANIFESTATION, INTERVENTIONS } from '../../constants';

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
  let areaData = require('../../data/areaList.json'); // flat list of area
  let country = require('../../data/areaListHierarchy.json'); // nested list of area for dropdown
  let statesID = [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
    23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 4440, 6821,
  ];
  let { queryLifecycle } = useParams();
  const arrayLifecycle = [1, 2, 3, 4, 5, 6];
  const arrayCategory = [1, 2, 3];
  if (
    typeof queryLifecycle === 'undefined' ||
    !arrayLifecycle.includes(parseInt(queryLifecycle))
  )
    queryLifecycle = EARLY_CHILDHOOD;
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
  if (
    typeof queryCategory === 'undefined' ||
    !arrayCategory.includes(parseInt(queryCategory))
  )
    queryCategory = MANIFESTATION;

  const [selCategory, setSelCategory] = useState(parseInt(queryCategory));

  let { queryIndicator } = useParams();
  if (typeof queryIndicator === 'undefined') {
    queryIndicator = null;
  }

  const [httpStatusCode, setHttpStatusCode] = useState(null);
  const [httpStatusMsg, setHttpStatusMsg] = useState(null);
  const [selIndicator, setSelIndicator] = useState(null);

  const [selArea, setSelArea] = useState(INDIA);
  const [indicatorDropdownOpt, setIndicatorDropdownOpt] = useState([]);
  const [selTimeperiod, setSelTimeperiod] = useState();
  const [unit, setUnit] = useState(1);
  const [areaDropdownOpt, setAreaDropdownOpt] = useState(null);
  const [timeperiodDropdownOpt, setTimeperiodDropdownOpt] = useState([]);
  const lifecycleData = [
    { title: 'Adolescence', value: 1 },
    { title: 'Women of Reproductive Age', value: 2 },
    { value: 3, title: 'Pregnancy' },
    { value: 4, title: 'Delivery PNC' },
    { value: 5, title: 'Early childhood' },
    { value: 6, title: 'School age' },
  ];
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
  const [parentArea, setParentArea] = useState(null);
  const [indicatorTrend, setIndicatorTrend] = useState(null);
  const [indicatorBar, setIndicatorBar] = useState(null);
  const [selIndiaData, setSelIndiaData] = useState(null);
  const [boundaries, setBoundaries] = useState(null);
  const [graphTitle, setGraphTitle] = useState(
    'Prevalence of stunting in under-five year olds'
  );
  const [graphTimeperiod, setGraphTimeperiod] = useState('NFHS5 2019-20');
  const [graphUnit, setGraphUnit] = useState('Percent');
  const [switchDisplay, setSwitchDisplay] = useState(true);
  const [toggleState, setToggleState] = useState(true);
  const [selStateData, setSelStateData] = useState(null);
  const [selDistrictsData, setSelDistrictsData] = useState(null);
  const [toggleStateBurden, setToggleStateBurden] = useState(true);
  const [note, setNote] = useState(null);

  let burdenIndicators = [34, 43, 47, 36, 37, 51, 42, 63, 56, 31, 78, 66];

  useEffect(() => {
    async function populateTabData() {
      setIsSelected(false);
      setToggleState(true);
      await populateCategoryDropdown(selLifecycle, setCategoryDropdownOpt);
      let catVal = selCategory;
      // if (selLifecycle === ADOLESCENCE || selLifecycle === SCHOOL_AGE) {
      //   if (selCategory === INTERVENTIONS) catVal = 1;
      // } else if (selLifecycle === DELIVERY_PNC) {
      //   if (selCategory === MANIFESTATION) catVal = 2;
      // }

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
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    async function fetchData() {
      //disabled createHierarchy to improve performance
      setStateID(statesID);
      setAreaDropdownOpt(country);
      setAreaList(areaData.result.docs);

      const stateTopology = require('../../data/boundaries/nfhs4/jsonIndianstate.json'); // NFHS4 state vector layer
      const districtTopology = require('../../data/boundaries/nfhs4/jsonIndiaDistrict.json'); // NFHS4 district vector layer
      const newStateTopology = require('../../data/boundaries/nfhs5/jsonNewIndianstate.json'); // NFHS5 state vector layer
      const newDistrictTopology = require('../../data/boundaries/nfhs5/dist_16_dec_2021_dissolved.json'); // NFHS5 district vector layer

      //conversion from topojson to geojson
      const stateObject = stateTopology.objects.india_state_old;
      const districtObject = districtTopology.objects.india_district_old_v2;
      const newStateObject = newStateTopology.objects['india-state_26may'];
      const newDistrictObject =
        newDistrictTopology.objects['dist_16_dec_2021_dissolved'];

      setBoundaries({
        state: feature(stateTopology, stateObject),
        dist: feature(districtTopology, districtObject),
        new_state: feature(newStateTopology, newStateObject),
        new_dist: feature(newDistrictTopology, newDistrictObject),
      });
    }
    fetchData();
    // eslint-disable-next-line
  }, []);
let sel_area_names= []
for (let i = 0; i < areaData.result.docs.length; i++) {
  if(areaData.result.docs[i].area_parent_id==selArea){
    sel_area_names.push({area_code: areaData.result.docs[i].area_code,
    area_id: areaData.result.docs[i].area_id,
    area_level: areaData.result.docs[i].area_level,
    area_name: areaData.result.docs[i].area_name,
    data_value: undefined,
    data_value_num: undefined})
  }


}

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

    let selCat = MANIFESTATION;
    if (val === SCHOOL_AGE) {
      setCategoryDropdownOpt([
        { value: 1, title: 'Manifestation' },
        { value: 3, title: 'Determinants' },
      ]);
    } else if (val === WORA || val === ADOLESCENCE) {
      setCategoryDropdownOpt([
        { value: 1, title: 'Manifestation' },
        { value: 2, title: 'Interventions' },
        { value: 3, title: 'Determinants' },
      ]);
    } else if (val === PREGNANCY) {
      setCategoryDropdownOpt([
        { value: 1, title: 'Manifestation' },
        { value: 2, title: 'Interventions' },
        { value: 3, title: 'Determinants' },
      ]);
    } else if (val === DELIVERY_PNC) {
      setCategoryDropdownOpt([
        { value: 2, title: 'Interventions' },
        { value: 3, title: 'Determinants' },
      ]);
      selCat = INTERVENTIONS;
    } else if (val === EARLY_CHILDHOOD) {
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
    setToggleStateBurden(true);
    setIsSelected(true);
    setToggleState(true);
  };

  const indicatorChange = async (e) => {
    let val = parseInt(e.target.value);
    setIsSelected(false);
    setToggleState(true);
    if (burdenIndicators.includes(val)) {
      setToggleStateBurden(true);
    }
    setSelIndicator(val);
    let indiObject = indicatorDropdownOpt.filter((f) => f.value === val)[0];
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
    if (solr_url.status !== 200) {
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

    if (timeValue !== '')
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
    if (treeRef.current)
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
    if (solr_url.status !== 200) {
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
    if (timeValue !== '')
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

  if (!boundaries || !boundaries.state || !boundaries.new_state) {
    return <div> </div>;
  }

  let burdenDropdown;
  if (!burdenIndicators.includes(selIndicator)) {
    burdenDropdown = (
      <ul className='nav nav-tabs d-flex' id='myTab' role='tablist'>
        <li className='nav-item'>
          <a
            href={() => false}
            className={`nav-link radius2 ${toggleStateBurden && 'active '}`}
            id='Prevalence'
            data-toggle='tab'
            role='tab'
            aria-controls='Prevalence'
            aria-selected='true'
            onClick={() => {
              setToggleStateBurden(true);
            }}
          >
            Prevalence
          </a>
        </li>
        <li className='nav-item nav-item-right'>
          <a
            href={() => false}
            className={`nav-link radius ${!toggleStateBurden && 'active '}`}
            id='Burden'
            data-toggle='tab'
            role='tab'
            aria-controls='Burden'
            aria-selected='false'
            onClick={() => {
              setToggleStateBurden(false);
            }}
          >
            Burden
          </a>
        </li>
      </ul>
    );
  } else {
    burdenDropdown = (
      <ul className='nav nav-tabs d-flex' id='myTab' role='tablist'>
        <li className='nav-item'>
          <a
            href={() => false}
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
            href={() => false}
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
  }

  if (httpStatusCode === 400 || httpStatusCode === 404) {
    return (
      <NotFound httpStatusCode={httpStatusCode} httpStatusMsg={httpStatusMsg} />
    );
  }

  return (
    <>
      {isSelected ? (
        <div>
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
                  <img
                    src={selLifeycleImg}
                    alt=''
                    className='lifecycle-img'
                    alt='India State wise NFHS-5 Reports'
                  />
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
                        className='select-border w-100 mt-1 paddingOffset'
                        value={selIndicator}
                        onChange={indicatorChange}
                      >
                        {indicatorDropdownOpt
                          .sort((a, b) => a.title.localeCompare(b.title))
                          .map((opt) => (
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
                    </div>
                  </div>
                  <div className='col-6 col-lg-3 p-2'>
                    <div>
                      <TreeSelect
                        // showSearch
                        className='w-100 mt-1 paddingOffset'
                        virtual={true}
                        value={selArea}
                        onFocus={() => setOpenDropdown(true)}
                        onBlur={() => setOpenDropdown(false)}
                        showSearch={true}
                        treeData={areaDropdownOpt}
                        treeDefaultExpandAll={false}
                        ref={treeRef}
                        open={openDropdown}
                        filterTreeNode
                        treeNodeFilterProp='title'
                        onChange={areaChange}
                      />
                    </div>
                  </div>
                  <div className='col-6 col-lg-3 p-2'>
                    <div>
                      <select
                        className='select-border w-100 mt-1 paddingOffset'
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
                  <a
                    href='/reports/reference-documents/'
                    target='_blank'
                    alt='India State wise NFHS-5 Reports'
                  >
                    <img
                      src={iicon}
                      className='i-icon'
                      alt=''
                      title='Visit reference documents for data used on this website'
                      alt='India State wise NFHS-5 Reports'
                    />
                  </a>
                </div>
              </div>
            </div>
          </header>

          <section id='main_dashboard_container' className='flex flex-col'>
            <section
              id='top_dashboard_row'
              className='flex md:flex-wrap-reverse flex-wrap-reverse'
            >
              <div
                className='flex w-full md:w-1/2'
                alt='India State wise NFHS-5 Reports'
              >
                {selTimeperiod !== '' ? (
                  <Trend
                    indicatorTrend={indicatorTrend}
                    graphTitle={graphTitle}
                    graphSubgroup='All'
                    graphUnit={graphUnit}
                    titleAreaName={titleAreaName}
                    graphTimeperiod={graphTimeperiod}
                    toggleStateBurden={toggleStateBurden}
                    selLifecycle={selLifecycle}
                    selCategory={selCategory}
                    selIndicator={selIndicator}
                    note={note}
                  />
                ) : (
                  <div id='msg'>No data: please select another area</div>
                )}
              </div>

              <div
                className=' flex w-full md:w-1/2'
                alt='India State wise NFHS-5 Reports'
              >
                {selTimeperiod !== '' ? (
                  <Map
                    boundaries={boundaries}
                    selIndiaData={selIndiaData}
                    setLevel={setLevel}
                    level={level}
                    unit={unit}
                    unitName={graphUnit}
                    selArea={selArea}
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
                    selStateData={selStateData}
                    selDistrictsData={selDistrictsData}
                    areaChange={areaChange}
                    graphTitle={graphTitle}
                    graphTimeperiod={graphTimeperiod}
                    graphUnit={graphUnit}
                    areaName={areaName}
                    titleAreaName={titleAreaName}
                    toggleStateBurden={toggleStateBurden}
                  />
                ) : (
                  <div id='msg'>No data: please select another area</div>
                )}
              </div>
            </section>

            <section
              id='bottom_dashboard_row'
              className='flex flex-wrap'
              alt='India State wise NFHS-5 Reports'
            >
              <div className=' flex w-full md:w-1/2'>
                {selTimeperiod !== '' ? (
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
                    sel_area_names = {sel_area_names}
                  />
                ) : (
                  <div id='msg'>No data: please select another area</div>
                )}
              </div>

              <div className='flex w-full md:w-1/2' alt='India NFHS-5 Reports'>
                {selTimeperiod !== '' ? (
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
                  />
                ) : (
                  <div id='msg'>No data: please select another area</div>
                )}
              </div>
            </section>
          </section>
        </div>
      ) : (
        <SkeletonDropdown />
      )}
    </>
  );
};
