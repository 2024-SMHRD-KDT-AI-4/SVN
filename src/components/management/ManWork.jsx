import { React, useState } from 'react'
import AddGroupModal from '../modals/AddGroupModal'

const ManWork = () => {
    const [workData, setWorkData] = useState([
        ["DE01", "오픈", "월급", "월,화,수,목,금", "주 40시간", "주 52시간", "정규직", "매장관리자"],
        ["OE01", "오픈", "월급", "월,화,수,목,금", "주 40시간", "주 52시간", "정규직", "오픈직원"],
        ["ME01", "미들", "시급", "월,수,금", "주 24시간", "주 30시간", "계약직", "청소/재고관리"],
        ["CE01", "마감", "시급", "목,금", "주 8시간", "주 8시간", "인턴", "교육중"],
    ]);
    // 근로번호
    // 근로명
    // 월급/시급
    // 소정근로요일
    // 소정근로규칙
    // 최대근로규칙
    // 계약유형

    const [selectedWorks, setSelectedWorks] = useState([]); // 체크된 조직들의 ID를 관리
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDltModalOpen, setIsDltModalOpen] = useState(false);

    const groupLine = (code, wName, salary, workDates, defTime, limtTime, type, comment) => {
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
                    <span style={{ width: "150px", textAlign: "right" }}>{code}</span>
                    <span style={{ width: "150px", textAlign: "right" }}>{wName}</span>
                    <span style={{ width: "150px", textAlign: "right" }}>{salary}</span>
                    <span style={{ width: "150px", textAlign: "right" }}>{workDates}</span>
                    <span style={{ width: "150px", textAlign: "right" }}>{defTime}</span>
                    <span style={{ width: "150px", textAlign: "right" }}>{limtTime}</span>
                    <span style={{ width: "150px", textAlign: "right" }}>{type}</span>
                    <span style={{ width: "150px", textAlign: "right" }}>{comment}</span>
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
        setIsAddModalOpen(false); // 모달 닫기
    };
    const btnAddGroup = () => {
        setIsAddModalOpen(true); // 모달 열기
    };
    return (
        <div style={{ width: "1600px" }}>
            <h2 style={{ margin: 0, marginRight: "20px" }}>근로관리</h2>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "20px" }}>
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
            </div>
            <div>
                <span>총 근로 수 : {workData.length}</span>
                <hr />
                <div style={{ display: "flex", gap: "25px" }}>
                    <span style={{ width: "50px", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "25px" }}>
                        <input
                            type="checkbox"
                            onChange={(e) => setSelectedWorks(e.target.checked ? workData.map((w) => w[0]) : [])}
                            checked={selectedWorks.length === workData.length && workData.length > 0}
                        />
                    </span>
                    <span style={{ width: "150px", textAlign: "right" }}>근로번호</span>
                    <span style={{ width: "150px", textAlign: "right" }}>근로명</span>
                    <span style={{ width: "150px", textAlign: "right" }}>월급/시급</span>
                    <span style={{ width: "150px", textAlign: "right" }}>소정근로요일</span>
                    <span style={{ width: "150px", textAlign: "right" }}>소정근로규칙</span>
                    <span style={{ width: "150px", textAlign: "right" }}>최대근로규칙</span>
                    <span style={{ width: "150px", textAlign: "right" }}>계약유형</span>
                    <span style={{ width: "150px", textAlign: "right" }}>비고란</span>

                </div>
                <hr style={{ marginBottom: "25px" }} />
                {/* 실질적인 직원 표시 */}
                <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
                    {workData.map(works => groupLine(works[0], works[1], works[2], works[3], works[4], works[5], works[6], works[7]))}
                </div>
            </div>
            {/* AddWorkerModal 컴포넌트를 렌더링 */}
            <AddGroupModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)} // 모달 닫기
                onSubmit={handleAddGroup} // 모달에서 직원 추가하기
            />
        </div>
    )
}

export default ManWork