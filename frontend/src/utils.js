import { json } from 'd3';

export const fetchAreaCode = (areaList,areaID) =>{
    return(areaList.filter(area => parseInt(area.area_id) === areaID)[0]['area_code']);
}

export const createHierarchy = (options) =>{
    let india = []; 
    let state = []; 
    let district = {};
    let onlyDistrict = [];
  
    options.forEach(area => {
      let area_id = area.area_id.toString();
      let level = area.area_level;
      let parent_id = area.area_parent_id;
      let area_name = area.area_name;
      let temp = {'value':area_id,'title':area_name,'code':area.area_code};
  
      if(level === 1){
        india.push(temp);
      }else if(level === 2){
        state.push(temp)
        onlyDistrict.push(area.area_id);
      }else if(level === 3){
        if(parent_id in district){
          district[parent_id].push(temp);
        }else{
          district[parent_id] = [temp];
        }
      }
    })
  
    //adding subs to state
    for(const i in state){
      let stateInfo = state[i];
      stateInfo['children'] = district[stateInfo.value];
    }
  
    //adding subs to india
    india[0]['children'] = state;
  
    return [india,onlyDistrict];
  }

  export async function setVisulaizationData(indicator, timeperiod, area, parentArea, level, levelThree, setIndicatorBar, setIndicatorTrend, 
    setSelIndiaData, setSelStateData, setSwitchDisplay, setSelDistrictsData)
  {
    
    //const url_1 =  await fetch(`http://13.234.11.176/api/getIndicatorTrend/${indicator}/6/${area}`);
    const url_1 =  await fetch(`http://nutritionindia.communitygis.net:8983/solr/nutritionv7/select?fl=timeperiod_id%2Ctimeperiod%2Cunit_id%2Cunit_name%2Cdata_value%2Cdata_value_num%2Csubgroup_id%2Csubgroup_name%2Csubgroup_category%2Cstart_date%2Cend_date&fq=area_id%3A${area}&fq=indicator_id%3A${indicator}&fq=subgroup_id%3A6&omitHeader=true&q=*%3A*&rows=400&sort=timeperiod_id%20asc`);
    const body_1 = await url_1.json();
    setIndicatorTrend(body_1.response.docs)



   // const url_2 = await fetch(`http://localhost:8000/api/getIndicatorBar/${indicator}/${timeperiod}/${area}`);
    const url_2 = await fetch(`http://nutritionindia.communitygis.net:8983/solr/nutritionv7/select?fl=unit_id%2Cunit_name%2Csubgroup_name%2Csub_category%2Cdata_value%2Cdata_value_num%2Csubgroup_id%2Csubgroup_name_subgroup_category&fq=area_id%3A${area}&fq=indicator_id%3A${indicator}&fq=timeperiod_id%3A${timeperiod}&omitHeader=true&q=*%3A*&rows=100&sort=subgroup_order%20asc`);
    const body_2 = await url_2.json();
    setIndicatorBar(body_2.response.docs);

    // if (level === 1)
    // {
    //  const url_3 = await fetch(`http://13.234.11.176/api/indiaMap/${indicator}/6/${timeperiod}/2`);
     const solr_url_3 = await fetch(`http://nutritionindia.communitygis.net:8983/solr/nutritionv7/select?fl=area_id%2Carea_code%2Carea_name%2Carea_level%2Cdata_value%2Cdata_value_num&fq=area_level%3A2&fq=indicator_id%3A${indicator}&fq=subgroup_id%3A6&fq=timeperiod_id%3A${timeperiod}&rows=100&omitHeader=true&q=*%3A*`);
    //  const body_3 = await url_3.json();
     const solr_body_3 = await solr_url_3.json();
    console.log("mapdata",solr_body_3.response.docs);
     setSelIndiaData(solr_body_3.response.docs);
    // }
    // else
     if (level === 2) {
      let url_4,solr_url_4;
      if (levelThree){
        // url_4 =  await fetch(`http://13.234.11.176/api/areaData/${indicator}/6/${timeperiod}/${parentArea}`);
        solr_url_4 =  await fetch(`http://nutritionindia.communitygis.net:8983/solr/nutritionv7/select?fl=area_id%2Carea_code%2Carea_name%2Carea_level%2Cdata_value%2Cdata_value_num&fq=area_parent_id%3A${parentArea}&fq=indicator_id%3A${indicator}&fq=subgroup_id%3A6&fq=timeperiod_id%3A${timeperiod}&rows=1000&omitHeader=true&q=*%3A*`);

      }
       
      else{
        // url_4 = await fetch(`http://13.234.11.176/api/areaData/${indicator}/6/${timeperiod}/${area}`);
        solr_url_4 =  await fetch(`http://nutritionindia.communitygis.net:8983/solr/nutritionv7/select?fl=area_id%2Carea_code%2Carea_name%2Carea_level%2Cdata_value%2Cdata_value_num&fq=area_parent_id%3A${area}&fq=indicator_id%3A${indicator}&fq=subgroup_id%3A6&fq=timeperiod_id%3A${timeperiod}&rows=1000&omitHeader=true&q=*%3A*`);
      }
        // const body_4 = await url_4.json();
        const solr_body_4 = await solr_url_4.json();
        // console.log(body_4,solr_body_4)
        setSelStateData(solr_body_4.response.docs);
    }
    // const switchurl= await fetch(`http://localhost:8000/api/getDistrictDetails/${indicator}/6/${timeperiod}`);
    const solr_switchurl= await fetch(`http://nutritionindia.communitygis.net:8983/solr/nutritionv7/select?fl=indicator_id%2Cindicator_name%2Ctimeperiod_id%2Ctimeperiod%2Cunit_id%2Cunit_name%2Cdata_value%2Cdata_value_num%2Carea_id%2Carea_code%2Carea_name%2Carea_level&fq=area_level%3A3&fq=indicator_id%3A${indicator}&fq=subgroup_id%3A6&fq=timeperiod_id%3A${timeperiod}&q=*%3A*&rows=10000&omitHeader=true`);
    // const body_5 = await switchurl.json();
    const solr_body_5 = await solr_switchurl.json();
    // console.log(solr_body_5.response.docs,body_5);
    if(solr_body_5.response.docs.length)
    {
      setSwitchDisplay(true);
      setSelDistrictsData(solr_body_5.response.docs);
    }
      else
        setSwitchDisplay(false);

  }

  export async function setCardData(tab, area, setIndicatorDetail)
  {
    // const url = await fetch(`http://localhost:8000/api/getIndicatorDetails/${tab}/${area}`);
    // const body = await url.json();
    // setIndicatorDetail(body);
  }

  export async function populateDropdowns(selLifeycle, selCategory, setIndicatorDropdownOpt,
    setSelIndicator, setUnit, setGraphTitle, setGraphUnit, selArea, parentArea, level, isLevelThree, setIndicatorBar, setIndicatorTrend, setSelIndiaData, setSelStateData, setSwitchDisplay, setSelDistrictsData, setTimeperiodDropdownOpt, setSelTimeperiod, setGraphTimeperiod, setIndicatorSense)
  {
    // const url_6 = await fetch(`http://13.234.11.176/api/indicator/${tab}`);
    const solr_url_6 = await fetch(`http://nutritionindia.communitygis.net:8983/solr/nutritionv7/select?fl=value:indicator_id%2Ctitle:indicator_name%2Cindi_sense&fq=category_id%3A${selCategory}&fq=lifecycle_id%3A${selLifeycle}&q=*%3A*&rows=100&sort=indicator_id%20asc&group=true&group.field=indicator_id&group.limit=1&group.main=true&omitHeader=true`);
    // const body_6 = await url_6.json();
    const solr_body_6 = await solr_url_6.json();
    setIndicatorDropdownOpt(solr_body_6.response.docs);
    setSelIndicator(solr_body_6.response.docs[0].value);
    setIndicatorSense(solr_body_6.response.docs[0].indi_sense);
    setGraphTitle(solr_body_6.response.docs[0].title);
    let indiVal = solr_body_6.response.docs[0].value;

    // const url_7 = await fetch(`http://13.234.11.176/api/subgroup/${indiVal}`);
    // const body_7 = await url_7.json();
    // setSubgroupDropdownOpt(body_7);
    // setSelSubgroup(body_7[0].value);
    // setGraphSubgroup(body_7[0].title);
   
    // const url_8 = await fetch(`http://13.234.11.176/api/getUnit/${indiVal}/6`);
    const solr_url_8 = await fetch(`http://nutritionindia.communitygis.net:8983/solr/nutritionv7/select?fl=unit_id%2Cunit_name%2Cindicator_id&fq=indicator_id%3A${indiVal}&fq=subgroup_id%3A6&group.field=unit_id&group.main=true&group=true&omitHeader=true&q=*%3A*`);
    // const body_8 = await url_8.json();
    const solr_body_8 = await solr_url_8.json();
    // console.log(body_8,solr_body_8.response.docs);
    setUnit(solr_body_8.response.docs[0].unit_id);
    setGraphUnit(solr_body_8.response.docs[0].unit_name);

   // const solr_url = await fetch(`http://nutritionindia.communitygis.net:8983/solr/nutritionv7/select?fl=title:timeperiod%2Cvalue:timeperiod_id&sort=timeperiod_id%20desc&q=indicator_id%3A${indiVal}%20AND%20subgroup_id%3A6%20AND%20area_id%3A${selArea}`);
        // const body_2 = await url_2.json();
    let solr_url;
    if(isLevelThree){
      // url = await fetch(`http://13.234.11.176/api/timeperiod/${val}/6/${parentArea}`);
      solr_url = await fetch(`http://nutritionindia.communitygis.net:8983/solr/nutritionv6/select?fl=title:timeperiod%2Cvalue:timeperiod_id&sort=timeperiod_id%20desc&q=lifecycle_id%3A${selLifeycle}%20AND%20category_id%3A${selCategory}%20AND%20indicator_id%3A${indiVal}%20AND%20subgroup_id%3A6%20AND%20area_id%3A${selArea}&group=true&group.field=timeperiod_id&group.limit=1&group.main=true&omitHeader=true`);

    }
    else{
          // url = await fetch(`http://13.234.11.176/api/timeperiod/${val}/6/${selArea}`);
          solr_url = await fetch(`http://nutritionindia.communitygis.net:8983/solr/nutritionv6/select?fl=title:timeperiod%2Cvalue:timeperiod_id&sort=timeperiod_id%20desc&q=lifecycle_id%3A${selLifeycle}%20AND%20category_id%3A${selCategory}%20AND%20indicator_id%3A${indiVal}%20AND%20subgroup_id%3A6%20AND%20area_parent_id%3A${selArea}&group=true&group.field=timeperiod_id&group.limit=1&group.main=true&omitHeader=true`);
    }
    const solr_body_2 = await solr_url.json();
    setTimeperiodDropdownOpt(solr_body_2.response.docs);
    setSelTimeperiod(solr_body_2.response.docs[0].value);
    let timeVal = solr_body_2.response.docs[0].value;
    setGraphTimeperiod(solr_body_2.response.docs[0].title);
    await setVisulaizationData(indiVal, timeVal, selArea, parentArea, level, isLevelThree, setIndicatorBar, setIndicatorTrend, setSelIndiaData, setSelStateData, setSwitchDisplay, setSelDistrictsData);
  }
        
  export function poissonDiscSampler(width, height, radius) {
    var k = 30, // maximum number of samples before rejection
        radius2 = radius * radius,
        R = 0.1 * radius2,
        cellSize = radius * Math.SQRT1_2,
        gridWidth = Math.ceil(width / cellSize),
        gridHeight = Math.ceil(height / cellSize),
        // grid = new Array(gridWidth * gridHeight);
        queue = [],
        queueSize = 0,
        sampleSize = 0;


        let  gridSize = Math.round(gridWidth*gridHeight);
        let  grid = new Array(gridSize);

    return function() {
      if (!sampleSize) return sample(Math.random() * width, Math.random() * height);

      // Pick a random existing sample and remove it from the queue.
      while (queueSize) {
        var i = Math.random() * queueSize | 0,
            s = queue[i];

        // Make a new candidate between [radius, 2 * radius] from the existing sample.
        for (var j = 0; j < k; ++j) {
          var a = 2 * Math.PI * Math.random(),
              r = Math.sqrt(Math.random() * R + radius2),
              x = s[0] + r * Math.cos(a),
              y = s[1] + r * Math.sin(a);

          // Reject candidates that are outside the allowed extent,
          // or closer than 2 * radius to any existing sample.
          if (0 <= x && x < width && 0 <= y && y < height && far(x, y)) return sample(x, y);
        }

        queue[i] = queue[--queueSize];
        queue.length = queueSize;
      }
    };

    function far(x, y) {
      var i = x / cellSize | 0,
          j = y / cellSize | 0,
          i0 = Math.max(i - 2, 0),
          j0 = Math.max(j - 2, 0),
          i1 = Math.min(i + 3, gridWidth),
          j1 = Math.min(j + 3, gridHeight);

      for (j = j0; j < j1; ++j) {
        var o = j * gridWidth;
        for (i = i0; i < i1; ++i) {
          if (s = grid[o + i]) {
            var s,
                dx = s[0] - x,
                dy = s[1] - y;
            if (dx * dx + dy * dy < radius2) return false;
          }
        }
      }

      return true;
    }

    function sample(x, y) {
      var s = [x, y];
      queue.push(s);
      grid[gridWidth * (y / cellSize | 0) + (x / cellSize | 0)] = s;
      ++sampleSize;
      ++queueSize;
      return s;
    }
  }

  