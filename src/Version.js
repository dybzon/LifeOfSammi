import React from 'react';
import VersionImg from './img/Version.png';

export default class Version extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      style: { height: 50, width: 200, position: 'fixed', left: 800, top: 100 }
    };
  };

	render() {
		return (
      <div className="version" style={this.state.style} >
        <img src={VersionImg} style={{height: this.state.height, width: this.state.width}} alt="Version" />
      </div>
		);
	}
}