import React, { useState } from "react";

const ReqShiftChange = () => {
  const [form, setForm] = useState({
    origin: "",
    originTm: "",
    shift: "",
    shiftTm: "",
    reason: "",
  });

  // 입력 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 버튼 활성화 조건
  const isFormValid = Object.values(form).every((val) => val.trim() !== "");

  const handleSubmit = async () => {
    if (!isFormValid) {
      alert("모든 항목을 입력해 주세요!");
      return;
    }

    try {
      const response = await fetch("https://your-api-endpoint.com/shifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form), // ✅ form 데이터 DB로 전송
      });

      if (!response.ok) {
        throw new Error("서버 오류 발생! 다시 시도해 주세요.");
      }

      const result = await response.json();

      // ✅ 성공적으로 전송되면 alert 창 띄우기
      alert(`근무 변경 요청 완료! 요청 ID: ${result.id}`);

      // ✅ 입력값 초기화
      setForm({
        origin: "",
        originTm: "",
        shift: "",
        shiftTm: "",
        reason: "",
      });
    } catch (error) {
      // 에러 처리
      console.error("근무 변경 요청 실패:", error);
      alert("근무 변경 요청 실패! 다시 시도해 주세요.");
    }
  };

  return (
    <div style={styles.container}>
      <h3>근무 변경 요청</h3>

      <div style={styles.formGroup}>
        {/* 기존 근무 날짜 */}
        <div style={styles.inputRow}>
          <span>기존 근무 날짜:</span>
          <input type="date" name="origin" value={form.origin} onChange={handleChange} style={styles.input} />
          <select name="originTm" value={form.originTm} onChange={handleChange} style={styles.select}>
            <option value="">선택</option>
            <option>오픈</option>
            <option>미들</option>
            <option>마감</option>
          </select>
        </div>

        {/* 변경 요청 날짜 */}
        <div style={styles.inputRow}>
          <span>변경할 근무 날짜:</span>
          <input type="date" name="shift" value={form.shift} onChange={handleChange} style={styles.input} />
          <select name="shiftTm" value={form.shiftTm} onChange={handleChange} style={styles.select}>
            <option value="">선택</option>
            <option>오픈</option>
            <option>미들</option>
            <option>마감</option>
          </select>
        </div>

        {/* 변경 사유 입력 */}
        <div style={styles.inputRow}>
          <span>사유:</span>
          <input type="text" name="reason" value={form.reason} onChange={handleChange} style={styles.fullInput} />
        </div>

        {/* 신청 버튼 */}
        <button style={styles.button} onClick={handleSubmit} disabled={!isFormValid}>
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
        gap: "12px", // ✅ 요소 간 간격 자동 조정 (marginBottom 제거)
      },
    inputRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "10px",
    },
    input: {
        width: "180px",
        padding: "5px",
    },
    select: {
        width: "80px",
        padding: "5px",
    },
    fullInput: {
        width: "250px",
        padding: "5px",
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

export default ReqShiftChange;
