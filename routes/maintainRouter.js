const express = require('express');
const path = require('path');
const maintainRouter = express.Router();
const conn = require("../config/db"); // DB 연결
const { request } = require('http');

// React 빌드 폴더 경로
const employeeTB = "tb_employee"; // DB테이블의 이름

// POST 요청을 처리하기 위한 미들웨어 설정
maintainRouter.use(express.json()); // 요청 본문을 JSON으로 파싱

// 직원 데이터를 가져오는 라우터
maintainRouter.get('/getEmployees', async (req, res) => {
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
maintainRouter.post('/addEmployees', async (req, res) => {
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

module.exports = maintainRouter;
