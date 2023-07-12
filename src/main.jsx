import React from 'react'
import ReactDOM from 'react-dom/client'
import './main.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from './Index';

function App() {
  return <Index />
}

export default App



const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
