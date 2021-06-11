import React from 'react';
import {HorizontalBar} from 'react-chartjs-2';

class BarComponent extends React.PureComponent {

  componentRef = React.createRef();

  render() {
    if(this.props.message){
      return(
        <div>
          <div id="statMsg">No data: please select another survey</div>
          <HorizontalBar ref={this.componentRef} id="bar"    data={this.props.data} options={this.props.options}/>
        </div>
      );
    }
    else{
      return (
        <div>
          <HorizontalBar ref={this.componentRef} id="bar" data={this.props.data} options={this.props.options}/>
        </div>
      );
    }
    
  }
}
export default BarComponent;