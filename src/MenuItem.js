import React from 'react';

export default class MenuItem extends React.Component {
	// Receive an image. Render that image on the specified position.
	// Props:
	// x, y, image, type, id, itemId (from allItems array), key, onMouseDown method, height, width
	constructor(props) {
		super(props);

		this.state = {
			highlighted: false,
		};

		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseOver = this.onMouseOver.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
	};

	// onComponentDidMount(){
 //    window.addEventListener('click', this.testFunc);
	// };

	// testFunc() {
	// 	console.log("Something was clicked: " + this.props.type + this.props.id);
	// };

	onMouseDown(e) {
		// console.log("MenuItem was clicked");
		this.props.onMouseDown({ imageSrc: this.props.imageSrc, fileName: this.props.fileName, type: this.props.type, draggable: true});
	};

	onMouseOver(e) {
		this.setState({highlighted: true});
	};

	onMouseLeave(e) {
		this.setState({highlighted: false});
	};

	render() {
    var itemsPerColumn = Math.floor(window.innerHeight / this.props.h);
    var left = 156 + Math.floor(this.props.id / itemsPerColumn) * this.props.w;
    var top = 2 + (this.props.id) * this.props.h - (Math.floor(this.props.id / itemsPerColumn) * itemsPerColumn * this.props.h);

    // console.log("id: " + this.props.id + ", top: " + top + ", itemsPerColumn: " + itemsPerColumn + ", id/ipc floored: " + Math.floor(this.props.id / itemsPerColumn));

		var style = {
			height: this.props.h,
			width: this.props.w,
			backgroundColor: this.state.highlighted ? "#888" : "#F3F3F3",
			border: "1px solid black",
			position: "fixed",
			left: left,
			top: top,
		};

		return (
      <div className="menuItem" onMouseDown={this.onMouseDown} onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave} style={style} >
      	<img src={this.props.imageSrc} height={this.props.h} width={this.props.w} alt={this.props.type + "-" + this.props.fileName} />
      </div>
    )
	}
}
