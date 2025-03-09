const express = require('express');
const path = require('path');
const router = express.Router();
const conn = require("../config/db"); // DB 연결
const { request } = require('http');
const publicPath = path.join(__dirname, "../public/");
const buildPath = path.join(__dirname, '../build');

// React 빌드 폴더 경로
const employeeTB = "tb_employee"; // DB테이블의 이름

// POST 요청을 처리하기 위한 미들웨어 설정
router.use(express.json()); // 요청 본문을 JSON으로 파싱

// /esports 경로에서 React 앱의 정적 파일 서빙
router.use(express.static(buildPath));  // React의 모든 정적 파일을 서빙

// /esports 경로에서 index.html 반환
router.get('/', (req, res) => {
    console.log('Serving index.html for /system');
    res.sendFile(path.join(buildPath, 'index.html'));  // React의 index.html을 서빙
});

// /esports 하위 경로에서 모든 요청에 대해 index.html 반환
router.get('*', (req, res) => {
    console.log('Serving index.html for any sub-path under /system');
    res.sendFile(path.join(buildPath, 'index.html'));  // React의 index.html을 서빙
});

module.exports = router;
