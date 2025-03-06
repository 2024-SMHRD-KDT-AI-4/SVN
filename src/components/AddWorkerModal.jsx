import React, { useState } from 'react';

// AddWorkerModal 컴포넌트 정의
const AddWorkerModal = ({ isOpen, onClose, onSubmit }) => {
    // 폼 데이터 상태 관리
    const [formData, setFormData] = useState({
        name: "",       // 이름
        position: "",   // 직책
        joinDate: "",   // 입사일
        department: "", // 부서
        dob: "",        // 생년월일
        phone: "",      // 연락처
        email: "",      // 이메일
    });

    // 입력값 변경 처리 함수
    const handleChange = (e) => {
        const { name, value } = e.target;  // input 필드의 name과 value 추출
        setFormData({ ...formData, [name]: value });  // 기존 formData에 새로운 값 업데이트
    };

    // 폼 제출 처리 함수
    const handleSubmit = () => {
        onSubmit(formData);  // 부모 컴포넌트로 formData 전달
        // 폼 데이터 초기화
        setFormData({
            name: "",
            position: "",
            joinDate: "",
            department: "",
            dob: "",
            phone: "",
            email: "",
        });
    };

    // isOpen이 false일 경우, 모달을 렌더링하지 않음
    if (!isOpen) return null;

    return (
        // 모달을 화면 중앙에 표시하기 위한 스타일
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
            <div style={{
                background: "#fff", padding: "20px", borderRadius: "10px", width: "400px",
                display: "flex", flexDirection: "column", gap: "10px"
            }}>
                <h3>직원 추가하기</h3>
                {/* 각 입력 필드 */}
                <input
                    type="text" name="name" placeholder="이름"
                    value={formData.name} onChange={handleChange}  // name 필드 변경 시 handleChange 호출
                />
                <input
                    type="text" name="position" placeholder="직책"
                    value={formData.position} onChange={handleChange}  // position 필드 변경 시 handleChange 호출
                />
                <input
                    type="date" name="joinDate" placeholder="입사일"
                    value={formData.joinDate} onChange={handleChange}  // joinDate 필드 변경 시 handleChange 호출
                />
                <input
                    type="text" name="department" placeholder="조직"
                    value={formData.department} onChange={handleChange}  // department 필드 변경 시 handleChange 호출
                />
                <input
                    type="text" name="dob" placeholder="생년월일"
                    value={formData.dob} onChange={handleChange}  // dob 필드 변경 시 handleChange 호출
                />
                <input
                    type="text" name="phone" placeholder="연락처"
                    value={formData.phone} onChange={handleChange}  // phone 필드 변경 시 handleChange 호출
                />
                <input
                    type="email" name="email" placeholder="전자우편"
                    value={formData.email} onChange={handleChange}  // email 필드 변경 시 handleChange 호출
                />
                {/* 취소 및 저장 버튼 */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                    <button onClick={onClose} style={{ padding: "5px 10px" }}>취소</button>  {/* 취소 버튼: 모달 닫기 */}
                    <button onClick={handleSubmit} style={{ padding: "5px 10px" }}>저장</button>  {/* 저장 버튼: 데이터 저장 */}
                </div>
            </div>
        </div>
    );
};

export default AddWorkerModal;
