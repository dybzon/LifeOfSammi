import React from 'react';

/*
  The Bin component will be used for removing items from the game. 
  We always want to position the bin in the bottom right corner.
*/
export default class Bin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      style: { height: this.props.h, width: this.props.w, position: 'fixed' }
    }

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  // Update the state when props are updated. This is important to keep the bin in the correct position.
  componentWillReceiveProps(nextProps) {
    this.setState({style: { height: this.props.h, width: this.props.w, position: 'fixed', left: nextProps.x, top: nextProps.y }});
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    // When the window size is updated we want to reposition the bin
    var newMarginLeft = window.innerWidth - this.state.style.width - 50;
    var newMarginTop = window.innerHeight - this.state.style.height - 50;
    
    // Update the position of the bin in the parent's (Game's) state. This is important when the game component needs to determine whether objects are dropped in the bin.
    this.props.setBinPosition({id: this.props.id, x: newMarginLeft, y: newMarginTop});
  }

  render() {
    return(
      <div className="bin" style={this.state.style} >
        <img src={this.props.imageSrc} style={{height: this.props.h, width: this.props.w}} alt="Bin" />
      </div>
    )
  }
}
