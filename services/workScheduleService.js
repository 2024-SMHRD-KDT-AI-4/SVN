const db = require('../config/db');

// ✅ 근무 시간 + 근무 유형 설정 로직
const setWorkSchedule = async (req, res) => {
    const { emp_id, weekly_hours, overtime_hours, work_type, shift_type } = req.body;

    // 유효성 검사
    if (!emp_id || weekly_hours < 0 || overtime_hours < 0 || overtime_hours > 12) {
        return res.status(400).json({ error: "잘못된 근무 시간 (연장 근로 최대 12시간)" });
    }
    if (!['주말', '혼합'].includes(work_type)) {
        return res.status(400).json({ error: "근무 형태는 '주말' 또는 '혼합'만 가능합니다." });
    }
    if (!['오픈', '미들', '마감'].includes(shift_type)) {
        return res.status(400).json({ error: "근무 유형은 '오픈', '미들', '마감'만 가능합니다." });
    }

    try {
        const sql = `
            INSERT INTO tb_work_schedule (emp_id, weekly_hours, overtime_hours, work_type, shift_type)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                weekly_hours = VALUES(weekly_hours), 
                overtime_hours = VALUES(overtime_hours),
                work_type = VALUES(work_type),
                shift_type = VALUES(shift_type)
        `;
        await db.execute(sql, [emp_id, weekly_hours, overtime_hours, work_type, shift_type]);
        res.status(200).json({ message: "근무 스케줄 설정 완료" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "DB 저장 중 오류 발생" });
    }
};

// ✅ 근무 스케줄 조회 로직
const getWorkSchedule = async (req, res) => {
    const { emp_id } = req.params;
    try {
        const sql = `SELECT emp_id, weekly_hours, overtime_hours, total_hours, work_type, shift_type FROM tb_work_schedule WHERE emp_id = ?`;
        const [rows] = await db.execute(sql, [emp_id]);
        if (rows.length > 0) res.status(200).json(rows[0]);
        else res.status(404).json({ error: "해당 직원의 근무 스케줄 없음" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "DB 조회 중 오류 발생" });
    }
};

// ✅ 근무 유형 로테이션 로직
const rotateShift = async (req, res) => {
    const { emp_id } = req.params;
    try {
        const [rows] = await db.execute(`SELECT shift_type FROM tb_work_schedule WHERE emp_id = ?`, [emp_id]);
        if (rows.length === 0) return res.status(404).json({ error: "근무 정보 없음" });

        const currentShift = rows[0].shift_type;
        const nextShift = currentShift === '오픈' ? '미들' : currentShift === '미들' ? '마감' : '오픈';

        await db.execute(`UPDATE tb_work_schedule SET shift_type = ? WHERE emp_id = ?`, [nextShift, emp_id]);
        res.status(200).json({ message: `근무 유형 '${nextShift}'로 로테이션됨` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "로테이션 중 오류 발생" });
    }
};

// ✅ 서비스 함수들 export
module.exports = {
    setWorkSchedule,
    getWorkSchedule,
    rotateShift
};
