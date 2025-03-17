const express = require('express');
const path = require('path');
const app = express();
const PORT = 5067;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// [기존 라우터들 유지]
const mainRouter = require('./routes/mainRouter.js');
app.use('/', mainRouter);

const subRouter = require('./routes/subRouter.js');
app.use('/system', subRouter);

const userRouter = require('./routes/userRouter.js');
app.use('/user', userRouter);

const managementRouter = require('./routes/managementRouter.js');
app.use('/management', managementRouter);

const workScheduleRouter = require('./routes/workSchedule.js');
app.use('/work-schedule', workScheduleRouter);

const attendanceRouter = require('./routes/attendanceRouter.js');
app.use('/attendance', attendanceRouter);

const requestRouter = require('./routes/requestRouter.js');
app.use('/request', requestRouter);

const autoScheduleRouter = require('./routes/autoSchedule.js'); // ✅ 추가!
app.use('/autoSchedule', autoScheduleRouter); // ✅ API 등록!

const scheduleManagerRouter = require('./routes/scheduleManager.js'); 
app.use('/schedule-manager', scheduleManagerRouter);  // ✅ 새로운 라우터 추가


// ---------------------- 서버 + 소켓.io ---------------------- //
const server = app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});

// socket.js에서 초기화된 소켓 객체를 가져옴
// 'require('./config/socket')'는 socket.js 파일에서 소켓을 초기화하는 기능을 가져오는 부분입니다.
// 이 객체는 서버와 클라이언트 간의 통신을 위한 소켓 연결을 설정하고 관리합니다.
const socket = require('./config/socket');

// 서버와 연결하여 socket.io를 초기화합니다.
// 'socket.init(server)'는 서버 인스턴스를 전달하여 소켓을 초기화하고, 소켓 객체를 반환합니다.
// 이 반환된 'io' 객체는 소켓 통신을 처리하는 데 사용됩니다.
const io = socket.init(server);

// ---------------------- 얼굴 인식 소켓 ---------------------- //
// 별도의 얼굴 인식 소켓 연결 처리
const faceSocket = require('./config/faceSocket');
//console.log(io);
faceSocket(io);  // 얼굴 인식 소켓 연결

// ---------------------- 스케줄 알림 소켓 ---------------------- //
// const scheduleAlertRouter = require('./routes/scheduleAlertRouter')(io);
// app.use('/schedule-alert', scheduleAlertRouter);

// // **채팅 서버 소켓**
// io.on('connection', (socket) => {
//   console.log('🟢 새 클라이언트 접속:', socket.id);

//   // 채팅 메시지 수신 및 브로드캐스트
//   socket.on('chatMessage', (message) => {
//     console.log('받은 메시지:', message);
//     io.emit('chatMessage', message); // 모든 클라이언트에 메시지 전송
//   });

//   // 연결 해제 처리
//   socket.on('disconnect', () => {
//     console.log('🔴 클라이언트 접속 해제:', socket.id);
//   });
// });

// ---------------------- ⭐ React 빌드 경로 처리 ---------------------- //
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));  // ✅ 주석 해제해서 빌드 파일 서빙

// ⭐ React SPA 처리 (리액트 라우터 전용)
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});
