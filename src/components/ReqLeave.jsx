// 휴가 신청 컴포넌트
import React, { useState, useEffect } from 'react';
import ReqComplete from './ReqComplete';
//import "react-datepicker/dist/react-datepicker.css";

const ReqLeave = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [days, setDays] = useState('');
    const [reason, setReason] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false); // 신청 완료 상태

    // 날짜 차이를 계산하는 함수
    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = end - start;
            const diffDays = diffTime / (1000 * 60 * 60 * 24) + 1; // 하루 포함 계산
            setDays(diffDays > 0 ? diffDays : 0);
        } else {
            setDays(0);
        }
    }, [startDate, endDate]);

    // 신청하기 버튼 클릭 시 실행되는 함수
    const handleSubmit = () => {
        if (!startDate || !endDate || !reason) {
            alert("모든 항목을 입력해 주세요!");
            return;
        }

        alert(`신청 완료! ${startDate} ~ ${endDate} (${days}일) 사유: ${reason}`);
        setIsSubmitted(true); // 신청 완료 상태 변경
    };


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
            <h3>휴가 / 병가 신청</h3>
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
                <span style={{ width: "200px", textAlign: "right", fontWeight: "bold" }}>{days} 일</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span>사유:</span>
                <input type='text' value={reason} onChange={(e) => setReason(e.target.value)} style={{ width: "200px" }} />
            </div>
            
            <button 
            style={{ width: "100%", padding: "5px 0", cursor: "pointer" }} 
            onClick={handleSubmit}>신청하기</button>

            <div style={{ textAlign: "center" }}>
            {/* 신청 완료 후, 완료 UI를 보여줌 */}
            {isSubmitted ? (
                <ReqComplete startDate={startDate} endDate={endDate} days={days} reason={reason} />
            ) : ('') }</div>
        </div>
    );
}

export default ReqLeave;