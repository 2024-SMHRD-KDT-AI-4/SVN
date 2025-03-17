import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import Main from './components/Main';
import ManEmplyee from './components/management/ManEmplyee'; // ✅ 경로 맞춰서
//import "bootswatch/dist/flatly/bootstrap.min.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/system" element={<Main />} />
        <Route path="/management" element={<ManEmplyee />} /> {/* 오타로 존재하는 파일 그대로 사용 */}
      </Routes>
    </Router>
  );
};

export default App;
