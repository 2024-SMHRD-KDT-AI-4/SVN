import { useState, useEffect } from "react";
import React from "react";  // 🔥 React import 추가 (필수!)


const WeeklyTableCalendar = () => {
  // 📌 상태 관리 (State)
  const [startDate, setStartDate] = useState(new Date()); // 현재 주의 시작 날짜
  const [name, setName] = useState(""); // 일정의 이름
  const [date, setDate] = useState(""); // 선택된 날짜
  const [startTime, setStartTime] = useState("시작 시간"); // 시작 시간
  const [endTime, setEndTime] = useState("끝 시간"); // 끝난 시간
  const [schedules, setSchedules] = useState([]); // 일정 목록
  

  // 📌 컴포넌트가 처음 렌더링될 때 실행 (주간 시작 날짜 설정)
  useEffect(() => {
    setStartDate(getStartOfWeek(new Date()));
  }, []);

  // 📌 현재 주의 시작 날짜를 계산하는 함수
  const getStartOfWeek = (date) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1)); // 월요일을 기준으로 설정
    return newDate;
  };

  // 📌 해당 주의 7일을 계산하는 함수
  const getWeekDays = (date) => {
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(date);
      day.setDate(date.getDate() + i);
      return {
        date: `${day.getDate()}일 (${["일", "월", "화", "수", "목", "금", "토"][day.getDay()]})`, // 요일과 날짜
        fullDate: day.toISOString().split("T")[0], // YYYY-MM-DD 형식
      };
    });
  };

  // 📌 주간 이동 함수 (이전 날, 다음 날 버튼 기능)
  const changeDay = (direction) => {
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + direction);
    setStartDate(newDate);
  };

  // 📌 오늘 날짜로 이동하는 함수
  const goToToday = () => {
    setStartDate(new Date());
  };

  // 📌 현재 날짜를 YYYY-MM-DD 형식으로 저장
  const today = new Date().toISOString().split("T")[0];

  // 📌 근무 시간 설정 (08:00 ~ 22:00)
  const workingHoursStart = 8;
  const workingHoursEnd = 22;

  // 📌 30분 단위로 timeSlots 생성
  const timeSlots = Array.from({ length: (workingHoursEnd - workingHoursStart) * 2 }, (_, i) => {
    const hour = Math.floor(i / 2) + workingHoursStart;
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${hour}:${minutes}`;
  });

  // 📌 시작 시간(timeSlots1)과 끝난 시간(timeSlots2)에 "시작시간", "끝시간" 추가
  const timeSlots1 = ["시작시간", ...timeSlots];
  const timeSlots2 = ["끝시간", ...timeSlots];

  // 📌 일정 추가 핸들러
  const handleScheduleSubmit = () => {
    if (!name.trim() || !date || !startTime || !endTime) {
      alert("모든 입력값을 입력해주세요!");
      return;
    }
  
    const startIdx = timeSlots1.indexOf(startTime);
    const endIdx = timeSlots2.indexOf(endTime);
  
    if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) {
      alert("시간 입력이 잘못되었습니다.");
      return;
    }
  
    const formattedDate = new Date(date).toISOString().split("T")[0];
  
    // ✅ 기존: 이름과 날짜만 비교 → 일정 중복 발생!
    // ✅ 수정: 이름 + 날짜 + 시작시간 + 끝시간까지 비교
    if (schedules.some((s) => s.name === name && s.date === formattedDate && s.startTime === startTime && s.endTime === endTime)) {
      alert("같은 이름, 같은 시간의 일정이 이미 존재합니다!");
      return;
    }
  
    const newSchedule = {
      name,
      date: formattedDate,
      startTime,
      endTime,
      startIndex: startIdx,
      endIndex: endIdx,
      color: getColorForName(name),
    };
  
    setSchedules([...schedules, newSchedule]);
  };

  // 📌 일정별 랜덤 색상 할당 함수
  const getColorForName = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    // 🔥 기존 방식 대신 HSL 색상 생성 (무지개 색상 유지)
    const hue = Math.abs(hash) % 360; // 0~359도 사이의 색상 (무지개 범위)
    const saturation = 70 + (Math.abs(hash) % 20); // 70%~90% 사이의 채도
    const lightness = 80 - (Math.abs(hash) % 10); // 70%~80% 사이의 밝기 (파스텔 느낌)
  
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`; // 🎨 파스텔 무지개 색 반환
  };

  // 📌 현재 주간의 날짜 목록 가져오기
  const weekDays = getWeekDays(startDate);

  return (
    <div className="w-full max-w-[1600px] mx-auto bg-white shadow-lg rounded-lg p-4">
      {/* 제목 */}
      <h1 className="text-2xl font-bold mb-4 text-center">주간 근무 일정표</h1>

      {/* 주간 이동 버튼 */}
      <div className="flex justify-between mb-4">
        <button onClick={() => changeDay(-1)} className="px-4 py-2 bg-gray-300 rounded">◀ 이전 날</button>
        <button onClick={goToToday} className="px-4 py-2 bg-blue-500 text-white rounded">오늘</button>
        <button onClick={() => changeDay(1)} className="px-4 py-2 bg-gray-300 rounded">다음 날 ▶</button>
      </div>

      {/* 일정 추가 입력란 */}
      <div className="flex gap-4 mb-4" >
        <input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border p-2 rounded" />
        <select value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border p-2 rounded">
          {timeSlots1.map((time) => <option key={time} value={time}>{time}</option>)}
        </select>
        <select value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border p-2 rounded">
          {timeSlots2.map((time) => <option key={time} value={time}>{time}</option>)}
        </select>
        <button onClick={handleScheduleSubmit} className="px-4 py-2 bg-green-500 text-white rounded">추가하기</button>
      </div>

      {/* 근무 일정 테이블 */}
      <table className="w-full max-w-[1600px] border-collapse border" style={{ width: '1600px' }}>
        <thead>
          <tr className="border">
            <th className="border p-2">시간</th>
            {weekDays.map((day) => (
              <th key={day.fullDate} className="border p-2" style={{ backgroundColor: day.fullDate === today ? 'pink' : 'transparent' }}>{day.date}</th>
            ))}
          </tr>
        </thead>
        <tbody>
  {timeSlots.map((time, i) => (
    <React.Fragment key={i}>
      <tr className="border-b-2 border-gray-800">
        {/* 시간 셀 */}
        <td className="border relative h-12" style={{ width: '100px', textAlign: "center", height: "50px" }}>
          {time}
        </td>

        {/* 요일별 일정 표시 */}
        {weekDays.map((day) => (
          <td key={day.fullDate} className="border relative h-12 flex flex-col">
            {schedules
              .filter((schedule) => {
                const startIdx = timeSlots1.indexOf(schedule.startTime) - 1; // 🔥 -1을 추가하여 올바른 인덱스 계산
                const endIdx = timeSlots2.indexOf(schedule.endTime) - 1;
                return schedule.date === day.fullDate && i >= startIdx && i < endIdx;
              })
              .map((schedule, index) => (
                <div
                  key={`schedule-${index}`}
                  className="w-full p-1 text-white font-bold rounded-md flex items-center justify-center"
                  style={{
                    backgroundColor: schedule.color,
                    marginBottom: "4px", // 일정 간격 추가
                    textAlign: 'center',
                  }}
                >
                  {schedule.name}
                </div>
              ))}
          </td>
        ))}
      </tr>

    </React.Fragment>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default WeeklyTableCalendar;
