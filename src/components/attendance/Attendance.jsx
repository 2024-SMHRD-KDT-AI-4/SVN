import React, { useState, useEffect } from "react";
import AttStatus from "./AttStatus";
import AttTodayPlan from "./AttTodayPlan";
import AttWorktime from "./AttWorktime";
import AttVacation from "./AttVacation";
import AttTodayCheck from "./AttTodayCheck";
// ✅ 새 이름으로 변경
import AttFaceRecog from "./AttFaceRecog";

const Attendance = () => {
  const [myAttendance, setMyAttendance] = useState({});

  // 페이지가 로드될 때 실행되는 useEffect 훅
  useEffect(() => {
    // 1. 세션 저장소에서 계정 정보를 불러옵니다.
    const me = JSON.parse(sessionStorage.getItem('user'));
    const storedEmployee = JSON.parse(sessionStorage.getItem('employeeData'));

    // console.log(me);
    // console.log(me.id);
    // console.log(storedEmployee);

    const findEmpId = storedEmployee.filter(emp => emp.act_id == me.id);

    if (findEmpId) {
      // console.log(findEmpId);
      // console.log(findEmpId[0].emp_id);
      const storedAttendance = JSON.parse(sessionStorage.getItem('attendanceData'));
      let myAttendance = storedAttendance.filter(att => att.emp_id === findEmpId[0].emp_id);

      console.log(myAttendance);

      setMyAttendance(myAttendance[0]);

    } else {
      // 2. 세션에 사용자 정보가 없으면 기본값 설정
      console.log("못찾음")

    }
  }, []);

  const cardStyle = {
    flex: 1,
    minHeight: "150px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#fff",
    padding: "10px",
    boxSizing: "border-box"
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "1600px",
        boxSizing: "border-box",
      }}
    >
      {/* 올해 근무 현황 */}
      <h4>올해 근무 현황</h4>
      <div style={{ display: "flex", gap: "20px", justifyContent: "space-around" }}>
        <div style={cardStyle}><span>근태 현황</span><AttStatus late={myAttendance.att_late} early={myAttendance.att_early_leave} absence={myAttendance.att_absence} /></div>
        <div style={cardStyle}><span>휴가 현황</span><AttVacation remain={myAttendance.att_remain} /></div>
        <div style={cardStyle}><span>근무시간</span><AttWorktime day={myAttendance.att_total_days} time={myAttendance.att_total_time} /></div>
      </div>

      {/* 오늘 근무 현황 */}
      <h4>오늘 근무 현황</h4>
      <div style={{ display: "flex", gap: "20px", justifyContent: "space-around" }}>
        <div style={cardStyle}><span>오늘은</span><AttTodayPlan /></div>
        <div style={cardStyle}><span>경고</span><AttFaceRecog /></div> {/* ✅ 여기도 교체 */}
        <div style={cardStyle}><span>근무체크</span><AttTodayCheck /></div>
      </div>
    </div>
  );
};

export default Attendance;
