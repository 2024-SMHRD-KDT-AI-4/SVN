import { React, useState, useEffect } from "react";
import AddWorkerModal from "./AddWorkerModal";
import axios from 'axios'; // axios를 사용하여 서버로부터 데이터 가져오기
const ManEmplyee = () => {
    const [workerData, setWorkerData] = useState([]);
    const [selectedWorkers, setSelectedWorkers] = useState([]); // 체크된 직원들의 ID를 관리
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const storedWorkers = sessionStorage.getItem('workerData'); // 저장된 사용자 정보 가져오기
        //console.log("한번실행")
        if (storedWorkers) {
            const parsedData = JSON.parse(storedWorkers);
            //console.log("직원데이터 :", parsedData);
            setWorkerData(parsedData);
        } else {
            // 로그인되지 않은 상태 처리 (필요시)
            console.log('로그인되지 않은 사용자');
            const temps = [
                {
                    emp_id: "241210001",
                    emp_name: "김예은",
                    emp_role: "팀장",
                    emp_firstDate: "2024.12.10",
                    emp_group: "백엔드",
                    emp_birthDate: "2001.05.07",
                    emp_phone: "010-0000-0000",
                    emp_email: "temp@gmail.com",
                    created_at: "2024.12.10"
                },
                {
                    emp_id: "241210002",
                    emp_name: "안지운",
                    emp_role: "부팀장",
                    emp_firstDate: "2024.12.10",
                    emp_group: "프론트엔드",
                    emp_birthDate: "1999.11.23",
                    emp_phone: "010-0000-0000",
                    emp_email: "temp@gmail.com",
                    created_at: "2024.12.10"
                },
                {
                    emp_id: "241210003",
                    emp_name: "김현웅",
                    emp_role: "사원",
                    emp_firstDate: "2024.12.10",
                    emp_group: "프론트엔드",
                    emp_birthDate: "1999.01.20",
                    emp_phone: "010-0000-0000",
                    emp_email: "temp@gmail.com",
                    created_at: "2024.12.10"
                },
                {
                    emp_id: "241210004",
                    emp_name: "전석현",
                    emp_role: "사원",
                    emp_firstDate: "2024.12.10",
                    emp_group: "백엔드",
                    emp_birthDate: "1997.12.26",
                    emp_phone: "010-0000-0000",
                    emp_email: "temp@gmail.com",
                    created_at: "2024.12.10"
                },
                {
                    emp_id: "241210005",
                    emp_name: "김민정",
                    emp_role: "사원",
                    emp_firstDate: "2024.12.10",
                    emp_group: "백엔드",
                    emp_birthDate: "1993.04.21",
                    emp_phone: "010-0000-0000",
                    emp_email: "temp@gmail.com",
                    created_at: "2024.12.10"
                },
                {
                    emp_id: "241210006",
                    emp_name: "강인오",
                    emp_role: "사원",
                    emp_firstDate: "2024.12.10",
                    emp_group: "프론트엔드",
                    emp_birthDate: "1991.02.25",
                    emp_phone: "010-0000-0000",
                    emp_email: "temp@gmail.com",
                    created_at: "2024.12.10"
                }
            ];
            setWorkerData(temps);
        }
    }, []);

    useEffect(() => {
        console.log(selectedWorkers);
    }, [selectedWorkers]);

    const handleCheckboxChange = (code) => {
        setSelectedWorkers((prev) =>
            prev.includes(code)
                ? prev.filter((id) => id !== code) // 이미 체크된 경우 제거
                : [...prev, code] // 체크되지 않은 경우 추가
        );
    };

    const btnRemoveWorker = () => {

        setWorkerData(workerData.filter((worker) => !selectedWorkers.includes(worker.emp_id)));
        setSelectedWorkers([]); // 삭제 후 선택 초기화
    };

    const workerLine = (id, name, role, firstDate, group, birthDate, phone, email) => {
        //console.log(id, name, role, firstDate, group, birthDate, phone, email)
        return (
            <div>
                <div style={{ display: "flex", gap: "25px" }}>
                    <span style={{ width: "50px", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "25px" }}>
                        <input
                            type="checkbox"
                            checked={selectedWorkers.includes(id)} // 체크 상태 관리
                            onChange={() => handleCheckboxChange(id)} // 상태 변경
                        />
                    </span>
                    <span style={{ width: "150px", textAlign: "right" }}>{id}</span>
                    <span style={{ width: "150px", textAlign: "right" }}>{name}</span>
                    <span style={{ width: "150px", textAlign: "right" }}>{role}</span>
                    <span style={{ width: "150px", textAlign: "right" }}>{firstDate}</span>
                    <span style={{ width: "150px", textAlign: "right" }}>{group}</span>
                    <span style={{ width: "150px", textAlign: "right" }}>{birthDate}</span>
                    <span style={{ width: "150px", textAlign: "right" }}>{phone}</span>
                    <span style={{ width: "200px", textAlign: "right" }}>{email}</span>
                </div>
                <hr />
            </div>
        );
    };

    const handleAddWorker = async (newWorker) => {

        // 새로운 직원 정보 변수 선언
        let temp_employeeId = `250306${ (workerData.length + 1 > 99 ? "": workerData.length + 1 > 9 ? "0" : "00")}`+ `${workerData.length + 1}`; // 직원번호 변수
        let temp_name = `${newWorker.name}${workerData.length + 1}`  || `테스트맨`; // 이름 변수
        let temp_position = newWorker.position || "테스트"; // 직책 변수
        let temp_joinDate = newWorker.joinDate || "2025.03.06"; // 입사일 변수
        let temp_department = newWorker.department || "테스트부서"; // 조직 변수
        let temp_dob = newWorker.dob || "2025.03.06"; // 생년월일 변수
        let temp_phone = newWorker.phone || "010-1234-5678"; // 연락처 변수
        let temp_email = newWorker.email || "newworker@com"; // 이메일 변수

        try {
            // DB에 새 직원 추가 요청
            const response = await axios.post("/management/addEmployees", {
                employeeId: temp_employeeId, // 새로운 직원번호
                name: temp_name, // 이름
                position: temp_position, // 직책
                joinDate: temp_joinDate, // 입사일
                department: temp_department, // 조직
                dob: temp_dob, // 생년월일
                phone: temp_phone, // 연락처
                email: temp_email // 이메일
            });

            // 서버로부터 저장된 데이터를 가져옴
            const savedWorker = response.data;
            //console.log(savedWorker);

            // 새로운 직원 데이터를 세션 저장소에 먼저 저장
            const updatedWorkerData = [
                ...workerData,
                {
                    emp_id: temp_employeeId,
                    emp_name: temp_name,
                    emp_role: temp_position,
                    emp_firstDate: temp_joinDate,
                    emp_group: temp_department,
                    emp_birthDate: temp_dob,
                    emp_phone: temp_phone,
                    emp_email: temp_email,
                    created_at: new Date().toISOString() // 현재 시간
                }
            ];
            console.log(updatedWorkerData)
            sessionStorage.setItem('workerData', JSON.stringify(updatedWorkerData)); // 세션 저장소에 저장

            // 세션 저장소에 저장된 데이터로 상태 업데이트
            setWorkerData(updatedWorkerData); // 상태 업데이트

            setIsModalOpen(false); // 모달 닫기
        } catch (error) {
            console.error("Failed to add worker:", error);
            alert("직원을 추가하는 데 실패했습니다. 다시 시도해주세요.");
        }
    };


    const btnAddWorker = () => {
        setIsModalOpen(true); // 모달 열기
    };
    return (
        <div style={{ width: "1600px" }}>
            <h2 style={{ margin: 0, marginRight: "20px" }}>직원관리</h2>
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
                    onClick={btnRemoveWorker}
                >
                    - 직원 삭제하기
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
                    onClick={btnAddWorker}
                >
                    + 직원 추가하기
                </span>
            </div>
            <div>
                <span>총 직원 수 : {workerData.length}</span>
                <hr />
                <div style={{ display: "flex", gap: "25px" }}>
                    <span style={{ width: "50px", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "25px" }}>
                        <input
                            type="checkbox"
                            onChange={(e) => setSelectedWorkers(e.target.checked ? workerData.map((w) => w.emp_id) : [])}
                            checked={selectedWorkers.length === workerData.length && workerData.length > 0}
                        />
                    </span>
                    <span style={{ width: "150px", textAlign: "right" }}>사원번호</span>
                    <span style={{ width: "150px", textAlign: "right" }}>이름</span>
                    <span style={{ width: "150px", textAlign: "right" }}>직책</span>
                    <span style={{ width: "150px", textAlign: "right" }}>입사일</span>
                    <span style={{ width: "150px", textAlign: "right" }}>조직</span>
                    <span style={{ width: "150px", textAlign: "right" }}>생년월일</span>
                    <span style={{ width: "150px", textAlign: "right" }}>연락처</span>
                    <span style={{ width: "200px", textAlign: "right" }}>전자우편</span>
                </div>
                <hr style={{ marginBottom: "25px" }} />
                <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
                    {/* 객체를 배열처리해줘야  map함수 사용 가능 */}
                    <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
                        {workerData.map(worker => workerLine(
                            worker.emp_id,
                            worker.emp_name,
                            worker.emp_role,
                            worker.emp_firstDate,
                            worker.emp_group,
                            worker.emp_birthDate,
                            worker.emp_phone,
                            worker.emp_email,))}
                    </div>
                </div>
            </div>
            <AddWorkerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddWorker} />
            <AddWorkerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddWorker} />
        </div>
    );
};

export default ManEmplyee;
