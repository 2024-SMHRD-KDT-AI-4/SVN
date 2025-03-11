// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 5067;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// [기존 라우터들] (예: mainRouter, subRouter etc.)
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

// [출근/퇴근 라우터] (이미 만들어놓은 attendanceRouter.js)
const attendanceRouter = require('./routes/attendanceRouter.js');
app.use('/attendance', attendanceRouter);

// [새로 추가] 경고+얼굴인식 라우터
const alertRouter = require('./routes/alertRouter.js');
app.use('/alert', alertRouter);

// 정적 파일 서빙(React 빌드 결과가 있다면)
const buildPath = path.join(__dirname, 'build');
// app.use(express.static(buildPath));

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
