import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axios를 사용하여 서버로부터 데이터 가져오기
import Buttons from './Buttons';
import Calendar from './Calendar';
import Chatting from './Chatting';
import Attendance from './Attendance';
import Management from './Management';
import Schedule from './Schedule';
import RequestForm from './RequestForm';
import QNA from './QNA';
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
        const fetchWorkerData = async () => {
            try {
                // 서버에 GET 요청을 보내 직원 데이터를 가져옴
                const response = await axios.get('/management/getEmployees');
                const fetchedWorkerData = response.data.data; // 서버에서 받은 직원 데이터
                //console.log(fetchedWorkerData)
                // 4. 받은 데이터를 세션 저장소에 저장
                sessionStorage.setItem('workerData', JSON.stringify(fetchedWorkerData));

                // // 5. 상태 업데이트하여 UI에 직원 데이터를 반영
                // setWorkerData(fetchedWorkerData);
            } catch (error) {
                // 6. 서버에서 데이터를 가져오는 데 실패한 경우 오류 처리
                console.error("직원 데이터를 가져오는 데 실패했습니다.", error);
            }
        };

        // 7. 페이지 로드 시 직원 데이터를 가져오는 함수 호출
        fetchWorkerData();

    }, []); // 빈 배열이므로 이 useEffect는 컴포넌트가 처음 렌더링될 때만 실행됩니다.

    return (
        <div>
            {/* 사용자 프로필 영역 */}
            <div id='profile'>
                <span id='logo'>SAVANNAH</span>
                <div id="account">
                    {/* 사용자 정보 표시 */}
                    <h3 id='welcome'>환영합니다. {account.name}님!({account.role})</h3>
                    {/* 알림표시 아이콘 */}
                    <img src="#" alt="알림" srcset="" />
                     {/* 계정 접속자의 사진 */}
                    <img src="#" alt="사진" srcset="" />
                </div>
            </div>
            <hr />
            <div style={{ display: 'flex' }}>
                <div id='buttonGroup'>
                    <Buttons className="funcButton" name={'메인'} func={() => { setTextValue(<Calendar />); }} />              
                    <Buttons className="funcButton" name={'채팅'} func={() => { setTextValue(<Chatting />); }} />
                    <Buttons className="funcButton" name={'할일'} func={() => { setTextValue(<Attendance />); }} />
                    <Buttons className="funcButton" name={'요청하기'} func={() => { setTextValue(<RequestForm />); }} />

                    {account.role === "관리자" && (
                        <>
                            <Buttons className="funcButton_auth" name={'스케줄 생성'} func={() => { setTextValue(<Schedule />); }} auth={true} />
                            <Buttons className="funcButton_auth" name={'관리하기'} func={() => { setTextValue(<Management />); }} auth={true} />
                            <Buttons className="funcButton_auth" name={'QNA'} func={() => { setTextValue(<QNA />); }} auth={true} />
                        </>
                    )}
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
