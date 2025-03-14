import React, { useState } from 'react';

// AddWorkerModal 컴포넌트 정의
const AddWorkerModal = ({ isOpen, onClose, onSubmit }) => {
    // sessionStorage에서 가져온 데이터가 올바른 JSON 문자열인지 확인
    const storedGroups = sessionStorage.getItem('groupData');
    const storedWorks = sessionStorage.getItem('workData');
    //let parsePos = ["관리자","매니저","직원","인턴"];
    let parsePos = null;
    let parsedWork = null;
    if (storedGroups) {
        //console.log(JSON.parse(storedGroups));
        parsePos = JSON.parse(storedGroups).map(item => item.group_name);
        //console.log("직책의 종류 :", parsePos);
    }
    if(storedWorks){
        //console.log(JSON.parse(storedWorks));
        parsedWork = JSON.parse(storedWorks).map(item => item.work_name);
        //console.log("조직의 종류 :", parsedWork);
        
    }

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

    const testSubmit = () => {

        // 테스트 데이터로 설정
        const testData = {
            name: "테스트맨",
            position: "직원",
            joinDate: "2025.03.06",
            department: "테스트부서",
            dob: "2025.03.06",
            phone: "010-1234-5678",
            email: "test@gmail.com",
        };
        // 상태 업데이트
        setFormData(testData);
        //console.log(testData);  // 테스트 데이터를 콘솔에 출력

        // 상태 업데이트 후 부모에게 데이터 전달
        onSubmit(testData);

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
                {/* 각 입력 필드에 레이블 추가 */}
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor="name">이름</label>
                    <input
                        type="text" name="name" id="name" placeholder="이름"
                        value={formData.name} onChange={handleChange}  // name 필드 변경 시 handleChange 호출
                    />
                </div>
                {/* <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor="position">직책</label>
                    <input
                        type="text" name="position" id="position" placeholder="직책"
                        value={formData.position} onChange={handleChange}  // position 필드 변경 시 handleChange 호출
                    />
                </div> */}
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor="position">직책</label>
                    <select
                        name="position"
                        id="position"
                        value={formData.position} // 선택된 값
                        onChange={handleChange} // 선택 변경 시 호출
                    >
                        <option value="">직책을 선택하세요</option> {/* 기본값 */}
                        {parsePos?.map((position, index) => (
                            <option key={index} value={position}>
                                {position}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor="joinDate">입사일</label>
                    <input
                        type="date" name="joinDate" id="joinDate"
                        value={formData.joinDate} onChange={handleChange}  // joinDate 필드 변경 시 handleChange 호출
                    />
                </div>
                {/* <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor="department">부서</label>
                    <input
                        type="text" name="department" id="department" placeholder="부서"
                        value={formData.department} onChange={handleChange}  // department 필드 변경 시 handleChange 호출
                    />
                </div> */}

                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor="department">조직</label>
                    <select
                        name="department"
                        id="department"
                        value={formData.department} // 선택된 값
                        onChange={handleChange} // 선택 변경 시 호출
                    >
                        <option value="">조직을 선택하세요</option> {/* 기본값 */}
                        {parsedWork?.map((department, index) => (
                            <option key={index} value={department}>
                                {department}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor="dob">생년월일</label>
                    <input
                        type="date" name="dob" id="dob"
                        value={formData.dob} onChange={handleChange}  // dob 필드 변경 시 handleChange 호출
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor="phone">연락처</label>
                    <input
                        type="text" name="phone" id="phone" placeholder="연락처"
                        value={formData.phone} onChange={handleChange}  // phone 필드 변경 시 handleChange 호출
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <label htmlFor="email">전자우편</label>
                    <input
                        type="email" name="email" id="email" placeholder="전자우편"
                        value={formData.email} onChange={handleChange}  // email 필드 변경 시 handleChange 호출
                    />
                </div>

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

export default AddWorkerModal;
