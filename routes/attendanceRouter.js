const express = require('express');
const router = express.Router();
const connection = require('../config/db');

// test2_table 구조 (예시)
// CREATE TABLE test2_table (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   wo_id VARCHAR(50) NOT NULL,
//   start_time DATETIME DEFAULT NULL,
//   end_time DATETIME DEFAULT NULL
// );


// [1] 출근하기
router.post('/check-in', (req, res) => {
  const { wo_id } = req.body;  // 프론트에서 { wo_id: 'E_001' } 같은 식으로 받음
  // DB에 NOW()로 출근시간 INSERT
  const insertSql = `
    INSERT INTO test2_table (wo_id, start_time)
    VALUES (?, NOW())
  `;
  connection.query(insertSql, [wo_id], (err, result) => {
    if (err) {
      console.error('INSERT 에러:', err);
      return res.json({ success: false, message: 'DB 저장 실패' });
    }

    // 방금 INSERT된 행의 출근시간을 조회하여 반환
    const selectSql = `
      SELECT DATE_FORMAT(start_time, '%Y-%m-%d %H:%i:%s') AS start_time
      FROM test2_table
      WHERE id = ?
    `;
    connection.query(selectSql, [result.insertId], (err2, rows) => {
      if (err2) {
        console.error('SELECT 에러:', err2);
        return res.json({ success: false, message: 'DB 조회 실패' });
      }
      const savedTime = rows.length ? rows[0].start_time : null;
      return res.json({ success: true, start_time: savedTime });
    });
  });
});

// [2] 퇴근하기
router.post('/check-out', (req, res) => {
  const { wo_id } = req.body;  // 예: { wo_id: 'E_001' }

  // end_time이 NULL인 레코드에 NOW()로 퇴근시간 UPDATE
  const updateSql = `
    UPDATE test2_table
    SET end_time = NOW()
    WHERE wo_id = ?
      AND end_time IS NULL
    ORDER BY id DESC
    LIMIT 1
  `;
  connection.query(updateSql, [wo_id], (err, result) => {
    if (err) {
      console.error('UPDATE 에러:', err);
      return res.json({ success: false, message: 'DB 저장 실패' });
    }
    if (result.affectedRows === 0) {
      // 이미 퇴근 처리되었거나 해당 wo_id 레코드가 없을 경우
      return res.json({ success: false, message: '업데이트된 행이 없습니다.' });
    }

    // 방금 UPDATE된 end_time을 SELECT
    const selectSql = `
      SELECT DATE_FORMAT(end_time, '%Y-%m-%d %H:%i:%s') AS end_time
      FROM test2_table
      WHERE wo_id = ?
      ORDER BY id DESC
      LIMIT 1
    `;
    connection.query(selectSql, [wo_id], (err2, rows) => {
      if (err2) {
        console.error('SELECT 에러:', err2);
        return res.json({ success: false, message: 'DB 조회 실패' });
      }
      const savedTime = rows.length ? rows[0].end_time : null;
      return res.json({ success: true, end_time: savedTime });
    });
  });
});

module.exports = router;