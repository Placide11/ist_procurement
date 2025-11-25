import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateRequest from './pages/CreateRequest';
import RequestDetail from './pages/RequestDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateRequest />} />
        
        <Route path="/requests/:id" element={<RequestDetail />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;