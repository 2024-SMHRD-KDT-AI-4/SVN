import { React, useState } from 'react'
import Modal from './AddWorkerModal'

const ManWorkers = () => {
    const [workerData, setWorkerData] = useState([
        ["241210001", "김예은", "팀장", "2024.12.10", "백엔드", "20010507", "010-0000-0000", "temp@gmail.com"],
        ["241210002", "안지운", "부팀장", "2024.12.10", "프론트엔드", "19991123", "010-0000-0000", "temp@gmail.com"],
        ["241210003", "김현웅", "사원", "2024.12.10", "프론트엔드", "19990120", "010-0000-0000", "temp@gmail.com"],
        ["241210004", "전석현", "사원", "2024.12.10", "백엔드", "19971226", "010-0000-0000", "temp@gmail.com"],
        ["241210005", "김민정", "사원", "2024.12.10", "백엔드", "19930421", "010-0000-0000", "temp@gmail.com"],
        ["241210006", "강인오", "사원", "2024.12.10", "프론트엔드", "19910225", "010-0000-0000", "kanginoh@gmail.com"],
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const workerLine = (code, name, role, firstDate, group, birthDate, phone, email) => {
        return (
            <div>
                <div style={{ display: "flex", gap: "25px" }}>
                    <span style={{ width: "200px", textAlign: "right" }}>{code}</span>
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
    const handleAddWorker = (newWorker) => {
        setWorkerData([
            ...workerData,
            [
                `25030600${workerData.length + 1}`, // 새로운 직원번호
                newWorker.name || `새직원${workerData.length + 1}`, // 이름
                newWorker.position || "사원", // 직책
                newWorker.joinDate || "2025.03.06", // 입사일
                newWorker.department || "부서 없음", // 조직
                newWorker.dob || "19900000", // 생년월일
                newWorker.phone || "010-0000-0000", // 연락처
                newWorker.email || "newworker@gmail.com", // 이메일
            ],
        ]);
        setIsModalOpen(false); // 모달 닫기
    };

    const btnAddWorker = () => {
        setIsModalOpen(true); // 모달 열기
    };
    return (
        <div style={{ width: "1600px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ margin: 0 }}>직원관리</h2>
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
                    }}
                    onClick={btnAddWorker}
                >
                    + 직원 추가하기
                </span>
            </div>
            <div>
                <span>총 직원 수 {workerData.length}</span>
                <hr />
                <div style={{ display: "flex", gap: "25px" }}>
                    <span style={{ width: "200px", textAlign: "right" }}>사원번호</span>
                    <span style={{ width: "150px", textAlign: "right" }}>이름</span>
                    <span style={{ width: "150px", textAlign: "right" }}>직책</span>
                    <span style={{ width: "150px", textAlign: "right" }}>입사일</span>
                    <span style={{ width: "150px", textAlign: "right" }}>조직</span>
                    <span style={{ width: "150px", textAlign: "right" }}>생년월일</span>
                    <span style={{ width: "150px", textAlign: "right" }}>연락처</span>
                    <span style={{ width: "200px", textAlign: "right" }}>전자우편</span>
                </div>
                <hr style={{ marginBottom: "25px" }} />
                {/* 실질적인 직원 표시 */}
                <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
                    {workerData.map(worker => workerLine(worker[0], worker[1], worker[2], worker[3], worker[4], worker[5], worker[6], worker[7]))}
                </div>
            </div>
            {/* AddWorkerModal 컴포넌트를 렌더링 */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)} // 모달 닫기
                onSubmit={handleAddWorker} // 모달에서 직원 추가하기
            />
        </div>
    )
}

export default ManWorkers