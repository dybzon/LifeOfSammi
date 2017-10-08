import React from 'react';

export default class Button extends React.Component {
	constructor(props){
		super(props);
		this.onMouseDown = this.onMouseDown.bind(this);
	};

	onMouseDown(e){
		this.props.onMouseDown({ clickValue: this.props.clickValue });
	};

	render() {
		var style={
			left: this.props.x,
			top: this.props.y,
			position: 'fixed',
		};

		var imgStyle={
			height: this.props.h,
			width: this.props.w,
		};

		return (
			<div className="button" style={style} onMouseDown={this.onMouseDown} >
				<img src={this.props.imageSrc} alt={this.props.desc} style={imgStyle} />
			</div>
		)
	}
}