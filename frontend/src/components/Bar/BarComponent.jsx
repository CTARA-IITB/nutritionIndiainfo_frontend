import React from 'react';
import {HorizontalBar} from 'react-chartjs-2';

class BarComponent extends React.PureComponent {

  componentRef = React.createRef();

  render() {
    return (
        <div>
            <HorizontalBar ref={this.componentRef} id="Bar" data={this.props.data} options={this.props.options}/>
        </div>
    );
  }
}
export default BarComponent;