import React, { useState, useEffect } from "react";
import axios from "axios";

const ReqShiftChange = () => {
  const [empId, setEmpId] = useState(""); // ✅ emp_id 상태값
  const [origindate, setOrigindate] = useState(""); // 시작 날짜
  const [origintime, setOrigintime] = useState(""); // 시작 시간
  const [changedate, setChangedate] = useState(""); // 종료 날짜
  const [changetime, setChangetime] = useState(""); // 종료 시간
  const [reason, setReason] = useState(""); // 사유
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


  // ✅ emp_id가 변경될 때마다 콘솔에서 확인 !!!!!!!!! 체크할 때 다시 사용
  // useEffect(() => {
  //   console.log("현재 로그인된 직원 ID:", empId); // ✅ 콘솔 로그 추가
  // }, [empId]);

  // 신청하기 버튼 클릭 (DB 연결)
  const handleSubmit = async () => {
    console.log("✅ [프론트엔드] handleSubmit 실행됨"); // 클릭 확인

    if (!origindate || !origintime || !changedate || !changetime || !reason) {
      alert("모든 항목을 입력해 주세요!");
      return;
    }

    try {
      // 콘솔 확인용!!!!!!
      console.log("보낼 데이터:", {
        emp_id: empId, origin_date: origindate, origin_time: origintime,
        change_date: changedate, change_time: changetime, reason
      });

      // axios.post() 방식
      const response = await axios.post("/request/shifts", {
        req_idx: null,
        req_type: "근무변경", // type : 근무변경
        req_content: reason?.trim() ? reason : "사유 입력",
        emp_id: empId, // 사용자 ID
        origin_date: origindate,
        origin_time: origintime,
        change_date: changedate,
        change_time: changetime,
      });

      // 확인용!!!!!
      console.log("✅ [프론트엔드] 서버 응답:", response.data);

      // ✅ 성공적으로 전송되면 alert 창 띄우기
      alert(`근무 변경 신청 완료!`);


      // ✅ 입력값 초기화
      setOrigindate("");
      setOrigintime("");
      setChangedate("");
      setChangetime("");
      setReason("");
      setIsSubmitted(true); // 신청 완료 상태 변경

    } catch (error) {
      // 에러 처리
      console.error("❌ [프론트엔드] 요청 실패:", error);
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
          <input
            type="date"
            value={origindate}
            onChange={(e) => setOrigindate(e.target.value)}
            style={styles.input} />

          <select value={origintime}
            onChange={(e) => setOrigintime(e.target.value)}
            style={styles.select}>

            <option value="time">선택</option>
            <option>오픈</option>
            <option>미들</option>
            <option>마감</option>
          </select>
        </div>

        {/* 변경 요청 날짜 */}
        <div style={styles.inputRow}>
          <span>변경할 근무 날짜:</span>
          <input
            type="date"
            value={changedate}
            onChange={(e) => setChangedate(e.target.value)}
            style={styles.input} />

          <select
            value={changetime}
            onChange={(e) => setChangetime(e.target.value)}
            style={styles.select}>

            <option value="time">선택</option>
            <option>오픈</option>
            <option>미들</option>
            <option>마감</option>
          </select>
        </div>

        {/* 변경 사유 입력 */}
        <div style={styles.inputRow}>
          <span>사유:</span>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={styles.fullInput} />
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
