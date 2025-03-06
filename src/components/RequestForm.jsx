// RequestForm.js (상위 컴포넌트)
import React, { useState } from 'react';
import ReqLeave from './ReqLeave';
import ReqSickLeave from './ReqSickLeave';
import ReqShiftChange from './ReqShiftChange';

const RequestForm = () => {

    return (
        <div>
            {/* 요청하기 Main */}
            <h2>요청하기</h2>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-around", gap: "20px", alignItems: "center"}}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span><img src="#" alt="휴가신청" /></span>
                    <span>휴가 신청</span>
                    <ReqLeave />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span><img src="#" alt="병가신청" /></span>
                    <span>병가 신청</span>
                    <ReqSickLeave />
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