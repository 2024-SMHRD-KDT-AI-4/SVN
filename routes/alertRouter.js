const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

// 얼굴 인식 요청 API
router.post('/face-check', (req, res) => {
  exec('python ./face_recognition/f_auto_recog.py', (error, stdout, stderr) => {
    if (error) {
      console.error('Python 실행 오류:', error);
      return res.status(500).json({ success: false, message: '얼굴 인식 실패' });
    }

    const result = stdout.trim();  // 인식된 ID 또는 "Unknown"

    if (result === "Unknown") {
      return res.json({ success: false, message: '미등록 사용자' });
    }

    return res.json({ success: true, wo_id: result });
  });
});

module.exports = router;
