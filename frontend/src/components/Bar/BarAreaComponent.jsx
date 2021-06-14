import React from 'react';
import {HorizontalBar} from 'react-chartjs-2';
import "./BarArea.css";

class BarAreaComponent extends React.PureComponent {

  componentRef = React.createRef();
  render() {
    if(this.props.data.labels.length > 0)
    {
      return (
          <div>
              <HorizontalBar ref={this.componentRef} height={this.props.calculatedHeight} id="barArea"  data={this.props.data} options={this.props.options}/>
          </div>
      );
    }
    else{
      return (
        <div>
          <div id="statMsg">No data: please select another survey</div>
          <HorizontalBar ref={this.componentRef} height={this.props.calculatedHeight} id="barArea"  data={this.props.data} options={this.props.options}/>
        </div>
      );
    }
  }
}
export default BarAreaComponent;