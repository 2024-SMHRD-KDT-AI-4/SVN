import { React, useState, useEffect } from 'react';
import axios from 'axios'; // axios를 사용하여 서버로부터 데이터 가져오기
import Modal from '../modals/VacationModal';
//import { Button } from '@mui/material';

const ManShift = () => {
    const [shiftData, setShiftData] = useState([]);
    const [empId, setEmpId] = useState("");
    const [selectedWorks, setSelectedVacations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ code: null, result: null, select: null });

    useEffect(() => {
        const storedShifts = sessionStorage.getItem('shfitData');
        let parsedData = null;
        try {
            parsedData = JSON.parse(storedShifts);
            setShiftData(parsedData);
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    }, []);

    useEffect(() => {
        const aa = JSON.parse(sessionStorage.getItem("user"));
        // const storedEmployeeData = JSON.parse(sessionStorage.getItem("employeeData"));

        //const hrEmployees = storedEmployeeData.filter(emp => emp.emp_name === aa.name);
        setEmpId(aa.id);
    }, []);

    useEffect(() => {
        if (modalData.code !== null) {
            console.log('변경된 근무변경 코드 : ', modalData.code, ' 변경된 처리내용 : ', modalData.result, ' 변경된 처리 결정 : ', modalData.select)
            setIsModalOpen(true); // modalData가 변경되면 모달을 열도록 설정
        }
    }, [modalData]); // modalData가 변경될 때마다 실행

    const vacationLine = (vCode, vType, vEmp, vStart, vEnd, vContent, vStatus, vAdminID, vApproval, vFinal) => {
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
                    {vStatus === "N" ?
                        <span style={{ width: "140px", textAlign: "right" }}>
                            <button onClick={() => btnReviewVacation(vCode, "승인", true)}>승인</button>
                            <button onClick={() => btnReviewVacation(vCode, "반려", false)}>반려</button>
                        </span> :
                        <span style={{ width: "140px", textAlign: "right" }}>{vFinal}</span>
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

    const btnReviewVacation = (code, decision, select) => {
        //console.log('전달된 휴가코드:',code, ' 전달된 처리내용 : ', decision ,' 전달된 처리 결정 : ', select);
        setModalData({ code, decision, select }); // 휴가 ID와 select 값 전달
    };

    const handleVacation = async (code, decision, confirm) => {
        console.log(`휴가번호 ${code}의 ${decision} 처리 ${confirm === true ? "허가" : "취소"}`)

        if (!confirm) {
            //console.log("삭제가 취소됨");
            return; // 아무 동작도 하지 않음
        }

        try {
            // 서버에 삭제 요청
            const response = await axios.post("/management/checkVacation", { ids: code, what: decision, who: empId });
            //console.log("서버에 보낸 데이터:", selectedGroups);

            // 서버 응답 확인
            const returnData = response.data;
            console.log("서버에서 받은 데이터:", returnData.data[0]); // 배열로 넘어옴

            // 응답이 성공적일 경우
            if (response.status === 200) {
                // 상태 업데이트

                const savedVacData = JSON.parse(sessionStorage.getItem("vacationData"))

                console.log('현재 저장되어 있는 휴가 데이터 :', savedVacData)

                // 전체 덮기 로직
                const index = savedVacData.findIndex(request => request.req_idx === returnData.data[0].req_idx);
                if (index !== -1) {
                    savedVacData[index] = returnData.data[0]; // 전체 교체
                }

                console.log('처리된 휴가 데이터', savedVacData);

                sessionStorage.setItem('vacationData', JSON.stringify(savedVacData)); // 세션 저장소에 저장

                const updatingVacations = sessionStorage.getItem('vacationData');
                let parsedData = null;
                try {
                    parsedData = JSON.parse(updatingVacations);
                    setShiftData(parsedData);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }

                setIsModalOpen(false); // 모달 닫기
            } else {
                console.error("서버 응답 오류:", response.data);
                alert("휴가 처리 요청이 실패했습니다. 서버의 응답을 확인하세요.");
            }
        } catch (error) {
            console.error("직원 삭제 요청 중 오류 발생:", error);
            alert("휴가를 처리하는 데 실패했습니다. 네트워크 상태를 확인하고 다시 시도해주세요.");
        }




        // 처리 로직을 여기에 추가 (예: 서버로 승인/반려 데이터 전송)
    };

    return (
        <div style={{ width: "1600px" }}>
            <h2 style={{ margin: 0, marginRight: "20px" }}>휴가관리</h2>

            <div>
                <span>총 휴가요청 수 : {shiftData.length}</span>
                <hr />
                <div style={{ display: "flex", gap: "25px" }}>
                    <span style={{ width: "50px", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "25px" }}>
                        <input
                            type="checkbox"
                            onChange={(e) => setSelectedVacations(e.target.checked ? shiftData.map((w) => w.req_idx) : [])}
                            checked={selectedWorks.length === shiftData.length && shiftData.length > 0}
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
                    {shiftData.map(vac => vacationLine(vac.req_idx, vac.req_type, vac.emp_id, vac.start_date, vac.end_date, vac.req_content, vac.req_status, vac.approved_at, vac.admin_id, vac.req_final))}
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} code={modalData.code} decision={modalData.decision} onSubmit={handleVacation} />
        </div>
    );
};

export default ManShift;
