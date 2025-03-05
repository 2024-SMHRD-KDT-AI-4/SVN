const express = require("express");

// 라우터 생성
const router = express.Router();
const path = require("path");

// 빌드된 파일 경로
const buildPath = path.join(__dirname, "../build/");

// 1. 사용자가 메인 페이지에 방문했을 때 main.html 파일 보여주기
router.get("/", (req, res) => {
    console.log('메인 페이지 요청');
    // buildPath와 "main.html"을 올바르게 결합
    res.sendFile(path.join(buildPath, 'main.html'));
});

// 2. 각각 야구와 축구의 요청에 맞게 응답할 코드 작성
router.get("/baseball", (req, res) => {
    console.log('야구 페이지 요청');
    res.sendFile(path.join(buildPath, 'baseball.html'));
});

// 라우터와 서버 파일을 연결
module.exports = router;
