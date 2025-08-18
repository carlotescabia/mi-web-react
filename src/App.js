import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HeroPage from './pages/HeroPage';
import TodoPage from './pages/TodoPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HeroPage />} />
      <Route path="/todo" element={<TodoPage />} />
    </Routes>
  );
}

export default App;
