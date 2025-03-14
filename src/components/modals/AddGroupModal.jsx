import React, { useState } from 'react';

// AddWorkerModal 컴포넌트 정의
const AddGroupModal = ({ isOpen, onClose, onSubmit }) => {
    // 폼 데이터 상태 관리
    const [formData, setFormData] = useState({
        dpId: "",       // 조직번호
        dpName: "",   // 조직명
        // dpHead: "",   // 조직장
        description: "", // 설명
        location: "",        // 위치
        // number: ""     // 인원수
    });

    // 조직번호 (Department ID): 조직을 고유하게 식별할 수 있는 번호
    // 조직명 (Department Name): 해당 조직의 이름
    // 조직장 (Department Head): 해당 조직의 관리자를 나타내는 정보
    // 설명 (Description): 조직에 대한 간략한 설명
    // 위치 (Location): 조직이 위치한 장소
    // 인원수 (Number of Employees): 해당 조직에 소속된 직원 수

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
            dpId: "",
            dpName: "",
            //dpHead: "",
            description: "",
            location: "",
            //number: ""
        });
    };
    const testSubmit = () => {

        // 테스트 데이터로 설정
        const testData = {
            dpId: "T",
            dpName: "테스트부서",
            //dpHead: "테스트장",
            description: "테스트용",
            location: "스마트",
            //number: 999,
        };
        // 상태 업데이트
        setFormData(testData);
        //console.log(testData);  // 테스트 데이터를 콘솔에 출력

        // 상태 업데이트 후 부모에게 데이터 전달
        onSubmit(testData);
        
        // 폼 데이터 초기화
        setFormData({
            dpId: "",
            dpName: "",
            //dpHead: "",
            description: "",
            location: "",
            //number: ""
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
                <h3>직책 추가하기</h3>
                {/* 각 입력 필드에 레이블 추가 */}
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor="dpId">직책번호</label>
                    <input
                        type="text" name="dpId" id="dpId" placeholder="직책번호"
                        value={formData.dpId} onChange={handleChange}  // dpId 필드 변경 시 handleChange 호출
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor="dpName">직책명</label>
                    <input
                        type="text" name="dpName" id="dpName" placeholder="직책명"
                        value={formData.dpName} onChange={handleChange}  // dpName 필드 변경 시 handleChange 호출
                    />
                </div>
                {/* <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor="dpHead">조직장</label>
                    <input
                        type="text" name="dpHead" id="dpHead" placeholder='조직장'
                        value={formData.dpHead} onChange={handleChange}  // dpHead 필드 변경 시 handleChange 호출
                    />
                </div> */}
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor="description">설명</label>
                    <input
                        type="text" name="description" id="description" placeholder="설명"
                        value={formData.description} onChange={handleChange}  // description 필드 변경 시 handleChange 호출
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor="location">위치</label>
                    <input
                        type="text" name="location" id="location" placeholder='위치'
                        value={formData.location} onChange={handleChange}  // dob 필드 변경 시 handleChange 호출
                    />
                </div>
                {/* <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor="number">인원수</label>
                    <input
                        type="number" name="number" id="number" placeholder="인원수"
                        value={formData.number} onChange={handleChange}  // phone 필드 변경 시 handleChange 호출
                    />
                </div> */}

                {/* 취소 및 저장 버튼 */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                    <button onClick={onClose} style={{ padding: "5px 10px" }}>취소</button>  {/* 취소 버튼: 모달 닫기 */}
                    <button onClick={testSubmit} style={{ padding: "5px 10px" }}>테스트</button>  {/* 테스트 버튼: 데이터 저장 */}
                    <button onClick={handleSubmit} style={{ padding: "5px 10px" }}>저장</button>  {/* 저장 버튼: 데이터 저장 */}
                </div>
            </div>
        </div>
    );
};

export default AddGroupModal;
