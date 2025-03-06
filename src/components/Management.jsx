import { React, useState } from 'react';
import styles from "../Group.module.css";
import ManWorkers from "./ManWorkers"
const Management = () => {
    const [status, setStatus] = useState("");
    // 각 박스의 제목과 내용

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {/* 올해 근무 현황 */}
            <div className={styles.manageBtns}>
                <span className={styles.workerTab}>직원</span>
                <span className={styles.groupTab}>조직</span>
            </div>

            <div className={styles.content}>
                <hr/>
                <ManWorkers />
            </div>
        </div>
    );
}



export default Management