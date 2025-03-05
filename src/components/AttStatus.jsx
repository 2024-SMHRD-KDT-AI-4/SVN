import React from 'react'

const AttStatus = (index = 0) => {
    return (
        <div
            key={index}
            style={{
                // display: "flex",
                // flexDirection: "column",
                // justifyContent: "center",
                // alignItems: "center",
                width: "500px",
                height: "100px",
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
                        flexDirection: "row",
                        justifyContent: "space-between", // 요소 간 동일한 간격 분배
                        alignItems: "center",
                        width: "100%", // 부모 컨테이너 전체 사용
                        height: "100px",
                    }}
                >
                    <div style={{ flex: 1, textAlign: "center" }}>
                        <span>지각</span>
                        <br />
                        <br />
                        <span>1</span>
                    </div>
                    <hr
                        style={{
                            border: "none",
                            borderLeft: "2px solid grey", // 선의 두께와 색상
                            height: "80%", // 수직선의 길이
                            margin: "0", // 수직선의 가운데 정렬
                        }}
                    />
                    <div style={{ flex: 1, textAlign: "center" }}>
                        <span>조퇴</span>
                        <br />
                        <br />
                        <span>0</span>
                    </div>
                    <hr
                        style={{
                            border: "none",
                            borderLeft: "2px solid grey", // 선의 두께와 색상
                            height: "80%", // 수직선의 길이
                            margin: "0", // 수직선의 가운데 정렬
                        }}
                    />
                    <div style={{ flex: 1, textAlign: "center" }}>
                        <span>결근</span>
                        <br />
                        <br />
                        <span>0</span>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AttStatus