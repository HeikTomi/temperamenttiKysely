import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from "react-intl";
import messages from './messages';

import '@formatjs/intl-relativetimeformat/polyfill';
import '@formatjs/intl-relativetimeformat/locale-data/fi';


import './index.scss';
import App from './component/App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
   <React.StrictMode >
        <IntlProvider locale='fi' messages={messages["fi"]}>
            <App />
        </IntlProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
