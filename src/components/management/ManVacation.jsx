import { React, useState, useEffect } from 'react'
import AddGroupModal from '../modals/AddGroupModal'
import { Button } from '@mui/material';

const ManVacation = () => {
    const [workData, setWorkData] = useState([]);
    // 근로번호
    // 근로명
    // 월급/시급
    // 소정근로요일
    // 소정근로규칙
    // 최대근로규칙
    // 계약유형

    const [selectedWorks, setSelectedWorks] = useState([]); // 체크된 조직들의 ID를 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        const storedVacations = sessionStorage.getItem('vacationData'); // 저장된 사용자 정보 가져오기
        //console.log("한번실행")
        //console.log(storedVacations)
        let parsedData = null;

        try {
            // storedVacations 항상 JSON 문자열로 들어온다고 가정
            parsedData = JSON.parse(storedVacations);
            //console.log("일반휴가데이터 :", parsedData);

            // 상태 업데이트
            setWorkData(parsedData);
        } catch (error) {
            // JSON 파싱에 실패한 경우
            console.error("Error parsing JSON:", error);

            // 필요하다면 기본 데이터로 초기화
            // setWorkData(temps); 
        }
    }, []);

    const vacationLine = (vCode,vType, vEmp, vStart, vEnd, vContent, vStatus, vAdminID, vApproval) => {
        return (
            <div>
                <div style={{ display: "flex", gap: "25px" }}>
                    <span style={{ width: "50px", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "25px" }}>
                        <input
                            type="checkbox"
                            checked={selectedWorks.includes(vCode)} // 체크 상태 관리
                            onChange={() => handleCheckboxChange(vCode)} // 상태 변경
                        />
                    </span>
                    <span style={{ width: "100px", textAlign: "right" }}>{vType}</span>
                    <span style={{ width: "140px", textAlign: "right" }}>{vEmp}</span>
                    <span style={{ width: "140px", textAlign: "right" }}>{vStart}</span>
                    <span style={{ width: "140px", textAlign: "right" }}>{vEnd}</span>
                    <span style={{ width: "140px", textAlign: "right" }}>{vContent}</span>
                    <span style={{ width: "140px", textAlign: "right" }}>{vStatus}</span>
                    <span style={{ width: "140px", textAlign: "right" }}>{vAdminID}</span>
                    <span style={{ width: "140px", textAlign: "right" }}>{vApproval}</span>
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
                    {/*  */}

                </div>
                <hr style={{ marginBottom: "25px" }} />
                {/* 실질적인 직원 표시 */}
                <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
                    {workData.map(work => vacationLine(work.req_idx, work.req_type, work.emp_id, work.start_date, work.end_date, work.req_content, work.req_status, work.approved_at, work.admin_id))}
                </div>
            </div>
            {/* AddWorkerModal 컴포넌트를 렌더링 */}
            <AddGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddGroup} />
        </div>
    )
}

export default ManVacation