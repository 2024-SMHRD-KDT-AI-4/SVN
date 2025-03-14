import React, { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5067'); // 소켓 연결

const AttFaceRecog = () => {

  // 소켓 연결 확인
  useEffect(() => {
    console.log('소켓 연결됨:', socket);

    // 소켓 연결 해제 방지
    return () => socket.disconnect();
  }, []);

  // 얼굴 인식 요청 함수
  const handleFaceCheck = () => {
    console.log('얼굴 인식 요청 보냄');
    socket.emit('faceCheck'); // 소켓으로 얼굴 인식 요청

    // 결과 수신
    socket.on('faceResult', (data) => {
      if (data.success) {
        const now = new Date().toLocaleString(); // 현재 시간
        alert(`${data.wo_id}님 얼굴 인식 성공! 시간: ${now}`);
      } else {
        alert(`인식 실패: ${data.message}`);
      }
    });
  };

  return (
    <div>
      <h3>출근 얼굴 인식 (소켓)</h3>
      <button onClick={handleFaceCheck}>얼굴 인식</button>
    </div>
  );
};

export default AttFaceRecog;
