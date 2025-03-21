import React from 'react';

const AttWorktime = ({ day, time }) => {
    // 총 근무시간 계산 함수
    const timeResult = (income) => {
        let hour = Math.floor(income / 60); // 시간 계산
        let minute = income % 60; // 분 계산

        return { h: hour, m: minute };
    };

    // JSX 내부에서 직접 함수 실행 대신 계산된 값을 변수로 저장
    const workTime = timeResult(time);

    return (
        <div
            // key={index}
            style={{
                // display: "flex",
                // flexDirection: "column",
                // justifyContent: "center",
                // alignItems: "center",
                width: "400px",
                height: "100px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
                padding: "10px",
            }}
        >
            <div style={{ fontSize: "20px" }}>
                <div
                    style={{
                        display: "flex", // flex 레이아웃 사용
                        flexDirection: "row", // 가로 방향으로 정렬
                        justifyContent: "space-between", // 항목들 간의 간격을 균등하게 분배
                        alignItems: "center", // 세로 중앙 정렬
                        width: "100%", // 부모 컨테이너의 전체 너비 사용
                        height: "100px", // 부모 컨테이너 높이 설정
                    }}
                >
                    {/* 근무일수 영역 */}
                    <div style={{ flex: 1, textAlign: "center" }}>
                        <span>근무일수</span>
                        <br />
                        <span>{day}일</span>
                    </div>

                    {/* 수직선 */}
                    <div
                        style={{
                            display: "flex", // flex 레이아웃을 사용해 수직선 중앙 정렬
                            justifyContent: "center", // 수직선 가로 방향 중앙 정렬
                            alignItems: "center", // 수직선 세로 방향 중앙 정렬
                            flex: 0.1, // 수직선이 차지할 최소 비율 설정
                        }}
                    >
                    </div>
                    <hr
                        style={{
                            border: "none",
                            borderLeft: "2px solid grey", // 선의 두께와 색상
                            height: "80%", // 수직선의 길이
                            margin: "0 auto", // 가운데 정렬
                        }}
                    />
                    <div></div>

                    {/* 총근무시간 영역 */}
                    <div style={{ flex: 1, textAlign: "center" }}>
                        <span>총근무시간</span>
                        <br />
                        <span>
                            {`${workTime.h}시간 ${workTime.m < 10 ? '0' : ''}${workTime.m}분`}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttWorktime;
