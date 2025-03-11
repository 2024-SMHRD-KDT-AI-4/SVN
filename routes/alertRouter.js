// routes/alertRouter.js
const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');

// 얼굴인식 (경고에서만 활용)
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
    // f_auto_recog.py가 "employeeID accuracy" 형태로 print했다 가정
    const lines = resultData.trim().split('\n');
    // 예) lines[0] = 'E001', lines[1] = '95.00%'
    const employeeId = lines[0] || 'Unknown';
    const accuracy = lines[1] || '??%';

    if (employeeId === 'Unknown') {
      return res.status(400).json({ message: '얼굴 인식 실패' });
    }
    // 성공 응답
    return res.json({
      wo_id: employeeId,
      accuracy: accuracy,
      message: '얼굴인식 완료',
    });
  });
});

module.exports = router;
