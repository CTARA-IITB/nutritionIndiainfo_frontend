import React from 'react';
import {Bar} from 'react-chartjs-2';

class BarComponent extends React.PureComponent {

  componentRef = React.createRef();

  render() {
    return (
        <div>
            <Bar ref={this.componentRef} id="Bar" data={this.props.data} options={this.props.options}/>
        </div>
    );
  }
}
export default BarComponent;