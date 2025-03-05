import { React, useState } from 'react'

const ManWorkers = () => {

    const workerLine = (code, name, role, firstDate, group, phone) => {
        return (
            <div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <span style={{ width: "150px", textAlign: "right" }}>{code}</span>
                    <span style={{ width: "150px", textAlign: "right" }}>{name}</span>
                    <span style={{ width: "150px", textAlign: "right" }}>{role}</span>
                    <span style={{ width: "150px", textAlign: "right" }}>{firstDate}</span>
                    <span style={{ width: "150px", textAlign: "right" }}>{group}</span>
                    <span style={{ width: "150px", textAlign: "right" }}>{phone}</span>
                </div>

                <hr />
            </div>

        );
    };

    const test = () => {

    }


    const [workers, setWorkers] = useState("")
    return (
        <div style={{ width: "1600px" }}>
            <div>
                <h2>직원관리</h2>
            </div>
            <div>
                <span>총 직원 수 6</span>
                <hr />
                <div style={{ display: "flex", gap: "10px" }}>
                    <span style={{ width: "150px", textAlign: "right" }}>사원번호</span>
                    <span style={{ width: "150px", textAlign: "right" }}>이름</span>
                    <span style={{ width: "150px", textAlign: "right" }}>직책</span>
                    <span style={{ width: "150px", textAlign: "right" }}>입사일</span>
                    <span style={{ width: "150px", textAlign: "right" }}>조직</span>
                    <span style={{ width: "150px", textAlign: "right" }}>연락처</span>
                </div>
                <hr />
                {/* 실질적인 직원 표시 */}
                <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
                    {workerLine("0001", "김예은", "최고존엄", "2024.12.10", "백엔드", "010-0000-0000")}
                    {workerLine("0002", "안지운", "존엄", "2024.12.10", "프론트엔드", "010-0000-0000")}
                    {workerLine("0003", "김현웅", "사원", "2024.12.10", "프론트엔드", "010-0000-0000")}
                    {workerLine("0004", "전석현", "사원", "2024.12.10", "백엔드", "010-0000-0000")}
                    {workerLine("0005", "김민정", "사원", "2024.12.10", "백엔드", "010-0000-0000")}
                    {workerLine("0006", "강인오", "염전노예", "2024.12.10", "올", "010-0000-0000")}
                </div>
            </div>
        </div>
    )
}

export default ManWorkers