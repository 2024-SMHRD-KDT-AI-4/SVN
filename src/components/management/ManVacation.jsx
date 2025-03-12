import { React, useState, useEffect } from 'react';
import Modal from '../modals/VacationModal';
import { Button } from '@mui/material';

const ManVacation = () => {
    const [vacationData, setVacationData] = useState([]);
    const [empId, setEmpId] = useState("");
    const [selectedWorks, setSelectedVacations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ code: null, select: null });

    useEffect(() => {
        const storedVacations = sessionStorage.getItem('vacationData');
        let parsedData = null;
        try {
            parsedData = JSON.parse(storedVacations);
            setVacationData(parsedData);
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    }, []);

    useEffect(() => {
        const aa = JSON.parse(sessionStorage.getItem("user"));
        const storedEmployeeData = JSON.parse(sessionStorage.getItem("employeeData"));

        const hrEmployees = storedEmployeeData.filter(emp => emp.emp_name === aa.name);
        setEmpId(hrEmployees[0].emp_id);
    }, []);

    useEffect(() => {
        if (modalData.code !== null) {
            console.log(modalData.code, modalData.select)
            setIsModalOpen(true); // modalData가 변경되면 모달을 열도록 설정
        }
    }, [modalData]); // modalData가 변경될 때마다 실행

    const vacationLine = (vCode, vType, vEmp, vStart, vEnd, vContent, vStatus, vAdminID, vApproval) => {
        return (
            <div>
                <div style={{ display: "flex", gap: "25px" }}>
                    <span style={{ width: "50px", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "25px" }}>
                        <input
                            type="checkbox"
                            checked={selectedWorks.includes(vCode)}
                            onChange={() => handleCheckboxChange(vCode)}
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
                    {vStatus === "N" && 
                    <span style={{ width: "140px", textAlign: "right" }}>
                        <button onClick={() => btnReviewVacation(vCode, true)}>승인</button>
                        <button onClick={() => btnReviewVacation(vCode, false)}>반려</button>
                    </span>
                    }
                </div>
                <hr />
            </div>
        );
    };

    const handleCheckboxChange = (code) => {
        setSelectedVacations((prev) =>
            prev.includes(code)
                ? prev.filter((id) => id !== code)
                : [...prev, code]
        );
    };

    const btnReviewVacation = (code, select) => {
        console.log(code, select);
        setModalData({ code, select }); // 휴가 ID와 select 값 전달
    };

    const handleVacation = (code, result) => {
        console.log(`휴가번호 ${code}의 ${result} 처리`)
        setIsModalOpen(false); // 모달 닫기
        // 처리 로직을 여기에 추가 (예: 서버로 승인/반려 데이터 전송)
    };

    return (
        <div style={{ width: "1600px" }}>
            <h2 style={{ margin: 0, marginRight: "20px" }}>휴가관리</h2>
            <hr />
            <div>
                <span>총 휴가요청 수 : {vacationData.length}</span>
                <hr />
                <div style={{ display: "flex", gap: "25px" }}>
                    <span style={{ width: "50px", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "25px" }}>
                        <input
                            type="checkbox"
                            onChange={(e) => setSelectedVacations(e.target.checked ? vacationData.map((w) => w.req_idx) : [])}
                            checked={selectedWorks.length === vacationData.length && vacationData.length > 0}
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
                <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
                    {vacationData.map(work => vacationLine(work.req_idx, work.req_type, work.emp_id, work.start_date, work.end_date, work.req_content, work.req_status, work.approved_at, work.admin_id))}
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} code={modalData.code} select={modalData.select} onSubmit={handleVacation} />
        </div>
    );
};

export default ManVacation;
