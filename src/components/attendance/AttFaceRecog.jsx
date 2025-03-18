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
        if(data.wo_id === "E_002"){
          alert(`${data.wo_id}님 얼굴 인식 성공! 시간: ${now}`);
        }
        else if(data.wo_id === "Unknown"){
          alert(`인식 실패 [미등록자]: 관리자에게 인식 요청`);
        }
        else if(data.wo_id === "Time out"){
          alert(`인식 실패 [미등록자] & 시간 경과(20sec): 관리자에게 요청`);
        }

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
    <div>
      <h3> 얼굴 자동 인식</h3>
      <button onClick={handleFaceCheck}>얼굴 인식</button>
    </div>
  );
};

export default AttFaceRecog;
