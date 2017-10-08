import React from 'react';

export default class BodyPart extends React.Component {
  render () {
    var style = {
      height: this.props.h,
      width: this.props.w,
      marginLeft: this.props.x,
      marginTop: this.props.y,
    };
    return (
      <div className="bodyPart" style={style}>
        { /* Add some items here?*/
          'Here is ' + this.props.type
        }
        <img src={this.props.imageSrc} alt={this.props.type} />
      </div>
    );
  }
}