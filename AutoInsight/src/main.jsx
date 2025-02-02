import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createRoot } from "react-dom/client";
import './index.css';
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from 'react'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
