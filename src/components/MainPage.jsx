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
        e.preventDefault();

        try {
            const response = await axios.post('user/login', { id, pw });

            if (response.data.success) {
                navigate('/system');
            } else {
                alert(response.data.message || '로그인 실패');
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            alert('로그인 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.pageContainer}>
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
                <button className={styles.btnLogin} type="submit">로그인</button>
            </form>

            <button className={styles.RUFirst} onClick={() => setShowModal(true)}>처음이신가요?</button>
            <a href="/system">접속없이 바로 들어가기</a>

            {/* 모달 */}
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <span className={styles.close} onClick={() => setShowModal(false)}>&times;</span>
                        <h2>가입하기</h2>
                        <form action="user/join" method="post">
                            <input type="text" name="act_id" placeholder="아이디를 입력하세요." maxlength="" />
                            <input type="password" name="act_pw" placeholder="비밀번호를 입력하세요."/>
                            <input type="text" name="act_name" placeholder="이름을 입력하세요."/>
                            <input type="text" name="act_mail" placeholder="이메일을 입력하세요."/>
                            <button type="submit">회원가입</button>
                            <button type="button" onClick={() => setShowModal(false)}>나가기</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainPage;
