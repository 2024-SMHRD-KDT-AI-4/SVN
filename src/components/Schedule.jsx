import { useState, useEffect } from "react";
import React from "react";  // 🔥 React import 추가 (필수!)
import styles from "../Calendar.module.css";
import Calendar from "./Calendar";

const WeeklyTableCalendar = () => {
  // 📌 상태 관리 (State)
  const [startDate, setStartDate] = useState(new Date()); // 현재 주의 시작 날짜
  const [schedules, setSchedules] = useState([]); // 일정 목록
  const [view, setView] = useState("Schedule");

  useEffect(() => {
    fetchSchedules();  // 🔥 DB에서 데이터 가져오기
  }, []);




  const fetchSchedules = async () => {
    try {
        console.log("🔍 [fetchSchedules] API 요청 실행됨!");

        const response = await fetch("http://localhost:5067/autoschedule/getSchedules");
        console.log("📡 [서버 응답 상태 코드]:", response.status);

        if (!response.ok) {
            throw new Error(`❌ HTTP 오류 발생: ${response.status}`);
        }

        const data = await response.json();
        console.log("📦 [서버 응답 데이터]:", JSON.stringify(data, null, 2));

        if (!Array.isArray(data)) {
            console.warn("⚠️ 서버에서 받은 데이터가 배열이 아님!", data);
            setSchedules([]);
            return;
        }

        // ✅ 날짜 변환 (UTC → 로컬 시간 변환 후 YYYY-MM-DD)
        const groupedSchedules = {};

        data.forEach((schedule) => {
            const dateObj = new Date(schedule.date); // 받아온 날짜
            dateObj.setHours(dateObj.getHours() + 9); // UTC+9 (한국 시간으로 변환)
            const formattedDate = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환

            const { work_name, employee_name } = schedule;

            if (!groupedSchedules[formattedDate]) {
                groupedSchedules[formattedDate] = {};
            }

            if (!groupedSchedules[formattedDate][work_name]) {
                groupedSchedules[formattedDate][work_name] = [];
            }

            groupedSchedules[formattedDate][work_name].push(employee_name);
        });

        console.log("✅ [가공된 데이터]:", groupedSchedules);

        // ✅ 변환된 데이터 구조를 새롭게 정의
        const formattedSchedules = [];

        Object.keys(groupedSchedules).forEach((date) => {
            Object.keys(groupedSchedules[date]).forEach((work_name) => {
                let startTime, endTime;

                if (work_name.includes("마감")) {
                    startTime = "16:00";
                    endTime = "20:00";
                } else if (work_name.includes("미들")) {
                    startTime = "12:00";
                    endTime = "16:00";
                } else if (work_name.includes("오픈")) {
                    startTime = "08:00";
                    endTime = "12:00";
                } else {
                    return; // 정의된 작업 유형이 아니면 무시
                }

                formattedSchedules.push({
                    date, // ✅ 변환된 날짜 적용 (하루 빠지는 문제 해결)
                    work_name,
                    startTime,
                    endTime,
                    name: groupedSchedules[date][work_name].join(" "), // ✅ 띄어쓰기로 합친 이름
                    color: getColorForName(work_name),
                });
            });
        });

        console.log("✅ [최종 변환된 일정 데이터]:", formattedSchedules);

        setSchedules(formattedSchedules);
        sessionStorage.setItem('autoSchData',JSON.stringify(formattedSchedules));
    } catch (error) {
        console.error("❌ 주간 스케줄 데이터를 불러오는 중 오류 발생:", error);
    }
};




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

  if (view === "Calendar") {
    return <Calendar goBack={() => setView("Schedule")} />;
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarChanges}>
        {/* 🔥 onClick 이벤트 추가 (주간 버튼 클릭 시 Schedule로 전환) */}
        <span className={styles.weekBtn} onClick={() => setView("Calendar")}>월간</span>
        <span className={styles.monthBtn}>주간</span>
      </div>

      {/* 주간 이동 버튼 */}
      <div className="flex justify-between mb-4">
        <button onClick={() => changeDay(-1)} className="px-4 py-2 bg-gray-300 rounded">◀ 이전 날</button>
        <button onClick={goToToday} className="px-4 py-2 bg-blue-500 text-white rounded">오늘</button>
        <button onClick={() => changeDay(1)} className="px-4 py-2 bg-gray-300 rounded">다음 날 ▶</button>
      </div>

      {/* 기존 일정 추가 입력란 삭제됨 */}

      {/* 근무 일정 테이블 */}
      <table className="w-full max-w-[1600px] border-collapse border" style={{ width: '1600px', tableLayout: "fixed" }}>
        <thead>
          <tr className="border">
            <th className="border p-2" style={{ width: "100px" }}>시간</th>
            {weekDays.map((day) => (
              <th
                key={day.fullDate}
                className="border p-2"
                style={{
                  width: "150px", // ✅ `th` 크기 고정 (늘어나지 않음)
                  backgroundColor: day.fullDate === today ? 'pink' : 'transparent',
                  whiteSpace: "nowrap", // ✅ 줄바꿈 방지
                  overflow: "hidden", // ✅ 넘치는 텍스트 숨김
                  textOverflow: "ellipsis", // ✅ 초과된 부분 '...' 표시
                }}
              >
                {day.date}
              </th>
            ))}
          </tr>
        </thead>


<tbody>
  {timeSlots.map((time, i) => (
    <React.Fragment key={i}>
      <tr className="border-b border-gray-400" style={{ borderBottom: "1px solid black" }}>
        {/* 시간 셀 */}
        <td className="border relative h-12" style={{ width: "100px", textAlign: "center", height: "50px" }}>
          {time}
        </td>

        {/* 요일별 일정 표시 */}
        {weekDays.map((day) => {
          // 📌 현재 시간대에 해당하는 일정 필터링
          const matchingSchedules = schedules.filter((schedule) => {
            const startIdx = timeSlots.indexOf(schedule.startTime);
            const endIdx = timeSlots.indexOf(schedule.endTime);
            return schedule.date === day.fullDate && i >= startIdx && i < endIdx;
          });

          return (
            <td key={day.fullDate} className="border relative h-12">
              {matchingSchedules.map((schedule, index) => (
                <span
                  key={`schedule-${index}-${day.fullDate}-${time}`}
                  className="p-1 text-white font-bold rounded-md flex items-center justify-center"
                  style={{
                    backgroundColor: schedule.color,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                  }}
                >
                  {schedule.name} {/* ✅ 이름을 시간별로 표시 */}
                </span>
              ))}
            </td>
          );
        })}
      </tr>
    </React.Fragment>
  ))}
</tbody>



      </table>
    </div>
  );
};

export default WeeklyTableCalendar;