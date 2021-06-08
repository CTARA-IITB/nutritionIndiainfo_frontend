import React from 'react';
import {HorizontalBar} from 'react-chartjs-2';
import "./BarArea.css";

class BarAreaComponent extends React.PureComponent {

  componentRef = React.createRef();
  render() {
    console.log("data", this.props.data.labels.length);
    if(this.props.data.labels.length > 0)
    {
    return (
        <div>
            <HorizontalBar ref={this.componentRef} height={this.props.calculatedHeight} id="BarArea"  data={this.props.data} options={this.props.options}/>
        </div>
    );
    }
    else{
      return (
        <div id="statMsg">No data: please select another survey</div>
    );
    }
  }
}
export default BarAreaComponent;