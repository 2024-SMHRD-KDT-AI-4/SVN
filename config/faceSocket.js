const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');  // 파일 존재 확인용

module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log('🟢 얼굴 인식 소켓 연결:', socket.id);

    socket.on('faceCheck', () => {
      console.log('📸 얼굴 인식 요청 받음');

      // ✅ venv 경로 우선 시도
      const venvPythonPath = path.join(__dirname, '../venv/Scripts/python.exe');
      let pythonPath = venvPythonPath;

      // ✅ venv의 python.exe가 없을 때만 where python 사용
      if (!fs.existsSync(venvPythonPath)) {
        console.log('⚠️ venv python.exe가 없어 where python 시도');
        exec('where python', (err, stdout) => {
          if (!err) {
            pythonPath = stdout.split('\n')[0].trim(); // 동적 탐색된 경로
          } else {
            console.error('❌ where python 실패:', err);
          }
          proceedWithPython(pythonPath); // 최종 경로로 진행
        });
      } else {
        console.log('🐍 venv Python 경로 사용:', pythonPath);
        proceedWithPython(pythonPath); // venv 경로로 바로 진행
      }

      // ✅ 파이썬 실행 함수 분리
      function proceedWithPython(pythonPath) {
        // ✅ Python 파일 경로
        const scriptPath = path.join(__dirname, '../face_recognition/f_auto_recog.py');

        // ✅ 실행 명령어
        const command = `"${pythonPath}" "${scriptPath}"`;
        console.log('📂 실행 명령어:', command);

        // ✅ 명령어 실행
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
          console.log('✅ 파이썬 결과:', result);

          if (result === "Unknown") {
            socket.emit('faceResult', { success: false, message: '미등록 사용자' });
          } else {
            socket.emit('faceResult', { success: true, wo_id: result });
          }
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('🔴 얼굴 인식 소켓 해제:', socket.id);
    });
  });
};
