// 휴가 신청 컴포넌트
import React, { useState } from 'react';
//import "react-datepicker/dist/react-datepicker.css";

const ReqLeave = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [days, setDays] = useState('');


    return (
        <div
        style={{
            width: "450px",
            height: "650px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
            padding: "10px",
        }}
        >
            <h3>휴가 신청</h3>
            {/* <div> // 잔여 휴가 일수 연동
                <AttVacation />
            </div> */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span>시작 날짜:</span>
                <input type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: "200px" }}/>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span>종료 날짜:</span>
                <input type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: "200px" }}/>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span>신청 일수:</span>
                <input type='number' value={days} onChange={(e) => setDays(e.target.value)} style={{ width: "200px" }} />
            </div>
            <button 
            style={{ width: "100%", padding: "5px 0", cursor: "pointer" }} 
            onClick={() => alert(`휴가 신청 완료! ${startDate} ~ ${endDate} (${days}일)`)}>신청하기</button>
        </div>
    );
}

export default ReqLeave;