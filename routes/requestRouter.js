const express = require('express');
const requestRouter = express.Router(); // ✅ 정확하게 requestRouter!!
const conn = require("../config/db"); // DB 연결
const { data } = require('react-router-dom');

//-----------------------------
// [1] 근무 요청 (휴가/병가)
//-----------------------------
requestRouter.post("/leave", (request, response) => {
    console.log("✅ [백엔드] 휴가 신청 요청 받음");  // 백엔드 요청 확인
    console.log("받은 데이터:", request.body); // 받은 데이터 확인

    const {req_idx ,req_type, req_content, emp_id, start_date, end_date } = request.body;
    // ✅ 1. 필수 데이터 확인
    // if (!emp_id || !start_date || !end_date || !reason || !type) {
    //     //return 
    //     response.status(400).json({ error: "❌ 필수 데이터 누락(emp_id 포함)" });
    // }

    // ✅ 2. 'type' 값 검증 (휴가 또는 병가만 허용)
    const allowedTypes = ["휴가", "병가"];
    if (!allowedTypes.includes(req_type)) {
        return response.status(400).json({ error: "❌ 유효하지 않은 휴가 유형입니다." });
    }

    // ✅ 3. 날짜 유효성 검사 (시작 날짜가 종료 날짜보다 늦으면 오류)
    if (new Date(start_date) > new Date(end_date)) {
        return response.status(400).json({ error: "❌ 종료 날짜가 시작 날짜보다 빠를 수 없습니다." });
    }

    //const content = `${start_date} ~ ${end_date} (${req_content})`;

    const sql = `
        INSERT INTO tb_request (req_idx ,req_type, req_content, emp_id, start_date, end_date)
        VALUES (? ,?, ?, ?, ?, ?)
    `;

    // 확인용 !!!!!!!!
    console.log(conn);

    // ✅ 4. DB 연결 에러 체크 및 쿼리 실행
    if (!conn) {
        console.error("❌ DB 연결이 설정되지 않았습니다.");
        return response.status(500).json({ error: "DB 연결 오류" });
    }

    conn.query(sql, [req_idx ,req_type, req_content, emp_id, start_date, end_date], (error, result) => {
        //req_idx, req_type, req_content, emp_id, start_date, end_date, origin_date, origin_time, change_date, change_time, created_at, req_status, approved_at, admin_id
        if (error) {
            console.error("❌ 근무 요청 등록 실패:", error);
            return response.status(500).json({ error: "DB 오류" });
        }

        console.log("✅ 근무 요청 등록 성공:", result);
        response.json({ message: "✅ 휴가/병가 신청 완료!", detail: result });
    });
});

//-----------------------------
// [2] 근무 교대 요청
//-----------------------------
requestRouter.post("/shifts", (request, response) => {
    console.log("✅ [백엔드] 변경 신청 요청 받음");  // 백엔드 요청 확인
    console.log("받은 데이터:",request.body); // 받은 데이터 확인

    const { req_idx ,req_type, req_content, emp_id, origin_date, origin_time, change_date, change_time } = request.body;
    // req_idx, req_type, req_content, emp_id, origin_date, origin_time, change_date, change_time, created_at, req_status

    const sql = `
        INSERT INTO tb_request (req_idx ,req_type, req_content, emp_id, origin_date, origin_time, change_date, change_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // 확인용 !!!!!!!!
    // console.log(conn);

    conn.query(sql, [req_idx ,req_type, req_content, emp_id, origin_date, origin_time, change_date, change_time], (error, result) => {
        if (error) {
            console.error("❌ 근무 변경 요청 실패:", error);
            return response.status(500).json({ error: "DB 오류" });
        }

        console.log("✅ 근무 변경 요청 성공:", result);
        response.json({ message: "✅ 근무 교대 요청 완료!", detail: result });
    });
});

//-----------------------------
// [3] 요청 내역 조회
//-----------------------------
requestRouter.post("/list/getlist", (request, response) => {
    // 요청에서 emp_id 가져오기
    console.log("받은 데이터1:",request.body); // 받은 데이터 확인
    const { ids } = request.body; // req.body에서 ids라는 배열로 여러 ID를 전달받음
    console.log("받은 데이터2:", ids); // 받은 데이터 확인
    //console.log("📋 요청 내역 조회:", emp_id);

    //SQL 쿼리: 요청 유형(req_type)에 따라 필요한 컬럼만 조회
    const sql = `
        SELECT 
            req_type, 
            req_status,
            req_content,
            -- 병가 및 휴가 관련 데이터
            CASE 
                WHEN req_type IN ('병가', '휴가') THEN start_date
                ELSE NULL
            END AS start_date,
            CASE 
                WHEN req_type IN ('병가', '휴가') THEN end_date
                ELSE NULL
            END AS end_date,

            -- 근무변경 관련 데이터
            CASE 
                WHEN req_type = '근무변경' THEN origin_date
                ELSE NULL
            END AS origin_date,
            CASE 
                WHEN req_type = '근무변경' THEN origin_time
                ELSE NULL
            END AS origin_time,
            CASE 
                WHEN req_type = '근무변경' THEN change_date
                ELSE NULL
            END AS change_date,
            CASE 
                WHEN req_type = '근무변경' THEN change_time
                ELSE NULL
            END AS change_time
        FROM tb_request
        WHERE emp_id IN (?)
        ORDER BY created_at DESC
    `;

    // DB 조회 실행
    conn.query(sql, [ids], (error, result) => {
        //console.log(result);
        if (result) {
            return response.status(200).json({ message: "해당 직원의 요청 내역이 없습니다.", data : result }); // ✅ JSON 응답
        }

        if (error) {
            console.error("❌ 요청 내역 조회 실패:", error);
            return response.status(500).json({ error: "DB 조회 실패" });
        }


        // // 조회된 데이터 반환
        // response.json(rows);
    });
});

//-----------------------------
// [4] 요청 수정
//-----------------------------
// requestRouter.put("/update/:req_idx", (request, response) => {
//     const { req_idx } = request.params;
//     const { req_content } = request.body;

//     if (!req_content) {
//         return response.status(400).json({ error: "❌ 수정할 내용이 필요합니다." });
//     }

//     const sql = `UPDATE tb_request SET req_content = ? WHERE req_idx = ?`;

//     conn.query(sql, [req_content, req_idx], (error, result) => {
//         if (error) {
//             console.error("❌ 요청 수정 실패:", error);
//             return response.status(500).json({ error: "DB 오류" });
//         }

//         console.log("✅ 요청 수정 성공:", result);
//         response.json({ message: "✅ 요청이 성공적으로 수정되었습니다." });
//     });
// });

//-----------------------------
// [5] 요청 삭제
//-----------------------------
// requestRouter.delete("/delete/:req_idx", (request, response) => {
//     const { req_idx } = request.params;

//     const sql = `DELETE FROM tb_request WHERE req_idx = ?`;

//     conn.query(sql, [req_idx], (error, result) => {
//         if (error) {
//             console.error("❌ 요청 삭제 실패:", error);
//             return response.status(500).json({ error: "DB 오류" });
//         }

//         console.log("✅ 요청 삭제 성공:", result);
//         response.json({ message: "✅ 요청이 성공적으로 삭제되었습니다." });
//     });
// });

//-----------------------------
// 모듈 내보내기
//-----------------------------
module.exports = requestRouter;
