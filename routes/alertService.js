const express = require('express');
const router = express.Router();
const { checkScheduleChanges, checkRequestApprovals } = require('../services/alertService');

// 📌 수동으로 알림 테스트할 수 있는 API
router.post('/test/schedule', async (req, res) => {
    await checkScheduleChanges();
    res.json({ message: "스케줄 변경 감지 및 알림 완료" });
});

router.post('/test/request', async (req, res) => {
    await checkRequestApprovals();
    res.json({ message: "근무 요청 승인 감지 및 알림 완료" });
});

module.exports = router;
