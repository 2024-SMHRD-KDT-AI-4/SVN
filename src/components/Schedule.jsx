import { useState, useEffect } from "react";

const WeeklyTableCalendar = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    setStartDate(getStartOfWeek(new Date()));
  }, []);

  const getStartOfWeek = (date) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1));
    return newDate;
  };

  const getWeekDays = (date) => {
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(date);
      day.setDate(date.getDate() + i);
      return {
        date: `${day.getDate()}일 (${["일", "월", "화", "수", "목", "금", "토"][day.getDay()]})`,
        fullDate: day.toISOString().split("T")[0],
      };
    });
  };

  const changeDay = (direction) => {
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + direction);
    setStartDate(newDate);
  };

  const goToToday = () => {
    setStartDate(new Date());
  };

  const today = new Date().toISOString().split("T")[0];
  const workingHoursStart = 8;
  const workingHoursEnd = 22;
  const timeSlots = Array.from({ length: (workingHoursEnd - workingHoursStart) * 2 }, (_, i) => {
    const hour = Math.floor(i / 2) + workingHoursStart;
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${hour}:${minutes}`;
  });

  const handleScheduleSubmit = () => {
    if (!name.trim() || !date || !startTime || !endTime) {
      alert("모든 입력값을 입력해주세요!");
      return;
    }

    const startIdx = timeSlots.indexOf(startTime);
    const endIdx = timeSlots.indexOf(endTime);

    if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) {
      alert("시간 입력이 잘못되었습니다.");
      return;
    }

    const formattedDate = new Date(date).toISOString().split("T")[0];
    
    if (schedules.some((s) => s.name === name && s.date === formattedDate)) {
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

  const getColorForName = (name) => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#FFA533", "#33FFF5", "#A833FF"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const weekDays = getWeekDays(startDate);

  return (
    <div className="w-full max-w-[1600px] mx-auto bg-white shadow-lg rounded-lg p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">주간 근무 일정표</h1>
      <div className="flex justify-between mb-4">
        <button onClick={() => changeDay(-1)} className="px-4 py-2 bg-gray-300 rounded">◀ 이전 날</button>
        <button onClick={goToToday} className="px-4 py-2 bg-blue-500 text-white rounded">오늘</button>
        <button onClick={() => changeDay(1)} className="px-4 py-2 bg-gray-300 rounded">다음 날 ▶</button>
      </div>
      <div className="flex gap-4 mb-4" >
        <input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border p-2 rounded" />
        <select value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border p-2 rounded">
          {timeSlots.map((time) => <option key={time} value={time}>{time}</option>)}
        </select>
        <select value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border p-2 rounded">
          {timeSlots.map((time) => <option key={time} value={time}>{time}</option>)}
        </select>
        <button onClick={handleScheduleSubmit} className="px-4 py-2 bg-green-500 text-white rounded">추가하기</button>
      </div>
      <table className="w-full max-w-[1600px] border-collapse border" style={{ width: '1600px' }}>
        <thead>
        <tr className="border" style={{ borderTop: '1px solid black', borderBottom: '1px solid black' }}>
            <th className="border p-2" style={{ width: '100px' }}>시간</th>
            {weekDays.map((day) => (
              <th key={day.fullDate} className="border p-2" style={{ backgroundColor: day.fullDate === today ? 'pink' : 'transparent' }}>{day.date}</th>
            ))}
          </tr>
        </thead>
        <tbody >
          {timeSlots.map((time, i) => (
            <tr key={i} className="border" style={{ borderBottom: '1px solid black' }}>
              <td className="border relative h-12" style={{ width: '100px', textAlign : "center", height : "100px" }}>{time}</td>
              {weekDays.map((day) => (
                <td key={day.fullDate} className="border relative h-12" style={{ borderRight: '1px solid black' }}>
                  {schedules.map((schedule, index) => (
                    schedule.date === day.fullDate && i >= schedule.startIndex && i < schedule.endIndex ? (
                      <div
                        key={index}
                        className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white font-bold rounded-md"
                        style={{ backgroundColor: schedule.color, zIndex: 1 , textAlign : "center", border : "1px solid" }}
                      >
                        {schedule.name}
                      </div>
                    ) : null
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyTableCalendar;
