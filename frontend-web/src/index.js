import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';


// Add debug listeners in development
if (process.env.NODE_ENV === 'development') {

}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);