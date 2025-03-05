import React from 'react'

const AttTodayCheck = () => {
  return (
    <div
      //key={index}
      style={{
        width: "500px",
        height: "400px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        padding: "10px",
      }}
    >
      <div style={{ fontSize: "20px" }}>
        <div style={{ textAlign: "center", margin: "50px", fontSize: "40px"}}>16 : 00 : 32</div>
        <div style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between", // 요소 간 동일한 간격 분배
          alignItems: "center",
          width: "100%", // 부모 컨테이너 전체 사용
        }}
        >
          <div style={{ flex: 1, textAlign: "center" }}>
            <span>출근시간</span>
            <br /><br />
            <span>09 : 52 : 48</span>
          </div>
          <div>

          </div>
          {/* 수직선 */}
          <div>
            <hr
              style={{
                border: "none",
                borderLeft: "2px solid grey", // 두께와 색상
                height: "80", // 수직선의 길이
              }}
            />
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <span>퇴근시간</span>
            <br /><br />
            <span>23 : 52 : 28</span>
          </div>
        </div>

      </div>

    </div>
  )
}

export default AttTodayCheck