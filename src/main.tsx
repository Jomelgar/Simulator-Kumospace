import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import Home from './pages/Home.tsx'
import Dashboard from './pages/Dashboard.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<App page="login" />} />
        <Route path="/sign_in" element={<App page="sign_in" />} />
        <Route path="/inicio" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)
