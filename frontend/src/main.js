'use strict';

import { Navigator } from './nav.js';

let navContainer = document.querySelector("#aphoNavContainer")
ReactDOM.render(<Navigator />, navContainer);

// import { Translator } from './translation.js';
// import { ImageAnnotator } from './annotator.js';
// 
// let translatorContainer = document.querySelector('#aph_translation');
// ReactDOM.render(<Translator />, translatorContainer);
// 
// let annotatorContainer = document.querySelector('#aph_image_annotate');
// ReactDOM.render(<ImageAnnotator />, annotatorContainer);