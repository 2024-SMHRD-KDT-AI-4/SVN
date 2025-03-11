import React, { useState, useEffect } from 'react';

const AttTodayCheck = () => {
  const [currentTime, setCurrentTime] = useState(new Date()); // 실시간 시계
  const [startTime, setStartTime] = useState(null); // 출근시간
  const [endTime, setEndTime] = useState(null);     // 퇴근시간

  // 1초마다 실시간 시계 갱신
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 출근하기
  const handleCheckIn = async () => {
    try {
      const res = await fetch('/attendance/checkin', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        // 서버가 time: now 형태로 응답
        const dateObj = new Date(data.time);
        setStartTime(dateObj);
      } else {
        console.error('출근 실패:', data.message);
      }
    } catch (err) {
      console.error('출근 처리 오류:', err);
    }
  };

  // 퇴근하기
  const handleCheckOut = async () => {
    try {
      const res = await fetch('/attendance/checkout', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        const dateObj = new Date(data.time);
        setEndTime(dateObj);
      } else {
        console.error('퇴근 실패:', data.message);
      }
    } catch (err) {
      console.error('퇴근 처리 오류:', err);
    }
  };

  // 시계 표시 (HH:MM:SS 24시간제)
  const clockStr = currentTime.toLocaleTimeString('ko-KR', { hour12: false });

  // 출근시간 표시
  const startStr = startTime
    ? startTime.toLocaleTimeString('ko-KR', { hour12: false })
    : '?? : ?? : ??';

  // 퇴근시간 표시
  const endStr = endTime
    ? endTime.toLocaleTimeString('ko-KR', { hour12: false })
    : '?? : ?? : ??';

  return (
    <div
      style={{
        width: "500px",
        height: "400px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        padding: "10px",
      }}
    >
      <div style={{ fontSize: "20px" }}>
        {/* 가운데 큰 시계 */}
        <div style={{ textAlign: "center", margin: "50px", fontSize: "40px" }}>
          {clockStr}
        </div>

        {/* 출근/퇴근시간 */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* 출근시간 영역 */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <span>출근시간</span>
            <br /><br />
            <span>{startStr}</span>
          </div>
          <div></div>
          <div>
            <hr
              style={{
                border: "none",
                borderLeft: "2px solid grey",
                height: "80",
              }}
            />
          </div>
          {/* 퇴근시간 영역 */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <span>퇴근시간</span>
            <br /><br />
            <span>{endStr}</span>
          </div>
        </div>
      </div>

      {/* 버튼들 */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={handleCheckIn}>출근하기</button>
        <button onClick={handleCheckOut} style={{ marginLeft: '10px' }}>
          퇴근하기
        </button>
      </div>
    </div>
  );
};

export default AttTodayCheck;
