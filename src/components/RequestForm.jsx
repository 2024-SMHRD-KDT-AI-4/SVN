// 요청하기 메인 컴포넌트
import React, { useState } from 'react';
import ReqLeave from './ReqLeave';
import ReqShiftChange from './ReqShiftChange';
import ReqSpace from './ReqSpace';
import ReqComplete from './ReqComplete';

const RequestForm = () => {

    const [completes, setCompletes] = useState([ // DB에서 가져온 데이터들
        { startDate: "25-03-06", endDate: "25-03-06", days: "1", reason: "병가", confirm: true },
        { startDate: "25-03-06", endDate: "25-03-06", days: "1", reason: "병가", confirm: true },
        { startDate: "25-03-06", endDate: "25-03-06", days: "1", reason: "병가", confirm: true },
        { startDate: "25-03-06", endDate: "25-03-06", days: "1", reason: "병가", confirm: false },
        { startDate: "25-03-06", endDate: "25-03-06", days: "1", reason: "병가", confirm: true },
        { startDate: "25-03-06", endDate: "25-03-06", days: "1", reason: "병가", confirm: false },
    ])
    const [selectedLists, setSelectedLists] = useState([]); // 체크된 조직들의 ID를 관리
    return (
        <div>
            <h4>요청하기</h4>
            <div style={{ display: "flex", flexDirection: "row", alignContent: "space-around", gap: "20px", marginTop: "100px" }}>
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
                <div style={{ display: "flex", flexDirection: "column", gap: "20px", background: "grey" }}>
                    <div>
                        <span>내역</span>
                        <button>수정</button>
                        <button>삭제</button>
                    </div>
                    <div>

                        {/* <ReqComplete /> */}
                        {completes.map((item, index) => (
                            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                <span style={{ width: "50px", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "25px" }}>
                                    <input
                                        type="checkbox"
                                        onChange={(e) => {
                                            let aa = index;
                                            console.log(aa);

                                        }}
                                            
                                            
                                            
                                        // checked={selectedLists.length === workData.length && workData.length > 0}
                                    />
                                </span>
                                <ReqComplete
                                    startDate={item.startDate}
                                    endDate={item.endDate}
                                    days={item.days}
                                    reason={item.reason}
                                    confirm={item.confirm}
                                />
                            </div>
                        ))}


                    </div>
                </div>
            </div>
        </div>
    );
}

export default RequestForm;