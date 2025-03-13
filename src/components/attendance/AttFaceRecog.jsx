// AttFaceRecog.jsx (수정된 코드 예시)
// ------------------------------------------------------
// 이 파일에서 fetch 요청을 '/face/face-check'로 맞추고
// 서버에서 오는 응답(stdout.trim()) 값을 그대로 보여주도록 수정

import React, { useState } from 'react';

const AttFaceRecog = () => {
  const [result, setResult] = useState('');

  const handleFaceRecognition = async () => {
    try {
      const res = await fetch('/face/face-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'alert' }) // 필요 시 body에 다른 데이터도 추가
      });
      const data = await res.json();
      // Python 스크립트에서 'success', 'fail'과 같은 문자열이 넘어온다고 가정
      // data.message를 그대로 출력하거나, 조건에 따라 메시지를 달리 할 수도 있음
      setResult(data.message);
    } catch (error) {
      setResult('에러: 얼굴 인식 실패');
    }
  };

  return (
    <div>
      <h3>얼굴 인식</h3>
      <button onClick={handleFaceRecognition}>얼굴 인식</button>
      <p>결과: {result}</p>
    </div>
  );
};

export default AttFaceRecog;
