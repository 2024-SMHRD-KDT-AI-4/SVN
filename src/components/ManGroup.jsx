import { React, useState } from 'react'
import AddGroupModal from './AddGroupModal'

const ManGroup = () => {
    const [groupData, setGroupData] = useState([
        ["B1001", "팬더팀", "김예은", "백엔드", "4라인", "2"],
        ["F1001", "너구리팀", "안지운", "프론트엔드", "4라인", "2"],
        ["P1001", "꾀꼬리팀", "김민정", "기획", "5라인", "2"],
    ]);

    // 조직번호 (Department ID): 조직을 고유하게 식별할 수 있는 번호
    // 조직명 (Department Name): 해당 조직의 이름
    // 조직장 (Department Head): 해당 조직의 관리자를 나타내는 정보
    // 설명 (Description): 조직에 대한 간략한 설명
    // 위치 (Location): 조직이 위치한 장소
    // 인원수 (Number of Employees): 해당 조직에 소속된 직원 수


    const [selectedGroups, setSelectedGroups] = useState([]); // 체크된 조직들의 ID를 관리
    const [isModalOpen, setIsModalOpen] = useState(false);

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
    const btnRemoveGroup = () => {
        setGroupData(groupData.filter((group) => !selectedGroups.includes(group[0])));
        setSelectedGroups([]); // 삭제 후 선택 초기화
    };

    const handleAddGroup = (newGroup) => {
        setGroupData([
            ...groupData,
            [
                newGroup.dpId || "T0000", // 팀번호
                newGroup.dpName || "테스트팀", // 팀이름
                newGroup.dpHead || "테스트장", // 팀장
                newGroup.description || "테스트용", // 이름
                newGroup.location || "8호실", // 이름
                newGroup.number || "999", // 이름
            ],
        ]);
        setIsModalOpen(false); // 모달 닫기
    };
    const btnAddGroup = () => {
        setIsModalOpen(true); // 모달 열기
    };
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
                <span>총 조직 수 {groupData.length}</span>
                <hr />
                <div style={{ display: "flex", gap: "25px" }}>
                    <span style={{ width: "50px", display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "25px" }}>
                        <input
                            type="checkbox"
                            onChange={(e) => setSelectedGroups(e.target.checked ? groupData.map((w) => w[0]) : [])}
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
                {/* 실질적인 직원 표시 */}
                <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
                    {groupData.map(group => groupLine(group[0], group[1], group[2], group[3], group[4], group[5]))}
                </div>
            </div>
            {/* AddWorkerModal 컴포넌트를 렌더링 */}
            <AddGroupModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)} // 모달 닫기
                onSubmit={handleAddGroup} // 모달에서 직원 추가하기
            />
        </div>
    )
}

export default ManGroup