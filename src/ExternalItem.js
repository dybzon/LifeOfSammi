import React from 'react';
import ReactDOM from 'react-dom';

/*
  ExternalItem class:
  The ExternalItem class should represent one draggable item, which is holds an image.
  The ExternalItem can be dropped on Sammi to dress him up.
*/ 
export default class ExternalItem extends React.Component {
  // Set the initial state via the constructor
  constructor(props) {
    super(props);
    this.state = {
      pos: { x: this.props.x, y: this.props.y },
      dragging: false,
      rel: null // Used when dragging. Holds the position of the mouse relative to the corner of the element.
    };

    // Bind the functions in the class to this. That will allow us to call setState() etc. from within these functions.
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
  };

  componentDidUpdate(props, state) {
    if(this.state.dragging && !state.dragging) {
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseup', this.onMouseUp)
    } else if(!this.state.dragging && state.dragging) {
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mouseup', this.onMouseUp)
    }
  }

  // Only here for snap-to-body functionality
  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.x !== "undefined" && typeof nextProps.y !== "undefined"){
      this.setState({pos: {x: nextProps.x, y: nextProps.y }});      
    }
  }

  onMouseDown(e){
    if(e.button !== 0 || !this.props.draggable) return // Return if the item is not draggable
    // Get the position of the element.
    var domRect = ReactDOM.findDOMNode(this).getBoundingClientRect()
    var pos = { top: parseInt(domRect.top, 10), left: parseInt(domRect.left, 10) }
    // Save the position of the mouse relative to the corner of the element.
    this.setState({
      dragging: true,
      rel: {
        x: e.pageX - pos.left,
        y: e.pageY - pos.top
      }
    })
    e.stopPropagation()
    e.preventDefault()
  };

  onMouseMove(e){
    if (!this.state.dragging) return
    var xPos = e.pageX - this.state.rel.x;
    var yPos = e.pageY - this.state.rel.y;
    // console.log("e.pageX: " + e.pageX + ", e.pageY: " + e.pageY + ", rel.x: " + this.state.rel.x + ", rel.y: " + this.state.rel.y);
    this.setState({
      pos: {
        x: xPos,
        y: yPos
      }
    })

    this.props.setItemHoveringPosition({ id: this.props.id, x: xPos, y: yPos, type: this.props.type });

    e.stopPropagation()
    e.preventDefault()
  };

  onMouseUp(e) {
    this.setState({dragging: false})
    // Call the parent (Game) with the new position of the item. The parent will do whatever needs to be done based on this.
    this.props.setItemPosition({ id: this.props.id, x: this.state.pos.x, y: this.state.pos.y, type: this.props.type, xOffset: this.props.xOffset, yOffset: this.props.yOffset });

    e.stopPropagation()
    e.preventDefault()
  }

  render() {
    return (
      <div 
        className="externalItem" 
        onMouseDown={this.onMouseDown} 
        style={{
          position: 'absolute',
          left: this.state.pos.x + 'px',
          top: this.state.pos.y + 'px',
          zIndex: this.props.zIndex,
        }}>
        <img src={this.props.imageSrc} height={this.props.h} width={this.props.w} alt={this.props.desc} />
      </div>
    )
  }
}
