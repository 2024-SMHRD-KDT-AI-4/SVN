import { useState, useEffect } from "react";
import axios from "axios"; // ✅ 서버 요청을 위한 axios


const Schedule2 = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weeklyWorkHours, setWeeklyWorkHours] = useState({});
  const [today, setToday] = useState(new Date());

  const [employees, setEmployees] = useState([]); // ✅ 직원 데이터 상태 추가
  const [workSchedules, setWorkSchedules] = useState([]); // ✅ 근무 데이터 상태 추가

  const saveScheduleToDB = async () => {
    try {
      console.log("📢 스케줄을 DB에 저장 요청...");
      console.log("🔍 전송 데이터:", JSON.stringify(schedule, null, 2));
  
      const response = await axios.post("/autoSchedule/saveSchedule", schedule); // ✅ API 경로 수정
  
      console.log("✅ 스케줄 저장 완료:", response.data);
      alert("스케줄이 DB에 저장되었습니다!");
    } catch (error) {
      console.error("❌ 스케줄 저장 오류:", error);
  
      if (error.response) {
        console.error("🔥 서버 응답 데이터:", error.response.data);
        console.error("🔥 상태 코드:", error.response.status);
      } else if (error.request) {
        console.error("🚨 요청이 서버에 도달하지 않음:", error.request);
      } else {
        console.error("⚠️ 요청 설정 중 오류 발생:", error.message);
      }
  
      alert("스케줄 저장 중 오류 발생! (자세한 내용은 콘솔 확인)");
    }
  };



  const fetchJoinData = async () => {
    try {
      console.log("📢 직원 + 근무 데이터 불러오기 시작...");
  
      const response = await axios.get("/management/getScheduleData"); // ✅ API 경로 수정
      console.log("✅ 서버 응답 데이터:", response.data);
  
      if (response.data.data) {
        const allData = response.data.data;
  
        const employeeData = allData.map(emp => ({
          emp_id: emp.emp_id,
          emp_name: emp.emp_name,
          emp_role: emp.emp_role,
          emp_group: emp.emp_group
        }));
  
        const workData = allData.map(work => ({
          work_id: work.work_id,
          work_name: work.work_name,
          work_days: work.work_days,
          work_max_rule: work.work_max_rule
        }));
  
        setEmployees(employeeData);
        setWorkSchedules(workData);
      }
  
    } catch (err) {
      console.error("❌ 직원 + 근무 데이터 불러오기 오류:", err);
    }
  };
  
  // ✅ useEffect에서 실행
  useEffect(() => {
    fetchJoinData(); 
  }, []);
  



  // ✅ 서버에서 직원 + 근무 데이터 가져오는 함수
  const fetchAutoSchedules = async () => {
    try {
      console.log("📢 자동 스케줄 불러오기 시작...");
      setLoading(true);


      const response = await axios.get("/management/getScheduleData");
      //autoSchedule/getAutoSchedule
      console.log("✅ 서버 응답 데이터:", response.data); // 🔍 콘솔 출력

      
      setSchedule(response.data.data); // 🔥 schedule에 올바른 데이터 저장

    } catch (err) {
      console.error("❌ 자동 스케줄 불러오기 오류:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };




  // ✅ 페이지 로드 시 API 호출하여 데이터 가져옴
  useEffect(() => {
    fetchJoinData(); // ✅ 페이지 로드 시 자동 실행
    //fetchAutoSchedules(); 
  }, []);


  // useEffect(() => {
  //   console.log("📢 스케줄 업데이트됨:", schedule);
  // }, [schedule]);


  const generateSchedule = () => {
    try {
      console.log("🔘 버튼 클릭됨! 스케줄 생성 시작!");
      setLoading(true);

      setSchedule([]); // ✅ 기존 스케줄 초기화하여 중복 방지!

      const generatedSchedule = [];
      let employeeWorkHours = {}; // ✅ 직원별 누적 근무 시간 저장
      let weeklyTracker = {}; // ✅ 주간별 직원 근무 시간 저장

      // ✅ 직원별 주간 근무 시간 초기화
      employees.forEach(emp => {
        employeeWorkHours[emp.emp_name] = 0;
      });

      // ✅ 현재 날짜 가져오기
      const sysDate = new Date(); // 🔥 시스템 날짜 (오늘 날짜)

      // ✅ 현재 월의 시작일과 마지막일 계산
      const firstDayOfMonth = new Date(sysDate.getFullYear(), sysDate.getMonth(), 1);
      const lastDayOfMonth = new Date(sysDate.getFullYear(), sysDate.getMonth() + 1, 0);

      // ✅ 전월 마지막 일요일 찾기
      let startDate = new Date(firstDayOfMonth);
      while (startDate.getDay() !== 1) { // 🔥 일요일이 될 때까지 날짜를 조정
        startDate.setDate(startDate.getDate() - 1);
      }

      console.log(`🔥 전월 마지막 일요일: ${startDate.toLocaleDateString("ko-KR")}`);

      // ✅ 이번 달 전체 + 전월 마지막 주 포함하여 루프 돌리기
      for (let i = 0; i <= (lastDayOfMonth - startDate) / (1000 * 60 * 60 * 24); i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const formattedDate = currentDate.toLocaleDateString("ko-KR"); // ✅ 한국 날짜 형식
        const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][currentDate.getDay()];

        let weekIndex = Math.floor((currentDate - startDate) / (7 * 24 * 60 * 60 * 1000)); // ✅ 주차 계산



        // ✅ 주간 변경 시 근무 시간 초기화 (일요일마다 초기화)
        if (dayOfWeek === "일") {

          employees.forEach(emp => {
            employeeWorkHours[emp.emp_name] = 0;
          });
        }

        // ✅ 근무 가능한 직원 필터링
        let availableWork = workSchedules.filter(work => {
          let workDaysArray = work.work_days ? work.work_days.split("") : []; // 🔥 배열로 변환
          return workDaysArray.includes(dayOfWeek) && employees.some(emp => emp.emp_group === work.work_name);
        });


        // ✅ 같은 근무 유형이 중복 추가되지 않도록 처리
        const uniqueWorkTypes = new Set(availableWork.map(w => w.work_name));
        availableWork = Array.from(uniqueWorkTypes).map(workType =>
          availableWork.find(w => w.work_name === workType)
        );

        if (availableWork.length === 0) {
          console.log(`⛔ ${formattedDate} - 근무 없음 (스킵)`);
          continue;
        }

        let assignedEmployees = [];
        let assignedToday = new Set(); // ✅ 오늘 배정된 직원 추적 (중복 방지)

        // ✅ 하루 단위로 오픈 → 미들 → 마감 순서대로 배정
        for (const workType of uniqueWorkTypes) {
          const work = availableWork.find(w => w.work_name === workType); // ✅ 중복 제거된 근무 유형만 선택
          console.log(`🛠 ${work.work_name} 근무 배정 중...`);

          let neededEmployees = 2
          let workHoursPerDay = work.work_name === "미들" ? 5 : 4;
          let workAssignments = [];

          // ✅ 근무 시간이 적은 순서로 전체 직원 정렬
          let sortedEmployees = employees
            .filter(emp =>
              emp.emp_role !== "관리자" &&  // ✅ 관리자는 제외
              emp.emp_group === work.work_name // ✅ emp_group이 근무 유형(work_name)과 일치하는 직원만 포함
            )
            .sort((a, b) => employeeWorkHours[a.emp_name] - employeeWorkHours[b.emp_name]);

          let traineeCount = 0; // ✅ 현재 근무조에 배정된 훈련생 수

          for (let k = 0; k < sortedEmployees.length; k++) {
            let selectedEmployee = sortedEmployees[k];

            // ✅ 훈련생이 1명 이상 배정되지 않도록 제한
            if (selectedEmployee.emp_role === "훈련생" && traineeCount >= 1) {
              continue;
            }

            // ✅ 근무 시간 초과 체크 후 배정
            if (
              selectedEmployee &&
              employeeWorkHours[selectedEmployee.emp_name] + workHoursPerDay <= parseInt(work.work_max_rule.match(/\d+/)?.[0] || "0", 10)
            ) {
              workAssignments.push({
                name: selectedEmployee.emp_name,
                role: selectedEmployee.emp_role
              });

              employeeWorkHours[selectedEmployee.emp_name] += workHoursPerDay;

              // ✅ 훈련생이 배정되었으면 카운트 증가
              if (selectedEmployee.emp_role === "훈련생") {
                traineeCount++;
              }

              if (!weeklyTracker[weekIndex]) weeklyTracker[weekIndex] = {};
              if (!weeklyTracker[weekIndex][selectedEmployee.emp_name]) {
                weeklyTracker[weekIndex][selectedEmployee.emp_name] = 0;
              }
              weeklyTracker[weekIndex][selectedEmployee.emp_name] += workHoursPerDay;

              assignedToday.add(selectedEmployee.emp_name);
            }

            // ✅ 필요한 직원 수만큼 채우면 중단
            if (workAssignments.length >= neededEmployees) break;
          }

          // ✅ 최종 배정된 직원 리스트 추가
          // ✅ 최종 배정된 직원 리스트 추가
          if (workAssignments.length > 0) {
            assignedEmployees.push({
              date: formattedDate,
              day: dayOfWeek,
              work_name: work.work_name,
              employees: workAssignments
            });
          }
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
      <h2>자동 생성된 스케줄</h2>

      <button onClick={generateSchedule} style={{ padding: "10px", backgroundColor: "#4CAF50", color: "white", border: "none", marginBottom: "10px" }}>
        자동 스케줄 생성
      </button>
      <button onClick={saveScheduleToDB} style={{ padding: "10px", backgroundColor: "#ff5722", color: "white", border: "none", marginBottom: "10px", marginLeft: "10px" }}>
        DB로 스케줄 저장
      </button>

      {loading && <p> 스케줄 생성 중...</p>}
      {error && <p> 오류 발생: {error.message}</p>}

      {schedule.length === 0 ? (
        <p>생성된 스케줄이 없습니다. "자동 스케줄 생성" 버튼을 눌러 주세요.</p>
      ) : (
        <div style={{ display: "flex", alignItems: "flex-start", width: '1600px' }}>
          <table border="1" cellPadding="5" style={{ width: "80%", textAlign: "center" }}>
            <thead>
              <tr>
                <th>날짜</th>
                <th>요일</th>
                <th>근무 유형</th>
                <th>근무자</th>
              </tr>
            </thead>
            <tbody >
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
            <h3>주간 누적 근무 시간 (일~토 합산)</h3>

            {Array.from({ length: Math.ceil(schedule.length / 7) }).map((_, weekIndex) => {
              // ✅ 현재 주차 (일~토) 데이터 슬라이스
              const weeklyData = schedule.slice(weekIndex * 21, (weekIndex + 1) * 21);

              // ✅ 직원별 주간 근무 시간 합산 (각 직원별 총합)
              let employeeHours = {};
              weeklyData.forEach(entry => {
                entry.employees.forEach(emp => {
                  if (!employeeHours[emp.name]) {
                    employeeHours[emp.name] = 0;
                  }
                  employeeHours[emp.name] += 4; // ✅ 기본 근무 시간 (4h) → 필요하면 조정 가능
                });
              });

              // ✅ 주간 총 근무 시간 (전체 직원 합산)
              const totalWeekHours = Object.values(employeeHours).reduce((sum, hours) => sum + hours, 0);

              // 🔥 **총 근무 시간이 0이면 렌더링하지 않음**
              if (totalWeekHours === 0) return null;

              return (
                <div key={weekIndex} style={{ marginBottom: "10px", borderBottom: "1px solid gray", paddingBottom: "5px" }}>
                  <h4>{`${weekIndex + 1}주차 (일~토)`}</h4>
                  <p><strong>총 근무 시간: {totalWeekHours}h</strong></p> {/* 🔥 전체 합산된 주간 근무 시간 표시 */}

                  <ul style={{ padding: 0, listStyle: "none" }}>
                    {Object.entries(employeeHours).map(([name, hours]) => (
                      <li key={name}>
                        <strong>{name}</strong>: {hours}h
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>


        </div>
      )}
    </div>
  );
};

export default Schedule2;