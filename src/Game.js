import React from 'react';

// Components
import ExternalItem from './ExternalItem.js';
import Bin from './Bin.js';
import BodyPart from './BodyPart.js';
import Button from './Button.js';
import Menu from './Menu.js';
import Audio from './Audio.js';
import Version from './Version.js';

// Import all images dynamically
function importAll(r) {
  var images = [];
  r.keys().map((item) => 
    {
      var src = item.replace('./',''); // DRY stuff
      images.push(
      {
        src: src, // E.g. Glasses/glasses1.png
        img: r(item), // The image
        type: src.substr(0,src.indexOf('/')), // e.g. Glasses
        fileName: src.substr(src.indexOf('/')+1,src.length) // E.g. glasses1.png
      }); 
    });
  return images;
}

function importAllAudio(r) {
	var audioTracks = [];
	r.keys().map((item,index) =>
	{
		audioTracks.push({
			id: index,
			src: r(item),
		});
	});
	return audioTracks;
}

// Helper function to get imported image resource
function getImg(img){
  return images.find(i => i.fileName === (img + '.png')).img;
}

const images = importAll(require.context('./img', true, /\.(png|jpe?g|svg)$/));
const audioTracks = importAllAudio(require.context('./audio', false, /\.(mp3)$/));

// Define subjects that should appear in the menu
const menuSubjects = ["Hats", "Glasses", "Clothes", "Hobby", "Hair", "Accessories"];
const wearableTypes = ["Hats", "Glasses", "Clothes", "Hair", "Accessories"];
const layeringOrder = 
	[{type: "Hats", layer: 50}, 
		{type: "Accessories", layer: 50},
		{type: "Glasses", layer: 40},
		{type: "Hair", layer: 30}, 
		{type: "Clothes", layer: 20}, 
		{type: "Hobby", layer: 60}, 
		{type: "Food", layer: 70},];
const bodyTypes = ["SAMMY", "COOKIE"];


// The Game class should hold all other elements, and should fill the entire frame
export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleted: [],
      binPosition: {x: 0, y: 0},
      data: this.props.data,
      fatLevel: 0, // Sammi's fat level. More bad food will make him appear choppy. More learn food will make him skinnier.
      backgroundImageIndex: 1, // The initial background image to use
      sidebarOpen: false,
      audioSourceId: 3,
      audioPlaying: true,
  		snapToSammi: 1, // Determines whether snap-to-sammi functionality is turned on
  		inputSequence: "", // Current sequence of keys that were inputted. Used for unlocking Sammi.
  		bodyType: "RandomDude",
    }

		document.body.style.background = "#f3f3f3 url("+getImg('BackgroundBedroom')+") no-repeat left top";
		document.body.style.backgroundSize = "cover";

    this.onDelete = this.onDelete.bind(this);
    this.setBinPosition = this.setBinPosition.bind(this);
    this.setItemPosition = this.setItemPosition.bind(this);
    this.setItemHoveringPosition = this.setItemHoveringPosition.bind(this);
    this.spawnFood = this.spawnFood.bind(this);
    this.spawnItem = this.spawnItem.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    document.addEventListener('keyup', this.onKeyUp);
  };

  componentDidMount() {
		this.setBodyPosition();
  }

  // Set the correct position of the body. This will be called when the game is initiated.
  setBodyPosition() {
  	var newData = this.state.data;
    var bodyIndex = newData.currentItems.findIndex(item => item.type === 'Body');
    var body = newData.currentItems[bodyIndex];

    body.x = window.innerWidth / 2 - body.w / 2; // Middle of window
    body.y = window.innerHeight - body.h; // Buttom of window
    this.setState({data: newData});
  }

  bodyTypesContainSubstring(substring){
  	var result = 0;
  	for (var i = bodyTypes.length - 1; i >= 0; i--) {
  		if(bodyTypes[i].indexOf(substring) > -1){
  			result = 1;
  		}
  	}
  	return result;
  }

  // Check whether SAMMY was inputted from the keyboard. This is the secret code for unlocking Sammi!
  onKeyUp(e) {
  	var newSequence = this.state.inputSequence.concat(String.fromCharCode(e.keyCode));
  	if(this.bodyTypesContainSubstring(newSequence)){
	  	this.setState({inputSequence: newSequence});
  		if(bodyTypes.indexOf(newSequence) > -1){
  			console.log(newSequence + " was unlocked!");
  			this.setState({bodyType: newSequence});
  			var newData = this.state.data;
		    var bodyIndex = newData.currentItems.findIndex(item => item.type === 'Body');
		    var body = newData.currentItems[bodyIndex];
  			body.imageSrc =	body.bodies.find(item => item.bodyType === newSequence && item.fatLevel >= this.state.fatLevel).imageSrc;
  			this.setState({data: newData, inputSequence: ""});
  		}
  	}
  	else{
  		this.setState({inputSequence: ""}); // Clear the input sequence if it is no longer a substring of SAMMY
  	}
	}

  renderExternalItem(id,x,y,imageSrc,h,w,type,desc,draggable,xOffset,yOffset,zIndex){
  	var zIndexFinal = 0;
  	if(zIndex > 0){
  		zIndexFinal = zIndex;
  	}
  	else{
	  	var layerType = layeringOrder.find(t => t.type === type); // Find the layer value for the type
	  	zIndexFinal = typeof layerType !== "undefined" ? layerType.layer : 0;  		
  	}
    return (
      <ExternalItem key={id} id={id} x={x} y={y} imageSrc={imageSrc} h={h} w={w} type={type} desc={desc} draggable={draggable}
      	zIndex={zIndexFinal}
      	xOffset={xOffset} yOffset={yOffset}
        onDelete={id => this.onDelete(id)} 
        setItemPosition={updatedItem => this.setItemPosition(updatedItem)} 
        setItemHoveringPosition={hoveringItem => this.setItemHoveringPosition(hoveringItem)}
        />
    )
  };

  renderBodyPart(x,y,imageSrc,h,w,type) {
    return (
      <BodyPart x={x} y={y} imageSrc={imageSrc} h={h} w={w} type={type} />
    )
  };

  renderBackgroundButton(id,x,y,imageSrc,h,w,direction,horizontalOrientation,verticalOrientation) {
  	return (
  		<Button id={id} key={id} x={x} y={y} imageSrc={imageSrc} h={h} w={w} clickValue={direction} 
        horizontalOrientation={horizontalOrientation}
        verticalOrientation={verticalOrientation}
  			onMouseDown={direction => this.changeBackgroundImage(direction)} desc="BackgroundButton" />
  	)
  };

  renderMusicButton(id,x,y,imageSrc,h,w,direction,horizontalOrientation,verticalOrientation) {
  	return (
  		<Button id={id} key={id} x={x} y={y} imageSrc={imageSrc} h={h} w={w} clickValue={direction} 
        horizontalOrientation={horizontalOrientation}
        verticalOrientation={verticalOrientation}
	  		onMouseDown={direction => this.switchAudio(direction)} desc="MusicButton" />
  	)
  };

  renderSnapToSammiButton(id,x,y,imageSrc,h,w,horizontalOrientation,verticalOrientation) {
  	return (
  		<Button id={id} key={id} x={x} y={y} imageSrc={imageSrc} h={h} w={w} clickValue={null} 
        horizontalOrientation={horizontalOrientation}
        verticalOrientation={verticalOrientation}
	  		onMouseDown={b => this.switchSnapToSammi(b)} desc="SnapToSammiButton" />
  	)
  };

  renderFoodButton(id,x,y,imageSrc,h,w,horizontalOrientation,verticalOrientation,fatValue) {
  	return (
  		<Button id={id} key={id} x={x} y={y} imageSrc={imageSrc} h={h} w={w} clickValue={fatValue}
        horizontalOrientation={horizontalOrientation}
        verticalOrientation={verticalOrientation}
  			onMouseDown={clickValue => this.spawnFood(clickValue)} 
  			desc="FoodButton" />
  	)
  };

  renderBin(id,x,y,imageSrc,h,w) {
    return(
      <Bin id={id} key={id} x={x} y={y} imageSrc={imageSrc} h={h} w={w} setBinPosition={updatedBin => this.setBinPosition(updatedBin)} />
    )
  };

  // Set the position of the bin (called when the window is resized).
  setBinPosition(updatedBin) {
    var binIndex = this.state.data.bins.findIndex((bin => bin.id === updatedBin.id)); // Find index of the bin (most likely always 0)
    var newData = this.state.data;
    newData.bins[binIndex].x = updatedBin.x;
    newData.bins[binIndex].y = updatedBin.y;
    this.setState({ data: newData }); // Is it possible to alter the state directly, or only via the setState method?
  };  

  // This method should change the background image of the body
  changeBackgroundImage(o) {
		var newBackgroundImageIndex = this.state.backgroundImageIndex + o.clickValue;
		var backgrounds = images.filter(item => item.type === "Background").map((image, index) => {return {id: index, imageSrc: image.img}});
		if(newBackgroundImageIndex >= backgrounds.length) newBackgroundImageIndex = 0;
		if(newBackgroundImageIndex < 0) newBackgroundImageIndex = backgrounds.length -1;
		this.setState({ backgroundImageIndex: newBackgroundImageIndex });
		document.body.style.background = "#f3f3f3 url("+backgrounds[newBackgroundImageIndex].imageSrc+") no-repeat left top";
		document.body.style.backgroundSize = "cover";	
  };

  // Spawn an item
  spawnItem(i) {
  	// Find max id in external items
  	var currentMaxId = Math.max.apply(Math,this.state.data.currentItems.map(function(item) {return item.id;}));
  	var configurationItem = this.state.data.configurationItems.find(item => item.type === i.type && item.fileName === i.fileName);
  	var itemSpawn = {
  		id: currentMaxId + 1,
  		x: configurationItem ? configurationItem.x : 900,
  		y: configurationItem ? configurationItem.y : 400,
  		imageSrc: i.imageSrc,
  		h: configurationItem ? configurationItem.h : 100,
  		w: configurationItem ? configurationItem.w : 100,
  		desc: i.fileName ? i.fileName : "",
  		type: i.type,
  		draggable: i.draggable,
  		xOffset: configurationItem ? configurationItem.xOffset : 0, // Offset used for snap-to-body functionality
  		yOffset: configurationItem ? configurationItem.yOffset : 0, // Offset used for snap-to-body functionality
  		zIndex: configurationItem ? configurationItem.zIndex > 0 ? configurationItem.zIndex : -1 : -1,
  	};

  	// Add the foodspawn to the current items data
  	var newData = this.state.data;
  	newData.currentItems.push(itemSpawn);
  	this.setState({ data: newData });
  };

  spawnFood(o) {
  	// Create a random food item of the healthy or unhealthy type, depending on the fatValue of the button
  	var foodImages = images.filter(i => i.type === (o.clickValue > 0 ? "UnhealthyFood" : "HealthyFood"));
  	var image = foodImages[Math.floor(Math.random()*foodImages.length)];

  	// Find max id in external items
  	var currentMaxId = Math.max.apply(Math,this.state.data.currentItems.map(function(i) {return i.id;}));
  	// Create a new item
  	var foodSpawn = {
  			id: currentMaxId + 1,
  			x: Math.floor(150 + Math.random() * 300),
  			y: Math.floor(50 + Math.random() * 450),
  			imageSrc: image.img,
  			h: 150,
  			w: 160,
  			type: image.type,
  			desc: image.fileName,
  			draggable: true,
  			fat: o.clickValue
  		};

  	// Add the foodspawn to the current items data
  	var newData = this.state.data;
  	newData.currentItems.push(foodSpawn);
  	this.setState({ data: newData });
  	console.log("Woah food!");
  };

  setItemHoveringPosition(hoveringItem){
    // Check whether the item overlaps the bin, and highlight the bin if it does.
    var itemIndex = this.state.data.currentItems.findIndex((item => item.id === hoveringItem.id)); // Find the item
    var newData = this.state.data; 
    newData.currentItems[itemIndex].x = hoveringItem.x;
    newData.currentItems[itemIndex].y = hoveringItem.y;
    this.setState({ data: newData }); // Is it possible to alter the state directly, or only via the setState method?

    var item = newData.currentItems[itemIndex];
    var bin = this.state.data.bins[0];
    var overlapsBin = !((item.x + item.w) < bin.x || 
                    item.x > (bin.x + bin.w) || 
                    (item.y + item.h) < bin.y || 
                    item.y > (bin.y + bin.h));

    // If the hovering item overlaps the bin, then highlight the bin. Otherwise make sure the bin is not highlighted.
    if(overlapsBin){
      bin.imageSrc = getImg('BinHighlighted');
    }
    else{
      bin.imageSrc = getImg('Bin');
    }

		// If the item is eatable and hovering over Sammi, then highlight Sammi
    if(hoveringItem.type.indexOf('Food') !== -1) {
	    var bodyIndex = newData.currentItems.findIndex(item => item.type === 'Body');
	    var body = newData.currentItems[bodyIndex];
        var overlapsBody = !((item.x + item.w) < body.x || 
                    item.x > (body.x + body.w) || 
                    (item.y + item.h) < body.y || 
                    item.y > (body.y + body.h));

      body.imageSrc = overlapsBody ? 
  			body.imageSrc =	body.bodies.find(item => item.bodyType === this.state.bodyType && item.fatLevel >= this.state.fatLevel).imageHighlightedSrc :
  			body.imageSrc =	body.bodies.find(item => item.bodyType === this.state.bodyType && item.fatLevel >= this.state.fatLevel).imageSrc;

			newData.currentItems[bodyIndex] = body;
    }

    newData.bins[0] = bin;
    this.setState({ data: newData })
  };

  setItemPosition(updatedItem){
    var itemIndex = this.state.data.currentItems.findIndex((item => item.id === updatedItem.id)); // Find index of the item
    var newData = this.state.data; 
    newData.currentItems[itemIndex].x = updatedItem.x;
    newData.currentItems[itemIndex].y = updatedItem.y;
    newData.bins[0].imageSrc = getImg('Bin'); // Ensure that the bin is not highlighted, in case an item was dropped into the bin
    this.setState({ data: newData }); // Is it possible to alter the state directly, or only via the setState method?

    // Check whether the item overlaps the bin, and delete the item if it does.
    var item = newData.currentItems[itemIndex];
    var bin = this.state.data.bins[0];
    var overlapsBin = !(item.x + item.w < bin.x || 
                    item.x > bin.x + bin.w || 
                    item.y + item.h < bin.y || 
                    item.y > bin.y + bin.h);
    if(overlapsBin){
      this.setState({ deleted: this.state.deleted.concat([item.id]) })
    }

    var bodyIndex = newData.currentItems.findIndex(item => item.type === 'Body');
    var body = newData.currentItems[bodyIndex];
    var overlapsBody = !((item.x + item.w) < body.x || 
                item.x > (body.x + body.w) || 
                (item.y + item.h) < body.y || 
                item.y > (body.y + body.h));

		// If the item is eatable and dropped on Sammi, then Sammi will eat it
    if(updatedItem.type.indexOf('Food') !== -1 && overlapsBody) {  
			this.setState({ deleted: this.state.deleted.concat([item.id]) }); // Read about setState and how it's called
			var newFatLevel = this.state.fatLevel+item.fat;
			console.log(item.fat > 0 ?  this.state.bodyType + " likes this food!" : this.state.bodyType + " seems to be on a diet");
			this.setState({ fatLevel: newFatLevel }); // Increment Sammi's fat level when he eats. Change this to add the nutrition value of the eaten item.
			body.imageSrc =	body.bodies.find(item => item.bodyType === this.state.bodyType && item.fatLevel >= this.state.fatLevel).imageSrc;

			// body.imageSrc = 
			// 	this.state.sammiUnlocked ?
			// 	body.sammiBodies.find(item => item.fatLevel >= newFatLevel).imageSrc :
			// 	body.otherBodies.find(item => item.fatLevel >= newFatLevel).imageSrc;
	    this.setState({ data: newData }); // Is it possible to alter the state directly, or only via the setState method?
    }

    // Implement snap-to-body functionality here
    if(this.state.snapToSammi && wearableTypes.indexOf(updatedItem.type) > -1 && overlapsBody) {
    	console.log(item.desc.substr(0,item.desc.indexOf('.') > 0 ? item.desc.indexOf('.') : item.desc.length) + " was dropped on " + this.state.bodyType);
    	// if(typeof updatedItem.xOffset !== "undefined" && typeof updatedItem.yOffset !== "undefined"){
    	if("xOffset" in updatedItem && "yOffset" in updatedItem && updatedItem.xOffset != 0 && updatedItem.yOffset != 0){
    		console.log(this.state.bodyType + " likes this item. He will put it on.");
	    	// Set position of item relative to Sammi, using the updatedItem.xOffset and updatedItem.yOffset
		    newData.currentItems[itemIndex].x = body.x + updatedItem.xOffset;
		    newData.currentItems[itemIndex].y = body.y + updatedItem.yOffset;
		    this.setState({ data: newData });
    	}
    	else {
    		console.log(this.state.bodyType + " does not know how to wear this item. He will leave it floating randomly.");
    	}
    }
  };

	switchAudio(o) {
		//Return for weird values. Used for the music player background.
		if(o.clickValue > 1){
			return;
		}

		// If direction is 0, then we want to mute/unmute rather than changing tracks
		if(o.clickValue === 0) {
			this.setState({audioPlaying: !this.state.audioPlaying});
			return;
		}

		// Otherwise we want to change tracks
		var newAudioSourceId = this.state.audioSourceId + o.clickValue;
		if(newAudioSourceId >= audioTracks.length) newAudioSourceId = 0;
		if(newAudioSourceId < 0) newAudioSourceId = audioTracks.length -1;
	  this.setState({audioSourceId: newAudioSourceId});
	};

	// Switch Snap-to-Sammi functionality on or off
	switchSnapToSammi(o) {
		this.setState({snapToSammi: !this.state.snapToSammi});
	};

	// Delete a current item from the game (i.e. add it to the list of items not to be rendered)
  onDelete(id) {
    this.setState({ deleted: this.state.deleted.concat([id]) })
  };

  render () {
    // Render external items from data (but only items that are not deleted)
    var items = this.state.data.currentItems
      .filter(item => this.state.deleted.indexOf(item.id) === -1)
      .map(item => 
        this.renderExternalItem(item.id, item.x, item.y, item.imageSrc, item.h, item.w, 
        	item.type, item.desc, item.draggable, item.xOffset, item.yOffset, item.zIndex > 0 ? item.zIndex : -1)
      );

    // Render the bin 
    var bins = this.state.data.bins
      .map(bin =>
        this.renderBin(bin.id, bin.x, bin.y, bin.imageSrc, bin.h, bin.w)
      );

    // Render background buttons
    var backgroundLeftOffset = window.innerWidth / 2 + 60 + 40; // Left button should be a little left of the middle of the screen
    var backgroundRightOffset = window.innerWidth / 2 + 60 - 40; // Right button should be a little right of the middle of the screen
    var backgroundButtons = this.state.data.backgroundButtons
      .map(btn =>
      	this.renderBackgroundButton(btn.id, btn.direction > 0 ? backgroundRightOffset : backgroundLeftOffset, 
      		btn.y, btn.imageSrc, btn.h, btn.w, btn.direction, btn.horizontalOrientation, btn.verticalOrientation)
      );

    // Render music buttons
    var musicButtons = this.state.data.musicButtons
    	.map(btn =>
      	this.renderMusicButton(btn.id, btn.x, btn.y, btn.imageSrc, btn.h, btn.w, btn.direction, btn.horizontalOrientation, btn.verticalOrientation)
    	);

    var snapToSammiButton = this.state.data.snapToSammiButton
    	.map(btn =>
      	this.renderSnapToSammiButton(btn.id, btn.x, btn.y, 
      		this.state.snapToSammi ? btn.activeImageSrc : btn.inactiveImageSrc, btn.h, btn.w, btn.horizontalOrientation, btn.verticalOrientation)
    	);

    var foodButtons = this.state.data.foodButtons
    	.map(btn =>
    		this.renderFoodButton(btn.id, btn.x, btn.y, btn.imageSrc, btn.h, btn.w, btn.horizontalOrientation, btn.verticalOrientation, btn.fatValue)
    	);

		return (
	    <div className="game">
	    	<Audio audioSrc={audioTracks[this.state.audioSourceId].src} audioPlaying={this.state.audioPlaying} />
	    	<Menu images={images} menuSubjects={menuSubjects} itemOnMouseDown={i => this.spawnItem(i)} />
	    	{backgroundButtons}
	    	{musicButtons}
	    	{foodButtons}
	    	{items}
	     	{bins}
	     	<Version />
	     	{snapToSammiButton}
	    </div>
    );
  }
}
