import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import Game from './Game.js';

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

// Helper function to get imported image resource
function getImg(img){
  return images.find(i => i.fileName === (img + '.png')).img;
}

// Fetch all image resources into an array
const images = importAll(require.context('./img', true, /\.(png|jpe?g|svg)$/));

//Define starting elements:
var initialData = {
  allItems: [
    {id: 1, x: 900, y: 300, imageSrc: getImg('Knoppers'), h: 150, w: 150, type: 'Food', desc: 'Knoppers', draggable: true, fat: 1},
    {id: 2, x: 900, y: 300, imageSrc: getImg('Broccoli'), h: 150, w: 150, type: 'Food', desc: 'Broccoli', draggable: true, fat: -1},
  ],
  // Add configuration here for images, such as their size, spawn position, etc. Default values will be used if no configuration exists.
  configurationItems: [
    {type: "Clothes", fileName: "TShirtRainbowsAreGay.png", x: 900, y: 400, h: 260, w: 190, draggable: true, xOffset: 110, yOffset: 125, zIndex: 18,},
    {type: "Clothes", fileName: "Bra.png", x: 900, y: 400, h: 80, w: 200, draggable: true, xOffset: 100, yOffset: 160, zIndex: 16,},
    {type: "Clothes", fileName: "Overalls.png", x: 900, y: 400, h: 600, w: 300, draggable: true, xOffset: 45, yOffset: 110, zIndex: 19,},
    {type: "Clothes", fileName: "Lederhosen.png", x: 900, y: 400, h: 500, w: 210, draggable: true, xOffset: 85, yOffset: 122, zIndex: 19,},
    {type: "Clothes", fileName: "Hotjeans.png", x: 900, y: 400, h: 180, w: 194, draggable: true, xOffset: 95, yOffset: 332, zIndex: 20,},
    {type: "Clothes", fileName: "SwimmingShorts.png", x: 900, y: 400, h: 220, w: 194, draggable: true, xOffset: 95, yOffset: 332, zIndex: 20,},
    {type: "Clothes", fileName: "Wifebeater.png", x: 900, y: 400, h: 243, w: 151, draggable: true, xOffset: 121, yOffset: 127, zIndex: 17,},
    {type: "Clothes", fileName: "ColorHoodie.png", x: 900, y: 400, h: 320, w: 250, draggable: true, xOffset: 75, yOffset: 82, zIndex: 20,},
    {type: "Clothes", fileName: "LeatherVest.png", x: 900, y: 400, h: 260, w: 195, draggable: true, xOffset: 98, yOffset: 115, zIndex: 21,},
    {type: "Food", fileName: "Knoppers.png", x: 900, y: 400, h: 150, w: 150, draggable: true,},
    {type: "Hobby", fileName: "PizzaShovel.png", x: 900, y: 400, h: 200, w: 200, draggable: true,},
    {type: "Hobby", fileName: "PoliceStick.png", x: 900, y: 400, h: 250, w: 150, draggable: true,},
    {type: "Hobby", fileName: "Pizza.png", x: 900, y: 400, h: 200, w: 200, draggable: true,},
    {type: "Hobby", fileName: "Mountainbike.png", x: 900, y: 400, h: 211, w: 388, draggable: true,},
    {type: "Hobby", fileName: "Wakeboard.png", x: 900, y: 400, h: 731, w: 229, draggable: true,},
    {type: "Hobby", fileName: "Audi.png", x: 900, y: 400, h: 245, w: 460, draggable: true,},
    {type: "Hobby", fileName: "DeWaltDrill.png", x: 900, y: 400, h: 150, w: 150, draggable: true,},
    {type: "Hobby", fileName: "Motorcycle.png", x: 900, y: 400, h: 200, w: 400, draggable: true,},
    {type: "Hobby", fileName: "Cat.png", x: 900, y: 400, h: 150, w: 150, draggable: true,},
    {type: "Accessories", fileName: "Pibe.png", x: 900, y: 400, h: 50, w: 50, draggable: true, xOffset: 200, yOffset: 123,},
    {type: "Accessories", fileName: "Cigar.png", x: 900, y: 400, h: 50, w: 50, draggable: true, xOffset: 200, yOffset: 108,},
    {type: "Accessories", fileName: "Bracelet1.png", x: 900, y: 400, h: 35, w: 35, draggable: true, xOffset: 290, yOffset: 390,},
    {type: "Accessories", fileName: "Bracelet2.png", x: 900, y: 400, h: 35, w: 35, draggable: true, xOffset: 67, yOffset: 390,},
    {type: "Accessories", fileName: "FlowerBracelet.png", x: 900, y: 400, h: 40, w: 50, draggable: true, xOffset: 61, yOffset: 390,},
    {type: "Accessories", fileName: "GoldNecklace.png", x: 900, y: 400, h: 100, w: 100, draggable: true, xOffset: 153, yOffset: 125,},
    {type: "Accessories", fileName: "DollarNecklace.png", x: 900, y: 400, h: 150, w: 100, draggable: true, xOffset: 153, yOffset: 123,},
    {type: "Hats", fileName: "PoliceHat.png", x: 900, y: 400, h: 90, w: 110, draggable: true, xOffset: 132, yOffset: -10,},
    {type: "Hats", fileName: "mario.png", x: 900, y: 400, h: 90, w: 100, draggable: true, xOffset: 136, yOffset: -4,},
    {type: "Hats", fileName: "hardhat.png", x: 900, y: 400, h: 90, w: 100, draggable: true, xOffset: 141, yOffset: -5,},
    {type: "Hats", fileName: "RedHat1.png", x: 900, y: 400, h: 90, w: 130, draggable: true, xOffset: 125, yOffset: -15,},
    {type: "Hats", fileName: "RedHat2.png", x: 900, y: 400, h: 80, w: 110, draggable: true, xOffset: 136, yOffset: -4,},
    {type: "Hats", fileName: "ShitHat.png", x: 900, y: 400, h: 85, w: 100, draggable: true, xOffset: 141, yOffset: -25,},
    {type: "Hats", fileName: "santa.png", x: 900, y: 400, h: 125, w: 125, draggable: true, xOffset: 113, yOffset: -16,},
    {type: "Hats", fileName: "Cap1.png", x: 900, y: 400, h: 68, w: 92, draggable: true, xOffset: 147, yOffset: 3,},
    {type: "Hats", fileName: "PumpkinHat.png", x: 900, y: 400, h: 185, w: 185, draggable: true, xOffset: 110, yOffset: -10,},
    {type: "Glasses", fileName: "Glasses1.png", x: 900, y: 400, h: 30, w: 90, draggable: true, xOffset: 151, yOffset: 80,},
    {type: "Glasses", fileName: "Glasses2.png", x: 900, y: 400, h: 30, w: 90, draggable: true, xOffset: 150, yOffset: 80,},
    {type: "Glasses", fileName: "Glasses3.png", x: 900, y: 400, h: 30, w: 90, draggable: true, xOffset: 150, yOffset: 78,},
    {type: "Glasses", fileName: "CoolGlasses.png", x: 900, y: 400, h: 30, w: 86, draggable: true, xOffset: 153, yOffset: 78,},
    {type: "Hair", fileName: "Beard1.png", x: 900, y: 400, h: 100, w: 95, draggable: true, xOffset: 152, yOffset: 83,},
    {type: "Hair", fileName: "Beard2.png", x: 900, y: 400, h: 60, w: 85, draggable: true, xOffset: 155, yOffset: 101,},
    {type: "Hair", fileName: "Beard3.png", x: 900, y: 400, h: 75, w: 103, draggable: true, xOffset: 146, yOffset: 107,},
    {type: "Hair", fileName: "Beard4.png", x: 900, y: 400, h: 62, w: 86, draggable: true, xOffset: 155, yOffset: 114,},
    {type: "Hair", fileName: "Beard5.png", x: 900, y: 400, h: 120, w: 145, draggable: true, xOffset: 125, yOffset: 95,},
    {type: "Hair", fileName: "Beard6.png", x: 900, y: 400, h: 120, w: 138, draggable: true, xOffset: 130, yOffset: 80,},
    {type: "Hair", fileName: "Beard7.png", x: 900, y: 400, h: 44, w: 65, draggable: true, xOffset: 165, yOffset: 113,},
    {type: "Hair", fileName: "Beard8.png", x: 900, y: 400, h: 180, w: 130, draggable: true, xOffset: 130, yOffset: 10,},
    {type: "Hair", fileName: "Beard9.png", x: 900, y: 400, h: 80, w: 85, draggable: true, xOffset: 155, yOffset: 84,},
    {type: "Hair", fileName: "jesus.png", x: 900, y: 400, h: 310, w: 170, draggable: true, xOffset: 110, yOffset: 6,},
    {type: "Hair", fileName: "BunnyHair.png", x: 900, y: 400, h: 115, w: 150, draggable: true, xOffset: 127, yOffset: -25,},
    {type: "Hair", fileName: "BodyHair1.png", x: 900, y: 400, h: 92, w: 145, draggable: true, xOffset: 125, yOffset: 150, zIndex: 15,},
  ],
  // currentItems determine what is current displayed in the game
  currentItems: [ 
    {id: 1, x: 450, y: 160, imageSrc: getImg('Nobody'), imageHighlightedSrc: getImg('SammiEating1'), h: 600, w: 400, type: 'Body', desc: 'Sammi', draggable: false,
      bodies: [
        {fatLevel: 0, imageSrc: getImg('Sammi3'), imageHighlightedSrc: getImg('SammiEating1'), bodyType: 'SAMMY',},
        {fatLevel: 4, imageSrc: getImg('FatSammi3'), imageHighlightedSrc: getImg('FatSammiEating3'), bodyType: 'SAMMY',},
        {fatLevel: 100, imageSrc: getImg('FatSammi4'), imageHighlightedSrc: getImg('FatSammiEating4'), bodyType: 'SAMMY',},
        {fatLevel: 0, imageSrc: getImg('Cookie3'), imageHighlightedSrc: getImg('SammiEating1'), bodyType: 'COOKIE',},
        {fatLevel: 4, imageSrc: getImg('FatCookie3'), imageHighlightedSrc: getImg('FatSammiEating3'), bodyType: 'COOKIE',},
        {fatLevel: 100, imageSrc: getImg('FatCookie4'), imageHighlightedSrc: getImg('FatSammiEating4'), bodyType: 'COOKIE',},
        {fatLevel: 0, imageSrc: getImg('Nobody'), imageHighlightedSrc: getImg('SammiEating1'), bodyType: 'RandomDude',},
        {fatLevel: 4, imageSrc: getImg('FatNobody1'), imageHighlightedSrc: getImg('FatSammiEating3'), bodyType: 'RandomDude',},
        {fatLevel: 100, imageSrc: getImg('FatNobody2'), imageHighlightedSrc: getImg('FatSammiEating4'), bodyType: 'RandomDude',},
      ],
    },
    // {id: 2, x: 800, y: 200, imageSrc: getImg('MusicPlayer'), h: 300, w: 120, type: "MusicPlayer", desc: "Music player Ipod", draggable: false,},
  ],
  bins: [
    {id: 1, x: 0, y: 0, imageSrc: getImg('Bin'), imageHighlightedSrc: getImg('BinHighlighted'), h: 200, w: 200,}
  ],
  backgroundButtons: [
    {id: 1, imageSrc: getImg('PrevButton'), x: 800, y: 20, h: 60, w: 60, direction: -1, horizontalOrientation: "right", verticalOrientation: "top",},
    {id: 2, imageSrc: getImg('NextButton'), x: 700, y: 20, h: 60, w: 60, direction: 1, horizontalOrientation: "right", verticalOrientation: "top",},
    // {id: 3, imageSrc: getImg('TravelButton'), x: 300, y: 150, h: 50, w: 50, direction: 0, horizontalOrientation: "right", verticalOrientation: "top",}, // This button is just for show. It has no effect.
  ],
  musicButtons: [
    {id: 7, imageSrc: getImg('MusicPlayer'), x: 250, y: 150, h: 313, w: 200, direction: 10, horizontalOrientation: "right", verticalOrientation: "top",},
    {id: 4, imageSrc: getImg('Trans'), x: 201, y: 335, h: 40, w: 40, direction: -1, horizontalOrientation: "right", verticalOrientation: "top",},
    {id: 5, imageSrc: getImg('Trans'), x: 125, y: 335, h: 40, w: 40, direction: 1, horizontalOrientation: "right", verticalOrientation: "top",},
    {id: 6, imageSrc: getImg('Trans'), x: 163, y: 335, h: 40, w: 40, direction: 0, horizontalOrientation: "right", verticalOrientation: "top",},
  ],
  snapToSammiButton: [
    {id: 8, x: 310, y: 20, h: 60, w: 60, activeImageSrc: getImg('MagnetActive'), inactiveImageSrc: getImg('MagnetInactive'), horizontalOrientation: "right", verticalOrientation: "top",},  // Not currently used
  ],
  foodButtons: [
    {id: 9, x: 230 , y:20, h: 60, w: 60, imageSrc: getImg('Healthy'), horizontalOrientation: "right", verticalOrientation: "top", fatValue: -1,},
    {id: 10, x: 150 , y:20, h: 60, w: 60, imageSrc: getImg('Unhealthy'), horizontalOrientation: "right", verticalOrientation: "top", fatValue: 1,},
  ],
}

/*
  TODO:
    - Create a form component that takes imageSrc, height, width, and adds an ExternalItem component to the game based on these values.
        This can be handled by adding the values to the Game's props.data.externalItems property.
    - Implement a present in the item menu. Clicking the present will spawn a random item (hurray!).
    - Sound effects
    - Implement a crab food type. This food should trigger CrabSammi.
    - Implement a way to mount Sammi?
    - Add items: Kattegrus, Lederhosen,
*/
  
ReactDOM.render(
  <Game data={initialData} />,
  document.getElementById('root')
);