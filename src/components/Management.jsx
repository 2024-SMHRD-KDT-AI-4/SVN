import React, { useState } from 'react';
import styles from "../Group.module.css";
import ManWorkers from "./ManWorkers";  // ManWorkers 컴포넌트 임포트
import ManGroup from "./ManGroup";  // ManGroup 컴포넌트 임포트

const Management = () => {
    const [status, setStatus] = useState(0);  // 현재 선택된 탭의 상태 관리

    // 각 탭 클릭 시 해당 탭의 콘텐츠를 변경
    const onClickTab = (index) => {
        setStatus(index);  // 클릭된 탭의 인덱스를 상태로 설정
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "1600px"}}>
            {/* 탭 버튼들 */}
            <div className={styles.manageBtns}>
                <span className={styles.workerTab} onClick={() => onClickTab(0)}>직원</span>
                <span className={styles.groupTab} onClick={() => onClickTab(1)}>조직</span>
                <span className={styles.groupTab} onClick={() => onClickTab(2)}>근로정보</span>
            </div>
            {/* 수평선의 스타일을 조정해보기 */}
            <hr style={{ margin: "10px 0" }} />
            <div className={styles.content}>
                {/* 상태에 맞는 탭의 콘텐츠 렌더링 */}
                {status === 0 && <ManWorkers />}  {/* 직원 탭 클릭 시 ManWorkers 컴포넌트 렌더링 */}
                {status === 1 && <ManGroup />}  {/* 조직 탭 클릭 시 조직 관리 내용 */}
                {status === 2 && <div>근로정보 컴포넌트</div>}  {/* 근로정보 탭 클릭 시 근로정보 내용 */}
            </div>
        </div>
    );
};

export default Management;
