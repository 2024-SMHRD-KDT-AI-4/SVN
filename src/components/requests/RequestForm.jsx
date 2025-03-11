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
    const [selectedLists, setSelectedLists] = useState([]); // 선택된 항목을 저장

    // 체크박스 선택 시 선택 리스트 업데이트
    const handleCheckboxChange = (index) => {
        setSelectedLists((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index) // 이미 체크된 경우 제거
                : [...prev, index] // 체크되지 않은 경우 추가
        );
    };

    // 삭제 버튼 클릭 시 선택된 항목 제거하는 함수
    const handleDelete = () => {
        setCompletes((prevCompletes) =>
            prevCompletes.filter((_, index) => !selectedLists.includes(index))
        );
        setSelectedLists([]); // 삭제 후 선택 초기화
    };



    return (
        <div>
            <h4>요청하기</h4>
            <div style={{ display: "flex", flexDirection: "row", alignContent: "space-around", gap: "20px", marginTop: "50px" }}>
                <div style={{ display: "center", flexDirection: "column", gap: "20px" }}>
                    <div>
                        <ReqSpace />
                    </div>
                </div>

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
                <div style={{ display: "flex", flexDirection: "column", gap: "20px", background: "#fafafa" }}>
                    <div>
                        <span>내역</span>
                        {/* 삭제 버튼 클릭 시 선택된 항목 삭제 */}
                        <button onClick={handleDelete}>삭제</button>
                    </div>
                    <div>
                        {completes.map((item, index) => (
                            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                                {/* 체크박스 선택 시 선택 리스트 업데이트 */}
                                <span style={{ width: "50px", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "25px" }}>
                                    <input
                                        type="checkbox"
                                        onChange={() => handleCheckboxChange(index)}
                                        checked={selectedLists.includes(index)}
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
};

export default RequestForm;