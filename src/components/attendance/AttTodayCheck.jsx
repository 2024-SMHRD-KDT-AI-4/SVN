import React, { useState, useEffect } from 'react';

const AttTodayCheck = () => {
  const [currentTime, setCurrentTime] = useState(new Date()); // 실시간 시계
  const [startTime, setStartTime] = useState(null); // 출근시간
  const [endTime, setEndTime] = useState(null);     // 퇴근시간

  // [A] 매초마다 currentTime 업데이트 (실시간 시계)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // [B] '출근하기' 버튼
  const handleCheckIn = async () => {
    try {
      // 서버로 출근 요청
      const res = await fetch('/attendance/checkin', { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        // data.time: 서버가 준 출근 시각(ISO 형태)
        // 화면에 표시하기 위해 Date 객체로 변환
        const dateObj = new Date(data.time);
        setStartTime(dateObj); // 출근 시간 상태를 업데이트
      } else {
        console.error('출근 실패:', data.message);
      }
    } catch (error) {
      console.error('출근 처리 중 오류:', error);
    }
  };

  // [C] '퇴근하기' 버튼
  const handleCheckOut = async () => {
    try {
      const res = await fetch('/attendance/checkout', { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        const dateObj = new Date(data.time);
        setEndTime(dateObj); // 퇴근 시간 상태를 업데이트
      } else {
        console.error('퇴근 실패:', data.message);
      }
    } catch (error) {
      console.error('퇴근 처리 중 오류:', error);
    }
  };

  // [D] 화면에 표시할 시각 문자열 만들기
  // 실시간 시계: HH:MM:SS
  const clockString = currentTime.toLocaleTimeString('ko-KR', {
    hour12: false,
  });

  // 출근시간 있으면 표시, 없으면 ??
  const startString = startTime
    ? startTime.toLocaleTimeString('ko-KR', { hour12: false })
    : '?? : ?? : ??';

  // 퇴근시간 있으면 표시, 없으면 ??
  const endString = endTime
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
        {/* 가운데 크게 보이는 실시간 시계 */}
        <div style={{ textAlign: "center", margin: "50px", fontSize: "40px" }}>
          {clockString}
        </div>

        {/* 출근시간/퇴근시간 표시 영역 */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* 왼쪽: 출근 시간 */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <span>출근시간</span>
            <br /><br />
            <span>{startString}</span>
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

          {/* 오른쪽: 퇴근 시간 */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <span>퇴근시간</span>
            <br /><br />
            <span>{endString}</span>
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
