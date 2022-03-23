import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { WallpaperProvider } from './contexts/WallpaperContext';

ReactDOM.render(
  <WallpaperProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </WallpaperProvider>,
  document.getElementById('root')
);
