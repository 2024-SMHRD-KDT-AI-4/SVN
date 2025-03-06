import React from "react";
import ReqLeave from "./ReqLeave";

const ReqComplete = ({startDate, endDate, days, reason}) => {
    return (
        <div style={{
            width: "350px",
            padding: "30px",
            border: "2px solid black",
            margin: "20px",
            borderRadius: "5px",
            position: "relative",
            fontFamily: "Arial, sans-serif"
        }}>
            {/* 상단 제목 */}
            <div style={{
                position: "absolute",
                top: "-12px",
                left: "10px",
                backgroundColor: "white",
                padding: "0 5px",
                fontWeight: "bold"
            }}>
                휴가 신청 완료
            </div>

            {/* 내용 영역 */}
            <div style={{
                width: "100%",
                height: "80px",
                border: "1px solid black",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center"
            }}>
            {`${startDate} ~ ${endDate} (${days}일) 사유: ${reason}`}
            </div>

            {/* 버튼 영역 */}
            <div style={{
                display: "flex",
                justifyContent: "space-between"
            }}>
                <button style={{
                    width: "45%",
                    padding: "5px 0",
                    backgroundColor: "#ddd",
                    border: "1px solid black",
                    cursor: "pointer"
                }}>수정</button>

                <button style={{
                    width: "45%",
                    padding: "5px 0",
                    backgroundColor: "#ffcccc",
                    border: "1px solid black",
                    cursor: "pointer"
                }}>삭제</button>
            </div>
        </div>
    );
}

export default ReqComplete;
