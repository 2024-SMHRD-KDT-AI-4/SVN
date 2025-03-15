const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 클라이언트 연결 관리
io.on('connection', (socket) => {
  console.log('사용자 연결됨:', socket.id);

  // 채팅 메시지 수신 및 브로드캐스트
  socket.on('chatMessage', (message) => {
    console.log('받은 메시지:', message);
    io.emit('chatMessage', message); // 모든 클라이언트에 메시지 전송
  });

  // 연결 해제 처리
  socket.on('disconnect', () => {
    console.log('사용자 연결 종료:', socket.id);
  });
});

// 5070 포트에서 서버 실행
const PORT = 5067;
server.listen(PORT, () => {
  console.log(`채팅 서버 실행 중: http://localhost:${PORT}`);
});
