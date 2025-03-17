const express = require('express');
const path = require('path');
const managementRouter = express.Router();
const conn = require("../config/db"); // DB 연결
const { request } = require('http');

// React 빌드 폴더 경로
const employeeTB = "tb_employee"; // DB테이블의 이름
const groupTB = "tb_group"; // DB테이블의 이름
const workTB = "tb_work"; // DB테이블의 이름
const requestTB = "tb_request"; // DB테이블의 이름
const attendanceTB = "tb_attendance"

// POST 요청을 처리하기 위한 미들웨어 설정
managementRouter.use(express.json()); // 요청 본문을 JSON으로 파싱

// 직원 데이터를 가져오는 라우터
managementRouter.get('/getEmployees', async (req, res) => {
    // DB에서 직원 데이터 가져오기
    const sql = `SELECT * FROM cgi_24K_AI4_p2_3.${employeeTB}`;

    try {
        conn.query(sql, (error, result) => {
            if (error) {
                console.error('DB 조회 에러:', error);
                res.status(500).json({ message: 'DB 조회 오류', error: error.message });
                return;
            }

            if (result?.length > 0) {
                // 직원 데이터가 성공적으로 반환되었을 때
                //console.log('직원 데이터 로드 완료:', result);
                res.status(200).json({ message: '직원 데이터 로드 완료', data: result });
            } else {
                //console.log('직원 데이터 없음');
                res.status(404).json({ message: '직원 데이터 없음', data: null });
            }
        });
    } catch (error) {
        console.error('직원 데이터를 가져오는 중 에러:', error);
        res.status(500).json({ message: '직원 데이터 가져오기 오류', error: error.message });
    }
});

// 직원 데이터를 추가하는 라우터
managementRouter.post('/addEmployees', async (req, res) => {
    const { employeeId, name, position, joinDate, department, dob, phone, email, accoutId } = req.body;

    const sql = `
        INSERT INTO ${employeeTB} (emp_id, emp_name, emp_role, emp_firstDate, emp_group, emp_birthDate, emp_phone, emp_email ,act_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ? ,?)
    `;

    try {
        conn.query(sql, [employeeId, name, position, joinDate, department, dob, phone, email, accoutId], (error, result) => {
            if (error) {
                console.error('직원 추가 중 오류:', error);
                res.status(500).json({ message: '직원 추가 실패', error: error.message });
                return;
            }

            if (result?.affectedRows > 0) {
                //console.log('직원 추가 성공:', result);
                res.status(201).json({ message: '직원 추가 성공', data: result });
            } else {
                console.log('직원 추가 실패: 변화 없음');
                res.status(500).json({ message: '직원 추가 실패', data: null });
            }
        });
    } catch (error) {
        console.error('직원 추가 중 오류:', error);
        res.status(500).json({ message: '직원 추가 오류', error: error.message });
    }
});

// 직원 데이터를 삭제하는 라우터
managementRouter.post('/dltEmployees', async (req, res) => {
    const { ids } = req.body; // req.body에서 ids라는 배열로 여러 ID를 전달받음

    // 요청받은 데이터가 문자열일 경우 파싱
    if (typeof ids === 'string') {
        try {
            ids = JSON.parse(ids); // 문자열을 배열로 변환
        } catch (error) {
            return res.status(400).json({ message: '잘못된 데이터 형식입니다.' });
        }
    }

    // 여러 ID를 DELETE하기 위해 IN 절 사용
    const sql = `DELETE FROM ${employeeTB} WHERE emp_id IN (?);`;

    try {
        conn.query(sql, [ids], (error, result) => {
            if (error) {
                console.error('직원 삭제 중 오류:', error);
                return res.status(500).json({ message: '직원 삭제 오류', error: error.message });
            }

            if (result.affectedRows > 0) {
                res.status(200).json({ message: '직원 삭제 성공', data: result });
            } else {
                res.status(404).json({ message: '삭제할 직원이 없습니다.', data: null });
            }
        });
    } catch (error) {
        console.error('직원 삭제 중 예외:', error);
        res.status(500).json({ message: '직원 삭제 중 서버 오류', error: error.message });
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////직책처리///////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

// 직책 데이터를 가져오는 라우터
managementRouter.get('/getGroup', async (req, res) => {
    // DB에서 직책 데이터 가져오기
    const sql = `SELECT * FROM cgi_24K_AI4_p2_3.${groupTB}`;
    try {
        conn.query(sql, (error, result) => {
            if (error) {
                console.error('DB 조회 에러:', error);
                res.status(500).json({ message: 'DB 조회 오류', error: error.message });
                return;
            }

            if (result?.length > 0) {
                // 직책 데이터가 성공적으로 반환되었을 때
                //console.log('직책 데이터 로드 완료:', result);
                res.status(200).json({ message: '직책 데이터 로드 완료', data: result });
            } else {
                //console.log('직책 데이터 없음');
                res.status(404).json({ message: '직책 데이터 없음', data: null });
            }
        });
    } catch (error) {
        console.error('직책 데이터를 가져오는 중 에러:', error);
        res.status(500).json({ message: '직책 데이터 가져오기 오류', error: error.message });
    }
});

// 직책 데이터를 추가하는 라우터
managementRouter.post('/addGroup', async (req, res) => {
    const { group_id, group_name, group_desc, group_pos, created_at} = req.body;
    const sql = `
    INSERT INTO ${groupTB} (group_id, group_name, group_desc, group_pos, created_at) VALUES (?, ?, ?, ?, ?)`;

    try {
        conn.query(sql, [group_id, group_name, group_desc, group_pos, created_at], (error, result) => {
            if (error) {
                console.error('직책 추가 중 오류:', error);
                res.status(500).json({ message: '직책 추가 실패', error: error.message });
                return;
            }

            if (result?.affectedRows > 0) {
                //console.log('직원 추가 성공:', result);
                res.status(201).json({ message: '직책 추가 성공', data: result });
            } else {
                console.log('그룹 추가 실패: 변화 없음');
                res.status(500).json({ message: '직책 추가 실패', data: null });
            }
        });
    } catch (error) {
        console.error('직책 추가 중 오류:', error);
        res.status(500).json({ message: '직책 추가 오류', error: error.message });
    }
});

// 그룹 데이터를 삭제하는 라우터
managementRouter.post('/dltGroup', async (req, res) => {
    const { ids } = req.body; // req.body에서 ids라는 배열로 여러 ID를 전달받음

    // 요청받은 데이터가 문자열일 경우 파싱
    if (typeof ids === 'string') {
        try {
            ids = JSON.parse(ids); // 문자열을 배열로 변환
        } catch (error) {
            return res.status(400).json({ message: '잘못된 데이터 형식입니다.' });
        }
    }

    // 여러 ID를 DELETE하기 위해 IN 절 사용
    const sql = `DELETE FROM ${groupTB} WHERE group_id IN (?);`;

    try {
        conn.query(sql, [ids], (error, result) => {
            if (error) {
                console.error('직책 삭제 중 오류:', error);
                return res.status(500).json({ message: '직책 삭제 오류', error: error.message });
            }

            if (result.affectedRows > 0) {
                res.status(200).json({ message: '직책 삭제 성공', data: result });
            } else {
                res.status(404).json({ message: '삭제할 직책이 없습니다.', data: null });
            }
        });
    } catch (error) {
        console.error('직책 삭제 중 예외:', error);
        res.status(500).json({ message: '직책 삭제 중 서버 오류', error: error.message });
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////근무처리///////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

// 근무 데이터를 가져오는 라우터
managementRouter.get('/getWork', async (req, res) => {
    // DB에서 직원 데이터 가져오기
    const sql = `SELECT * FROM cgi_24K_AI4_p2_3.${workTB}`;
    try {
        conn.query(sql, (error, result) => {
            if (error) {
                console.error('DB 조회 에러:', error);
                res.status(500).json({ message: 'DB 조회 오류', error: error.message });
                return;
            }

            if (result?.length > 0) {
                // 근무 데이터가 성공적으로 반환되었을 때
                //console.log('근무 데이터 로드 완료:', result);
                res.status(200).json({ message: '근무 데이터 로드 완료', data: result });
            } else {
                //console.log('근무 데이터 없음');
                res.status(404).json({ message: '근무 데이터 없음', data: null });
            }
        });
    } catch (error) {
        console.error('근무 데이터를 가져오는 중 에러:', error);
        res.status(500).json({ message: '근무 데이터 가져오기 오류', error: error.message });
    }
});

// 근무 데이터를 추가하는 라우터
managementRouter.post('/addWork', async (req, res) => {
    const { work_id, work_name, work_start, work_end, work_break, work_days, work_default_rule, work_max_rule, work_type, work_desc } = req.body;
    const sql = `
    INSERT INTO ${workTB} (work_id, work_name, work_start, work_end, work_break, work_days, work_default_rule, work_max_rule, work_type, work_desc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
        conn.query(sql, [work_id, work_name, work_start, work_end, work_break, work_days, work_default_rule, work_max_rule, work_type, work_desc], (error, result) => {
            if (error) {
                console.error('근무 추가 중 오류:', error);
                res.status(500).json({ message: '그룹 추가 실패', error: error.message });
                return;
            }

            if (result?.affectedRows > 0) {
                //console.log('직원 추가 성공:', result);
                res.status(201).json({ message: '그룹 추가 성공', data: result });
            } else {
                console.log('근무 추가 실패: 변화 없음');
                res.status(500).json({ message: '그룹 추가 실패', data: null });
            }
        });
    } catch (error) {
        console.error('근무 추가 중 오류:', error);
        res.status(500).json({ message: '근무 추가 오류', error: error.message });
    }
});

// 그룹 데이터를 삭제하는 라우터
managementRouter.post('/dltWork', async (req, res) => {
    const { ids } = req.body; // req.body에서 ids라는 배열로 여러 ID를 전달받음
    //console.log(req.body);
    // 요청받은 데이터가 문자열일 경우 파싱
    if (typeof ids === 'string') {
        try {
            ids = JSON.parse(ids); // 문자열을 배열로 변환
        } catch (error) {
            return res.status(400).json({ message: '잘못된 데이터 형식입니다.' });
        }
    }

    // 여러 ID를 DELETE하기 위해 IN 절 사용
    const sql = `DELETE FROM ${workTB} WHERE work_id IN (?);`;

    try {
        conn.query(sql, [ids], (error, result) => {
            if (error) {
                console.error('근무 삭제 중 오류:', error);
                return res.status(500).json({ message: '근무 삭제 오류', error: error.message });
            }

            if (result.affectedRows > 0) {
                res.status(200).json({ message: '근무 삭제 성공', data: result });
            } else {
                res.status(404).json({ message: '삭제할 근무 없습니다.', data: null });
            }
        });
    } catch (error) {
        console.error('근무 삭제 중 예외:', error);
        res.status(500).json({ message: '근무 삭제 중 서버 오류', error: error.message });
    }
});


/////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////휴가처리///////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

// 휴가요청 데이터를 가져오는 라우터
managementRouter.get('/getVacation', async (req, res) => {
    // DB에서 '휴가' 데이터만 가져오기
    
    const sql = `
    SELECT 
    req_idx, req_type, req_content, emp_id, start_date, end_date, created_at, req_status, approved_at, admin_id, req_final 
    FROM cgi_24K_AI4_p2_3.${requestTB} 
    WHERE req_type = '휴가'`;

    try {
        // Promise 기반으로 쿼리 실행
        const [result] = await conn.promise().query(sql);

        if (result.length > 0) {
            // 데이터가 있을 경우
            res.status(200).json({ message: '휴가 데이터 로드 완료', data: result });
        } else {
            // 데이터가 없을 경우
            console.log('휴가 데이터 없음');
            res.status(404).json({ message: '휴가 데이터 없음', data: null });
        }
    } catch (error) {
        // 에러 처리
        console.error('휴가 데이터를 가져오는 중 에러:', error);
        res.status(500).json({ message: '휴가 데이터 가져오기 오류', error: error.message });
    }
});

// 휴가 데이터를 처리하는 라우터
managementRouter.post('/checkVacation', async (req, res) => {
    const { ids, what, who } = req.body; // req.body에서 ids와 who를 받음
    console.log("휴가 처리할 관리자의 관리자id",who);
    // 처리수행 쿼리문
    const updateSql = `
        UPDATE tb_request
        SET 
            approved_at = NOW(),
            admin_id = ?,
            req_status = 'Y',
            req_final = ?
        WHERE req_idx IN (?)
    `;

    const selectSql = `
        SELECT 
            req_idx, 
            req_type, 
            req_content, 
            emp_id, 
            start_date, 
            end_date, 
            created_at, 
            req_status, 
            approved_at, 
            admin_id,
            req_final
        FROM tb_request
        WHERE req_idx IN (?)
    `;

    try {
        conn.query(updateSql, [who, what ,ids], (updateError, updateResult) => {
            if (updateError) {
                console.error('휴가 처리 중 오류:', updateError);
                return res.status(500).json({ message: '휴가 처리 오류', error: updateError.message });
            }

            if (updateResult.affectedRows > 0) {
                // 업데이트된 데이터를 조회
                conn.query(selectSql, [ids], (selectError, rows) => {
                    if (selectError) {
                        console.error('처리된 데이터 조회 중 오류:', selectError);
                        return res.status(500).json({ message: '처리된 데이터 조회 오류', error: selectError.message });
                    }

                    // 처리된 데이터를 응답으로 반환
                    res.status(200).json({ 
                        message: '휴가 처리 성공', 
                        data: rows 
                    });
                });
            } else {
                res.status(404).json({ message: '처리할 휴가가 없습니다.', data: null });
            }
        });
    } catch (error) {
        console.error('휴가 처리 중 예외:', error);
        res.status(500).json({ message: '휴가 처리 중 서버 오류', error: error.message });
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////근태처리///////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

// 근태요청 데이터를 가져오는 라우터
managementRouter.get('/getAttendance', async (req, res) => {
    // DB에서 '근태' 데이터 가져오기

    const sql = `SELECT * FROM cgi_24K_AI4_p2_3.${attendanceTB}`;
    try {
        // Promise 기반으로 쿼리 실행
        const [result] = await conn.promise().query(sql);

        if (result.length > 0) {
            // 데이터가 있을 경우
            res.status(200).json({ message: '근태 데이터 로드 완료', data: result });
        } else {
            // 데이터가 없을 경우
            console.log('근태 데이터 없음');
            res.status(404).json({ message: '근태 데이터 없음', data: null });
        }
    } catch (error) {
        // 에러 처리
        console.error('근태 데이터를 가져오는 중 에러:', error);
        res.status(500).json({ message: '근태 데이터 가져오기 오류', error: error.message });
    }
});


// getScheduleData

managementRouter.get('/getScheduleData', async (req, res) => {
    const sql = `
        SELECT 
            e.emp_id, 
            e.emp_name, 
            e.emp_role, 
            e.emp_group, 
            e.emp_firstDate,
            e.emp_birthDate,
            e.emp_phone,
            e.emp_email,
            w.work_id, 
            w.work_name, 
            w.work_start, 
            w.work_end, 
            w.work_break, 
            w.work_days, 
            w.work_max_rule
        FROM tb_employee e
        INNER JOIN tb_work w 
        ON e.emp_group = w.work_name
    `;

    try {
        conn.query(sql, (error, result) => {
            if (error) {
                console.error('❌ 스케줄 데이터 조회 에러:', error);
                res.status(500).json({ message: 'DB 조회 오류', error: error.message });
                return;
            }

            console.log("📢 DB에서 가져온 데이터:", result); // ✅ DB에서 데이터를 제대로 가져오는지 확인!

            if (result?.length > 0) {
                res.status(200).json({ message: '스케줄 데이터 로드 완료', data: result });
            } else {
                console.log("⚠️ DB에서 데이터 없음");
                res.status(404).json({ message: '스케줄 데이터 없음', data: null });
            }
        });
    } catch (error) {
        console.error('❌ 스케줄 데이터를 가져오는 중 에러:', error);
        res.status(500).json({ message: '스케줄 데이터 가져오기 오류', error: error.message });
    }
});





module.exports = managementRouter;
