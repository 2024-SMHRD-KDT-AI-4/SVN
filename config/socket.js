//  config/socket.js
// 웹소켓을 관리하는 설정 파일

let io = null; // io를 저장할 변수

module.exports = {
  // 서버와 연결해서 io 초기화
  init: (server) => {
    io = require('socket.io')(server, {
      cors: {
        origin: "*", // 모든 프론트 연결 허용 (배포 시 주소 제한 필요)
        methods: ["GET", "POST"]
      }
    });
    console.log("강인오 체크")
    return io; // 연결된 io 반환
  },

  // 다른 파일에서 io를 가져올 때 사용하는 함수
  getIO: () => {
    if (!io) {
      throw new Error("❌ Socket.io가 초기화되지 않았습니다!"); // 예외 처리
    }
    return io;
  }
};
