import React from "react";
import ReqLeave from "./ReqLeave";

// ReqLeave.jsx에 보낼 변수값 4가지 설정
const ReqComplete = ({ startDate, endDate, days, reason, confirm }) => {
    return (
        <div style={{
            width: "400px",
            // height: "650px",
            gap: "20px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(12, 11, 11, 0.1)",
            backgroundColor: "#fafafa",
            padding: "10px",
        }}>

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

                {/* {confirm === true && (
                    <>
                        <button
                            style={{
                                width: "45%",
                                padding: "5px 0",
                                backgroundColor: "#ddd",
                                border: "1px solid black",
                                cursor: "pointer",
                            }}
                        >
                            수정
                        </button>

                        <button
                            style={{
                                width: "45%",
                                padding: "5px 0",
                                backgroundColor: "#ffcccc",
                                border: "1px solid black",
                                cursor: "pointer",
                            }}
                        >
                            삭제
                        </button>
                    </>
                )
                } */}
            </div>
        </div>
    )
}
export default ReqComplete;
