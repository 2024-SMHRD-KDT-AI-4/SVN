import React, { useState, useEffect } from 'react';

function AttTodayCheck() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date()); // 현재 시간 흐르게 할 상태

  // 현재 시계 흐르게
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // 1초마다 갱신

    return () => clearInterval(timer); // 언마운트 시 타이머 제거
  }, []);
  
  // 출근하기
  const handleCheckIn = async () => {
    try {
      const response = await fetch('/attendance/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wo_id: 'E_002' }) // 임시로 E_001
      });
      const data = await response.json();
      if (data.success) {
        setStartTime(data.start_time);
      } else {
        console.log('출근 실패:', data.message);
      }
    } catch (error) {
      console.log('출근 요청 오류:', error);
    }
  };

  // 퇴근하기
  const handleCheckOut = async () => {
    try {
      const response = await fetch('/attendance/check-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wo_id: 'E_002' }) // 임시로 E_001
      });
      const data = await response.json();
      if (data.success) {
        setEndTime(data.end_time);
      } else {
        console.log('퇴근 실패:', data.message);
      }
    } catch (error) {
      console.log('퇴근 요청 오류:', error);
    }
  };

  // 시간 포맷 (두 자리로 표시)
  const formatTime = (date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes()
      .toString()
      .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', width: '350px' }}>
     
      <h2>{formatTime(currentTime)}</h2> {/* 실시간 시계 */}
      <p>출근시간: {startTime || '---'}</p>
      <p>퇴근시간: {endTime || '---'}</p>
      <button onClick={handleCheckIn}>출근하기</button>
      <button onClick={handleCheckOut} style={{ marginLeft: '10px' }}>퇴근하기</button>
    </div>
  );
}

export default AttTodayCheck;
