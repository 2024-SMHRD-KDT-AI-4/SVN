const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const conn = require('../config/db'); // DB 연결

// 출근
router.post('/checkin', (req, res) => {
  const python = spawn('python', ['face_recognition/f_auto_recog.py']);
  let resultData = '';

  python.stdout.on('data', (data) => {
    resultData += data.toString();
  });

  python.stderr.on('data', (data) => {
    console.error('[Python 오류]', data.toString());
  });

  python.on('close', (code) => {
    const recognizedId = resultData.trim();
    const now = new Date();

    if (!recognizedId || recognizedId === 'Unknown') {
      return res.status(400).json({ message: '얼굴 인식 실패' });
    }

    const sql = 'INSERT INTO work_history (wo_id, start_time) VALUES (?, ?)';
    conn.query(sql, [recognizedId, now], (err) => {
      if (err) return res.status(500).json({ message: 'DB 오류' });
      return res.json({ message: '출근 성공', wo_id: recognizedId, time: `${now.getHours()}시 ${now.getMinutes()}분 ${now.getSeconds()}초` });
    });
  });
});

// 퇴근
router.post('/checkout', (req, res) => {
  const python = spawn('python', ['face_recognition/f_auto_recog.py']);
  let resultData = '';

  python.stdout.on('data', (data) => {
    resultData += data.toString();
  });

  python.stderr.on('data', (data) => {
    console.error('[Python 오류]', data.toString());
  });

  python.on('close', (code) => {
    const recognizedId = resultData.trim();
    const now = new Date();

    if (!recognizedId || recognizedId === 'Unknown') {
      return res.status(400).json({ message: '얼굴 인식 실패' });
    }

    const sql = 'UPDATE work_history SET end_time=? WHERE wo_id=? AND end_time IS NULL';
    conn.query(sql, [now, recognizedId], (err, result) => {
      if (err) return res.status(500).json({ message: 'DB 오류' });
      if (result.affectedRows === 0) return res.status(400).json({ message: '퇴근 기록 없음' });
      return res.json({ message: '퇴근 성공', wo_id: recognizedId, time: `${now.getHours()}시 ${now.getMinutes()}분 ${now.getSeconds()}초` });
    });
  });
});

module.exports = router;
