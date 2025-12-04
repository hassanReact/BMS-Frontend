/* eslint-disable prettier/prettier */
import React from 'react';
import ReactDOM from 'react-dom/client';

// third party
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

// project imports
import App from './App';
import { store } from './store';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

// style + assets
import './assets/scss/style.scss';
import config from '@/config';

// ==============================|| REACT DOM RENDER  ||============================== //

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={config.basename}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
