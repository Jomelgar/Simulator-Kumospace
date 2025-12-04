import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import Home from './pages/Home.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App page ="inicio"/>} />
        <Route path="/login" element={<App page="login" />} />
        <Route path="/signin" element={<App page="signin" />} />
        <Route path="/inicio" element={<App page ="inicio"/>} />
        <Route path="/dashboard" element={<App page="dashboard" />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)
