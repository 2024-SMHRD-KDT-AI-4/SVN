import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axios를 사용하여 서버로부터 데이터 가져오기
//import Buttons from './Buttons';
import Calendar from './Calendar';
import Chatting from './Chatting';
import Attendance from './attendance/Attendance';
import Management from './management/Management';
import Schedule2 from './Schedule2';
import RequestForm from './requests/RequestForm';
import QNA from './QNA';
import MenuList from './MenuList'; // 🔹 메뉴 리스트 추가
import '../App.css';


const Main = () => {
    const [textValue, setTextValue] = useState(<Calendar />); // 현재 표시할 컴포넌트
    const [account, setAccount] = useState({
        id: "temp", // 로그인 상태에 따라 초기 값 설정
        name: "Unknown", // 기본 사용자 이름
        role: "Unknown", // 기본 사용자 역할
    });
    //const [workerData, setWorkerData] = useState([]); // 직원 데이터 저장 상태

    // 페이지가 로드될 때 실행되는 useEffect 훅
    useEffect(() => {
        // 1. 세션 저장소에서 계정 정보를 불러옵니다.
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser); // 세션 저장소에 저장된 사용자 데이터 파싱
            //console.log(userData);
            setAccount({
                id: "temp", // 기본적으로 "temp"로 설정
                name: userData?.name || 'Unknown', // 이름이 없으면 기본값 "Unknown"
                role: userData?.role || 'Unknown' // 역할이 없으면 기본값 "Unknown"
            });
        } else {
            // 2. 세션에 사용자 정보가 없으면 기본값 설정
            setAccount({
                id: "temp",
                name: '테스터', // 로그인하지 않은 경우 기본 이름
                role: '관리자' // 기본 역할 설정
            });
        }

        ///////////////////////////////////////////////////
        // 이전 로그인페이지에서 접속 시도가 성공시 접속한 계정의 데이터를 가져와 저장까진 완료(clear)
        // 1. 이후 메이페이지에서 DB의 전반적인 데이터들을 가져오고 자함
        // 2. 아래의 workerData를 가져오기를 원함
        // 3. workerData에  데이터를 저장.
        //////////////////////////////////////////////////

        // 3. DB에서 직원 데이터를 가져오는 함수
        const fetchEmployeeData = async () => {
            try {
                // 서버에 GET 요청을 보내 직원 데이터를 가져옴
                const response = await axios.get('/management/getEmployees');
                const fetchedEmployeeData = JSON.stringify(response.data.data); // 서버에서 받은 직원 데이터
                //console.log("직원 데이터 : ", fetchedWorkerData)
                // 4. 받은 데이터를 세션 저장소에 저장
                sessionStorage.setItem('employeeData', fetchedEmployeeData);

            } catch (error) {
                // 6. 서버에서 데이터를 가져오는 데 실패한 경우 오류 처리
                console.error("직원 데이터를 가져오는 데 실패했습니다.", error);
                const tempEmployees = [
                    {
                        emp_id: "241210001",
                        emp_name: "김예은",
                        emp_role: "팀장",
                        emp_firstDate: "2024.12.10",
                        emp_group: "백엔드",
                        emp_birthDate: "2001.05.07",
                        emp_phone: "010-0000-0000",
                        emp_email: "temp@gmail.com",
                        created_at: "2024.12.10"
                    },
                    {
                        emp_id: "241210002",
                        emp_name: "안지운",
                        emp_role: "부팀장",
                        emp_firstDate: "2024.12.10",
                        emp_group: "프론트엔드",
                        emp_birthDate: "1999.11.23",
                        emp_phone: "010-0000-0000",
                        emp_email: "temp@gmail.com",
                        created_at: "2024.12.10"
                    },
                    {
                        emp_id: "241210003",
                        emp_name: "김현웅",
                        emp_role: "사원",
                        emp_firstDate: "2024.12.10",
                        emp_group: "프론트엔드",
                        emp_birthDate: "1999.01.20",
                        emp_phone: "010-0000-0000",
                        emp_email: "temp@gmail.com",
                        created_at: "2024.12.10"
                    },
                    {
                        emp_id: "241210004",
                        emp_name: "전석현",
                        emp_role: "사원",
                        emp_firstDate: "2024.12.10",
                        emp_group: "백엔드",
                        emp_birthDate: "1997.12.26",
                        emp_phone: "010-0000-0000",
                        emp_email: "temp@gmail.com",
                        created_at: "2024.12.10"
                    },
                    {
                        emp_id: "241210005",
                        emp_name: "김민정",
                        emp_role: "사원",
                        emp_firstDate: "2024.12.10",
                        emp_group: "백엔드",
                        emp_birthDate: "1993.04.21",
                        emp_phone: "010-0000-0000",
                        emp_email: "temp@gmail.com",
                        created_at: "2024.12.10"
                    },
                    {
                        emp_id: "241210006",
                        emp_name: "강인오",
                        emp_role: "사원",
                        emp_firstDate: "2024.12.10",
                        emp_group: "프론트엔드",
                        emp_birthDate: "1991.02.25",
                        emp_phone: "010-0000-0000",
                        emp_email: "temp@gmail.com",
                        created_at: "2024.12.10"
                    }
                ];

                // 객체를 문자열로 변환하여 sessionStorage에 저장
                sessionStorage.setItem('employeeData', JSON.stringify(tempEmployees));
            }
        };

        // 4. DB에서 조직 데이터를 가져오는 함수
        const fetchGroupData = async () => {
            //console.log("그룹 데이터 가져오기")
            try {
                // 서버에 GET 요청을 보내 그룹 데이터를 가져옴
                const response = await axios.get('/management/getGroup');
                const fetchedGroupData = JSON.stringify(response.data.data, null, 2); // 서버에서 받은 조직 데이터
                //console.log("그룹 데이터:", fetchedGroupData);
                // 4. 받은 조직 데이터를 세션 저장소에 저장
                sessionStorage.setItem('groupData', fetchedGroupData);

            } catch (error) {
                // 6. 서버에서 데이터를 가져오는 데 실패한 경우 오류 처리
                console.error("조직 데이터를 가져오는 데 실패했습니다.", error);
                const tempGroups = [
                    {
                        group_id: "B1001",
                        group_name: "팬더팀",
                        group_head: "김예은",
                        group_desc: "백엔드",
                        group_pos: "4라인",
                        group_count: 2,
                    },
                    {
                        group_id: "F1001",
                        group_name: "너구리팀",
                        group_head: "안지운",
                        group_desc: "프론트엔드",
                        group_pos: "4라인",
                        group_count: 2,
                    },
                    {
                        group_id: "P1001",
                        group_name: "꾀꼬리팀",
                        group_head: "김민정",
                        group_desc: "기획",
                        group_pos: "5라인",
                        group_count: 2,
                    },
                ];
                // 객체를 문자열로 변환하여 sessionStorage에 저장
                sessionStorage.setItem('groupData', JSON.stringify(tempGroups));
            }
        };

        // 4. DB에서 근무 데이터를 가져오는 함수
        const fetchWorkData = async () => {
            //console.log("근무 데이터 가져오기")
            try {
                // 서버에 GET 요청을 보내 근무 데이터를 가져옴
                const response = await axios.get('/management/getWork');
                const fetchedWorkData = JSON.stringify(response.data.data, null, 2); // 서버에서 받은 근무 데이터
                //console.log("근무 데이터:", fetchedWorkData);
                // 4. 받은 근무 데이터를 세션 저장소에 저장
                sessionStorage.setItem('workData', fetchedWorkData);

            } catch (error) {
                // 6. 서버에서 데이터를 가져오는 데 실패한 경우 오류 처리
                console.error("근무 데이터를 가져오는 데 실패했습니다.", error);
                const tempWorks = [
                    {

                        work_id: "DE01",
                        work_name: "오픈",
                        work_start: "09:00",
                        work_end: "18:00",
                        work_break: "60",
                        work_days: "월,화,수,목,금",
                        work_default_rule: "주 40시간",
                        work_max_rule: "주 52시간",
                        work_type: "정규직",
                        work_desc: "매장관리자",
                        created_at: "2025.03.11"
                    },
                    {
                        work_id: "OE01",
                        work_name: "오픈",
                        work_start: "09:00",
                        work_end: "18:00",
                        work_break: "60",
                        work_days: "월,화,수,목,금",
                        work_default_rule: "주 40시간",
                        work_max_rule: "주 52시간",
                        work_type: "정규직",
                        work_desc: "오픈직원",
                        created_at: "2025.03.11"
                    },
                    {
                        work_id: "ME01",
                        work_name: "미들",
                        work_start: "09:00",
                        work_end: "18:00",
                        work_break: "60",
                        work_days: "월,수,금",
                        work_default_rule: "주 24시간",
                        work_max_rule: "주 30시간",
                        work_type: "파트타임",
                        work_desc: "청소/재고관리",
                        created_at: "2025.03.11"
                    },
                    {
                        work_id: "CE01",
                        work_name: "마감",
                        work_start: "09:00",
                        work_end: "14:00",
                        work_break: "60",
                        work_days: "목,금",
                        work_default_rule: "주 8시간",
                        work_max_rule: "주 8시간",
                        work_type: "파트타임",
                        work_desc: "교육중",
                        created_at: "2025.03.11"
                    }
                ];
                // 객체를 문자열로 변환하여 sessionStorage에 저장
                sessionStorage.setItem('workData', JSON.stringify(tempWorks));
            }
        };

        // 5. DB에서 휴가 데이터를 가져오는 함수
        const fetchVacationData = async () => {
            //console.log("휴가 데이터 가져오기")
            try {
                // 서버에 GET 요청을 보내 휴가 데이터를 가져옴
                const response = await axios.get('/management/getVacation');
                const fetchedVacationData = JSON.stringify(response.data.data, null, 2); // 서버에서 받은 휴가 데이터
                //console.log("휴가 데이터:", fetchedVacationData);
                // 4. 받은 휴가 데이터를 세션 저장소에 저장
                sessionStorage.setItem('vacationData', fetchedVacationData);

            } catch (error) {
                // 6. 서버에서 데이터를 가져오는 데 실패한 경우 오류 처리
                console.error("휴가 데이터를 가져오는 데 실패했습니다.", error);
                const vacations = [
                    {
                        req_idx: "1",
                        req_type: "휴가",
                        req_content: "1111",
                        emp_id: "241210001",
                        start_date: "2025.03.11",
                        end_date: "2025.03.12",
                        created_at: "2025.03.11",
                        req_status: "N",
                        approved_at: "",
                        admin_id: ""
                    },
                    {
                        req_idx: "2",
                        req_type: "휴가",
                        req_content: "집에가고싶어요",
                        emp_id: "241210001",
                        start_date: "2025.03.11",
                        end_date: "2025.03.12",
                        created_at: "2025.03.11",
                        req_status: "N",
                        approved_at: "",
                        admin_id: ""
                    },
                    {
                        req_idx: "3",
                        req_type: "휴가",
                        req_content: "테스트",
                        emp_id: "241210001",
                        start_date: "2025.03.12",
                        end_date: "2025.03.13",
                        created_at: "2025.03.11",
                        req_status: "N",
                        approved_at: "",
                        admin_id: ""
                    },
                ];
                // 객체를 문자열로 변환하여 sessionStorage에 저장
                sessionStorage.setItem('workData', JSON.stringify(vacations));
            }
        };

        // 7. 페이지 로드 시 데이터들을 가져오는 함수 호출
        fetchEmployeeData();
        fetchGroupData();
        fetchWorkData();
        fetchVacationData();

    }, []); // 빈 배열이므로 이 useEffect는 컴포넌트가 처음 렌더링될 때만 실행됩니다.

    // ✅ 메뉴 리스트에서 선택될 때 실행되는 함수
    const handleMenuSelect = (item) => {
        switch (item.label) {
            case '메인':
                setTextValue(<Calendar />);
                break;
            case '채팅':
                setTextValue(<Chatting />);
                break;
            case '근태':
                setTextValue(<Attendance />);
                break;
            case '요청하기':
                setTextValue(<RequestForm />);
                break;
            case '스케줄 생성':
                if (account.role === "관리자") setTextValue(<Schedule2 />);
                break;
            case '관리하기':
                if (account.role === "관리자") setTextValue(<Management />);
                break;
            case 'QNA':
                if (account.role === "관리자") setTextValue(<QNA />);
                break;
            default:
                setTextValue(<Calendar />);
        }
    };


    return (
        <div>
            {/* 사용자 프로필 영역 */}
            <div id='profile'>
                <span id='logo'>SAVANNAH</span>
                <div id="account">
                    {/* 사용자 정보 표시 */}
                    <h3 id='welcome'>환영합니다. {account.name}님!({account.role})</h3>
                    {/* 알림표시 아이콘 */}
                    <img src="#" alt="알림" srcSet="" />
                    {/* 계정 접속자의 사진 */}
                    <img src="#" alt="사진" srcSet="" />
                </div>
            </div>
            <hr />
            <div style={{ display: 'flex' }}>
                <div id='buttonGroup'>
                    {/* ✅ MenuList 추가 */}
                    <MenuList
                        menuItems={[
                            { label: '메인' },
                            { label: '채팅' },
                            { label: '근태' },
                            { label: '요청하기' },
                            ...(account.role === "관리자" ? [
                                { label: '스케줄 생성' },
                                { label: '관리하기' },
                                { label: 'QNA' }
                            ] : [])
                        ]}
                        onItemSelect={handleMenuSelect} // 메뉴 클릭 시 실행할 함수 전달
                    />

                    {/* 버튼들 */}
                    {/* <Buttons className="funcButton" name={'메인'} func={() => { setTextValue(<Calendar />); }} />              
                    <Buttons className="funcButton" name={'채팅'} func={() => { setTextValue(<Chatting />); }} />
                    <Buttons className="funcButton" name={'근태'} func={() => { setTextValue(<Attendance />); }} />
                    <Buttons className="funcButton" name={'요청하기'} func={() => { setTextValue(<RequestForm />); }} />

                    {account.role === "관리자" && (
                        <>
                            <Buttons className="funcButton_auth" name={'스케줄 생성'} func={() => { setTextValue(<Schedule />); }} auth={true} />
                            <Buttons className="funcButton_auth" name={'관리하기'} func={() => { setTextValue(<Management />); }} auth={true} />
                            <Buttons className="funcButton_auth" name={'QNA'} func={() => { setTextValue(<QNA />); }} auth={true} />
                        </>
                    )} */}
                </div>
                <div id='changableView'>
                    {/* 현재 선택된 컴포넌트 표시 */}
                    {textValue}
                </div>
            </div>
        </div>
    );
}

export default Main;
