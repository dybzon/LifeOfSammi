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
		// Default orientation for buttons is upper left
		var style={
			left: this.props.x,
			top: this.props.y,
			position: 'fixed',
		};

		// Change vertical position if verticalOrientation is bottom
		if(this.props.verticalOrientation === "bottom") {
			style.top = window.innerHeight - this.props.y;
		}

		// Change horizontal position if horizontal position is right
		if(this.props.horizontalOrientation === "right") {
			style.left = window.innerWidth - this.props.x;
		}

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