const express = require('express');
const path = require('path');
const router = express.Router();

// React 빌드 폴더 경로
const buildPath = path.join(__dirname, '../build');

// /esports 경로에서 React 앱의 정적 파일 서빙
router.use(express.static(buildPath));  // React의 모든 정적 파일을 서빙

// /esports 경로에서 index.html 반환
router.get('/', (req, res) => {
    console.log('Serving index.html for /esports');
    res.sendFile(path.join(buildPath, 'index.html'));  // React의 index.html을 서빙
});

// /esports 하위 경로에서 모든 요청에 대해 index.html 반환
router.get('*', (req, res) => {
    console.log('Serving index.html for any sub-path under /esports');
    res.sendFile(path.join(buildPath, 'index.html'));  // React의 index.html을 서빙
});

module.exports = router;