import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../MainPage.module.css';  // CSS 파일 import

const MainPage = () => {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [showModal, setShowModal] = useState(false);  // 모달 표시 상태 관리
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // 폼의 기본 제출 동작 방지

        try {
            // 로그인 요청: id, pw을 서버로 전송
            const response = await axios.post('user/login', { id, pw }); // sub라우터에 로그인요청보냄

            if (response.data.success) { // 요청을 받아 라우터에서 로직이 성공적으로 수행되었다면
                const userData = response.data.user; // 서버에서 반환한 사용자 정보
                //console.log('사용자 정보:', userData);

                // 로컬스토리지에 사용자 정보 저장 (email 제외)
                sessionStorage.setItem('user', JSON.stringify(userData));

                // 시스템 페이지로 이동
                navigate('/system');
            } else {
                alert(response.data.message || '로그인 실패');
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            alert('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        }
    };
    const editerLogin = async () => {
        //e.preventDefault(); // 폼의 기본 제출 동작 방지
        // id와 pw를 자동으로 입력
        const id = 'kanginoh';
        const pw = '12345';

        try {
            // 로그인 요청: id, pw을 서버로 전송
            const response = await axios.post('user/login', { id, pw }); // sub라우터에 로그인요청보냄

            if (response.data.success) { // 요청을 받아 라우터에서 로직이 성공적으로 수행되었다면
                const userData = response.data.user; // 서버에서 반환한 사용자 정보
                //console.log('사용자 정보:', userData);

                // 로컬스토리지에 사용자 정보 저장 (email 제외)
                sessionStorage.setItem('user', JSON.stringify(userData));

                // 시스템 페이지로 이동
                navigate('/system');
            } else {
                alert(response.data.message || '로그인 실패');
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            navigate('/system');
            //alert('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        }
    };
    return (
        <div className={styles.pageContainer}>
            <div style={{border: ""}}>
                <div className={styles.container}>
                    <span className={styles.our}>SAVANNAH</span>
                </div>

                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        name="id"
                        placeholder="아이디를 입력하세요."
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        name="pw"
                        placeholder="비밀번호를 입력하세요."
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        required
                    />
                    <br/>
                    <button className={styles.btnLogin} type="submit">로그인</button>
                </form>

                <div style={{
                    display: "flex",
                    flexDirection: "row", // 버튼들을 수평으로 배치
                    justifyContent: "center", // 세로 방향 중앙 정렬
                    //marginTop: "5px"
                    // height: "100vh", // 화면 전체 높이를 차지하게 설정
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "center", // 세로 방향 중앙 정렬
                        // height: "100vh", // 화면 전체 높이를 차지하게 설정
                    }}>
                        <button
                            className={styles.RUFirst}
                            style={{
                                width: "180px", // 버튼 고정 너비
                                padding: "10px 20px", // 내부 여백
                                margin: "20px 15px", // 버튼 간 간격
                            }}
                            onClick={() => setShowModal(true)}
                        >
                            처음이신가요?
                        </button>
                    </div>
                    <div style={{
                        display: "flex",
                        justifyContent: "center", // 세로 방향 중앙 정렬
                        // height: "100vh", // 화면 전체 높이를 차지하게 설정
                    }}>
                        <button
                            className={styles.RUFirst}
                            style={{
                                width: "180px", // 버튼 고정 너비
                                padding: "10px 20px", // 내부 여백
                                margin: "20px 15px", // 버튼 간 간격
                            }}
                            onClick={() => editerLogin()}
                        >
                            접속skip(개발자용)
                        </button>
                    </div>

                </div>

                {/* 모달 */}
                {showModal && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <span className={styles.close} onClick={() => setShowModal(false)}>&times;</span>
                            <h2>가입하기</h2>
                            <form action="user/join" method="post">
                                <input type="text" name="act_id" placeholder="아이디를 입력하세요." maxlength="" />
                                <input type="password" name="act_pw" placeholder="비밀번호를 입력하세요." />
                                <input type="text" name="act_name" placeholder="이름을 입력하세요." />
                                <input type="text" name="act_mail" placeholder="이메일을 입력하세요." />
                                <button type="submit">회원가입</button>
                                <button type="button" onClick={() => setShowModal(false)}>나가기</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MainPage;
