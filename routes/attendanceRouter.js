// routes/attendanceRouter.js
const express = require('express');
const router = express.Router();
const conn = require('../config/db');

// [출근하기]
router.post('/checkin', (req, res) => {
  // 버튼 누른 서버 시점
  const now = new Date();

  // 임시: 직원 ID "E001" (로그인 세션 등에서 받아와도 됨)
  const wo_id = 'E001';

  // DB INSERT (테이블명은 팀 내에서 합의된 이름 사용)
  const sql = 'INSERT INTO test_table (wo_id, start_time) VALUES (?, ?)';
  conn.query(sql, [wo_id, now], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'DB 오류', error });
    }
    // DB 저장 후, 프론트에도 now 전달
    return res.json({ message: '출근 처리 완료', time: now });
  });
});

// [퇴근하기]
router.post('/checkout', (req, res) => {
  const now = new Date();
  const wo_id = 'E001';

  // DB UPDATE (end_time 컬럼 세팅)
  const sql = 'UPDATE test_table SET end_time=? WHERE wo_id=? AND end_time IS NULL';
  conn.query(sql, [now, wo_id], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'DB 오류', error });
    }
    return res.json({ message: '퇴근 처리 완료', time: now });
  });
});

module.exports = router;
