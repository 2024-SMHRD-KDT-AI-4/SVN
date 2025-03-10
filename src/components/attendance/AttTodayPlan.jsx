import React from 'react'

const AttTodayPlan = () => {
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
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <div>2월 8일 화요일</div>
                    <div>10:00 ~ 21:30 (소정 8시간/연장 2시간)</div>
                    
                </div>

            </div>

        </div>
    )
}

export default AttTodayPlan