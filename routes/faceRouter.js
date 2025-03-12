// faceRouter.js (수정된 코드 예시)
// ------------------------------------------------------
// Python 코드(f_auto_recog.py)에서 "success" 또는 "fail"을 출력한다고 했으므로
// stdout.trim() 값이 "success"면 success: true, "fail"이면 false 처리를 하도록 수정

const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

router.post('/face-check', (req, res) => {
  const { type } = req.body;
  
  // 필요하다면 type에 따라 다른 Python 스크립트 실행도 가능
  exec('python ./face_recognition/f_auto_recog.py', (error, stdout, stderr) => {
    if (error) {
      console.error('Python 실행 오류:', error);
      return res.status(500).json({ success: false, message: '얼굴 인식 실패' });
    }

    const result = stdout.trim();
    console.log('Python 실행 결과:', result);

    // f_auto_recog.py에서 recognized = True면 "success", 아니면 "fail"로 출력한다고 가정
    if (result === 'success') {
      return res.json({ success: true, message: '인식 성공' });
    } else {
      return res.json({ success: false, message: '인식 실패(미등록 혹은 오류)' });
    }
  });
});

module.exports = router;
