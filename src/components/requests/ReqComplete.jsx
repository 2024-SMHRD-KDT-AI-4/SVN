import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const ReqComplete = () => {
    const [requests, setRequests] = useState([]);
    const [empId, setEmpId] = useState(""); // ✅ emp_id 상태값

    // ✅ sessionStorage에서 직원 데이터 불러오기
    useEffect(() => {
        const aa = JSON.parse(sessionStorage.getItem("user")); // 현재 로그인한 유저
        const storedEmployeeData = JSON.parse(sessionStorage.getItem("employeeData")); // 현재 등록된 직원들

        // console.log('테스트c', aa)
        // console.log('테스트c2', storedEmployeeData)

        const hrEmployees = storedEmployeeData.filter(emp => emp.emp_name === aa.name);
        // console.log("체크c", hrEmployees); // emp_id 값만 담긴 배열 출력

        setEmpId(hrEmployees[0].emp_id)
    }, []);


    // ✅ emp_id가 변경될 때마다 콘솔에서 확인 !!!!!!!!! 체크할 때 다시 사용
    useEffect(() => {
        //console.log("현재 로그인된 직원 ID(C):", empId); 

        if (!empId) {
            //console.log("첫 렌더링! 재렌더링 시작")
            //console.log("❌ empId가 없습니다. API 호출 중단");
            return;
        }

        //console.log(`📡 API 호출: /api/list/${empId}`); // 디버깅용 로그 추가

        const fetchVacationData = async () => {
            //console.log("휴가 데이터 가져오기")
            try {
                // 서버에 GET 요청을 보내 휴가 데이터를 가져옴
                const response = await axios.post('request/list/getlist', { ids: empId });
                //console.log("mysql에서온 따끈한 결과", response.data.data);
                setRequests(response.data.data);
            }
            catch (error) {
                console.error("❌ 데이터 불러오기 실패:", error)
            }
        }

        fetchVacationData();
    }, [empId]);




    return (
        <div>
            {requests.length > 0 ? (
                requests.map((req, index) => (
                    <div style={styles.container}>
                        <div key={index} style={styles.requestBox}>
                            {req.req_type === "근무변경" ? (
                                // 근무변경일 경우: 날짜 + 시간 포함
                                <div>
                                <span>
                                    🔄{req.req_type} : {dayjs(req.origin_date).format("YYYY-MM-DD")} {req.origin_time}
                                    ➝ {dayjs(req.change_date).format("YYYY-MM-DD")} {req.change_time}
                                </span>
                                <p>(사유: {req.req_content})</p>
                                </div>
                                
                            ) : (
                                // 병가/휴가일 경우: 일반 날짜 표시
                                <div>
                                    <span>
                                        ⏸{req.req_type} : {dayjs(req.start_date).format("YYYY-MM-DD")} ~
                                        {dayjs(req.end_date).format("YYYY-MM-DD")}
                                    </span>
                                    <p>(사유: {req.req_content})</p>
                                </div>
                            )}

                        </div>
                    </div>
                ))
            ) : (
                <p style={styles.noData}>📭 요청 내역이 없습니다.</p>
            )
            }
        </div>
    )
};
// 스타일 객체 정리
const styles = {
    container: {
        // display: "flex", // ✅ Flexbox 사용
        flexDirection: "column", // ✅ 세로 정렬
        // alignItems: "center", // ✅ 중앙 정렬
        width: "100%", // ✅ 부모 크기에 맞추기
        maxWidth: "350px", // ✅ 너무 크지 않도록 설정
        margin: "5px auto", // ✅ 자동 정렬 (위아래 간격 추가)
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(12, 11, 11, 0.1)",
        backgroundColor: "#fafafa",
    },
    requestBox: {
        // width: "100%", // ✅ 부모 크기에 맞춤
        minWidth: "200px", // ✅ 최소 크기 설정
        border: "1px solid lightgray",
        padding: "10px",
        borderRadius: "10px",
        textAlign: "center",
        wordBreak: "break-word", // ✅ 긴 텍스트 자동 줄바꿈
    },
    noData: {
        textAlign: "center",
        color: "#888",
    }
};
export default ReqComplete;
