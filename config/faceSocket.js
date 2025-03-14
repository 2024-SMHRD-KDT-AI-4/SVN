const { exec } = require('child_process');
const path = require('path');

module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log('🟢 얼굴 인식 소켓 연결:', socket.id);

    socket.on('faceCheck', () => {
      console.log('📸 얼굴 인식 요청 받음');

      // ✅ Python 3.11 경로로 명확하게 지정
      const pythonPath = 'C:\\Users\\smhrd\\AppData\\Local\\Programs\\Python\\Python311\\python.exe';

      // ✅ Python 파일 절대 경로 (현재 이 js 파일 기준)
      const scriptPath = path.join(__dirname, '../face_recognition/f_auto_recog.py');

      // ✅ 명령어 최종 조합 (절대경로로 실행)
      const command = `"${pythonPath}" "${scriptPath}"`;

      console.log('📂 실행 명령어:', command); // 실제 실행될 명령어 확인

      // ✅ Python 스크립트 실행
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ 파이썬 실행 오류:', error);
          socket.emit('faceResult', { success: false, message: '얼굴 인식 실패' });
          return;
        }

        if (stderr) {
          console.error('⚠️ 파이썬 stderr:', stderr);
        }

        const result = stdout.trim();
        console.log('✅ 파이썬 결과:', result); // 직원 ID or Unknown

        // ✅ 결과에 따라 소켓 전송
        if (result === "Unknown") {
          socket.emit('faceResult', { success: false, message: '미등록 사용자' });
        } else {
          socket.emit('faceResult', { success: true, wo_id: result });
        }
      });
    });

    socket.on('disconnect', () => {
      console.log('🔴 얼굴 인식 소켓 해제:', socket.id);
    });
  });
};
