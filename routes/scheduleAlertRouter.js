const express = require('express');
const conn = require("../config/db");

// ⭐ io 주입 가능하도록 함수로 export
module.exports = function (io) {
  const router = express.Router();
  const chatTB = "td_chating";
  const scheduleTB = "tb_schedule";

  // ✅ [스케줄 생성 API]
  router.post("/schedule/create", (request, response) => {
    const { sche_title, sche_content, st_dt, st_tm, ed_dt, ed_tm, sche_status, emp_id, chat_name } = request.body;

    // ⭐ sche_file, sche_color 빈 문자열로 추가 (NOT NULL 컬럼)
    const scheduleSql = `
        INSERT INTO ${scheduleTB} 
        (sche_title, sche_content, sche_file, st_dt, st_tm, ed_dt, ed_tm, sche_status, sche_color, emp_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // ✅ 쿼리 실행
    conn.query(
      scheduleSql,
      [sche_title, sche_content, '', st_dt, st_tm, ed_dt, ed_tm, sche_status, '', emp_id],
      (error, result) => {
        if (error) {
          console.error("❌ 스케줄 저장 실패:", error);
          return response.status(500).json({ success: false, message: "스케줄 저장 실패" });
        }

        // ✅ [알림 채팅 저장]
        const chat_message = "스케줄 생성 완료. 확인요망.";
        const created_at = new Date();

        const chatSql = `
            INSERT INTO ${chatTB} (chat_name, chat_message, created_at)
            VALUES (?, ?, ?)
        `;
        conn.query(chatSql, [chat_name, chat_message, created_at], (chatErr, chatRes) => {
          if (chatErr) {
            console.error("❌ 채팅 테이블 저장 실패:", chatErr);
            return response.status(500).json({ success: false, message: "채팅 DB 오류" });
          }

          // ✅ [소켓 알림 전송]
          io.emit("scheduleAlert", chat_message);

          // ✅ 최종 응답
          return response.json({ success: true, message: "스케줄 생성 및 알림 완료" });
        });
      }
    );
  });

  return router; // ⭐ 잊지 말고 반환
};
