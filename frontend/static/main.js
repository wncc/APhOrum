'use strict';

import { Translator } from './translation.js';

var translatorContainer = document.querySelector('#aph_translation');
ReactDOM.render(React.createElement(Translator, null), translatorContainer);