import { useState, useEffect } from "react";

const WeeklyTableCalendar = () => {
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    setStartDate(getStartOfWeek(new Date()));
  }, []);

  // 📌 주간 달력 시작 날짜 (월요일부터 시작)
  const getStartOfWeek = (date) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1));
    return newDate;
  };

  // 📌 현재 주의 날짜 목록 (월~일)
  const getWeekDays = (date) => {
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(date);
      day.setDate(date.getDate() + i);
      return {
        date: day.getDate(),
        dayOfWeek: ["월", "화", "수", "목", "금", "토", "일"][i],
        fullDate: day.toISOString().split("T")[0], // YYYY-MM-DD 형식
      };
    });
  };

  // 📌 날짜 이동 (이전 / 다음 하루씩 이동)
  const changeDay = (direction) => {
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + direction);
    setStartDate(newDate);
  };

  // 📌 오늘 날짜(Today)로 이동
  const goToToday = () => {
    setStartDate(new Date()); // 오늘 날짜로 변경
  };

  // 📌 현재 날짜(sysdate)
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD 형식

  // 📌 근무시간 (08:00 ~ 22:00) - 30분 단위
  const timeSlots = [
    { label: "오픈", start: 8, end: 11 }, // 08:00 ~ 11:00
    { label: "주간", start: 11, end: 17 }, // 11:00 ~ 17:00
    { label: "마감", start: 17, end: 22 }, // 17:00 ~ 22:00
  ];

  const weekDays = getWeekDays(startDate);

  return (
    <div className="w-full max-w-[1600px] mx-auto bg-white shadow-lg rounded-lg p-4" style={{ border: "1px solid black" }}>
      {/* 상단 네비게이션 */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeDay(-1)} className="px-4 py-2 bg-gray-200 rounded-md">
          ◀ 이전 날
        </button>
        <h2 className="text-xl font-bold">
          {startDate.getFullYear()}년 {startDate.getMonth() + 1}월 {Math.ceil(startDate.getDate() / 7)}주차
        </h2>
        <button onClick={goToToday} className="px-4 py-2 bg-blue-500 text-white rounded-md">
          오늘
        </button>
        <button onClick={() => changeDay(1)} className="px-4 py-2 bg-gray-200 rounded-md">
          다음 날 ▶
        </button>
      </div>

      {/* 주간 스케줄 표 */}
      <table className="w-full border-collapse" style={{ border: "1px solid black", minHeight: "600px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0", borderBottom: "1px solid black", height: "60px" }}>
            <th style={{ border: "1px solid black", padding: "10px", textAlign: "center", fontSize: "18px", width: "100px" }}>구분</th>
            <th style={{ border: "1px solid black", padding: "10px", textAlign: "center", fontSize: "18px", width: "100px" }}>시간</th>
            {weekDays.map((day) => (
              <th
                key={day.fullDate}
                style={{
                  border: "1px solid black",
                  padding: "10px",
                  textAlign: "center",
                  fontSize: "18px",
                  minWidth: "150px",
                  backgroundColor: day.fullDate === today ? "lightblue" : "white",
                }}
              >
                {day.dayOfWeek} {day.date}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot, slotIdx) => {
            const rows = (slot.end - slot.start) * 2; // 30분 단위로 나누기
            return (
              <tr key={slotIdx} style={{ height: `${rows * 20}px` }}>
                <td rowSpan={rows} style={{ border: "1px solid black", textAlign: "center", fontSize: "16px", fontWeight: "bold", padding: "5px", backgroundColor: "#f0f0f0" }}>
                  {slot.label}
                </td>
                {Array.from({ length: rows }, (_, i) => {
                  const hour = Math.floor(i / 2) + slot.start;
                  const minutes = i % 2 === 0 ? "00" : "30";
                  return (
                    <tr key={i} style={{ height: "40px" }}>
                      <td style={{ border: "1px solid black", textAlign: "center", fontSize: "16px", fontWeight: "bold", padding: "5px" }}>{`${hour}:${minutes}`}</td>
                      {weekDays.map((day) => (
                        <td
                          key={day.fullDate}
                          style={{
                            border: "1px solid black",
                            minHeight: "40px",
                            cursor: "pointer",
                            backgroundColor: day.fullDate === today ? "#e0f7fa" : "#ffffff",
                            textAlign: "center",
                            fontSize: "16px",
                          }}
                          onClick={() => alert(`${day.dayOfWeek} ${day.date}일 ${hour}:${minutes} 일정 추가`)}
                        >
                          👤 0/5 {/* 예제 값 */}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyTableCalendar;
