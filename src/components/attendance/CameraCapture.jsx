import React, { useRef, useState } from 'react';

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const [streaming, setStreaming] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setStreaming(true);
    } catch (err) {
      console.error('카메라 오류:', err);
    }
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(onCapture, 'image/jpeg');
  };

  return (
    <div>
      {!streaming && <button onClick={startCamera}>카메라 켜기</button>}
      <video ref={videoRef} autoPlay style={{ width: '100%', maxWidth: '400px' }} />
      {streaming && <button onClick={captureImage}>사진 찍기</button>}
    </div>
  );
};

export default CameraCapture;
