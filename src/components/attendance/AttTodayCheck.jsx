import React, { useRef, useState, useEffect } from 'react';

const AttTodayCheck = () => {
  const videoRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [mode, setMode] = useState(null); // 출근 or 퇴근
  const [result, setResult] = useState("");
  const [checkInTime, setCheckInTime] = useState("?? : ?? : ??");
  const [checkOutTime, setCheckOutTime] = useState("?? : ?? : ??");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (mode) startCameraAndAutoCapture(); // 출근/퇴근 버튼 누르면 카메라 + 자동캡처
  }, [mode]);

  const startCameraAndAutoCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setStreaming(true);

      setTimeout(() => captureImage(stream), 3000); // 3초 뒤 자동 캡처
    } catch (err) {
      console.error('카메라 오류:', err);
    }
  };

  const captureImage = (stream) => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => sendImageToServer(blob), 'image/jpeg');

    stream.getTracks().forEach(track => track.stop()); // 카메라 끄기
    setStreaming(false);
  };

  const sendImageToServer = async (imageBlob) => {
    const formData = new FormData();
    formData.append('image', imageBlob);

    try {
      const res = await fetch('/api/face-check', { method: 'POST', body: formData });
      const data = await res.json();

      if (data.recognizedId !== 'Unknown') {
        const now = new Date().toLocaleTimeString('ko-KR');
        if (mode === '출근') {
          setCheckInTime(now);
          await fetch('/api/checkin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ wo_id: data.recognizedId }) });
        } else if (mode === '퇴근') {
          setCheckOutTime(now);
          await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ wo_id: data.recognizedId }) });
        }
        setResult(`[${mode} 성공] 직원 ID: ${data.recognizedId}, 정확도: ${data.accuracy}`);
      } else {
        setResult(`[${mode} 실패] 얼굴 인식 실패`);
      }
    } catch (err) {
      console.error(err);
      setResult("서버 전송 에러");
    }

    setMode(null); // 모드 초기화
  };

  return (
    <div style={{ width: '100%', padding: '10px', textAlign: 'center' }}>
      <h3>{currentTime.toLocaleTimeString("ko-KR")}</h3>
      <p>출근시간: {checkInTime}</p>
      <p>퇴근시간: {checkOutTime}</p>
      <button onClick={() => setMode('출근')}>출근하기</button>
      <button onClick={() => setMode('퇴근')}>퇴근하기</button>
      {streaming && <video ref={videoRef} autoPlay style={{ width: '100%', maxWidth: '400px' }} />}
      {result && <p style={{ color: "red" }}>{result}</p>}
    </div>
  );
};

export default AttTodayCheck;
