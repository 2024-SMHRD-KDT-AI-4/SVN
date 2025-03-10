// 근무 변경 요청 컴포넌트
import React, { useState } from 'react';

const ReqShiftChange = () => {
    const [origin, setOrigin] = useState('');     // 기존 근무 날짜
    const [originTm, setOriginTm] = useState(''); // 기존 근무 시간

    const [shift, setShift] = useState('');       // 변경 요청 날짜
    const [shiftTm, setShiftTm] = useState('');   // 변경 요청 시간


    return (
        <div
        style={{
            width: "450px",
            height: "300px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
            padding: "10px",
        }}
        >
            <h3>근무 변경 요청</h3>

            {/* 기존 근무 시간 선택 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span>기존 근무 날짜 :</span>
                <input type="date" value={origin} onChange={(e) => setOrigin(e.target.value)}  style={{ width: "200px" }}/>

                <div><select value={originTm} onChange={(e) => setOriginTm(e.target.value)}>
                    <option value="">선택</option> 
                    <option>오픈</option>    
                    <option>미들</option>    
                    <option>마감</option>    
                </select></div>
            </div>

            {/* 변경 요청 날짜, 시간 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span>변경할 근무 날짜 :</span>
                <input type="date" value={shift} onChange={(e) => setShift(e.target.value)}  style={{ width: "200px" }}/>

                <div><select value={shiftTm} onChange={(e) => setShiftTm(e.target.value)}>
                    <option value="">선택</option> 
                    <option>오픈</option>    
                    <option>미들</option>    
                    <option>마감</option>    
                </select></div>
            </div>
            
            <button 
            style={{ width: "100%", padding: "5px 0", cursor: "pointer" }}
            onClick={() => alert(`근무 변경 요청 완료! 변경: ${origin} '${originTm}' → ${shift} '${shiftTm}'`)}>신청하기</button>
        </div>
    );
}

export default ReqShiftChange;
