const express = require("express");
const db = require("../config/db"); // MySQL 연결 파일 가져오기
const router = express.Router(); // ✅ `express.Router()` 선언

// 📌 날짜 변환 함수 (YYYY-MM-DD 형식으로 변환)
const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식 변환
};

// 📌 자동 생성된 스케줄 저장 API
router.post("/saveSchedule", async (req, res) => {
    const scheduleData = req.body;

    console.log("📌 받은 데이터:", JSON.stringify(scheduleData, null, 2));

    if (!Array.isArray(scheduleData) || scheduleData.length === 0) {
        return res.status(400).json({ message: "올바른 데이터를 보내세요!" });
    }

    const insertSql = `
        INSERT INTO tb_autoschedule (date, day, work_name, employee_name, employee_role, created_at)
        VALUES ?
    `;

    const values = [];
    scheduleData.forEach(entry => {
        if (Array.isArray(entry.employees)) {
            entry.employees.forEach(emp => {
                if (!emp.name || !emp.role) return;

                const formattedDate = formatDate(entry.date);
                console.log("✅ 저장할 날짜 값:", formattedDate);

                values.push([
                    formattedDate,  // ✅ 변환된 날짜 저장
                    entry.day,
                    entry.work_name,
                    emp.name,
                    emp.role,
                    new Date()
                ]);
            });
        }
    });

    console.log("📌 저장할 데이터:", values);

    if (values.length === 0) {
        return res.status(400).json({ message: "저장할 직원 데이터가 없습니다!" });
    }

    db.query("DELETE FROM tb_autoschedule", (err) => {
        if (err) {
            console.error("❌ 기존 데이터 삭제 오류:", err);
            return res.status(500).json({ message: "기존 데이터 삭제 실패!", error: err });
        }

        db.query("ALTER TABLE tb_autoschedule AUTO_INCREMENT = 1", (err) => {
            if (err) {
                console.error("❌ AUTO_INCREMENT 초기화 오류:", err);
                return res.status(500).json({ message: "번호 초기화 실패!", error: err });
            }

            db.query(insertSql, [values], (err, result) => {
                if (err) {
                    console.error("❌ 데이터 저장 오류:", err);
                    return res.status(500).json({ message: "데이터 저장 실패!", error: err });
                }

                console.log("✅ 스케줄 데이터 저장 완료 (번호 초기화 포함):", result);
                res.status(200).json({ message: "스케줄 데이터 저장 성공 (번호 초기화 완료)!", result });
            });
        });
    });
});

// ✅ **자동 생성된 스케줄 조회 API (프론트엔드에서 호출할 라우트)**
router.get("/getSchedules", (req, res) => {
    console.log("📢 [GET] /autoschedule/getSchedules 요청 도착");

    const query = "SELECT * FROM tb_autoschedule ORDER BY date, work_name";
    
    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ 데이터 조회 오류:", err);
            return res.status(500).json({ message: "데이터 조회 실패!", error: err });
        }

        console.log("✅ 스케줄 데이터 조회 성공:", results.length, "개");
        res.status(200).json(results);
    });
});

module.exports = router; // ✅ 라우터 내보내기
