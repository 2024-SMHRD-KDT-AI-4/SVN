const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

// 얼굴 인식 요청 API (직원 ID + 현재 시간 반환)
router.post('/face-check', (req, res) => {
  exec('python ./face_recognition/f_auto_recog.py', (error, stdout, stderr) => {
    if (error) {
      console.error('Python 실행 오류:', error);
      return res.status(500).json({ success: false, message: '서버 내부 오류' });
    }

    const result = stdout.trim();
    console.log('Python 결과:', result);

    // 현재 시간 가져오기 (형식: YYYY-MM-DD HH:mm:ss)
    const now = new Date();
    const formattedTime = now.toISOString().replace('T', ' ').substring(0, 19);

    // 조건 분기
    if (result === 'Unknown') {
      return res.json({ success: false, message: '미등록 사용자' });
    } else if (result.startsWith('[ERROR]')) {
      return res.status(500).json({ success: false, message: result });
    } else {
      // 인식 성공: 직원 ID와 현재 시간 반환
      return res.json({ success: true, wo_id: result, time: formattedTime });
    }
  });
});

module.exports = router;
