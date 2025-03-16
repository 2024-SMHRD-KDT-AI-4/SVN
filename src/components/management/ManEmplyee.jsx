import { React, useState, useEffect } from "react";
import AddWorkerModal from "../modals/AddWorkerModal";
import DeleteConfirmModal from "../modals/DeleteConfirmModal";
import axios from 'axios';
import io from 'socket.io-client'; // ⭐️ 추가됨

const ManEmplyee = () => {
    const [employeeData, setEmployeeData] = useState([{}]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDltModalOpen, setIsDltModalOpen] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const storedEmployees = sessionStorage.getItem('employeeData');
        let parsedData = null;
        if (storedEmployees) {
            parsedData = JSON.parse(storedEmployees);
            setEmployeeData(parsedData);
        }

        const newSocket = io("http://localhost:5067");
        setSocket(newSocket);

        newSocket.on('faceResult', (data) => {
            if (data.success) alert(`얼굴 인식 성공: ${data.wo_id}`);
            else alert(`얼굴 인식 실패: ${data.message}`);
        });

        return () => newSocket.disconnect();
    }, []);

    const handleAddEmployee = async (newEmployee) => {
        // 그대로 두기
    };

    const handleDeleteWorker = async (confirm) => {
        // 그대로 두기
    };

    const btnAddEmployee = () => setIsAddModalOpen(true);
    const btnRemoveEmployee = () => {
        if (selectedEmployees.length === 0) return;
        setIsDltModalOpen(true);
    };
    const btnAddFace = () => {
        if (socket) {
            socket.emit('faceCheck');
            alert("직원 얼굴 인식이 시작됩니다. 잠시만 기다려 주세요.");
        } else {
            alert("서버 연결 오류");
        }
    };

    const handleCheckboxChange = (code) => {
        setSelectedEmployees((prev) =>
            prev.includes(code)
                ? prev.filter((id) => id !== code)
                : [...prev, code]
        );
    };

    const employLine = (id, name, role, firstDate, group, birthDate, phone, email) => (
        <div>
            <div style={{ display: "flex", gap: "25px" }}>
                <span style={{ width: "50px", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "25px" }}>
                    <input
                        type="checkbox"
                        checked={selectedEmployees.includes(id)}
                        onChange={() => handleCheckboxChange(id)}
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

    return (
        <div style={{ width: "1600px" }}>
            <h2 style={{ margin: 0, marginRight: "20px" }}>직원관리</h2>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "20px", marginRight: "50px" }}>
                <span style={buttonStyle} onClick={btnRemoveEmployee}>- 직원 삭제하기</span>
                <span style={buttonStyle} onClick={btnAddEmployee}>+ 직원 추가하기</span>
                <span style={buttonStyle} onClick={btnAddFace}>+ 직원 얼굴 등록하기</span>
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
                    {employeeData?.map(worker => employLine(
                        worker.emp_id, worker.emp_name, worker.emp_role, worker.emp_firstDate,
                        worker.emp_group, worker.emp_birthDate, worker.emp_phone, worker.emp_email
                    ))}
                </div>
            </div>
            <AddWorkerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddEmployee} />
            <DeleteConfirmModal isOpen={isDltModalOpen} onClose={() => setIsDltModalOpen(false)} onSubmit={handleDeleteWorker} isType={"직원"} />
        </div>
    );
};

const buttonStyle = { display: "inline-block", padding: "10px 20px", backgroundColor: "#007BFF", color: "#fff", borderRadius: "5px", cursor: "pointer", textAlign: "center", fontSize: "14px", fontWeight: "bold", marginLeft: "10px" };

export default ManEmplyee;
