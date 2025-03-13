import React, { useEffect, useState } from 'react'; // 알림 받기 위해 useEffect, useState 추가
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';  // MainPage 컴포넌트 import
import Main from './components/Main';  // Main 컴포넌트 import
import AttAlert from './components/attendance/AttAlert';  

// ---------------- Socket.io 클라이언트 import ----------------
import io from 'socket.io-client'; // 소켓 클라이언트 사용
const socket = io('http://localhost:5067'); // 서버와 연결 (주소 확인)

// ---------------- App 컴포넌트 ----------------
const App = () => {
  const [toastMessage, setToastMessage] = useState(''); // 토스트 메시지 상태
  const [showToast, setShowToast] = useState(false); // 토스트 표시 여부

  // ---------------- Socket.io 알림 처리 ----------------
  useEffect(() => {
    // 서버에서 오는 'scheduleAlert' 이벤트 수신
    socket.on('scheduleAlert', (message) => {
      console.log('받은 알림:', message); // 콘솔 확인용
      setToastMessage(`[알림] ${message}`); // 토스트 메시지 세팅
      setShowToast(true); // 토스트 보이기

      // 3초 후 자동 사라짐
      setTimeout(() => {
        setShowToast(false); // 토스트 숨기기
      }, 3000);
    });

    // 컴포넌트 언마운트 시 소켓 연결 해제 (메모리 누수 방지)
    return () => {
      socket.off('scheduleAlert');
    };
  }, []); // 빈 배열로 최초 1번만 실행

  return (
    <Router>
      {/* 토스트 알림 (맨 위 고정 전체 가로) */}
      {showToast && (
        <div style={{
          position: 'fixed', // 화면 어디든 고정
          top: 0, // 맨 위에 딱 붙이기
          left: 0, // 왼쪽부터
          width: '100%', // 가로 전체
          backgroundColor: '#333', // 배경
          color: '#fff', // 글씨
          padding: '16px 0', // 상하 여백
          textAlign: 'center', // 글씨 가운데
          zIndex: 10000, // 무조건 다른 것들보다 위에 (헤더보다 위로)
          fontSize: '16px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)' // 아래 그림자
        }}>
          {toastMessage}
        </div>
      )}

      <Routes>
        {/* 첫 페이지로 MainPage를 설정 */}
        <Route path="/" element={<MainPage />} />
        {/* 시스템 페이지 */}
        <Route path="/system" element={<Main />} />
        
        {/* [기존 라우터 유지] */}
        {/* 경고/출퇴근 알림 */}
        <Route path="/alert" element={<AttAlert />} />

        {/* 앞으로 필요한 페이지 있으면 여기에 추가 */}
      </Routes>
    </Router>
  );
};

export default App;
