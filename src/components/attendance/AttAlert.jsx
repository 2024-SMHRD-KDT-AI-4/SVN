import React, { useState } from 'react';

function AttAlert() {
  const [message, setMessage] = useState('');

  // 얼굴인식 요청 함수
  const handleFaceRecognize = async () => {
    try {
      // Node 서버에 요청 (예: /alert/face-check)
      const res = await fetch('/alert/face-check', { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        setMessage(`[인식 성공] 직원 ID: ${data.wo_id}`);
      } else {
        setMessage(`[인식 실패] ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('얼굴 인식 중 오류 발생');
    }
  };

  return (
    <div
      style={{
        width: "280px",
        height: "400px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        padding: "10px",
      }}
    >
      <h3>경고경고</h3>
      <p>얼굴인식 테스트를 할 수 있는 곳</p>

      <button onClick={handleFaceRecognize}>얼굴 인식하기</button>
      <div style={{ marginTop: "10px", color: "red" }}>
        {message}
      </div>
    </div>
  );
}

export default AttAlert;
