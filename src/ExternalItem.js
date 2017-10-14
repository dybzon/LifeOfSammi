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
      rotating: false,
      rel: null, // Used when dragging. Holds the position of the mouse relative to the corner of the element.
      rotationOrigin: {
        x: this.props.x + this.props.w / 2,
        y: this.props.y + this.props.h / 2,
      },
      lastAngle: 0,
      addedStyles: {},
    };

    // Bind the functions in the class to this. That will allow us to call setState() etc. from within these functions.
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.rotate = this.rotate.bind(this);
  };

  componentDidUpdate(props, state) {
    if((this.state.dragging && !state.dragging) || (this.state.rotating && !state.rotating)) {
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseup', this.onMouseUp)
    } else if((!this.state.dragging && state.dragging) || (!this.state.rotating && state.rotating)) {
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mouseup', this.onMouseUp)
    }
  }

  // Only here for snap-to-body functionality
  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.x !== "undefined" && typeof nextProps.y !== "undefined"){
      this.setState({pos: {x: nextProps.x, y: nextProps.y }});
      if(!this.state.rotating){
        this.setState({rotationOrigin: {
          x: nextProps.x + this.props.w / 2,
          y: nextProps.y + this.props.h / 2,
        }})
      }

    }
  }

  onMouseDown(e){
    if(e.button !== 0 || (!this.props.draggable && !this.props.rotatable)) return // Return if the item is not draggable or rotatable
    // Get the position of the element.
    var domRect = ReactDOM.findDOMNode(this).getBoundingClientRect()
    var pos = { top: parseInt(domRect.top, 10), left: parseInt(domRect.left, 10) }
    // Save the position of the mouse relative to the corner of the element.
    var shouldRotate = (e.ctrlKey);
    this.setState({
      dragging: !shouldRotate,
      rotating: shouldRotate,
      rel: {
        x: e.pageX - pos.left,
        y: e.pageY - pos.top
      },
      rotationHandle: {
        x: e.pageX,
        y: e.pageY,
      }
    })
    e.stopPropagation()
    e.preventDefault()
  };

  onMouseMove(e){
    if (this.state.dragging) {
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
    } else {
      console.log('Now rotating');
      this.rotate(e);
    }

    e.stopPropagation()
    e.preventDefault()
  };

  rotate(e) {
    var rotationStartX = e.pageX;
    var rotationStartY = e.pageY;
    var rotationOriginX = this.state.rotationOrigin.x;
    var rotationOriginY = this.state.rotationOrigin.y;
    var rotationHandleX = this.state.rotationHandle.x;
    var rotationHandleY = this.state.rotationHandle.y;
    var lastAngle = this.state.lastAngle;
    var movementRadians = 0;
    var element = document.getElementById("2");
    if(rotationStartX !== rotationOriginX && rotationStartY !== rotationOriginY) { // start rotate
      movementRadians = Math.atan2(rotationStartY - rotationOriginY, rotationStartX - rotationOriginX); // current to origin
      movementRadians -= Math.atan2(rotationHandleY - rotationOriginY, rotationHandleX - rotationOriginX); // handle to origin
      movementRadians += lastAngle; // relative last one
      var degree = (movementRadians * (360 / (2 * Math.PI)));
      var addedStyles = {
        MozTransform: "rotate(" + degree + "deg)",
        MozTransformOrigin: "50% 50%",
        WebkitTransform: "rotate(" + degree + "deg)",
        WebkitTransformOrigin: "50% 50%",
        OTransform: "rotate(" + degree + "deg)",
        OTransformOrigin: "50% 50%",
        MsTransform: "rotate(" + degree + "deg)",
        MsTransformOrigin: "50% 50%",
      };
      this.setState({addedStyles: addedStyles});
    }
  }

  onMouseUp(e) {
    this.setState({dragging: false, rotating: false})
    // Call the parent (Game) with the new position of the item. The parent will do whatever needs to be done based on this.
    this.props.setItemPosition({ id: this.props.id, x: this.state.pos.x, y: this.state.pos.y, type: this.props.type, xOffset: this.props.xOffset, yOffset: this.props.yOffset });

    e.stopPropagation()
    e.preventDefault()
  }

  render() {
    var baseStyle = {
      position: 'absolute',
      left: this.state.pos.x + 'px',
      top: this.state.pos.y + 'px',
      zIndex: this.props.zIndex,
    };
    var style = Object.assign(baseStyle, this.state.addedStyles);
    return (
      <div 
        id={this.props.id}
        className="externalItem" 
        onMouseDown={this.onMouseDown} 
        style={style}>
        <img src={this.props.imageSrc} height={this.props.h} width={this.props.w} alt={this.props.desc} />
      </div>
    )
  }
}
