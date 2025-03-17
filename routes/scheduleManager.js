const express = require("express");
const db = require("../config/db"); 
const router = express.Router();

// 📌 **스케줄 자동 생성 API (`tb_work`에서 work_start, work_end 자동 연동)**
router.post("/generateSchedule", async (req, res) => {
    const scheduleData = req.body;

    if (!Array.isArray(scheduleData) || scheduleData.length === 0) {
        return res.status(400).json({ message: "올바른 데이터를 보내세요!" });
    }

    try {
        // 🔥 1️⃣ 기존 데이터 삭제 및 AUTO_INCREMENT 초기화
        await db.promise().query("DELETE FROM tb_autoschedule");
        await db.promise().query("ALTER TABLE tb_autoschedule AUTO_INCREMENT = 1");

        // 🔥 2️⃣ `work_name`을 기반으로 `work_start`, `work_end` 가져오기
        const scheduleValues = [];

        for (const entry of scheduleData) {
            if (!Array.isArray(entry.employees)) continue;

            for (const emp of entry.employees) {
                if (!emp.name || !emp.role) continue;

                // 🔥 `tb_work`에서 `work_start`, `work_end` 가져오기
                const [workResult] = await db.promise().query(
                    "SELECT work_start, work_end FROM tb_work WHERE work_name = ?",
                    [entry.work_name]
                );

                if (workResult.length === 0) {
                    console.warn(`⚠️ 근무 유형 '${entry.work_name}'의 시간이 설정되지 않음.`);
                    continue;
                }

                const { work_start, work_end } = workResult[0];

                scheduleValues.push([
                    entry.date,          // 날짜
                    entry.day,           // 요일
                    entry.work_name,     // 근무 유형
                    emp.name,            // 직원 이름
                    emp.role,            // 직원 역할
                    work_start,          // 🔥 자동으로 `work_start` 입력
                    work_end,            // 🔥 자동으로 `work_end` 입력
                    new Date()           // 저장 시간 (자동 생성)
                ]);
            }
        }

        if (scheduleValues.length === 0) {
            return res.status(400).json({ message: "저장할 데이터가 없습니다!" });
        }

        // 🔥 3️⃣ 새로운 데이터 삽입
        const insertSql = `
            INSERT INTO tb_autoschedule (date, day, work_name, employee_name, employee_role, start_time, end_time, created_at)
            VALUES ?
        `;
        await db.promise().query(insertSql, [scheduleValues]);

        res.status(200).json({ message: "스케줄 자동 생성 및 저장 완료!" });

    } catch (error) {
        console.error("❌ 스케줄 생성 오류:", error);
        res.status(500).json({ message: "스케줄 생성 실패!", error });
    }
});

module.exports = router;
