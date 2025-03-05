import React from 'react'

const AttVacation = () => {
    return (
        <div
            //key={index}
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
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%", // 부모 컨테이너 전체 사용
                        height: "100px",
                    }}
                >
                    {/* 잔여휴가 영역 */}
                    <div style={{ flex: 1, textAlign: "center" }}>
                        <div>잔여휴가</div>
                        <br />
                        <span>13일 5시간</span>
                    </div>

                    {/* 수직선 */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%", // 부모 컨테이너의 전체 높이 사용
                        }}
                    >
                        <hr
                            style={{
                                border: "none",
                                borderLeft: "2px solid grey", // 두께와 색상
                                height: "80%", // 수직선의 길이
                            }}
                        />
                    </div>


                    {/* 휴가신청 버튼 */}
                    <div style={{ flex: 1, textAlign: "center" }}>
                        <button>휴가신청</button>
                    </div>
                </div>


            </div>

        </div>
    )
}

export default AttVacation