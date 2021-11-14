'use strict';

import { Translator } from './translation.js';
import { ImageAnnotator } from './annotator.js';

var translatorContainer = document.querySelector('#aph_translation');
ReactDOM.render(React.createElement(Translator, null), translatorContainer);

var annotatorContainer = document.querySelector('#aph_image_annotate');
ReactDOM.render(React.createElement(ImageAnnotator, null), annotatorContainer);