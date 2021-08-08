export const solr_domain = process.env.REACT_APP_SOLR_DOMAIN;
export const solr_core = process.env.REACT_APP_SOLR_CORE;
export const API = process.env.REACT_APP_BASEURL

const CryptoJS = require("crypto-js");

// Encrypt
export const token = CryptoJS.AES.encrypt(JSON.stringify(process.env.REACT_APP_SECRET_DATA), process.env.REACT_APP_KEY).toString();

export const fetchAreaCode = (areaList, areaID) => {
  return areaList.filter((area) => parseInt(area.area_id) === areaID)[0][
    'area_code'
  ];
};

export const createHierarchy = (options) => {
  let india = [];
  let state = [];
  let district = {};
  let onlyDistrict = [];

  options.forEach((area) => {
    let area_id = area.area_id.toString();
    let level = area.area_level;
    let parent_id = area.area_parent_id;
    let area_name = area.area_name;
    let temp = { value: area_id, title: area_name, code: area.area_code };

    if (level === 1) {
      india.push(temp);
    } else if (level === 2) {
      state.push(temp);
      onlyDistrict.push(area.area_id);
    } else if (level === 3) {
      if (parent_id in district) {
        district[parent_id].push(temp);
      } else {
        district[parent_id] = [temp];
      }
    }
  });

  //adding subs to state
  for (const i in state) {
    let stateInfo = state[i];
    stateInfo['children'] = district[stateInfo.value];
  }

  //adding subs to india
  india[0]['children'] = state;

  return [india, onlyDistrict];
};

export async function setVisulaizationData(
  indicator,
  timeperiod,
  area,
  parentArea,
  level,
  levelThree,
  setIndicatorBar,
  setIndicatorTrend,
  setSelIndiaData,
  setSelStateData,
  setSwitchDisplay,
  setSelDistrictsData
) {
  const url_1 = await fetch(
    `${API}/v1/url_1u?area=${area}&indicator=${indicator}` , {
      headers:{
        Authorization:`${token}`
      }
    }
  );

  // const url_1 =  await fetch(`${solr_domain}/solr/${solr_core}/select?fl=timeperiod_id%2Ctimeperiod%2Cunit_id%2Cunit_name%2Cdata_value%2Cdata_value_num%2Csubgroup_id%2Csubgroup_name%2Csubgroup_category%2Cstart_date%2Cend_date&fq=area_id%3A${area}&fq=indicator_id%3A${indicator}&fq=subgroup_id%3A6&omitHeader=true&q=*%3A*&rows=400&sort=timeperiod_id%20asc`);
  // console.log('URL', url_1);
  const body_1 = await url_1.json();
  if (body_1.result.docs.length) {
  const trendData = body_1.result.docs.filter(data => data.subgroup_id === 6)
  trendData.sort(function(a, b){
      return a.timeperiod_id-b.timeperiod_id
    })
    setIndicatorTrend(trendData);
 

  const subBarData = body_1.result.docs.filter(data => data.timeperiod_id === timeperiod)
  subBarData.sort(function(a, b){
    return a.subgroup_order-b.subgroup_order
  })
  setIndicatorBar(subBarData);
}
  //setIndicatorTrend(body_1.result.docs);

  // const url_2 = await fetch(  
  //   `${API}/v1/url_2u?area=${area}&indicator=${indicator}&timeperiod=${timeperiod}` , {
  //     headers:{
  //       Authorization:`${token}`
  //     }
  //   }
  // );
  // const url_2 = await fetch(
  //   `${solr_domain}/solr/${solr_core}/select?fl=unit_id%2Cunit_name%2Csubgroup_name%2Csub_category%2Cdata_value%2Cdata_value_num%2Csubgroup_id%2Csubgroup_name_subgroup_category&fq=area_id%3A${area}&fq=indicator_id%3A${indicator}&fq=timeperiod_id%3A${timeperiod}&omitHeader=true&q=*%3A*&rows=100&sort=subgroup_order%20asc`
  // );
  // const body_2 = await url_2.json();


  if (level === 1) {
    const solr_url_3 = await fetch(
      `${API}/v1/url_3u?indicator=${indicator}&timeperiod=${timeperiod}` , {
        headers:{
          Authorization:`${token}`
        }
      }
    );

    // const solr_url_3 = await fetch(
    //   `${solr_domain}/solr/${solr_core}/select?fl=area_id%2Carea_code%2Carea_name%2Carea_level%2Cdata_value%2Cdata_value_num&fq=area_level%3A2&fq=indicator_id%3A${indicator}&fq=subgroup_id%3A6&fq=timeperiod_id%3A${timeperiod}&rows=100&omitHeader=true&q=*%3A*`
    // );
    const solr_body_3 = await solr_url_3.json();
    setSelIndiaData(solr_body_3.result.docs);
  } else {
    let solr_url_4;
    if (levelThree) {
      solr_url_4 = await fetch(
        `${API}/v1/url_4b_u?parentArea=${parentArea}&indicator=${indicator}&timeperiod=${timeperiod}` , {
          headers:{
            Authorization:`${token}`
          }
        }
      );
      // solr_url_4 = await fetch(
      //   `${solr_domain}/solr/${solr_core}/select?fl=area_id%2Carea_code%2Carea_name%2Carea_level%2Cdata_value%2Cdata_value_num&fq=area_parent_id%3A${parentArea}&fq=indicator_id%3A${indicator}&fq=subgroup_id%3A6&fq=timeperiod_id%3A${timeperiod}&rows=1000&omitHeader=true&q=*%3A*`
      // );
    } else {
      solr_url_4 = await fetch(
        `${API}/v1/url_4c_u?area=${area}&indicator=${indicator}&timeperiod=${timeperiod}` , {
          headers:{
            Authorization:`${token}`
          }
        }
      );
      // solr_url_4 = await fetch(
      //   `${solr_domain}/solr/${solr_core}/select?fl=area_id%2Carea_code%2Carea_name%2Carea_level%2Cdata_value%2Cdata_value_num&fq=area_parent_id%3A${area}&fq=indicator_id%3A${indicator}&fq=subgroup_id%3A6&fq=timeperiod_id%3A${timeperiod}&rows=1000&omitHeader=true&q=*%3A*`
      // );
    }
    const solr_body_4 = await solr_url_4.json();
    setSelStateData(solr_body_4.result.docs);
  }

  const arrayTimeperiod = [20,3,11,14,7,12,10,17,4,24]
  if (arrayTimeperiod.includes(timeperiod) && area === 1)
    {
        const solr_switchurl = await fetch(
          `${API}/v1/url_5u?indicator=${indicator}&timeperiod=${timeperiod}` , {
            headers:{
              Authorization:`${token}`
            }
          }
        );

        // const solr_switchurl = await fetch(
        //   `${solr_domain}/solr/${solr_core}/select?fl=indicator_id%2Cindicator_name%2Ctimeperiod_id%2Ctimeperiod%2Cunit_id%2Cunit_name%2Cdata_value%2Cdata_value_num%2Carea_id%2Carea_code%2Carea_name%2Carea_level&fq=area_level%3A3&fq=indicator_id%3A${indicator}&fq=subgroup_id%3A6&fq=timeperiod_id%3A${timeperiod}&q=*%3A*&rows=10000&omitHeader=true`
        // );
        const solr_body_5 = await solr_switchurl.json();
        if (solr_body_5.result.docs.length) {
          setSwitchDisplay(true);
          setSelDistrictsData(solr_body_5.result.docs);
        } 
        else setSwitchDisplay(false);
    }
  else {
      setSwitchDisplay(false);
      }
}

export async function setCardData(tab, area, setIndicatorDetail) {
  // const url = await fetch(`http://localhost:8000/api/getIndicatorDetails/${tab}/${area}`);
  // const body = await url.json();
  // setIndicatorDetail(body);
}

export async function populateDropdowns(
  selLifecycle,
  selCategory,
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
  queryIndicator
) {
  // console.log(`selCategory: ${selCategory}  ,  selLifeycle : ${selLifeycle}`);
  const solr_url_6 = await fetch(
    `${API}/v1/url_6u?selCategory=${selCategory}&selLifecycle=${selLifecycle}` , {
      headers:{
        Authorization:`${token}`
      }
    }
  );
  // const solr_url_6 = await fetch(
  //   `${solr_domain}/solr/${solr_core}/select?fl=value:indicator_id%2Ctitle:indicator_short_name%2Cindi_sense%2Cindicator_name%2Cnotes&fq=category_id%3A${selCategory}&fq=lifecycle_id%3A${selLifeycle}%20OR%20lifecycle_id%3A7&q=*%3A*&rows=100&sort=indicator_id%20asc&group=true&group.field=indicator_id&group.limit=1&group.main=true&omitHeader=true`
  // );

  const solr_body_6 = await solr_url_6.json();
  // console.log('URL 6', API);
  setIndicatorDropdownOpt(solr_body_6.result.docs);
  let indiVal;
  let passedIndicator;
  if(solr_body_6.result.docs.length)
  {
  if (queryIndicator) {
    passedIndicator = solr_body_6.result.docs.filter(
      (i) => i.value === parseInt(queryIndicator)
    )[0];
  }
  if(passedIndicator)
  {
    setSelIndicator(passedIndicator.value);
    setIndicatorSense(passedIndicator.indi_sense);
    setGraphTitle(passedIndicator.indicator_name);
    indiVal = passedIndicator.value;
    setUnit(passedIndicator.unit_id)
    setGraphUnit(passedIndicator.unit_name)
    setNote(passedIndicator.notes);
  } else {
    setSelIndicator(solr_body_6.result.docs[0].value);
    setIndicatorSense(solr_body_6.result.docs[0].indi_sense);
    setGraphTitle(solr_body_6.result.docs[0].indicator_name);
    indiVal = solr_body_6.result.docs[0].value;
    setUnit(solr_body_6.result.docs[0].unit_id)
    setGraphUnit(solr_body_6.result.docs[0].unit_name)
    setNote(solr_body_6.result.docs[0].notes);
  }
}
 

  // const solr_url_8 = await fetch(`${API}/v1/url_8u?indiVal=${indiVal}` , {
  //   headers:{
  //     Authorization:`${token}`
  //   }
  // })

  // // const solr_url_8 = await fetch(
  // //   `${solr_domain}/solr/${solr_core}/select?fl=unit_id%2Cunit_name%2Cindicator_id&fq=indicator_id%3A${indiVal}&fq=subgroup_id%3A6&group.field=unit_id&group.main=true&group=true&omitHeader=true&q=*%3A*`
  // // );
  // const solr_body_8 = await solr_url_8.json();
  // if(solr_body_8.result.docs.length)
  // {
  // setUnit(solr_body_8.result.docs[0].unit_id);
  // setGraphUnit(solr_body_8.result.docs[0].unit_name);
  // }
  let solr_url;
  // URL_9
  solr_url = await fetch(`${API}/v1/url_9u?selLifeycle=${selLifecycle}&selCategory=${selCategory}&indiVal=${indiVal}&selArea=${selArea}` , {
    headers:{
      Authorization:`${token}`
    }
  })
  // solr_url = await fetch(
  //   `${solr_domain}/solr/${solr_core}/select?fl=title:timeperiod%2Cvalue:timeperiod_id&sort=timeperiod_id%20desc&fq=lifecycle_id%3A${selLifeycle}%20OR%20lifecycle_id%3A7&fq=category_id%3A${selCategory}&fq=indicator_id%3A${indiVal}&fq=subgroup_id%3A6&fq=area_id%3A${selArea}&q=*%3A*&group=true&group.field=timeperiod_id&group.limit=1&group.main=true&omitHeader=true`
  // );
  const solr_body_2 = await solr_url.json();
  setTimeperiodDropdownOpt(solr_body_2.result.docs);
  let timeVal = '';
  if (typeof solr_body_2.result.docs[0] !== 'undefined') {
    setSelTimeperiod(solr_body_2.result.docs[0].value);
    timeVal = solr_body_2.result.docs[0].value;
    setGraphTimeperiod(solr_body_2.result.docs[0].title);
  } else {
    setSelTimeperiod('');
    setGraphTimeperiod('');
  }
  if (timeVal !== '')
    await setVisulaizationData(
      indiVal,
      timeVal,
      selArea,
      parentArea,
      level,
      isLevelThree,
      setIndicatorBar,
      setIndicatorTrend,
      setSelIndiaData,
      setSelStateData,
      setSwitchDisplay,
      setSelDistrictsData
    );
}

export async function populateCategoryDropdown(selLifecycle, setCategoryDropdownOpt)
{  
  if(selLifecycle === 1 || selLifecycle === 6){
    setCategoryDropdownOpt([{value:1,title:"Manifestation"},  { value: 3, title: "Determinants" } ])
  }else if(selLifecycle === 2){
    setCategoryDropdownOpt([
      { value: 1, title: "Manifestation" },
      { value: 2, title: "Interventions" },
      { value: 3, title: "Determinants" }                 
    ]);
  }else if(selLifecycle === 3){
    setCategoryDropdownOpt([
      { value: 1, title: "Manifestation" },
      { value: 2, title: "Interventions" },
      { value: 3, title: "Determinants" }                 

    ]);
  }
  else if(selLifecycle ===4){
    setCategoryDropdownOpt([
      { value: 2, title: "Interventions" },
      { value: 3, title: "Determinants" }                 

    ]);
  }else if(selLifecycle === 5){
    setCategoryDropdownOpt([
      { value: 1, title: "Manifestation" },
      { value: 2, title: "Interventions" },
      { value: 3, title: "Determinants" }
    ])
  }
}

export function commaSeparated(x) {
  if (typeof x !== 'undefined') {
    return x.toLocaleString('en-IN');
  }

}
