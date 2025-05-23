import React, { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5067'); // 소켓 연결

const AttFaceRecog = () => {

  // 소켓 연결 확인
  useEffect(() => {
    console.log('소켓 연결됨:', socket);

    // 얼굴 인식 결과 수신 (구독은 한 번만)
    const handleFaceResult = (data) => {
      if (data.success) {
        const now = new Date().toLocaleString(); // 현재 시간
        alert(`${data.wo_id}님 얼굴 인식 성공! 시간: ${now}`);
      } else {
        alert(`인식 실패: ${data.message}`);
      }
    };

    // 'faceResult' 이벤트 구독 (한 번만)
    socket.on('faceResult', handleFaceResult);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      socket.off('faceResult', handleFaceResult); // 리스너 제거
      socket.disconnect(); // 소켓 연결 해제
    };
  }, []); // 빈 배열로 한 번만 실행

  // 얼굴 인식 요청 함수
  const handleFaceCheck = () => {
    console.log('얼굴 인식 요청 보냄');
    socket.emit('faceCheck'); // 소켓으로 얼굴 인식 요청
  };

  return (
<div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "400px",
        // backgroundColor: "#f3f4f6", // 연한 회색
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff", // 흰색 배경
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // 그림자 효과
          borderRadius: "16px", // 둥근 모서리
          padding: "24px",
          width: "480px",
          minHeight: "360px",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#1f2937", // 진한 회색
            marginBottom: "16px",
          }}
        >
          얼굴 자동 인식
        </h3>
        <button
          onClick={handleFaceCheck}
          style={{
            width: "100%",
            backgroundColor: "#3b82f6", // 파란색
            color: "#ffffff", // 흰색 텍스트
            padding: "12px",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")} // 어두운 파란색
          onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")} // 기본 파란색
        >
          얼굴 인식
        </button>
      </div>
    </div>
  );
};

export default AttFaceRecog;
