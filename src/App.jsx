import {BrowserRouter,Routes,Route}  from 'react-router-dom';
import React from "react";
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
  //<h1 className='text-red-700'>App</h1>;
}
