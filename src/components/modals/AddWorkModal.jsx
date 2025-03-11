import React, { useState } from 'react';

const AddWorkModal = ({ isOpen, onClose, onSubmit }) => {
    const fieldAttributes  = {
        element1: { htmlFor: "wrkId", name: "wrkId", id: "wrkId", placeholder: "근무번호" },
        element2: { htmlFor: "wrkName", name: "wrkName", id: "wrkName", placeholder: "근로명" },
        element3: { htmlFor: "salaryType", name: "salaryType", id: "salaryType", placeholder: "급여타입" },
        element4: { htmlFor: "wrkDays", name: "wrkDays", id: "wrkDays", placeholder: "근무요일" },
        element5: { htmlFor: "wrkDfRule", name: "wrkDfRule", id: "wrkDfRule", placeholder: "소정근로규칙" },
        element6: { htmlFor: "wrkMxRule", name: "wrkMxRule", id: "wrkMxRule", placeholder: "최대근로규칙" },
        element7: { htmlFor: "wrkType", name: "wrkType", id: "wrkType", placeholder: "근무타입" },
        element8: { htmlFor: "wrkDesc", name: "wrkDesc", id: "wrkDesc", placeholder: "비고란" },
    };

    // 폼 데이터 상태 관리
    const [formData, setFormData] = useState({
        wrkId: "",
        wrkName: "",
        salaryType: "",
        wrkDays: "",
        wrkDfRule: "",
        wrkMxRule: "",
        wrkType: "",
        wrkDesc: ""
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
            salaryType: "",
            wrkDays: "",
            wrkDfRule: "",
            wrkMxRule: "",
            wrkType: "",
            wrkDesc: ""
        });
    };

    const testSubmit = () => {
        const testData = {
            wrkId: "T",
            wrkName: "테스트",
            salaryType: "월급",
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
            salaryType: "",
            wrkDays: "",
            wrkDfRule: "",
            wrkMxRule: "",
            wrkType: "",
            wrkDesc: ""
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
                    <label htmlFor={fieldAttributes.element1.htmlFor}>근무번호</label>
                    <input
                        type="text"
                        name={fieldAttributes.element1.name}
                        id={fieldAttributes.element1.id}
                        placeholder={fieldAttributes.element1.placeholder}
                        value={formData.wrkId}
                        onChange={handleChange}
                    />
                </div>
                {/* 조직명 */}
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor={fieldAttributes.element2.htmlFor}>조직명</label>
                    <input
                        type="text"
                        name={fieldAttributes.element2.name}
                        id={fieldAttributes.element2.id}
                        placeholder={fieldAttributes.element2.placeholder}
                        value={formData.wrkName}
                        onChange={handleChange}
                    />
                </div>
                {/* 월급/시급 */}
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor={fieldAttributes.element3.htmlFor}>월급/시급</label>
                    <input
                        type="text"
                        name={fieldAttributes.element3.name}
                        id={fieldAttributes.element3.id}
                        placeholder={fieldAttributes.element3.placeholder}
                        value={formData.salaryType}
                        onChange={handleChange}
                    />
                </div>
                {/* 근무요일 */}
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor={fieldAttributes.element4.htmlFor}>근무요일</label>
                    <input
                        type="text"
                        name={fieldAttributes.element4.name}
                        id={fieldAttributes.element4.id}
                        placeholder={fieldAttributes.element4.placeholder}
                        value={formData.wrkDays}
                        onChange={handleChange}
                    />
                </div>
                {/* 소정근로규칙 */}
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor={fieldAttributes.element5.htmlFor}>소정근로규칙</label>
                    <input
                        type="text"
                        name={fieldAttributes.element5.name}
                        id={fieldAttributes.element5.id}
                        placeholder={fieldAttributes.element5.placeholder}
                        value={formData.wrkDfRule}
                        onChange={handleChange}
                    />
                </div>
                {/* 최대근로규칙 */}
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor={fieldAttributes.element6.htmlFor}>최대근로규칙</label>
                    <input
                        type="text"
                        name={fieldAttributes.element6.name}
                        id={fieldAttributes.element6.id}
                        placeholder={fieldAttributes.element6.placeholder}
                        value={formData.wrkMxRule}
                        onChange={handleChange}
                    />
                </div>
                {/* 근무타입 */}
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor={fieldAttributes.element7.htmlFor}>근무타입</label>
                    <input
                        type="text"
                        name={fieldAttributes.element7.name}
                        id={fieldAttributes.element7.id}
                        placeholder={fieldAttributes.element7.placeholder}
                        value={formData.wrkType}
                        onChange={handleChange}
                    />
                </div>
                {/* 비고란 */}
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor={fieldAttributes.element8.htmlFor}>비고란</label>
                    <input
                        type="text"
                        name={fieldAttributes.element8.name}
                        id={fieldAttributes.element8.id}
                        placeholder={fieldAttributes.element8.placeholder}
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
