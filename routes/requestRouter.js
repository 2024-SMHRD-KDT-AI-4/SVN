const express = require('express');
const requestRouter = express.Router(); // ✅ 정확하게 requestRouter!!
const conn = require("../config/db"); // DB 연결

//-----------------------------
// [1] 근무 요청 (휴가/병가)
//-----------------------------
requestRouter.post("/leave", (request, response) => {
    console.log(request.body); // 받은 데이터 확인

    const { emp_id, start_date, end_date, reason, type } = request.body;

    // 데이터 누락 확인
    if (!emp_id || !start_date || !end_date || !reason || !type) {
        return response.status(400).json({ error: "❌ 필수 데이터 누락" });
    }

    const content = `${start_date} ~ ${end_date} (${reason})`;

    const sql = `
        INSERT INTO tb_request (req_type, req_content, emp_id, start_date, end_date, created_at, req_status)
        VALUES (?, ?, ?, ?, ?, NOW(), '대기')
    `;

    conn.query(sql, [type, content, emp_id, start_date, end_date], (error, result) => {
        if (error) {
            console.error("❌ 근무 요청 등록 실패:", error);
            return response.status(500).json({ error: "DB 오류" });
        }

        console.log("✅ 근무 요청 등록 성공:", result);
        response.json({ message: "✅ 휴가/병가 신청 완료!", detail: content });
    });
});

//-----------------------------
// [2] 근무 교대 요청
//-----------------------------
requestRouter.post("/shift-change", (request, response) => {
    console.log(request.body);

    const { emp_id, current_date, current_shift, target_date, target_shift } = request.body;

    if (!emp_id || !current_date || !current_shift || !target_date || !target_shift) {
        return response.status(400).json({ error: "❌ 필수 데이터 누락" });
    }

    const content = `변경 요청: ${current_date} '${current_shift}' → ${target_date} '${target_shift}'`;

    const sql = `
        INSERT INTO tb_request (req_type, req_content, emp_id, created_at, req_status)
        VALUES ('근무변경', ?, ?, NOW(), '대기')
    `;

    conn.query(sql, [content, emp_id], (error, result) => {
        if (error) {
            console.error("❌ 근무 변경 요청 실패:", error);
            return response.status(500).json({ error: "DB 오류" });
        }

        console.log("✅ 근무 변경 요청 성공:", result);
        response.json({ message: "✅ 근무 교대 요청 완료!", detail: content });
    });
});

//-----------------------------
// [3] 요청 내역 조회
//-----------------------------
requestRouter.get("/list/:emp_id", (request, response) => {
    const { emp_id } = request.params;
    console.log("📋 요청 내역 조회:", emp_id);

    const sql = `SELECT * FROM tb_request WHERE emp_id = ? ORDER BY created_at DESC`;

    conn.query(sql, [emp_id], (error, rows) => {
        if (error) {
            console.error("❌ 요청 내역 조회 실패:", error);
            return response.status(500).json({ error: "DB 조회 실패" });
        }

        response.json(rows);
    });
});

//-----------------------------
// [4] 요청 수정
//-----------------------------
requestRouter.put("/update/:req_idx", (request, response) => {
    const { req_idx } = request.params;
    const { req_content } = request.body;

    if (!req_content) {
        return response.status(400).json({ error: "❌ 수정할 내용이 필요합니다." });
    }

    const sql = `UPDATE tb_request SET req_content = ? WHERE req_idx = ?`;

    conn.query(sql, [req_content, req_idx], (error, result) => {
        if (error) {
            console.error("❌ 요청 수정 실패:", error);
            return response.status(500).json({ error: "DB 오류" });
        }

        console.log("✅ 요청 수정 성공:", result);
        response.json({ message: "✅ 요청이 성공적으로 수정되었습니다." });
    });
});

//-----------------------------
// [5] 요청 삭제
//-----------------------------
requestRouter.delete("/delete/:req_idx", (request, response) => {
    const { req_idx } = request.params;

    const sql = `DELETE FROM tb_request WHERE req_idx = ?`;

    conn.query(sql, [req_idx], (error, result) => {
        if (error) {
            console.error("❌ 요청 삭제 실패:", error);
            return response.status(500).json({ error: "DB 오류" });
        }

        console.log("✅ 요청 삭제 성공:", result);
        response.json({ message: "✅ 요청이 성공적으로 삭제되었습니다." });
    });
});

//-----------------------------
// 모듈 내보내기
//-----------------------------
module.exports = requestRouter;
