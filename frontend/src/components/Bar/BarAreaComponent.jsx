import React from 'react';
import {Bar,HorizontalBar} from 'react-chartjs-2';

class BarAreaComponent extends React.PureComponent {

  componentRef = React.createRef();

  render() {
    return (
        <div>
            <HorizontalBar ref={this.componentRef} id="BarArea" data={this.props.data} options={this.props.options}/>
        </div>
    );
  }
}
export default BarAreaComponent;