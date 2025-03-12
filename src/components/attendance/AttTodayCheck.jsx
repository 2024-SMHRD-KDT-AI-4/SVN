import React, { useState } from 'react';

function AttTodayCheck() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // 출근하기
  const handleCheckIn = async () => {
    try {
      const response = await fetch('/attendance/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wo_id: 'E_001' }) // 예시로 'E_001'
      });
      const data = await response.json();
      if (data.success) {
        // DB에서 받아온 출근 시각
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
        body: JSON.stringify({ wo_id: 'E_001' })
      });
      const data = await response.json();
      if (data.success) {
        // DB에서 받아온 퇴근 시각
        setEndTime(data.end_time);
      } else {
        console.log('퇴근 실패:', data.message);
      }
    } catch (error) {
      console.log('퇴근 요청 오류:', error);
    }
  };

  return (
    <div>
      <h2>근무체크 (test2_table)</h2>
      <p>출근시간: {startTime || '---'}</p>
      <p>퇴근시간: {endTime || '---'}</p>
      <button onClick={handleCheckIn}>출근하기</button>
      <button onClick={handleCheckOut}>퇴근하기</button>
    </div>
  );
}

export default AttTodayCheck;
