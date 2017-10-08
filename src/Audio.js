import React from 'react';

// import Disturbed from './audio/Disturbed.mp3';

export default class Audio extends React.Component {
	componentDidMount() {
	  var audio = document.getElementById('audio');
		audio.play();
	};

	componentWillReceiveProps(nextProps) {
	  var audio = document.getElementById('audio');
		if(this.props.audioSrc !== nextProps.audioSrc) {
		  // Load the new track on update
			audio.load();		
		}

		if(this.props.audioPlaying !== nextProps.audioPlaying) {
			if(nextProps.audioPlaying) {
				audio.play();
			}
			else {
				audio.pause();
			}
		}
	};

	render() {
		return(
			<audio id="audio" className="audio" autoPlay="true" loop>
			  <source id="audioSource" src={this.props.audioSrc}></source>
			  Your browser does not support the audio format.
			</audio>
		);
	};
}