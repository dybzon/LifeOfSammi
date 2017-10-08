import React from 'react';
import MenuItem from './MenuItem.js';

export default class MenuSubject extends React.Component {
	constructor(props) {
		super(props);
		this.onMouseDown = this.onMouseDown.bind(this);
	};

	renderMenuItem(id, x, y, imageSrc, onMouseDown, h, w, type, fileName) {
		return (<MenuItem id={id} key={id} x={x} y={y} imageSrc={imageSrc} type={this.props.subject} onMouseDown={onMouseDown} h={h} w={w} type={type} fileName={fileName} />);
	};

	onMouseDown(e) {
		var clickValue = this.props.itemsVisible ? "" : this.props.subject;
		this.props.setItemVisibility(clickValue);
	};

  render() {
  	// Create menu items based on the received image array
  	var menuItems = 
			this.props.itemsVisible ? this.props.menuItems
  		.map((item, index) => 
  			this.renderMenuItem(index, 200, 100*index, item.img, this.props.itemOnMouseDown, 100, 100, item.type, item.fileName)
  		) : null;

    return (
	  <div className="menuSubject" onMouseDown={this.onMouseDown}>
	    {this.props.subject}
	  	{menuItems}
	  </div>
    )
  }
}
