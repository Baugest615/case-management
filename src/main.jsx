// src/main.jsx - 安全版本
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

console.log('正在載入應用程式...');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)