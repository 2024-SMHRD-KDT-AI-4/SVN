import { useState } from "react";
import tempData from "../data/tempData"; // ✅ 데이터 불러오기

const Schedule2 = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateSchedule = () => {
    try {
      console.log("🔘 버튼 클릭됨! 스케줄 생성 시작!");
      setLoading(true);
      const generatedSchedule = [];
      const today = new Date();

      // ✅ 직원별 주간 근무 시간 추적 (매주 일요일 초기화)
      let employeeWorkHours = {};
      tempData.employees.forEach(emp => {
        employeeWorkHours[emp.emp_name] = 0;
      });

      console.log("📌 현재 직원 리스트:", tempData.employees);
      console.log("📌 현재 근무 유형 리스트:", tempData.workSchedules);

      for (let i = 0; i < 21; i++) { // 📅 3주 스케줄 생성
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        const formattedDate = currentDate.toISOString().split("T")[0];

        const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][currentDate.getDay()];
        
        // ✅ 매주 일요일이면 직원 근무 시간 초기화 (주간 리셋)
        if (dayOfWeek === "일") {
          console.log(`🔄 주간 근무 시간 초기화 (${formattedDate})`);
          tempData.employees.forEach(emp => {
            employeeWorkHours[emp.emp_name] = 0;
          });
        }

        const availableWork = tempData.workSchedules?.filter(work => work.work_days.includes(dayOfWeek)) || [];

        console.log(`📅 ${formattedDate} (${dayOfWeek}) - 가능한 근무 유형:`, availableWork);

        if (availableWork.length === 0) {
          console.warn(`⚠️ ${formattedDate} - 근무 가능한 유형이 없음.`);
          continue; // 스킵
        }

        availableWork.forEach(work => {
          let maxHours = parseInt(work.work_max_rule.match(/\d+/)?.[0] || "0", 10);

          // ✅ 근무 유형별 배정 인원 & 시간 설정
          let neededEmployees, workHoursPerDay;
          if (work.work_name === "주간") {
            neededEmployees = 4;
            workHoursPerDay = 5; // 주간 근무 시간: 5시간
          } else {
            neededEmployees = 2;
            workHoursPerDay = 4; // 오픈 & 마감 근무 시간: 4시간
          }

          // ✅ 직원 리스트에서 근무 시간이 적은 순서로 정렬하여 균등 배정
          let sortedEmployees = [...tempData.employees].sort((a, b) => employeeWorkHours[a.emp_name] - employeeWorkHours[b.emp_name]);

          let assignedEmployees = [];

          for (let j = 0; j < neededEmployees; j++) {
            let selectedEmployee = sortedEmployees[j];

            if (
              selectedEmployee &&
              employeeWorkHours[selectedEmployee.emp_name] + workHoursPerDay <= maxHours
            ) {
              assignedEmployees.push({
                name: selectedEmployee.emp_name,
                hours: employeeWorkHours[selectedEmployee.emp_name] + workHoursPerDay
              });
              employeeWorkHours[selectedEmployee.emp_name] += workHoursPerDay;
            }
          }

          console.log(`✅ ${work.work_name} 배정 완료:`, assignedEmployees.map(e => `${e.name} (${e.hours}h)`));

          generatedSchedule.push({
            date: formattedDate,
            day: dayOfWeek,
            work_name: work.work_name,
            employees: assignedEmployees.length > 0 
              ? assignedEmployees.map(emp => `${emp.name} (${emp.hours}h)`) 
              : ["❌ 배정 없음"]
          });
        });
      }

      console.log("📢 최종 생성된 스케줄:", generatedSchedule);
      setSchedule(generatedSchedule);
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

      {/* ✅ 자동 생성 버튼 */}
      <button
        onClick={generateSchedule}
        style={{ padding: "10px", backgroundColor: "#4CAF50", color: "white", border: "none", cursor: "pointer", marginBottom: "10px" }}
      >
        📌 자동 스케줄 생성
      </button>

      {loading && <p>📢 스케줄 생성 중...</p>}
      {error && <p>❌ 오류 발생: {error.message}</p>}

      <table border="1" cellPadding="5" style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th>📅 날짜</th>
            <th>📌 요일</th>
            <th>💼 근무 유형</th>
            <th>👥 근무자 (누적 시간)</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{entry.day}</td>
              <td>{entry.work_name}</td>
              <td>{entry.employees.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Schedule2;
