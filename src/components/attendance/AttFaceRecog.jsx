// src/components/attendance/AttFaceRecog.jsx
import React, { useState } from 'react';

function AttFaceRecog() {
  const [message, setMessage] = useState('');

  const handleFaceCheck = async () => {
    try {
      // Node 서버의 /alert/face-check 라우트로 POST 요청
      const res = await fetch('/alert/face-check', { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        setMessage(`[인식 성공] 직원 ID: ${data.wo_id}, 정확도: ${data.accuracy}`);
      } else {
        setMessage(`[인식 실패] ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('에러 발생');
    }
  };

  return (
    <div style={{ width: '300px', height: '200px', padding: '10px' }}>
      <h4>얼굴 인식</h4>
      <button onClick={handleFaceCheck}>얼굴인식</button>
      <div style={{ marginTop: '10px', color: 'red' }}>{message}</div>
    </div>
  );
}

export default AttFaceRecog;
