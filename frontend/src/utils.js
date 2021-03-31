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

  export async function setVisulaizationData(indicator, subgroup, timeperiod, area, parentArea, level, levelThree, setIndicatorBar, setIndicatorTrend, 
    setSelIndiaData, setSelStateData, setSwitchDisplay, setSelDistrictsData)
  {
    const url_1 =  await fetch(`http://13.234.11.176/api/getIndicatorTrend/${indicator}/${subgroup}/${area}`);
    const body_1 = await url_1.json();
    setIndicatorTrend(body_1)

    const url_2 = await fetch(`http://13.234.11.176/api/getIndicatorBar/${indicator}/${timeperiod}/${area}`);
    const body_2 = await url_2.json();
    setIndicatorBar(body_2);

    // if (level === 1)
    // {
     const url_3 = await fetch(`http://13.234.11.176/api/indiaMap/${indicator}/${subgroup}/${timeperiod}/2`);
     const body_3 = await url_3.json();
     setSelIndiaData(body_3);
    // }
    // else
     if (level === 2) {
      let url_4;
      if (levelThree)
       url_4 =  await fetch(`http://13.234.11.176/api/areaData/${indicator}/${subgroup}/${timeperiod}/${parentArea}`);
      else
        url_4 = await fetch(`http://13.234.11.176/api/areaData/${indicator}/${subgroup}/${timeperiod}/${area}`);
        const body_4 = await url_4.json();
        setSelStateData(body_4);
    }
    const switchurl= await fetch(`http://13.234.11.176/api/getDistrictDetails/${indicator}/${subgroup}/${timeperiod}`);
    const body_5 = await switchurl.json();
    if(body_5.length)
    {
      setSwitchDisplay(true);
      setSelDistrictsData(body_5);
    }
      else
        setSwitchDisplay(false);

  }

  export async function setCardData(tab, area, setIndicatorDetail)
  {
    const url = await fetch(`http://13.234.11.176/api/getIndicatorDetails/${tab}/${area}`);
    const body = await url.json();
    setIndicatorDetail(body);
  }

  export async function populateDropdowns(tab, indiVal, subVal, setIndicatorDropdownOpt, setSubgroupDropdownOpt,
    setSelIndicator, setSelSubgroup, setUnit, setGraphTitle, setGraphSubgroup, setGraphUnit)
  {
    const url_6 = await fetch(`http://13.234.11.176/api/indicator/${tab}`);
    const body_6 = await url_6.json();
    setIndicatorDropdownOpt(body_6);
    setSelIndicator(body_6[0].value);
    setGraphTitle(body_6[0].title);

    const url_7 = await fetch(`http://13.234.11.176/api/subgroup/${indiVal}`);
    const body_7 = await url_7.json();
    setSubgroupDropdownOpt(body_7);
    setSelSubgroup(body_7[0].value);
    setGraphSubgroup(body_7[0].title);
   
    const url_8 = await fetch(`http://13.234.11.176/api/getUnit/${indiVal}/${subVal}`);
    const body_8 = await url_8.json();
    setUnit(body_8[0].unit.unit_id);
    setGraphUnit(body_8[0].unit.unit_name);
  }
        
  export function poissonDiscSampler(width, height, radius) {
    console.log("poisson called");

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

  