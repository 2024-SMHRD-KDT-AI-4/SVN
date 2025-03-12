import { React, useState, useEffect } from "react";
import AddWorkerModal from "../modals/AddWorkerModal";
//import DeleteWorkerModal from "../modals/DeleteWorkerModal";
import DeleteConfirmModal from "../modals/DeleteConfirmModal";
import axios from 'axios'; // axios를 사용하여 서버로부터 데이터 가져오기
const ManEmplyee = () => {
    const [employeeData, setEmployeeData] = useState([{}]);
    const [selectedEmployees, setSelectedEmployees] = useState([]); // 체크된 직원들의 ID를 관리
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDltModalOpen, setIsDltModalOpen] = useState(false);

    useEffect(() => {
        const storedEmployees = sessionStorage.getItem('employeeData'); // 저장된 사용자 정보 가져오기
        //console.log("한번실행")
        //console.log(storedEmployees)
        let parsedData = null;

        if (storedEmployees) {
            // storedWorkers가 항상 JSON 문자열로 들어온다고 가정
            parsedData = JSON.parse(storedEmployees);
            //console.log("일반조직데이터 :", parsedData);

            // 상태 업데이트
            setEmployeeData(parsedData);
        }
    }, []);

    const handleCheckboxChange = (code) => {
        setSelectedEmployees((prev) =>
            prev.includes(code)
                ? prev.filter((id) => id !== code) // 이미 체크된 경우 제거
                : [...prev, code] // 체크되지 않은 경우 추가
        );
    };
    //////////////////////////////////////////////////////////////////////


    const employLine = (id, name, role, firstDate, group, birthDate, phone, email) => {
        //console.log(id, name, role, firstDate, group, birthDate, phone, email)
        return (
            <div>
                <div style={{ display: "flex", gap: "25px" }}>
                    <span style={{ width: "50px", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "25px" }}>
                        <input
                            type="checkbox"
                            checked={selectedEmployees.includes(id)} // 체크 상태 관리
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

    const handleAddEmployee = async (newEmployee) => {

        // 새로운 직원 정보 변수 선언
        let temp_employeeId = `250306${(employeeData.length + 1 > 99 ? "" : employeeData.length + 1 > 9 ? "0" : "00")}` + `${employeeData.length + 1}`; // 직원번호 변수
        let temp_name = `${newEmployee.name}${employeeData.length + 1}` || `테스트맨`; // 이름 변수
        let temp_position = newEmployee.position || "테스트"; // 직책 변수
        let temp_joinDate = newEmployee.joinDate || "2025.03.06"; // 입사일 변수
        let temp_department = newEmployee.department || "테스트부서"; // 조직 변수
        let temp_dob = newEmployee.dob || "2025.03.06"; // 생년월일 변수
        let temp_phone = newEmployee.phone || "010-1234-5678"; // 연락처 변수
        let temp_email = newEmployee.email || "newworker@com"; // 이메일 변수

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
            const returnData = response.data;
            console.log("서버에서 받은 데이터:", returnData);

            // 새로운 직원 데이터를 세션 저장소에 먼저 저장
            const updatedEmployeeData = [
                ...employeeData,
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
            //console.log(updatedWorkerData)
            sessionStorage.setItem('employeeData', JSON.stringify(updatedEmployeeData)); // 세션 저장소에 저장

            // 세션 저장소에 저장된 데이터로 상태 업데이트
            setEmployeeData(updatedEmployeeData); // 상태 업데이트

            setIsAddModalOpen(false); // 모달 닫기
        } catch (error) {
            console.error("Failed to add worker:", error);
            alert("직원을 tkrwp하는 데 실패했습니다. 다시 시도해주세요.");
        }
    };
    const handleDeleteWorker = async (confirm) => {
        if (!confirm) {
            //console.log("삭제가 취소됨");
            return; // 아무 동작도 하지 않음
        }

        try {
            // 서버에 삭제 요청
            const response = await axios.post("/management/dltEmployees", { ids: selectedEmployees });
            //console.log("서버에 보낸 데이터:", selectedWorkers);

            // 서버 응답 확인
            const returnData = response.data;
            console.log("서버에서 받은 데이터:", returnData);

            // 응답이 성공적일 경우
            if (response.status === 200) {
                // 상태 업데이트
                const updatedWorkerData = employeeData.filter((worker) => !selectedEmployees.includes(worker.emp_id));
                //console.log("업데이트된 직원 데이터:", updatedWorkerData);

                sessionStorage.setItem('employeeData', JSON.stringify(updatedWorkerData)); // 세션 저장
                setEmployeeData(updatedWorkerData); // React 상태 업데이트
                setSelectedEmployees([]); // 선택 초기화
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
    const btnAddEmployee = () => {
        setIsAddModalOpen(true); // 추가 모달 열기
    };
    const btnRemoveEmployee = () => {
        if (selectedEmployees.length === 0) {
            return // 선택된 것이 없음으로 빠져나가기
        }
        setIsDltModalOpen(true); // 삭제 모달 열기

    };
    /////////////////////////////////////////

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
                    onClick={btnRemoveEmployee}
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
                    onClick={btnAddEmployee}
                >
                    + 직원 추가하기
                </span>
            </div>
            <div>
                <span>총 직원 수 : {employeeData.length}</span>
                <hr />
                <div style={{ display: "flex", gap: "25px" }}>
                    <span style={{ width: "50px", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "25px" }}>
                        <input
                            type="checkbox"
                            onChange={(e) => setSelectedEmployees(e.target.checked ? employeeData.map((employee) => employee.emp_id) : [])}
                            checked={selectedEmployees.length === employeeData.length && employeeData.length > 0}
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
                        {employeeData?.map(worker => employLine(
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
            <AddWorkerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddEmployee} />
            {/* <DeleteWorkerModal isOpen={isDltModalOpen} onClose={() => setIsDltModalOpen(false)} onSubmit={handleDeleteWorker} /> */}
            <DeleteConfirmModal isOpen={isDltModalOpen} onClose={() => setIsDltModalOpen(false)} onSubmit={handleDeleteWorker} isType={"직원"} />
        </div>
    );
};

export default ManEmplyee;
