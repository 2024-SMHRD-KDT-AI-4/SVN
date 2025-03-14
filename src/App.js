import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import Main from './components/Main';

import io from 'socket.io-client';
const socket = io('http://localhost:5067'); // 서버 연결

const App = () => {
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // 스케줄 알림
    socket.on('scheduleAlert', (message) => {
      setToastMessage(`[알림] ${message}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    });

    // 얼굴 인식 결과
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

  // 얼굴 인식 요청 버튼
  const handleFaceCheck = () => {
    socket.emit('faceCheck'); // 소켓으로 얼굴 인식 요청
  };

  return (
    <Router>
      {/* 토스트 알림 (맨 위 고정) */}
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

      {/* 라우터 */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/system" element={<Main />} />
      </Routes>

      {/* ✅ 하단 or 상단 원하는 위치에 버튼 배치 */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        <button onClick={handleFaceCheck} style={{
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '8px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          cursor: 'pointer'
        }}>
          얼굴 인식 시작
        </button>
      </div>
    </Router>
  );
};

export default App;
