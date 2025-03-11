import { React, useState, useEffect } from 'react'
import AddGroupModal from '../modals/AddGroupModal'
//import DeleteGroupModal from "../modals/DeleteGroupModal";
import DeleteConfirmModal from "../modals/DeleteConfirmModal";
import axios from 'axios'; // axios를 사용하여 서버로부터 데이터 가져오기
const ManGroup = () => {
    const [groupData, setGroupData] = useState([]);

    // 조직번호 (Department ID): 조직을 고유하게 식별할 수 있는 번호
    // 조직명 (Department Name): 해당 조직의 이름
    // 조직장 (Department Head): 해당 조직의 관리자를 나타내는 정보
    // 설명 (Description): 조직에 대한 간략한 설명
    // 위치 (Location): 조직이 위치한 장소
    // 인원수 (Number of Employees): 해당 조직에 소속된 직원 수

    const [selectedGroups, setSelectedGroups] = useState([{}]); // 체크된 조직들의 ID를 관리
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDltModalOpen, setIsDltModalOpen] = useState(false);

    // useEffect(() => {
    //     console.log("변화된 ", selectedGroups);
    //     // 테스트용 잘 선택되나 확인
    // }, [selectedGroups])

    useEffect(() => {
        const storedGroups = sessionStorage.getItem('groupData'); // 저장된 사용자 정보 가져오기
        //console.log("한번실행")
        //console.log(storedWorkers)
        let parsedData = null;

        try {
            // storedWorkers가 항상 JSON 문자열로 들어온다고 가정
            parsedData = JSON.parse(storedGroups);
            console.log("일반조직데이터 :", parsedData);
        
            // 상태 업데이트
            setGroupData(parsedData);
        } catch (error) {
            // JSON 파싱에 실패한 경우
            console.error("Error parsing JSON:", error);
        
            // 필요하다면 기본 데이터로 초기화
            // setEmployeeData(temps); 
        }
    }, []);

    const groupLine = (code, dpName, dpHeader, description, location, number) => {
        return (
            <div>
                <div style={{ display: "flex", gap: "25px" }}>
                    <span style={{ width: "50px", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "25px" }}>
                        <input
                            type="checkbox"
                            checked={selectedGroups.includes(code)} // 체크 상태 관리
                            onChange={() => handleCheckboxChange(code)} // 상태 변경
                        />
                    </span>
                    <span style={{ width: "150px", textAlign: "right" }}>{code}</span>
                    <span style={{ width: "150px", textAlign: "right" }}>{dpName}</span>
                    <span style={{ width: "150px", textAlign: "right" }}>{dpHeader}</span>
                    <span style={{ width: "150px", textAlign: "right" }}>{description}</span>
                    <span style={{ width: "150px", textAlign: "right" }}>{location}</span>
                    <span style={{ width: "150px", textAlign: "right" }}>{number}</span>
                </div>

                <hr />
            </div>

        );
    };
    const handleCheckboxChange = (code) => {
        setSelectedGroups((prev) =>
            prev.includes(code)
                ? prev.filter((id) => id !== code) // 이미 체크된 경우 제거
                : [...prev, code] // 체크되지 않은 경우 추가
        );
    };

    const handleAddGroup = async (newGroup) => {

        // 새로운 그룹 정보 변수 선언
        let temp_groupId = newGroup.dpId + `${groupData.length}` || `group001`;  // 그룹 ID 변수
        let temp_groupName = newGroup.dpName || `테스트그룹`;  // 그룹 이름 변수
        let temp_groupHead = newGroup.dpHead || `테스트그룹장`;  // 그룹장 ID 변수
        let temp_groupDesc = newGroup.description || `테스트 그룹 설명`;  // 그룹 설명 변수
        let temp_groupPos = newGroup.location || `테스트 위치`;  // 조직 위치 변수
        let temp_groupCount = newGroup.number || 999;  // 그룹 인원 수 변수

        try {
            // DB에 새 그룹 추가 요청
            const response = await axios.post("/management/addGroup", {
                group_id: temp_groupId,
                group_name: temp_groupName,
                group_head: temp_groupHead,
                group_desc: temp_groupDesc,
                group_pos: temp_groupPos,
                group_count: temp_groupCount
            });

            // 서버로부터 저장된 데이터를 가져옴
            const incomingGroup = response.data;
            //console.log("서버 요청 결과 : ", incomingGroup);

            // 새로운 직원 데이터를 세션 저장소에 먼저 저장
            const updatedGroupData = [
                ...groupData,
                {
                    group_id: temp_groupId,
                    group_name: temp_groupName,
                    group_head: temp_groupHead,
                    group_desc: temp_groupDesc,
                    group_pos: temp_groupPos,
                    group_count: temp_groupCount,
                    created_at: new Date().toISOString() // 현재 시간
                }
            ];

            //console.log(updatedGroupData)
            sessionStorage.setItem('groupData', JSON.stringify(updatedGroupData)); // 세션 저장소에 저장

            // 세션 저장소에 저장된 데이터로 상태 업데이트
            setGroupData(updatedGroupData); // 상태 업데이트
            setIsAddModalOpen(false); // 모달 닫기
        } catch (error) {
            console.error("Failed to add worker:", error);
            alert("그룹을 추가하는 데 실패했습니다. 다시 시도해주세요.");
        }

        setIsAddModalOpen(false); // 모달 닫기
    };
    const handleDeleteGroup = async (confirm) => {
        if (!confirm) {
            //console.log("삭제가 취소됨");
            return; // 아무 동작도 하지 않음
        }

        try {
            // 서버에 삭제 요청
            const response = await axios.post("/management/dltGroup", { ids: selectedGroups });
            //console.log("서버에 보낸 데이터:", selectedGroups);

            // 서버 응답 확인
            const returnData = response.data;
            console.log("서버에서 받은 데이터:", returnData);

            // 응답이 성공적일 경우
            if (response.status === 200) {
                // 상태 업데이트
                const updatedGroupData = groupData.filter((group) => !selectedGroups.includes(group.group_id));
                //console.log("업데이트된 직원 데이터:", updatedGroupData);

                sessionStorage.setItem('groupData', JSON.stringify(updatedGroupData)); // 세션 저장소에 저장

                setGroupData(updatedGroupData); // React 상태 업데이트
                setSelectedGroups([]); // 선택 초기화
                setIsAddModalOpen(false); // 모달 닫기
            } else {
                console.error("서버 응답 오류:", response.data);
                alert("직원 삭제 요청이 실패했습니다. 서버의 응답을 확인하세요.");
            }
        } catch (error) {
            console.error("직원 삭제 요청 중 오류 발생:", error);
            alert("직원을 삭제하는 데 실패했습니다. 네트워크 상태를 확인하고 다시 시도해주세요.");
        }
    };

    ///////버튼 기능들/////////////////////////////
    const btnAddGroup = () => {
        setIsAddModalOpen(true); // 그룹 추가 모달 열기
    };
    const btnRemoveGroup = () => {
        if (selectedGroups.length === 0) {
            //console.log("체크된 것이 없습니다.")
            return // 선택된 것이 없음으로 빠져나가기
        }
        setIsDltModalOpen(true); // 그룹 삭제 모달 열기
    };
    /////////////////////////////////////////

    return (
        <div style={{ width: "1600px" }}>
            <h2 style={{ margin: 0, marginRight: "20px" }}>조직관리</h2>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "20px" }}>
                <span
                    style={{
                        display: "inline-block",
                        padding: "10px 20px",
                        backgroundColor: "#007BFF",
                        color: "#fff",
                        borderRadius: "5px",
                        cursor: "pointer",
                        textAlign: "center",
                        fontSize: "14px",
                        fontWeight: "bold",
                        marginLeft: "10px",
                    }}
                    onClick={btnRemoveGroup}
                >
                    - 조직 삭제하기
                </span>
                <span
                    style={{
                        display: "inline-block",
                        padding: "10px 20px",
                        backgroundColor: "#007BFF",
                        color: "#fff",
                        borderRadius: "5px",
                        cursor: "pointer",
                        textAlign: "center",
                        fontSize: "14px",
                        fontWeight: "bold",
                        marginLeft: "10px",
                    }}
                    onClick={btnAddGroup}
                >
                    + 조직 추가하기
                </span>
            </div>
            <div>
                <span>총 조직 수 : {groupData.length}</span>
                <hr />
                <div style={{ display: "flex", gap: "25px" }}>
                    <span style={{ width: "50px", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "25px" }}>
                        <input
                            type="checkbox"
                            onChange={(e) => setSelectedGroups(e.target.checked ? groupData.map((g) => g.group_id) : [])}
                            checked={selectedGroups.length === groupData.length && groupData.length > 0}
                        />
                    </span>
                    <span style={{ width: "150px", textAlign: "right" }}>조직번호</span>
                    <span style={{ width: "150px", textAlign: "right" }}>조직명</span>
                    <span style={{ width: "150px", textAlign: "right" }}>조직장</span>
                    <span style={{ width: "150px", textAlign: "right" }}>설명</span>
                    <span style={{ width: "150px", textAlign: "right" }}>위치</span>
                    <span style={{ width: "150px", textAlign: "right" }}>인원수</span>

                </div>
                <hr style={{ marginBottom: "25px" }} />
                {/* 객체를 배열처리해줘야  map함수 사용 가능 */}
                <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
                    {
                        groupData.map(countedGroup => groupLine(
                            countedGroup.group_id,
                            countedGroup.group_name,
                            countedGroup.group_head,
                            countedGroup.group_desc,
                            countedGroup.group_pos,
                            countedGroup.group_count))}

                </div>
            </div>
            {/* AddWorkerModal 컴포넌트를 렌더링 */}
            <AddGroupModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddGroup} />
            {/* <DeleteGroupModal isOpen={isDltModalOpen} onClose={() => setIsDltModalOpen(false)} onSubmit={handleDeleteGroup} /> */}
            <DeleteConfirmModal isOpen={isDltModalOpen} onClose={() => setIsDltModalOpen(false)} onSubmit={handleDeleteGroup} isType={"조직"} />
        </div>
    )
}

export default ManGroup