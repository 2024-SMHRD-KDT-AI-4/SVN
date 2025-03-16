import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axios를 사용하여 서버로부터 데이터 가져오기
//import Buttons from './Buttons';
import tempDataStore from "../data/tempDataStore"; // ✅ 데이터 불러오기
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
    //const [testMode,setTestMode] = useState(false);
    const [textValue, setTextValue] = useState(<Calendar />); // 현재 표시할 컴포넌트
    const [account, setAccount] = useState({
        id: "temp", // 로그인 상태에 따라 초기 값 설정
        name: "Unknown", // 기본 사용자 이름
        role: "Unknown", // 기본 사용자 역할
    });

    // 페이지가 로드될 때 실행되는 useEffect 훅
    useEffect(() => {
        // 1. 세션 저장소에서 계정 정보를 불러옵니다.
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser); // 세션 저장소에 저장된 사용자 데이터 파싱
            console.log(userData);
            setAccount({
                id: userData?.id, // 기본적으로 "temp"로 설정
                name: userData?.name, // 이름이 없으면 기본값 "Unknown"
                role: userData?.role // 역할이 없으면 기본값 "Unknown"
            });
        } else {
            // 2. 세션에 사용자 정보가 없으면 기본값 설정
            //console.log('연결 없는 접근')
            let kk = {
                id: "tester",
                name: '안지운', // 로그인하지 않은 경우 기본 이름
                role: '관리자' // 기본 역할 설정
            }
            sessionStorage.setItem('user', JSON.stringify(kk));
            setAccount(kk);
        }

    }, []); // 빈 배열이므로 이 useEffect는 컴포넌트가 처음 렌더링될 때만 실행됩니다.
    useEffect(() => {

        if (account.id === "temp") {
            //console.log("첫 시작! 데이터를 요청하지 않음");
            return;
        }
        ///////////////////////////////////////////////////
        // 이전 로그인페이지에서 접속 시도가 성공시 접속한 계정의 데이터를 가져와 저장까진 완료(clear)
        // 1. 이후 메이페이지에서 DB의 전반적인 데이터들을 가져오고 자함
        // 2. 아래의 workerData를 가져오기를 원함
        // 3. workerData에  데이터를 저장.
        //////////////////////////////////////////////////

        // 3. DB에서 직원 데이터를 가져오는 함수
        const fetchEmployeeData = async (consoleOn = "C") => {

            if (account.id !== "tester") {
                try {

                    // 서버에 GET 요청을 보내 직원 데이터를 가져옴
                    const response = await axios.get('/management/getEmployees');
                    const fetchedEmployeeData = JSON.stringify(response.data.data); // 서버에서 받은 직원 데이터
                    //console.log("직원 데이터 : ", fetchedWorkerData)
                    // 4. 받은 데이터를 세션 저장소에 저장
                    sessionStorage.setItem('employeeData', fetchedEmployeeData);

                } catch (error) {
                    if (error.status === 404 && account.id !== "tester") {
                        console.log("불러올 직원 데이터가 없습니다. 추가하세요.");
                        return;
                    }
                }
            }
            else {
                // 객체를 문자열로 변환하여 sessionStorage에 저장
                sessionStorage.setItem('employeeData', JSON.stringify(tempDataStore.employees));
            }
            if (consoleOn === "Y") {
                console.log("직원 저장 완료", JSON.parse(sessionStorage.getItem('employeeData')));
            }

        }


        // 4. DB에서 조직 데이터를 가져오는 함수
        const fetchGroupData = async (consoleOn = "C") => {
            //console.log("그룹 데이터 가져오기")
            if (account.id !== "tester") {
                try {
                    // 서버에 GET 요청을 보내 그룹 데이터를 가져옴
                    const response = await axios.get('/management/getGroup');
                    const fetchedGroupData = JSON.stringify(response.data.data, null, 2); // 서버에서 받은 조직 데이터
                    //console.log("그룹 데이터:", fetchedGroupData);
                    // 4. 받은 조직 데이터를 세션 저장소에 저장
                    sessionStorage.setItem('groupData', fetchedGroupData);

                } catch (error) {

                    if (error.status === 404 && account.id !== "tester") {
                        console.log("불러올 조직 데이터가 없습니다. 추가하세요.")
                        return
                    }
                }
            }
            else {
                // 객체를 문자열로 변환하여 sessionStorage에 저장
                sessionStorage.setItem('groupData', JSON.stringify(tempDataStore.groups));
            }
            // 6. 서버에서 데이터를 가져오는 데 실패한 경우 오류 처리
            //console.error("조직 데이터를 가져오는 데 실패했습니다.", error);
            if (consoleOn === "Y") {
                console.log("조직 저장 완료", JSON.parse(sessionStorage.getItem('groupData')))
            }

        }

        // 4. DB에서 근무 데이터를 가져오는 함수
        const fetchWorkData = async (consoleOn = "C") => {
            //console.log("근무 데이터 가져오기")
            if (account.id !== "tester") {
                try {
                    // 서버에 GET 요청을 보내 근무 데이터를 가져옴
                    const response = await axios.get('/management/getWork');
                    const fetchedWorkData = JSON.stringify(response.data.data, null, 2); // 서버에서 받은 근무 데이터
                    //console.log("근무 데이터:", fetchedWorkData);
                    // 4. 받은 근무 데이터를 세션 저장소에 저장
                    sessionStorage.setItem('workData', fetchedWorkData);

                } catch (error) {
                    // 6. 서버에서 데이터를 가져오는 데 실패한 경우 오류 처리
                    if (error.status === 404 && account.id !== "tester") {
                        console.log("불러올 근무 데이터가 없습니다. 추가하세요.")
                        return
                    }
                }
            }
            else {
                // 객체를 문자열로 변환하여 sessionStorage에 저장
                sessionStorage.setItem('workData', JSON.stringify(tempDataStore.works));
            }
            if (consoleOn === "Y") {
                console.log("근무 저장 완료", JSON.parse(sessionStorage.getItem('workData')));
            }

        }

        // 5. DB에서 휴가 데이터를 가져오는 함수
        const fetchVacationData = async (consoleOn = "C") => {
            //console.log("휴가 데이터 가져오기")
            if (account.id !== "tester") {
                try {
                    // 서버에 GET 요청을 보내 휴가 데이터를 가져옴
                    const response = await axios.get('/management/getVacation');
                    const fetchedVacationData = JSON.stringify(response.data.data, null, 2); // 서버에서 받은 휴가 데이터
                    //console.log("휴가 데이터:", fetchedVacationData);
                    // 4. 받은 휴가 데이터를 세션 저장소에 저장
                    sessionStorage.setItem('vacationData', fetchedVacationData);

                } catch (error) {
                    // 6. 서버에서 데이터를 가져오는 데 실패한 경우 오류 처리
                    if (error.status === 404 && account.id !== "tester") {
                        console.log("불러올 휴가 데이터가 없습니다. 추가하세요.")
                        return
                    }
                }
            }
            else {
                //console.error("휴가 데이터를 가져오는 데 실패했습니다.", error);
                // 객체를 문자열로 변환하여 sessionStorage에 저장
                sessionStorage.setItem('vacationData', JSON.stringify(tempDataStore.vacations));
            }
            if (consoleOn === "Y") {
                console.log("휴가 저장 완료", JSON.parse(sessionStorage.getItem('vacationData')))
            }

        }

        // 6. DB에서 근태 데이터를 가져오는 함수
        const fetchAttendanceData = async (consoleOn = "C") => {
            //console.log("근태 데이터 가져오기")
            if (account.id !== "tester") {
                try {
                    // 서버에 GET 요청을 보내 근태 데이터를 가져옴
                    const response = await axios.get('/management/getAttendance');
                    const fetchedAttendanceData = JSON.stringify(response.data.data, null, 2); // 서버에서 받은 휴가 데이터
                    //console.log("근태 데이터:", fetchedAttendanceData);
                    // 4. 받은 휴가 데이터를 세션 저장소에 저장
                    sessionStorage.setItem('attendanceData', fetchedAttendanceData);

                } catch (error) {
                    // 6. 서버에서 데이터를 가져오는 데 실패한 경우 오류 처리
                    if (error.status === 404 && account.id !== "tester") {
                        console.log("불러올 휴가 데이터가 없습니다. 추가하세요.")
                        return
                    }
                }
            }
            else {
                //console.error("휴가 데이터를 가져오는 데 실패했습니다.", error);
                // 객체를 문자열로 변환하여 sessionStorage에 저장
                sessionStorage.setItem('attendanceData', JSON.stringify(tempDataStore.attendances));
            }
            if (consoleOn === "Y") {
                console.log("근태 저장 완료", JSON.parse(sessionStorage.getItem('attendanceData')))
            }

        }
        // 7. 페이지 로드 시 데이터들을 가져오는 함수 호출
        fetchEmployeeData("Y"); // 콘솔을 확인하려면 "Y"를 파라미터로 주라
        fetchGroupData(); // 콘솔을 확인하려면 "Y"를 파라미터로 주라
        fetchWorkData(); // 콘솔을 확인하려면 "Y"를 파라미터로 주라
        fetchVacationData(); // 콘솔을 확인하려면 "Y"를 파라미터로 주라
        fetchAttendanceData("Y");// 콘솔을 확인하려면 "Y"를 파라미터로 주라
    }, [account])




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
            <div style={{ display: 'flex', width: "1920px" }}>
                <div style={{ display: 'flex', width: "320px" }}>
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

                </div>
                <div id='changableView' style={{ width: "1600px" }} >
                    {/* 현재 선택된 컴포넌트 표시 */}
                    {textValue}
                </div>
            </div>
        </div>
    );
}

export default Main;
