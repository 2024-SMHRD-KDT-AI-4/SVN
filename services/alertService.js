const db = require('../config/db');

// 📌 알림 저장 함수
async function sendAlert(emp_id, sche_idx, message) {
    try {
        const now = new Date().toISOString().slice(0, 19).replace("T", " ");
        const sql = "INSERT INTO tb_alert (emp_id, sche_idx, alert_msg, created_at, confirmed_yn) VALUES (?, ?, ?, ?, 'N')";
        await db.execute(sql, [emp_id, sche_idx, message, now]);
        console.log(`🔔 알림 저장 완료! 직원ID: ${emp_id}, 메시지: "${message}"`);
    } catch (err) {
        console.error("❌ 알림 저장 오류:", err);
    }
}

// 📌 스케줄 변경 감지
async function checkScheduleChanges() {
    try {
        const [results] = await db.execute("SELECT sche_idx, emp_id FROM tb_schedule WHERE sche_status = '변경됨'");
        for (const row of results) {
            const message = "📅 근무 일정이 변경되었습니다! 스케줄을 확인하세요.";
            await sendAlert(row.emp_id, row.sche_idx, message);
            await db.execute("UPDATE tb_schedule SET sche_status = '확정' WHERE sche_idx = ?", [row.sche_idx]);
        }
    } catch (err) {
        console.error("❌ 스케줄 변경 조회 오류:", err);
    }
}

// 📌 근무 요청 승인 감지
async function checkRequestApprovals() {
    try {
        const [results] = await db.execute("SELECT req_idx, emp_id FROM tb_request WHERE req_status = '승인'");
        for (const row of results) {
            const message = "✅ 근무 요청이 승인되었습니다! 변경된 일정을 확인하세요.";
            await sendAlert(row.emp_id, row.req_idx, message);
            await db.execute("UPDATE tb_request SET req_status = '완료' WHERE req_idx = ?", [row.req_idx]);
        }
    } catch (err) {
        console.error("❌ 근무 요청 승인 조회 오류:", err);
    }
}

// 📌 10초마다 변경 사항 감지하여 자동 알림 전송
setInterval(() => {
    console.log("🔍 변경 사항 확인 중...");
    checkScheduleChanges();
    checkRequestApprovals();
}, 10000); // 10초마다 실행

console.log("🚀 자동 알림 시스템 실행 중...");

// ✅ 외부로 함수 내보내기
module.exports = { checkScheduleChanges, checkRequestApprovals, sendAlert };
