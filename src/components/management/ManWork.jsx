import { React, useState, useEffect } from 'react'
import AddWorkModal from '../modals/AddWorkModal'
import DeleteConfirmModal from '../modals/DeleteConfirmModal'
import axios from 'axios'; // axios를 사용하여 서버로부터 데이터 가져오기

const ManWork = () => {
    const [workData, setWorkData] = useState([]);
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

    // useEffect(() => {
    //     console.log("변화된 ", selectedWorks);
    //     // 테스트용 잘 선택되나 확인
    // }, [selectedWorks])

    useEffect(() => {
        const storedWorks = sessionStorage.getItem('workData'); // 저장된 사용자 정보 가져오기
        //console.log("한번실행")
        //console.log(storedWorkers)
        let parsedData = null;

        try {
            // storedWorkers가 항상 JSON 문자열로 들어온다고 가정
            parsedData = JSON.parse(storedWorks);
            //console.log("일반근무데이터 :", parsedData);
        
            // 상태 업데이트
            setWorkData(parsedData);
        } catch (error) {
            // JSON 파싱에 실패한 경우
            console.error("Error parsing JSON:", error);
        
            // 필요하다면 기본 데이터로 초기화
            // setEmployeeData(temps); 
        }
    }, []);


    const workLine = (code, wName, salary, workDates, defTime, limtTime, type, comment) => {
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


    const handleAddWork = async (newWork) => {
        // 새로운 그룹 정보 변수 선언
        let temp01 = newWork.wrkId + `${workData.length + 1}` || `T${workData.length + 1}`;  // 그룹 ID 변수
        let temp02 = newWork.wrkName || `테스트그룹`;  // 그룹 이름 변수
        let temp03 = newWork.salaryType || `테스트그룹장`;  // 그룹장 ID 변수
        let temp04 = newWork.wrkDays || `테스트 그룹 설명`;  // 그룹 설명 변수
        let temp05 = newWork.wrkDfRule || 40;  // 조직 위치 변수
        let temp06 = newWork.wrkMxRule || 52;  // 그룹 인원 수 변수
        let temp07 = newWork.wrkType || "정규직";  // 그룹 인원 수 변수
        let temp08 = newWork.wrkDesc || "테스트용";  // 그룹 인원 수 변수

        try {
            // DB에 새 그룹 추가 요청
            const response = await axios.post("/management/addwork", {
                work_id: temp01,
                work_name: temp02,
                work_salary_type: temp03,
                work_days: temp04,
                work_default_rule: temp05,
                work_max_rule: temp06,
                work_type: temp07,
                work_desc: temp08
            });
            // 서버로부터 저장된 데이터를 가져옴
            const incomingGroup = response.data;
            //console.log("서버 요청 결과 : ", incomingGroup);

            // 새로운 직원 데이터를 세션 저장소에 먼저 저장
            const updatedWorkData = [
                ...workData,
                {
                    work_id: temp01,
                    work_name: temp02,
                    work_salary_type: temp03,
                    work_days: temp04,
                    work_default_rule: temp05,
                    work_max_rule: temp06,
                    work_type: temp07,
                    work_desc: temp08,
                    created_at: new Date().toISOString() // 현재 시간
                }
            ];

            //console.log(updatedGroupData)
            sessionStorage.setItem('workData', JSON.stringify(updatedWorkData)); // 세션 저장소에 저장

            // 세션 저장소에 저장된 데이터로 상태 업데이트
            setWorkData(updatedWorkData); // 상태 업데이트
            setIsAddModalOpen(false); // 모달 닫기
        } catch (error) {
            console.error("Failed to add worker:", error);
            alert("그룹을 추가하는 데 실패했습니다. 다시 시도해주세요.");
        }

        setIsAddModalOpen(false); // 모달 닫기
    };

    const handleDeleteWork = async (confirm) => {
        if (!confirm) {
            console.log("삭제가 취소됨");
            return; // 아무 동작도 하지 않음
        }

        try {
            // 서버에 삭제 요청
            const response = await axios.post("/management/dltWork", { ids: selectedWorks });
            //console.log("서버에 보낸 데이터:", selectedWorks);

            // 서버 응답 확인
            const returnData = response.data;
            //console.log("서버에서 받은 데이터:", returnData);

            // 응답이 성공적일 경우
            if (response.status === 200) {
                // 상태 업데이트
                const updatedWorkData = workData.filter((work) => !selectedWorks.includes(work.work_id));
                //console.log("업데이트된 직원 데이터:", updatedGroupData);

                sessionStorage.setItem('workData', JSON.stringify(updatedWorkData)); // 세션 저장소에 저장

                setWorkData(updatedWorkData); // React 상태 업데이트
                setSelectedWorks([]); // 선택 초기화
                setIsAddModalOpen(false); // 모달 닫기
            } else {
                console.error("서버 응답 오류:", response.data);
                alert("직원 삭제 요청이 실패했습니다. 서버의 응답을 확인하세요.");
            }
        } catch (error) {
            console.error("직원 삭제 요청 중 오류 발생:", error);
            alert("직원을 삭제하는 데 실패했습니다. 네트워크 상태를 확인하고 다시 시도해주세요.");
        }
    };

    ///////버튼 기능들/////////////////////////////
    const btnAddWork = () => {
        setIsAddModalOpen(true); // 그룹 추가 모달 열기
    };
    const btnRemoveWork = () => {
        if (selectedWorks.length === 0) {
            //console.log("체크된 것이 없습니다.")
            return // 선택된 것이 없음으로 빠져나가기
        }
        setIsDltModalOpen(true); // 그룹 삭제 모달 열기
    };
    /////////////////////////////////////////
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
                    onClick={btnRemoveWork}
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
                    onClick={btnAddWork}
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
                    {
                        workData.map(work => workLine(
                            work.work_id,
                            work.work_name,
                            work.work_salary_type,
                            work.work_default_rule,
                            work.work_max_rule,
                            work.work_type,
                            work.work_desc))}
                </div>
            </div>
            {/* AddWorkerModal 컴포넌트를 렌더링 */}
            <AddWorkModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddWork} />
            <DeleteConfirmModal isOpen={isDltModalOpen} onClose={() => setIsDltModalOpen(false)} onSubmit={handleDeleteWork} isType={"근로"} />
        </div>
    )
}

export default ManWork