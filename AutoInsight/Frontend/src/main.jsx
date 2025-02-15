import App from './App';
import { createRoot } from "react-dom/client";
import './index.css';
import { StrictMode } from 'react'
import { Provider } from 'react-redux';
import store from './store/index';



createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
    <App />
  </StrictMode>,
  </Provider>
  
)
