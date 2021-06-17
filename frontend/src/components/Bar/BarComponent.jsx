import React from 'react';
import {HorizontalBar} from 'react-chartjs-2';

class BarComponent extends React.PureComponent {

  componentRef = React.createRef();

  render() {
    if(this.props.message){
      return(
        <div id="Bar">
          <div id="statMsg">No data: please select another survey</div>
          <HorizontalBar ref={this.componentRef}  data={this.props.data} options={this.props.options}/>
        </div>
      );
    }
    else{
      return (
        <div id="Bar">
           <div className="barTitle" id="barT" >
              <small style={{textAlign:'end',fontWeight:"bold",fontSize:"13px"}}>{this.props.title}</small>
            </div>
          <HorizontalBar ref={this.componentRef}  data={this.props.data} options={this.props.options}/>
        </div>
      );
    }
    
  }
}
export default BarComponent;