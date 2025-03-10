const express = require('express');
const router = express.Router();

// 서비스 파일 연결
const {
    setWorkSchedule,
    getWorkSchedule,
    rotateShift
} = require('../services/workScheduleService');

// 근무 시간 + 유형 설정
router.post('/set', setWorkSchedule);

// 근무 스케줄 조회
router.get('/:emp_id', getWorkSchedule);

// 근무 유형 로테이션
router.post('/rotate/:emp_id', rotateShift);

module.exports = router;
