import React from 'react'

const AttAlert = () => {
  return (
    <div
            //key={index}
            style={{
                // display: "flex",
                // flexDirection: "column",
                // justifyContent: "center",
                // alignItems: "center",
                width: "500px",
                height: "400px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
                padding: "10px",
            }}
        >
            <div style={{
                fontSize: "20px"
            }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between", // 요소 간 동일한 간격 분배
                        alignItems: "center",
                        width: "100%", // 부모 컨테이너 전체 사용
                        height: "100px",
                    }}
                >
                    <div style={{ flex: 1, textAlign: "center" }}>
                        <span>이번 주 근무</span>
                        <br />
                        <br />
                        <span>1</span>
                    </div>
                    <div style={{ flex: 1, textAlign: "center" }}>
                        <span></span>
                        <br />
                        <br />
                        <span>0</span>
                    </div>
                </div>
            </div>

        </div>
  )
}

export default AttAlert