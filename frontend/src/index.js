import React from 'react';
import ReactDOM from 'react-dom/client';
import{
  BrowserRouter, Routes, Route
} from 'react-router-dom';
import './index.css';
import Login from './components/pages/Login/Login';
import Register from './components/pages/Register/Register';
import Otp from './components/pages/Otp/Otp';
import Books from './components/pages/Books/Books';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter> 
    <Routes>
      <Route path = "/" element = {<Login />} />
      <Route path = "/daftar" element = {<Register />} />
      <Route path = "/kode-otp" element = {<Otp />} />
      <Route path = "/books" element = {<Books />} />
    </Routes>
  </BrowserRouter>
);

