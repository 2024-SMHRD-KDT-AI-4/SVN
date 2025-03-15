import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import Main from './components/Main';
import ManEmplyee from './components/management/ManEmplyee'; // ✅ 경로 맞춰서

import io from 'socket.io-client';
const socket = io('http://localhost:5067'); // 서버 연결

const App = () => {
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    socket.on('scheduleAlert', (message) => {
      setToastMessage(`[알림] ${message}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    });

    socket.on('faceResult', (data) => {
      if (data.success) {
        setToastMessage(`[얼굴 인식 성공] ${data.wo_id}님 출근 인식 완료`);
      } else {
        setToastMessage(`[얼굴 인식 실패] ${data.message}`);
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    });

    return () => {
      socket.off('scheduleAlert');
      socket.off('faceResult');
    };
  }, []);

  const handleFaceCheck = () => {
    socket.emit('faceCheck'); // 소켓으로 얼굴 인식 요청
  };

  return (
    <Router>
      {showToast && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          backgroundColor: '#333',
          color: '#fff',
          padding: '16px 0',
          textAlign: 'center',
          zIndex: 10000,
          fontSize: '16px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }}>
          {toastMessage}
        </div>
      )}

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/system" element={<Main />} />
        <Route path="/management" element={<ManEmplyee />} /> {/* 오타로 존재하는 파일 그대로 사용 */}
      </Routes>
    </Router>
  );
};

export default App;
