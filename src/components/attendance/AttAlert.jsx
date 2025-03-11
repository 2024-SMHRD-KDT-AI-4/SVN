// src/components/attendance/AttAlert.jsx
import React, { useState } from 'react';

function AttAlert() {
  const [message, setMessage] = useState('');

  const handleFaceCheck = async () => {
    try {
      // Node 서버의 /alert/face-check 라우트로 POST
      const res = await fetch('/alert/face-check', { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        setMessage(`[인식 성공] 직원 ID: ${data.wo_id}, 정확도: ${data.accuracy}`);
      } else {
        // 400, 500 등
        setMessage(`[인식 실패] ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('에러 발생');
    }
  };

  return (
    <div
      style={{
        width: "300px",
        height: "200px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "#fff",
        padding: "10px",
      }}
    >
      <h4>경고</h4>
      <button onClick={handleFaceCheck}>얼굴인식</button>
      <div style={{ marginTop: '10px', color: 'red' }}>{message}</div>
    </div>
  );
}

export default AttAlert;
