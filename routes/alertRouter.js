// routes/alertRouter.js
const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');

// DB를 쓰려면 (필요시 주석 해제)
// const conn = require('../config/db');

// [POST] /alert/face-check
router.post('/face-check', (req, res) => {
  // Python 스크립트 실행
  const python = spawn('python', ['face_recognition/f_auto_recog.py']);

  let resultData = '';
  python.stdout.on('data', (data) => {
    resultData += data.toString();
  });

  python.stderr.on('data', (err) => {
    console.error('[Python 오류]', err.toString());
  });

  python.on('close', (code) => {
    // 파이썬에서 print로 결과를 준다고 가정
    // 예: 첫 줄=직원ID, 두 번째 줄=정확도
    const lines = resultData.trim().split('\n');

    // 파이썬이 Unknown이면 인식 실패, 아니면 직원ID
    const employeeId = lines[0] || 'Unknown';
    const accuracy = lines[1] || '0%';

    if (employeeId === 'Unknown') {
      return res.status(400).json({ message: '얼굴 인식 실패' });
    }

    // (선택) DB 처리 예시 (주석 해제해서 사용 가능)
    /*
    const sql = 'INSERT INTO face_log (wo_id, recognized_time, accuracy) VALUES (?, NOW(), ?)';
    conn.query(sql, [employeeId, accuracy], (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'DB 오류' });
      }
      return res.json({
        message: '얼굴인식 성공(DB 기록 완료)',
        wo_id: employeeId,
        accuracy: accuracy
      });
    });
    */

    // DB 안 쓴다면, 아래처럼 바로 응답
    return res.json({
      message: '얼굴인식 성공',
      wo_id: employeeId,
      accuracy: accuracy
    });
  });
});

module.exports = router;
