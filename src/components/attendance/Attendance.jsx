import React, { useState } from "react";
import AttStatus from "./AttStatus";
import AttTodayPlan from "./AttTodayPlan";
import AttWorktime from "./AttWorktime";
import AttVacation from "./AttVacation";
import AttTodayCheck from "./AttTodayCheck";
// ✅ 새 이름으로 변경
import AttFaceRecog from "./AttFaceRecog";

const Attendance = () => {
  const [status, setStatus] = useState("");

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
        <div style={cardStyle}><span>근태 현황</span><AttStatus /></div>
        <div style={cardStyle}><span>휴가 현황</span><AttVacation /></div>
        <div style={cardStyle}><span>근무시간</span><AttWorktime /></div>
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
