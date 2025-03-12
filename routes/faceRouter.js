const express = require('express');
const router = express.Router();
const multer = require('multer');
const { spawn } = require('child_process');
const conn = require('../config/db');

// uploads 폴더 저장
const upload = multer({ dest: 'uploads/' });

// 얼굴인식 처리
router.post('/face-check', upload.single('image'), (req, res) => {
  const python = spawn('python', ['face_recognition/f_auto_recog.py', req.file.path]);
  let resultData = '';

  python.stdout.on('data', (data) => { resultData += data.toString(); });
  python.on('close', () => {
    const [recognizedId, accuracy] = resultData.trim().split('\n');
    res.json({ recognizedId, accuracy });
  });
});

// 출근
router.post('/checkin', (req, res) => {
  const sql = 'INSERT INTO work_history (wo_id, start_time) VALUES (?, NOW())';
  conn.query(sql, [req.body.wo_id], (err) => res.json(err ? { message: 'DB 오류' } : { message: '출근 완료' }));
});

// 퇴근
router.post('/checkout', (req, res) => {
  const sql = 'UPDATE work_history SET end_time=NOW() WHERE wo_id=? AND end_time IS NULL';
  conn.query(sql, [req.body.wo_id], (err) => res.json(err ? { message: 'DB 오류' } : { message: '퇴근 완료' }));
});

module.exports = router;
