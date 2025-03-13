import { useState, useEffect } from "react";
import tempData from "../data/tempData"; // ✅ 데이터 불러오기

const Schedule2 = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weeklyWorkHours, setWeeklyWorkHours] = useState({}); // ✅ 주간별 직원 누적 시간 저장
  const [today, setToday] = useState(new Date()); // ✅ 오늘 날짜를 상태로 저장

  useEffect(() => {
    console.log("📢 스케줄 업데이트됨:", schedule);
  }, [schedule]);

  const generateSchedule = () => {
    try {
      console.log("🔘 버튼 클릭됨! 스케줄 생성 시작!");
      setLoading(true);
      const generatedSchedule = [];
      let employeeWorkHours = {}; // ✅ 직원별 누적 근무 시간 저장
      let weeklyTracker = {}; // ✅ 주간별 직원 근무 시간 저장

      // ✅ 직원별 주간 근무 시간 초기화
      tempData.employees.forEach(emp => {
        employeeWorkHours[emp.emp_name] = 0;
      });

// ✅ 현재 날짜 가져오기
const sysDate = new Date(); // 🔥 시스템 날짜 (오늘 날짜)

// ✅ 현재 월의 시작일과 마지막일 계산
const firstDayOfMonth = new Date(sysDate.getFullYear(), sysDate.getMonth(), 1); // 이번 달 1일
const lastDayOfMonth = new Date(sysDate.getFullYear(), sysDate.getMonth() + 1, 0); // 이번 달 마지막 날

// ✅ 전월 마지막 날짜 가져오기
const lastDayPrevMonth = new Date(sysDate.getFullYear(), sysDate.getMonth(), 0); 

// ✅ 전월 마지막 일요일 찾기 (요일 받아오기 추가)
let startDate = new Date(lastDayPrevMonth);
const lastMonthLastDayOfWeek = lastDayPrevMonth.getDay(); // 🔥 전월 마지막 날의 요일
startDate.setDate(lastDayPrevMonth.getDate() - lastMonthLastDayOfWeek); // 🔥 전월 마지막 일요일 찾기

// ✅ 현재 요일 가져오기 (디버깅용)
const todayDayOfWeek = sysDate.getDay();
console.log(`🔥 오늘(${sysDate.toISOString().split("T")[0]}) 요일: ${["일", "월", "화", "수", "목", "금", "토"][todayDayOfWeek]}`);
console.log(`🔥 전월 마지막 일요일: ${startDate.toISOString().split("T")[0]} (일요일)`);





// ✅ 이번 달 전체 + 전월 마지막 주 포함하여 루프 돌리기
for (let i = 0; i <= (lastDayOfMonth - startDate) / (1000 * 60 * 60 * 24); i++) {
  const currentDate = new Date(startDate); // 🔥 새로운 날짜 객체 생성
  currentDate.setDate(startDate.getDate() + i);
  const formattedDate = currentDate.toISOString().split("T")[0];

  const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][currentDate.getDay()];
  let weekIndex = Math.floor((currentDate - startDate) / (7 * 24 * 60 * 60 * 1000)); // ✅ 주차 계산 (전월 포함)

  console.log(`📆 ${formattedDate} (${dayOfWeek}) - ${weekIndex + 1}주차`);

  // ✅ 주간 변경 시 근무 시간 초기화 (일요일마다 초기화)
  if (dayOfWeek === "일") {
    console.log(`🔄 새로운 주(${weekIndex + 1}주차) 시작 - 직원 근무 시간 초기화`);
    tempData.employees.forEach(emp => {
      employeeWorkHours[emp.emp_name] = 0;
    });
  }

  // ✅ 해당 날짜의 근무 유형을 가져옴 (오픈 → 미들 → 마감 순서 유지)
  let availableWork = tempData.workSchedules?.filter(work => work.work_days.includes(dayOfWeek)) || [];

  if (availableWork.length === 0) {
    console.log(`⛔ ${formattedDate} - 근무 없음 (스킵)`);
    continue;
  }

  let assignedEmployees = [];
  let assignedToday = new Set(); // ✅ 오늘 배정된 직원 추적 (중복 방지)

  // ✅ 하루 단위로 오픈 → 미들 → 마감 순서대로 배정
  for (const work of availableWork) {
    console.log(`🛠 ${work.work_name} 근무 배정 중...`);

    let neededEmployees = work.work_name === "미들" ? 4 : 2;
    let workHoursPerDay = work.work_name === "미들" ? 5 : 4;
    let workAssignments = [];

    // ✅ 근무 시간이 적은 순서대로 정렬하여 배정
    let sortedEmployees = [...tempData.employees]
      .sort((a, b) => employeeWorkHours[a.emp_name] - employeeWorkHours[b.emp_name]);

    for (let k = 0; k < sortedEmployees.length; k++) {
      let selectedEmployee = sortedEmployees[k];

      if (
        selectedEmployee &&
        employeeWorkHours[selectedEmployee.emp_name] + workHoursPerDay <= parseInt(work.work_max_rule.match(/\d+/)?.[0] || "0", 10)
      ) {
        workAssignments.push({
          name: selectedEmployee.emp_name,
          role: selectedEmployee.emp_role
        });

        employeeWorkHours[selectedEmployee.emp_name] += workHoursPerDay;

        // ✅ 주간 근무 시간 초기화 (없으면 0으로 설정 후 추가)
        if (!weeklyTracker[weekIndex]) weeklyTracker[weekIndex] = {};
        if (!weeklyTracker[weekIndex][selectedEmployee.emp_name]) {
          weeklyTracker[weekIndex][selectedEmployee.emp_name] = 0;
        }
        weeklyTracker[weekIndex][selectedEmployee.emp_name] += workHoursPerDay;

        // ✅ 직원이 오늘 배정되었음을 기록
        assignedToday.add(selectedEmployee.emp_name);
      }

      // ✅ 필요한 직원 수만큼 채우면 중단
      if (workAssignments.length >= neededEmployees) break;
    }

    assignedEmployees.push({
      date: formattedDate,
      day: dayOfWeek,
      work_name: work.work_name,
      employees: workAssignments.length > 0 ? workAssignments : [{ name: "❌ 배정 없음", role: "" }]
    });
  }

  generatedSchedule.push(...assignedEmployees);
}



      console.log("📢 최종 생성된 스케줄:", generatedSchedule);
      setSchedule(generatedSchedule);
      setWeeklyWorkHours(weeklyTracker);
    } catch (err) {
      console.error("❌ 스케줄 생성 오류:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>📅 자동 생성된 스케줄</h2>

      <button onClick={generateSchedule} style={{ padding: "10px", backgroundColor: "#4CAF50", color: "white", border: "none", marginBottom: "10px" }}>
        📌 자동 스케줄 생성
      </button>

      {loading && <p>📢 스케줄 생성 중...</p>}
      {error && <p>❌ 오류 발생: {error.message}</p>}

      {schedule.length === 0 ? (
        <p>📢 생성된 스케줄이 없습니다. "자동 스케줄 생성" 버튼을 눌러 주세요.</p>
      ) : (
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <table border="1" cellPadding="5" style={{ width: "80%", textAlign: "center" }}>
            <thead>
              <tr>
                <th>📅 날짜</th>
                <th>📌 요일</th>
                <th>💼 근무 유형</th>
                <th>👥 근무자</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.date}</td>
                  <td>{entry.day}</td>
                  <td>{entry.work_name}</td>
                  <td>
                    {entry.employees.map((employee, empIndex) => (
                      <span key={empIndex}>
                        {employee.name} ({employee.role})
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ 오른쪽에 주간 누적 근무 시간 표시 */}
          <div style={{ width: "20%", padding: "10px", border: "1px solid black", backgroundColor: "#f8f9fa", marginLeft: "10px" }}>
            <h3>⏳ 주간 누적 근무 시간</h3>
            {Object.entries(weeklyWorkHours).map(([weekIndex, workHours]) => (
              <div key={weekIndex} style={{ marginBottom: "10px", borderBottom: "1px solid gray", paddingBottom: "5px" }}>
                <h4>🗓️ {weekIndex === "0" ? `이번 주 (${today.toISOString().split("T")[0]})` : `${parseInt(weekIndex) + 1}`}</h4>
                <ul style={{ padding: 0, listStyle: "none" }}>
                  {Object.entries(workHours).map(([name, hours]) => (
                    <li key={name}>{name}: {hours}h</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule2;
