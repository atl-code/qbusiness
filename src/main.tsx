import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import React from 'react';
import { Amplify } from 'aws-amplify';
import config from './aws-exports';
import { BrowserRouter } from 'react-router-dom';
Amplify.configure(config);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </React.StrictMode>,
)
