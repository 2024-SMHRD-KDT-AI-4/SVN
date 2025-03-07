import React, { useState, useEffect } from 'react';
//import axios from 'axios';
import Buttons from './Buttons';
import Calendar from './Calendar';
import Attendance from './Attendance';
import Management from './Management';
import Schedule from './Schedule';
import '../App.css';
import RequestForm from './RequestForm';
import QNA from './QNA';

const Main = () => {
    const temps = [
        {
            emp_id: "241210001",
            emp_name: "김예은",
            emp_role: "팀장",
            emp_firstDate: "2024.12.10",
            emp_group: "백엔드",
            emp_birthDate: "2001.05.07",
            emp_phone: "010-0000-0000",
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
            created_at: "2024.12.10"
        }
    ];
    const [textValue, setTextValue] = useState(<Calendar />);
    const [account, setAccount] = useState() // 계정의 정보를 가져오기
    
    useEffect(() => {
        const storedUser = localStorage.getItem('user'); // 저장된 사용자 정보 가져오기
    
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setAccount({
                id: "temp", // 기본적으로 "temp"로 설정
                name: userData.name, 
                role: userData.role
            }); // 저장된 사용자 정보로 상태 업데이트
        } else {
            // 로그인되지 않은 상태 처리 (필요시)
            console.log('로그인되지 않은 사용자');
            setAccount({
                id: "temp", // 기본적으로 "temp"로 설정
                name: '김예은', 
                role: '관리자'
            });
        }
    }, []);

    return (
        <div>
            <div id='profile'>
                <span id='logo'>
                    SAVANNAH
                </span>
                <div id="account">
                    <span>
                        <h3 id='welcome'>환영합니다. {account.name}님!({account.role})</h3>
                    </span>
                    <span>
                        <img
                            id='picture'
                            src={account.imageUrl || null}
                            alt="알림"
                            onClick={() => console.log('알림 클릭')}
                        />
                    </span>
                    <span>
                        <img
                            id='picture'
                            src={account.imageUrl || null}
                            alt="증명사진"
                            onClick={() => console.log('프로파일 클릭 설정창')}
                        />
                    </span>
                </div>

            </div>
            <hr />
            <div style={{ display: 'flex' }}>
                <div id='buttonGroup'>
                    <Buttons name={'메인'} func={() => { setTextValue(<Calendar />); }} />
                    <Buttons name={'작은달력'} func={() => { setTextValue('작은달력'); }} />
                    <Buttons name={'할일'} func={() => { setTextValue(<Attendance />); }} />
                    <Buttons name={'요청하기'} func={() => { setTextValue(<RequestForm />); }} />

                    {account.role === "관리자" && (
                        <>
                            <Buttons name={'스케줄 생성'} func={() => { setTextValue(<Schedule />); }} auth={true} />
                            <Buttons name={'관리하기'} func={() => { setTextValue(<Management />); }} auth={true} />
                            <Buttons name={'QNA'} func={() => { setTextValue(<QNA />); }} auth={true} />
                        </>
                    )}
                </div>
                <div id='changableView'>
                    {textValue}
                </div>
            </div>
        </div>
    );
}

export default Main;
