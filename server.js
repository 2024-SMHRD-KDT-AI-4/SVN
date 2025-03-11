// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 5067;

const buildPath = path.join(__dirname, 'build');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 여기까지는 기존 코드 그대로 유지

// 메인 라우터들
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

// ★ 추가: 근태(출근/퇴근) 라우터
const attendanceRouter = require('./routes/attendanceRouter.js');
app.use('/attendance', attendanceRouter);

// 서버 실행
app.listen(PORT, () => {
    console.log(`서버가 실행되었습니다: http://localhost:${PORT}`);
});
