import React, { useState, useEffect } from "react";
import axios from "axios"; // axios 라이브러리

const ReqLeave = () => {
    const [empId, setEmpId] = useState(""); // ✅ emp_id 상태값
    const [startDate, setStartDate] = useState(""); // 시작 날짜
    const [endDate, setEndDate] = useState(""); // 종료 날짜
    const [days, setDays] = useState(0); // 신청 일수
    const [reason, setReason] = useState(""); // 사유
    const [type, setType] = useState("휴가"); // ✅ 휴가 유형
    const [isSubmitted, setIsSubmitted] = useState(false); // 신청 완료 상태

    // ✅ sessionStorage에서 직원 데이터 불러오기
    useEffect(() => {
        const aa = JSON.parse(sessionStorage.getItem("user")); // 현재 로그인한 유저
        const storedEmployeeData = JSON.parse(sessionStorage.getItem("employeeData")); // 현재 등록된 직원들

        //console.log('테스트1', aa)
        //console.log('테스트2', storedEmployeeData)

        const hrEmployees = storedEmployeeData.filter(emp => emp.emp_name === aa.name);
        //console.log("체크", hrEmployees); // emp_id 값만 담긴 배열 출력
        setEmpId(hrEmployees[0].emp_id)
    }, []);

    //✅ emp_id가 변경될 때마다 콘솔에서 확인 !!!!!!!!!
    // useEffect(() => {
    //     console.log("현재 로그인된 직원 ID:", empId); // ✅ 콘솔 로그 추가
    // }, [empId]);

    // 신청 일수 계산
    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = end - start;
            const diffDays = diffTime / (1000 * 60 * 60 * 24) + 1;
            setDays(diffDays > 0 ? diffDays : 0); // 음수 값 방지
        } else {
            setDays(0);
        }
    }, [startDate, endDate]);

    // 신청하기 버튼 클릭 (DB 연결)
    const handleSubmit = async () => {
        console.log("✅ [프론트엔드] handleSubmit 실행됨"); // 클릭 확인

        if (!startDate || !endDate || !reason) {
            alert("모든 항목을 입력해 주세요!");
            return;
        }

        if (days <= 0) {
            alert("올바른 날짜 범위를 선택하세요!");
            return;
        }

        try {
            // 콘솔 확인용!!!!!!
            console.log("보낼 데이터:", {
                emp_id: empId, start_date: startDate,
                end_date: endDate, reason, type
            });

            // axios.post() 방식
            const response = await axios.post("/request/leave", {
                req_idx: null,
                req_type: type, // 휴가 유형
                req_content: reason,
                emp_id: empId, // 로그인한 사용자 ID
                start_date: startDate,
                end_date: endDate,
            });

            // 확인용!!!!!
            console.log("✅ [프론트엔드] 서버 응답:", response.data);



            // ✅ 성공적으로 전송되면 alert 창 띄우기
            alert(`휴가 신청 완료! 상세 내용: ${response.data.detail}`);

            // ✅ 입력값 초기화
            setStartDate("");
            setEndDate("");
            setDays(0);
            setReason("");
            setType("휴가"); // ✅ 초기화 시 기본값 설정
            setIsSubmitted(true);

            setIsSubmitted(true); // 신청 완료 상태 변경
        } catch (error) {
            console.error("❌ [프론트엔드] 요청 실패:", error);
            alert("휴가 신청 실패! 다시 시도해 주세요.");
        }
    };

    return (
        <div style={styles.container}>
            <h3>휴가 / 병가 신청</h3>

            <div style={styles.formGroup}>
                <div style={styles.inputGroup}>
                    <label>휴가 유형:</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} style={styles.select}>
                        <option value="휴가">휴가</option>
                        <option value="병가">병가</option>
                    </select>
                </div>

                <div style={styles.inputGroup}>
                    <label>시작 날짜:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label>종료 날짜:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        style={styles.input}
                        min={startDate} // 종료 날짜가 시작 날짜보다 빠르지 않도록 제한
                    />
                </div>

                {/* 신청 일 수  */}
                <div style={styles.inputGroup}>
                    <label>신청일 수:</label>
                    <span style={styles.boldText}>{days} 일</span>
                </div>

                {/* 변경 사유 입력 */}
                <div style={styles.inputGroup}>
                    <label>사유:</label>
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        style={styles.fullInput}
                    />
                </div>

                {/* 신청 버튼 */}
                <button style={styles.button} onClick={handleSubmit}>
                    신청하기
                </button>
            </div>
        </div>
    );
};

// 스타일 객체
const styles = {
    container: {
        width: "450px",
        height: "300px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "10px", // 요소 간격 자동 조정
    },
    inputGroup: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    input: {
        width: "200px",
        padding: "5px",
    },
    fullInput: {
        width: "250px",
        padding: "5px",
    },
    select: {
        width: "250px",
        padding: "5px"
    },
    boldText: {
        width: "200px",
        textAlign: "right",
        fontWeight: "bold",
    },
    button: {
        width: "100%",
        padding: "10px 0",
        cursor: "pointer",
        backgroundColor: "#007BFF",
        color: "white",
        border: "none",
        borderRadius: "5px",
    },
};

export default ReqLeave;
