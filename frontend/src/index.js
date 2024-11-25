import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Creates a root DOM node where the React app will be rendered
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/*Set the App component to the root of the application*/}
    <App />
  </React.StrictMode>
);


