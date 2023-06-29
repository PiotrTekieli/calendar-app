import React from 'react'
import ReactDOM from 'react-dom/client'
import './main.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from './Index';
import Add from './Add';
import Layout from './Layout';

function App() {
  // return (
  //   <>
  //     <BrowserRouter>
  //       <Routes>
  //         <Route path="/" element={<Layout />}>
  //           <Route index element={<Index />} />
  //           <Route path="add" element={<Add />} />
  //         </Route>
  //       </Routes>
  //     </BrowserRouter>
  //   </>
  // )
  return <Index />
}

export default App



const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
