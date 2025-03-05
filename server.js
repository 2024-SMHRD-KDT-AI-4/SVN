const express = require('express');
const path = require('path');
const app = express();
const PORT = 5067;

// 빌드된 파일 경로
const buildPath = path.join(__dirname, 'build');

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
app.use('/user', userRouter);  // 서브 페이지는 /esports로 처리

// 서버 실행
app.listen(PORT, () => {
    console.log(`서버가 실행되었습니다: http://localhost:${PORT}`);
});
