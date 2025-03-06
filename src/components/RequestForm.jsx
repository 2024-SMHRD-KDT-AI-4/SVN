// 요청하기 메인 컴포넌트
import React, { useState } from 'react';
import ReqLeave from './ReqLeave';
import ReqShiftChange from './ReqShiftChange';
import ReqSpace from './ReqSpace';
import ReqComplete from './ReqComplete';

const RequestForm = () => {

    return (
        <div>
            <h4>요청하기</h4>
            <div style={{ display: "flex", flexDirection: "row", alignContent: "space-around", gap: "20px", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* 휴가 및 병가 */}
                    <div>
                        <ReqLeave />
                    </div>
                    {/* 근무 변경 요청 */}
                    <div>
                        <ReqShiftChange />
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* 공지 등 추가 예정 */}
                    <div>
                        <ReqSpace />
                    </div>
                    <div>
                        <ReqSpace />
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                        <ReqComplete />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RequestForm;