
import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';
import App from './component/App';
import * as serviceWorker from './serviceWorker';

const lang = (/^en\b/.test(navigator.language)) ? "en" : "fi";

ReactDOM.render(
   <React.StrictMode >
      <App lang={lang} />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
