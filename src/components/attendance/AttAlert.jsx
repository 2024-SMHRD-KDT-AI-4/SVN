import React, { useState } from 'react';
import axios from 'axios';

const AttAlert = () => {
  const [result, setResult] = useState('');

  const handleFaceRecognition = async () => {
    try {
      const response = await axios.post('/alert/face-check');
      if (response.data.success) {
        setResult(`[인식 성공] 직원 ID: ${response.data.wo_id}`);
      } else {
        setResult(`[인식 실패] ${response.data.message}`);
      }
    } catch (error) {
      console.error('서버 오류:', error);
      setResult('서버 오류 발생');
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
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <h4>경고</h4>
      <button onClick={handleFaceRecognition} style={{ marginBottom: '10px' }}>
        얼굴 인식
      </button>
      <div style={{ color: "red" }}>{result}</div>
    </div>
  );
};

export default AttAlert;
