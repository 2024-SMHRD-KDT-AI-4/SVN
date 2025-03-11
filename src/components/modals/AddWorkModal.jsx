import React, { useState } from 'react';

const AddWorkModal = ({ isOpen, onClose, onSubmit }) => {
    const fieldAttributes = {
        element01: { htmlFor: "wrkId", name: "wrkId", id: "wrkId", placeholder: "근무번호" },
        element02: { htmlFor: "wrkName", name: "wrkName", id: "wrkName", placeholder: "근로명" },
        element03: { htmlFor: "wrkTimeStart", name: "wrkTimeStart", id: "wrkTimeStart", placeholder: "시작시간" }, 
        element04: { htmlFor: "wrkTimeEnd", name: "wrkTimeEnd", id: "wrkTimeEnd", placeholder: "종료시간" },
        element05: { htmlFor: "breakTime", name: "breakTime", id: "breakTime", placeholder: "휴식시간" }, 
        element06: { htmlFor: "wrkDays", name: "wrkDays", id: "wrkDays", placeholder: "근무요일" }, //
        element07: { htmlFor: "wrkDfRule", name: "wrkDfRule", id: "wrkDfRule", placeholder: "소정근로규칙" }, // 7
        element08: { htmlFor: "wrkMxRule", name: "wrkMxRule", id: "wrkMxRule", placeholder: "최대근로규칙" }, // 8
        element09: { htmlFor: "wrkType", name: "wrkType", id: "wrkType", placeholder: "근무타입" } , // 9
        element10: { htmlFor: "wrkDesc", name: "wrkDesc", id: "wrkDesc", placeholder: "비고란" },// 10
    };

    // 폼 데이터 상태 관리
    const [formData, setFormData] = useState({
        wrkId: "",
        wrkName: "",
        wrkTimeStart: "", // 근무 시작 시간
        wrkTimeEnd: "",    // 근무 종료 시간
        wrkDays: "",
        wrkDfRule: "",
        wrkMxRule: "",
        wrkType: "",
        wrkDesc: "",

    });

    // 입력값 변경 처리 함수
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 폼 제출 처리 함수
    const handleSubmit = () => {
        onSubmit(formData);
        setFormData({
            wrkId: "",
            wrkName: "",
            wrkTimeStart: "", // 근무 시작 시간
            wrkTimeEnd: "",    // 근무 종료 시간
            wrkDays: "",
            wrkDfRule: "",
            wrkMxRule: "",
            wrkType: "",
            wrkDesc: "",
        });
    };

    const testSubmit = () => {
        const testData = {
            wrkId: "T",
            wrkName: "테스트",
            wrkTimeStart: "09:00", // 근무 시작 시간
            wrkTimeEnd: "16:00",    // 근무 종료 시간
            wrkDays: "월,화,수,목,금",
            wrkDfRule: 40,
            wrkMxRule: 52,
            wrkType: "정규직",
            wrkDesc: "테스트용"
        };
        setFormData(testData);
        onSubmit(testData);
        setFormData({
            wrkId: "",
            wrkName: "",
            wrkTimeStart: "", // 근무 시작 시간
            wrkTimeEnd: "",    // 근무 종료 시간
            wrkDays: "",
            wrkDfRule: "",
            wrkMxRule: "",
            wrkType: "",
            wrkDesc: "",
        });
    };

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        setFormData((prevState) => {
            // 현재 선택된 요일들을 배열로 변환
            const selectedDays = prevState.wrkDays ? prevState.wrkDays.split(",") : [];

            const updatedDays = checked
                ? [...selectedDays, value] // 체크된 경우 추가
                : selectedDays.filter((day) => day !== value); // 체크 해제된 경우 제거

            // 배열을 문자열로 변환하여 저장
            return { ...prevState, wrkDays: updatedDays.join(",") };
        });
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
            <div style={{
                background: "#fff", padding: "20px", borderRadius: "10px", width: "400px",
                display: "flex", flexDirection: "column", gap: "10px"
            }}>
                <h3>조직 추가하기</h3>
                {/* 근무번호 */}
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor={fieldAttributes.element01.htmlFor}>근무번호</label>
                    <input
                        type="text"
                        name={fieldAttributes.element01.name}
                        id={fieldAttributes.element01.id}
                        placeholder={fieldAttributes.element01.placeholder}
                        value={formData.wrkId}
                        onChange={handleChange}
                    />
                </div>
                {/* 조직명 */}
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor={fieldAttributes.element02.htmlFor}>조직명</label>
                    <input
                        type="text"
                        name={fieldAttributes.element02.name}
                        id={fieldAttributes.element02.id}
                        placeholder={fieldAttributes.element02.placeholder}
                        value={formData.wrkName}
                        onChange={handleChange}
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor={fieldAttributes.element03.htmlFor}>근무시간 및 휴식시간</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {/* 근무시간 */}
                        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                            <input
                                type="time" // 시간 입력 전용
                                name={fieldAttributes.element03.name}
                                id={fieldAttributes.element03.id}
                                placeholder={fieldAttributes.element03.placeholder}
                                value={formData.wrkTimeStart || ""} // 기본값 처리
                                onChange={handleChange}
                                style={{ width: "100px" }} // 적절한 크기 설정
                            />
                            <span>~</span>
                            <input
                                type="time" // 시간 입력 전용
                                name={fieldAttributes.element04.name}
                                id={fieldAttributes.element04.id}
                                placeholder={fieldAttributes.element04.placeholder}
                                value={formData.wrkTimeEnd || ""} // 기본값 처리
                                onChange={handleChange}
                                style={{ width: "100px" }} // 적절한 크기 설정
                            />
                        </div>
                        {/* 휴식시간 */}
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <label htmlFor={fieldAttributes.element05.htmlFor} style={{ whiteSpace: "nowrap" }}>휴식:</label>
                            <select
                                name={fieldAttributes.element05.name}
                                id={fieldAttributes.element05.id}
                                value={formData.breakTime || "0"} // 기본값 처리
                                onChange={handleChange}
                                style={{
                                    padding: "5px",
                                    width: "80px", // 드롭다운 너비 제한
                                    boxSizing: "border-box",
                                }}
                            >
                                <option value="0">0분</option>
                                <option value="30">30분</option>
                                <option value="60">1시간</option>
                                <option value="90">1시간 30분</option>
                                <option value="120">2시간</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 근무요일 */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
                        <label key={day} style={{ display: "flex", alignItems: "center" }}>
                            <input
                                type="checkbox"
                                name={fieldAttributes.element06.name}
                                id={fieldAttributes.element06.id}
                                value={day}
                                checked={formData.wrkDays.includes(day)} // 선택 여부 확인
                                onChange={handleCheckboxChange} // 체크박스 상태 변경
                            />
                            {day}
                        </label>
                    ))}
                </div>
                {/* 소정근로규칙 */}
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor={fieldAttributes.element07.htmlFor}>소정근로규칙</label>
                    <input
                        type="text"
                        name={fieldAttributes.element07.name}
                        id={fieldAttributes.element07.id}
                        placeholder={fieldAttributes.element07.placeholder}
                        value={formData.wrkDfRule}
                        onChange={handleChange}
                    />
                </div>
                {/* 최대근로규칙 */}
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor={fieldAttributes.element08.htmlFor}>최대근로규칙</label>
                    <input
                        type="text"
                        name={fieldAttributes.element08.name}
                        id={fieldAttributes.element08.id}
                        placeholder={fieldAttributes.element08.placeholder}
                        value={formData.wrkMxRule}
                        onChange={handleChange}
                    />
                </div>
                {/* 근무타입 */}
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor={fieldAttributes.element09.htmlFor}>근무타입</label>
                    <input
                        type="text"
                        name={fieldAttributes.element09.name}
                        id={fieldAttributes.element09.id}
                        placeholder={fieldAttributes.element09.placeholder}
                        value={formData.wrkType}
                        onChange={handleChange}
                    />
                </div>
                {/* 비고란 */}
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor={fieldAttributes.element10.htmlFor}>비고란</label>
                    <input
                        type="text"
                        name={fieldAttributes.element10.name}
                        id={fieldAttributes.element10.id}
                        placeholder={fieldAttributes.element10.placeholder}
                        value={formData.wrkDesc}
                        onChange={handleChange}
                    />
                </div>
                {/* 취소 및 저장 버튼 */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                    <button onClick={onClose} style={{ padding: "5px 10px" }}>취소</button>
                    <button onClick={testSubmit} style={{ padding: "5px 10px" }}>테스트</button>
                    <button onClick={handleSubmit} style={{ padding: "5px 10px" }}>저장</button>
                </div>
            </div>
        </div>
    );
};

export default AddWorkModal;
