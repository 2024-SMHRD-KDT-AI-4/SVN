import { React, useState } from 'react'
import AddGroupModal from '../modals/AddGroupModal'
import { Button } from '@mui/material';

const ManVacation = () => {
    const [workData, setWorkData] = useState([
        ["휴가", "안지운", "2025.03.12", "2025.03.12", "내맘이지구리", "검토 중", "", ""],
        ["휴가", "안지운", "2025.03.13", "2025.03.13", "내맘이지구리", "검토 중", "", ""],
        ["휴가", "안지운", "2025.03.14", "2025.03.14", "내맘이지구리", "검토 중", "", ""],
        ["휴가", "안지운", "2025.03.15", "2025.03.15", "내맘이지구리", "검토 중", "", ""],

    ]);
    // 근로번호
    // 근로명
    // 월급/시급
    // 소정근로요일
    // 소정근로규칙
    // 최대근로규칙
    // 계약유형

    const [selectedWorks, setSelectedWorks] = useState([]); // 체크된 조직들의 ID를 관리
    const [isModalOpen, setIsModalOpen] = useState(false);

    const vacationLine = (code, wName, salary, workDates, defTime, limtTime, type, comment) => {
        return (
            <div>
                <div style={{ display: "flex", gap: "25px" }}>
                    <span style={{ width: "50px", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "25px" }}>
                        <input
                            type="checkbox"
                            checked={selectedWorks.includes(code)} // 체크 상태 관리
                            onChange={() => handleCheckboxChange(code)} // 상태 변경
                        />
                    </span>
                    <span style={{ width: "100px", textAlign: "right" }}>{code}</span>
                    <span style={{ width: "140px", textAlign: "right" }}>{wName}</span>
                    <span style={{ width: "140px", textAlign: "right" }}>{salary}</span>
                    <span style={{ width: "140px", textAlign: "right" }}>{workDates}</span>
                    <span style={{ width: "140px", textAlign: "right" }}>{defTime}</span>
                    <span style={{ width: "140px", textAlign: "right" }}>{limtTime}</span>
                    <span style={{ width: "140px", textAlign: "right" }}>{type}</span>
                    <span style={{ width: "140px", textAlign: "right" }}>{comment}</span>
                    <span style={{ width: "140px", textAlign: "right" }}> <button>승인</button><button>반려</button></span>
                </div>

                <hr />
            </div>

        );
    };
    const handleCheckboxChange = (code) => {
        setSelectedWorks((prev) =>
            prev.includes(code)
                ? prev.filter((id) => id !== code) // 이미 체크된 경우 제거
                : [...prev, code] // 체크되지 않은 경우 추가
        );
    };
    const btnRemoveGroup = () => {
        setWorkData(workData.filter((group) => !selectedWorks.includes(group[0])));
        setSelectedWorks([]); // 삭제 후 선택 초기화
    };

    const handleAddGroup = (newWork) => {
        setWorkData([
            ...workData,
            [
                newWork.dpId || "T0000", // 팀번호
                newWork.dpName || "테스트팀", // 팀이름
                newWork.dpHead || "테스트장", // 팀장
                newWork.description || "테스트용", // 이름
                newWork.location || "8호실", // 이름
                newWork.number || "999", // 이름
            ],
        ]);
        setIsModalOpen(false); // 모달 닫기
    };
    const btnAddGroup = () => {
        setIsModalOpen(true); // 모달 열기
    };
    return (
        <div style={{ width: "1600px" }}>
            <h2 style={{ margin: 0, marginRight: "20px" }}>휴가관리</h2>
            <hr />
            {/* <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "20px" }}>
                <span
                    style={{
                        display: "inline-block",
                        padding: "10px 20px",
                        backgroundColor: "#007BFF",
                        color: "#fff",
                        borderRadius: "5px",
                        cursor: "pointer",
                        textAlign: "center",
                        fontSize: "14px",
                        fontWeight: "bold",
                        marginLeft: "10px",
                    }}
                    onClick={btnRemoveGroup}
                >
                    - 근로 삭제하기
                </span>
                <span
                    style={{
                        display: "inline-block",
                        padding: "10px 20px",
                        backgroundColor: "#007BFF",
                        color: "#fff",
                        borderRadius: "5px",
                        cursor: "pointer",
                        textAlign: "center",
                        fontSize: "14px",
                        fontWeight: "bold",
                        marginLeft: "10px",
                    }}
                    onClick={btnAddGroup}
                >
                    + 근로 추가하기
                </span>
            </div> */}
            <div>
                <span>총 휴가요청 수 : {workData.length}</span>
                <hr />
                <div style={{ display: "flex", gap: "25px" }}>
                    <span style={{ width: "50px", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "25px" }}>
                        <input
                            type="checkbox"
                            onChange={(e) => setSelectedWorks(e.target.checked ? workData.map((w) => w[0]) : [])}
                            checked={selectedWorks.length === workData.length && workData.length > 0}
                        />
                    </span>
                    <span style={{ width: "100px", textAlign: "right" }}>요청종류</span>
                    <span style={{ width: "140px", textAlign: "right" }}>요청자</span>
                    <span style={{ width: "140px", textAlign: "right" }}>부터</span>
                    <span style={{ width: "140px", textAlign: "right" }}>까지</span>
                    <span style={{ width: "140px", textAlign: "right" }}>사유</span>
                    <span style={{ width: "140px", textAlign: "right" }}>처리여부</span>
                    <span style={{ width: "140px", textAlign: "right" }}>처리날짜</span>
                    <span style={{ width: "140px", textAlign: "right" }}>처리자</span>
                    <span style={{ width: "140px", textAlign: "right" }}>승인처리</span>

                </div>
                <hr style={{ marginBottom: "25px" }} />
                {/* 실질적인 직원 표시 */}
                <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
                    {workData.map(works => vacationLine(works[0], works[1], works[2], works[3], works[4], works[5],works[6],works[7]))}
                </div>
            </div>
            {/* AddWorkerModal 컴포넌트를 렌더링 */}
            <AddGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddGroup}/>
        </div>
    )
}

export default ManVacation