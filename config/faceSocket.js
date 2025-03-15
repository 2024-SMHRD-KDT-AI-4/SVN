const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');  // 파일 존재 확인용

module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log(`🟢 새 연결: ${socket.id}, 클라이언트 수: ${io.engine.clientsCount}`);

    socket.on('faceCheck', () => {
      console.log('📸 얼굴 인식 요청 받음');

      // venv Python 경로
      const venvPythonPath = path.join(__dirname, '../venv/Scripts/python.exe');
      let pythonPath = venvPythonPath;

      // venv 경로가 없으면 시스템에서 Python 경로를 동적으로 찾기
      if (!fs.existsSync(venvPythonPath)) {
        console.log('⚠️ venv python.exe가 없어 where python 시도');

        exec('where python', (err, stdout, stderr) => {
          if (err) {
            console.error('❌ where python 실패:', err);
            socket.emit('faceResult', { success: false, message: '파이썬 경로를 찾을 수 없습니다.' });
            return;
          }

          pythonPath = stdout.split('\n')[0].trim(); // 첫 번째 경로 사용
          console.log('🔍 파이썬 경로:', pythonPath);

          proceedWithPython(pythonPath); // 찾은 경로로 진행
        });
      } else {
        console.log('🐍 venv Python 경로 사용:', pythonPath);
        proceedWithPython(pythonPath); // venv 경로 사용
      }

      // Python 파일 실행 함수
      function proceedWithPython(pythonPath) {
        const scriptPath = path.join(__dirname, '../face_recognition/f_auto_recog.py');
        const command = `"${pythonPath}" "${scriptPath}"`;

        console.log('📂 실행 명령어:', command);

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
      console.log(`🔴 연결 해제: ${socket.id}, 남은 클라이언트 수: ${io.engine.clientsCount}`);
    });
  });
};
