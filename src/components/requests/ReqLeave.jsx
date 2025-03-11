import React, { useState, useEffect } from "react";

const ReqLeave = () => {
    const [startDate, setStartDate] = useState(""); // 시작 날짜
    const [endDate, setEndDate] = useState(""); // 종료 날짜
    const [days, setDays] = useState(0); // 신청 일수
    const [reason, setReason] = useState(""); // 사유
    const [isSubmitted, setIsSubmitted] = useState(false); // 신청 완료 상태

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
        if (!startDate || !endDate || !reason) {
            alert("모든 항목을 입력해 주세요!");
            return;
        }

        if (days <= 0) {
            alert("올바른 날짜 범위를 선택하세요!");
            return;
        }

        try {
            const response = await fetch("https://your-api-endpoint.com/leave", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    startDate,
                    endDate,
                    days,
                    reason,
                }), // ✅ 입력 데이터 전송
            });

            if (!response.ok) {
                throw new Error("서버 오류 발생! 다시 시도해 주세요.");
            }

            const result = await response.json();

            // ✅ 성공적으로 전송되면 alert 창 띄우기
            alert(`휴가 신청 완료! 신청 ID: ${result.id}`);

            // ✅ 입력값 초기화
            setStartDate("");
            setEndDate("");
            setDays(0);
            setReason("");

            setIsSubmitted(true); // 신청 완료 상태 변경
        } catch (error) {
            console.error("휴가 신청 실패:", error);
            alert("휴가 신청 실패! 다시 시도해 주세요.");
        }
    };

    return (
        <div style={styles.container}>
            <h3>휴가 / 병가 신청</h3>

            <div style={styles.formGroup}>
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

                <div style={styles.inputGroup}>
                    <label>신청 일수:</label>
                    <span style={styles.boldText}>{days} 일</span>
                </div>

                <div style={styles.inputGroup}>
                    <label>사유:</label>
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        style={styles.fullInput}
                    />
                </div>

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
        gap: "15px", // 요소 간격 자동 조정
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
