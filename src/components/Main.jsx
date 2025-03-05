import React, { useState, useEffect } from 'react';
//import axios from 'axios';
import Buttons from './Buttons';
import Calendar from './Calendar';
import Attendance from './Attendance';
import '../App.css';

const Main = () => {

    const [textValue, setTextValue] = useState('메인화면');
    const [account, setAccount] = useState({ name: '', role: '' }) // 계정의 정보를 가져오기
    //const check = true; // You can toggle this value to see the conditional rendering in action

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const response = await fetch('/api/account'); // 서버에서 계정 정보 요청
                if (!response.ok) throw new Error('Failed to fetch account data');
                const data = await response.json();
                setAccount(data); // 계정 정보 업데이트
            } catch (error) {
                console.error('Error fetching account data:', error);
                setAccount({ name: '김예은', role: '관리자' })
            }
        };

        fetchAccount();
    }, []); // 빈 배열 -> 컴포넌트가 처음 렌더링될 때만 실행

    return (
        <div>
            <div id='profile'>
                <span id='logo'>
                    SAVANNAH
                </span>
                <div id = "account">
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
                    <Buttons name={'요청하기'} func={() => { setTextValue('요청하기'); }} />

                    {account.role === "관리자" && (
                        <>
                            <Buttons name={'스케줄 생성'} func={() => { setTextValue('스케줄 생성'); }} auth={true} />
                            <Buttons name={'관리하기'} func={() => { setTextValue('관리하기'); }} auth={true} />
                            <Buttons name={'통계 및 분석'} func={() => { setTextValue('통계 및 분석'); }} auth={true} />
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
