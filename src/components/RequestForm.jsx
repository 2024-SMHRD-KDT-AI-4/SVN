// RequestForm.js (상위 컴포넌트)
import React, { useState } from 'react';
import ReqLeave from './ReqLeave';
import ReqShiftChange from './ReqShiftChange';

const RequestForm = () => {

    return (
        <div>
            {/* 요청하기 Main */}
            <h2>요청하기</h2>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", gap: "20px", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span><img src="#" alt="휴가/병가 신청" /></span>
                    <span>휴가/병가 신청</span>
                    <ReqLeave />
                </div>
                <div style={{
                    width: "450px",
                    height: "650px",
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#fff",
                    padding: "10px",
                }}>
                    <span>공지, 달력 등 추가</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span><img src="#" alt="근무변경요청" /></span>
                    <span>근무 변경 요청</span>
                    <ReqShiftChange />
                </div>
            </div>
        </div>
    );
}

export default RequestForm;