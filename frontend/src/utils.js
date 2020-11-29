export const fetchAreaCode = (areaList,areaID) =>{
    return(areaList.filter(area => parseInt(area.area_id) == areaID)[0]['area_code']);
}

export const createHierarchy = (options) =>{
    let india = new Array(); 
    let state = new Array(); 
    let district = {};
    let onlyDistrict = new Array();
  
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