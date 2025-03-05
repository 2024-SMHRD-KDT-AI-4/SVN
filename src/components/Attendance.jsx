import { React, useState } from "react";
import AttStatus from "./AttStatus"
import AttTodayPlan from "./AttTodayPlan"
import AttWorktime from "./AttWorktime"
import AttVacation from "./AttVacation"
import AttTodayCheck from "./AttTodayCheck"
import AttAlert from "./AttAlert"


const Attendance = () => {
  const [status, setStatus] = useState("");
  // 각 박스의 제목과 내용

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* 올해 근무 현황 */}
      <h4>올해 근무 현황</h4>
      <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
        <div>
          <span><img src="#" alt="근태" /></span>
          <span>근태 현황</span>
          <AttStatus />
        </div>
        <div>
          <span><img src="#" alt="휴가현황" /></span>
          <span>휴가 현황</span>
          <AttVacation />
        </div>
        <div>
          <span><img src="#" alt="근무시간" /></span>
          <span>근무시간</span>
          <AttWorktime />
        </div>
      </div>

      {/* 오늘 근무 현황 */}
      <h4>오늘 근무 현황</h4>
      <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
        <div>
          <span><img src="#" alt="오늘은" /></span>
          <span>오늘은</span>
          <AttTodayPlan />
        </div>
        <div>
          <span><img src="#" alt="근무체크" /></span>
          <span>근무체크</span>
          <AttTodayCheck />
        </div>
        <div>
          <span><img src="#" alt="경고" /></span>
          <span>경고</span>
          <AttAlert />
        </div>
      </div>
    </div>
  );
};

export default Attendance;
