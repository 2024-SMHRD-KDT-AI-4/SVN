const express = require('express');
const path = require('path');
const managementRouter = express.Router();
const conn = require("../config/db"); // DB 연결
const { request } = require('http');

// React 빌드 폴더 경로
const employeeTB = "tb_employee"; // DB테이블의 이름
const groupTB = "tb_group"; // DB테이블의 이름

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
                console.log('직원 데이터 없음');
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
    const { employeeId, name, position, joinDate, department, dob, phone, email } = req.body;

    const sql = `
        INSERT INTO ${employeeTB} (emp_id, emp_name, emp_role, emp_firstDate, emp_group, emp_birthDate, emp_phone, emp_email) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        conn.query(sql, [employeeId, name, position, joinDate, department, dob, phone, email], (error, result) => {
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
///////////////////////////////////////그룹처리///////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

// 그룹 데이터를 가져오는 라우터
managementRouter.get('/getGroup', async (req, res) => {
    // DB에서 직원 데이터 가져오기
    const sql = `SELECT * FROM cgi_24K_AI4_p2_3.${groupTB}`;
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
                res.status(200).json({ message: '그룹 데이터 로드 완료', data: result });
            } else {
                console.log('그룹 데이터 없음');
                res.status(404).json({ message: '그룹 데이터 없음', data: null });
            }
        });
    } catch (error) {
        console.error('그룹 데이터를 가져오는 중 에러:', error);
        res.status(500).json({ message: '그룹 데이터 가져오기 오류', error: error.message });
    }
});

// 그룹 데이터를 추가하는 라우터
managementRouter.post('/addGroup', async (req, res) => {
    const { group_id, group_name, group_head, group_desc, group_pos, group_count } = req.body;
    const sql = `
    INSERT INTO ${groupTB} (group_id, group_name, group_head, group_desc, group_pos, group_count) VALUES (?, ?, ?, ?, ?, ?)`;

    try {
        conn.query(sql, [group_id, group_name, group_head, group_desc, group_pos, group_count], (error, result) => {
            if (error) {
                console.error('그룹 추가 중 오류:', error);
                res.status(500).json({ message: '그룹 추가 실패', error: error.message });
                return;
            }

            if (result?.affectedRows > 0) {
                //console.log('직원 추가 성공:', result);
                res.status(201).json({ message: '그룹 추가 성공', data: result });
            } else {
                console.log('직원 추가 실패: 변화 없음');
                res.status(500).json({ message: '그룹 추가 실패', data: null });
            }
        });
    } catch (error) {
        console.error('그룹 추가 중 오류:', error);
        res.status(500).json({ message: '그룹 추가 오류', error: error.message });
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
                console.error('그룹 삭제 중 오류:', error);
                return res.status(500).json({ message: '그룹 삭제 오류', error: error.message });
            }

            if (result.affectedRows > 0) {
                res.status(200).json({ message: '그룹 삭제 성공', data: result });
            } else {
                res.status(404).json({ message: '삭제할 그룹 없습니다.', data: null });
            }
        });
    } catch (error) {
        console.error('그룹 삭제 중 예외:', error);
        res.status(500).json({ message: '그룹 삭제 중 서버 오류', error: error.message });
    }
});
module.exports = managementRouter;
