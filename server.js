const express = require('express');
const path = require('path');
const app = express();
const PORT = 5067;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// [기존 라우터들] (예: mainRouter, subRouter etc.)

// 정적 파일 서빙(React 빌드 결과가 있다면)
const buildPath = path.join(__dirname, 'build');
// app.use(express.static(buildPath));

// 미들웨어 추가
app.use(express.json());  // JSON 형식의 body 파싱
app.use(express.urlencoded({ extended: true }));  // URL 인코딩된 데이터 파싱


// 정적 파일 서빙
//app.use(express.static(buildPath));  // build 폴더 내의 모든 파일을 서빙

// 메인 라우터와 서브 라우터
const mainRouter = require('./routes/mainRouter.js');
app.use('/', mainRouter);  // 메인 페이지 처리

const subRouter = require('./routes/subRouter.js');
app.use('/system', subRouter);  // 서브 페이지는 /esports로 처리

const userRouter = require('./routes/userRouter.js');
app.use('/user', userRouter);  // 유저 페이지는 /user 처리

const managementRouter = require('./routes/managementRouter.js');
app.use('/management', managementRouter);  // 관리하기 페이지는 /maintain 처리

// 근무 스케줄 라우터 추가
const workScheduleRouter = require('./routes/workSchedule.js');
app.use('/work-schedule', workScheduleRouter);  // 근무 시간/유형 관리

// [출근/퇴근 라우터] (이미 만들어놓은 attendanceRouter.js)
const attendanceRouter = require('./routes/attendanceRouter.js');
app.use('/attendance', attendanceRouter);

// 요청 (휴가/근무변경) 라우터 추가
const requestRouter = require('./routes/requestRouter.js');
app.use('/request', requestRouter);




// 프론트에서 보낸 이미지 받아서 파이썬으로 넘겨 얼굴 인식 결과 반환
const faceRouter = require('./routes/faceRouter'); // 경로 확인
app.use('/api', faceRouter);


// 서버 실행
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
