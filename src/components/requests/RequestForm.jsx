// 요청하기 메인 컴포넌트
import React from 'react';
import ReqSpace from './ReqSpace';
import ReqLeave from './ReqLeave';
import ReqShiftChange from './ReqShiftChange';
import ReqComplete from './ReqComplete';

const RequestForm = () => {


    return (
        <div>
            <h4>요청하기</h4>
            <div style={{ display: "flex", flexDirection: "row", alignContent: "space-around", gap: "20px", marginTop: "50px" }}>
                <div style={{ display: "center", flexDirection: "column", gap: "20px" }}>
                    <ReqSpace />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* 휴가 및 병가 */}
                    <ReqLeave />
                    {/* 근무 변경 요청 */}
                    <ReqShiftChange />
                </div>

                {/* 요청 내역 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px", background: "#fafafa" }}>
                    <div>
                        <h3>내역</h3>
                    </div>
                    <ReqComplete />
                </div>
            </div>
        </div>
    );
};

export default RequestForm;