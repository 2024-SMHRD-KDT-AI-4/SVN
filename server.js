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

// ---------------------- 서버 + 소켓.io ---------------------- //
const server = app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});

const socket = require('./config/socket');
const io = socket.init(server);

io.on('connection', (socket) => {
  console.log('🟢 새 클라이언트 접속:', socket.id);
  socket.on('disconnect', () => {
    console.log('🔴 클라이언트 접속 해제:', socket.id);
  });
});

const scheduleAlertRouter = require('./routes/scheduleAlertRouter')(io);
app.use('/schedule-alert', scheduleAlertRouter);

const faceSocket = require('./config/faceSocket');
faceSocket(io); // 얼굴 인식 소켓 연결

// ---------------------- ⭐ React 빌드 경로 처리 ---------------------- //
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));  // ✅ 주석 해제해서 빌드 파일 서빙

// ⭐ React SPA 처리 (리액트 라우터 전용)
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});
