import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';  // MainPage 컴포넌트 import
import Main from './components/Main';  // Main 컴포넌트 import
import AttAlert from './components/attendance/AttAlert';  

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 첫 페이지로 MainPage를 설정 */}
        <Route path="/" element={<MainPage />} />
        {/* 시스템 페이지 */}
        <Route path="/system" element={<Main />} />
        
      </Routes>
    </Router>
  );
};

export default App;
