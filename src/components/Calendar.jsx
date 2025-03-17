import React, { useState, useEffect } from "react";
import styles from "../Calendar.module.css";
import Schedule from "./Schedule";

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [schedules, setSchedules] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [view, setView] = useState("Calendar"); // 🔥 주간/월간 뷰 관리
    const [newEvent, setNewEvent] = useState("");
    const [vacations, setVacations] = useState({}); // ✅ 휴가 데이터 저장 상태

    const fetchVacations = async () => {
        try {
            console.log("🔍 [fetchVacations] API 요청 실행됨!");

            const response = await fetch("http://localhost:5067/management/getVacation"); // ✅ 백엔드 API 경로 맞춤
            console.log("📡 [서버 응답 상태 코드]:", response.status);

            if (!response.ok) {
                throw new Error(`❌ HTTP 오류 발생: ${response.status}`);
            }

            const { data } = await response.json(); // ✅ 응답에서 데이터만 추출
            console.log("📦 [휴가 데이터]:", JSON.stringify(data, null, 2));

            if (!Array.isArray(data)) {
                console.warn("⚠️ 서버에서 받은 데이터가 배열이 아님!", data);
                setVacations({});
                return;
            }

            // ✅ 날짜별로 휴가 데이터를 그룹화
            const groupedVacations = {};
            data.forEach((vacation) => {
                const formattedDate = vacation.start_date.split("T")[0]; // 날짜 변환

                if (!groupedVacations[formattedDate]) {
                    groupedVacations[formattedDate] = [];
                }

                groupedVacations[formattedDate].push({
                    emp_id: vacation.emp_id,
                    content: vacation.req_content, // ✅ 요청 내용 저장
                });
            });

            console.log("✅ [가공된 휴가 데이터]:", groupedVacations);
            setVacations(groupedVacations);
        } catch (error) {
            console.error("❌ 휴가 데이터를 불러오는 중 오류 발생:", error);
        }
    };





    const fetchSchedules = async () => {
        try {
            console.log("🔍 [fetchSchedules] API 요청 실행됨!");

            const response = await fetch("http://localhost:5067/autoschedule/getSchedules");
            console.log("📡 [서버 응답 상태 코드]:", response.status);

            if (!response.ok) {
                throw new Error(`❌ HTTP 오류 발생: ${response.status}`);
            }

            const data = await response.json();
            console.log("📦 [서버 응답 데이터]:", JSON.stringify(data, null, 2));

            if (!Array.isArray(data)) {
                console.warn("⚠️ 서버에서 받은 데이터가 배열이 아님!", data);
                setSchedules([]);
                return;
            }

            const groupedSchedules = {};
            data.forEach((schedule) => {
                const dateObj = new Date(schedule.date); // 받아온 날짜
                dateObj.setHours(dateObj.getHours() + 9); // UTC+9 (한국 시간으로 변환)
                const formattedDate = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환

                const { work_name, employee_name } = schedule;

                if (!groupedSchedules[formattedDate]) {
                    groupedSchedules[formattedDate] = {};
                }

                if (!groupedSchedules[formattedDate][work_name]) {
                    groupedSchedules[formattedDate][work_name] = [];
                }

                groupedSchedules[formattedDate][work_name].push(employee_name);
            });

            console.log("✅ [가공된 데이터]:", groupedSchedules);

            setSchedules(groupedSchedules);

        } catch (error) {
            console.error("❌ 주간 스케줄 데이터를 불러오는 중 오류 발생:", error);
        }
    };



    useEffect(() => {
        fetchSchedules();
        fetchVacations();
    }, []);

    useEffect(() => {
        console.log("🔍 [변경된 휴가 데이터]:", vacations);
        setCurrentDate(new Date()); // ✅ 강제 리렌더링 트리거
    }, [vacations]);



    const changeMonth = (offset) => {
        const newDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + offset,
            1
        );
        setCurrentDate(newDate);
    };

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();











    const renderDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = new Date(year, month, 1).getDay();
        const days = [];

        for (let pre = 0; pre < firstDay; pre++) {
            days.push(<div key={`pre-empty-${pre}`} className={styles.inactive}></div>);
        }





        for (let day = 1; day <= daysInMonth; day++) {
            const formattedDate = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
            const schedule = schedules[formattedDate];
            const vacationList = vacations[formattedDate] || [];
            const hasVacation = vacationList.length > 0;






            // ✅ 휴가 여부 확인 함수
            const isOnVacation = (name) => vacationList.some(v => v.emp_id.trim() === name.trim());

            days.push(
                <div
                    key={day}
                    className={styles.active}
                    onClick={() => {
                        setSelectedDate(formattedDate);
                        setIsModalOpen(true);
                    }}
                >
                    <span className={styles.dayNumber}>{day}</span>

                    {/* ✅ 일정 표시 (오픈 → 미들 → 마감) */}
                    {schedule ? (
                        <span style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                            <p
                                style={{
                                    backgroundColor: "#D4EDDA", // 연한 초록색 (오픈)
                                    color: "#155724",
                                    borderRadius: "5px",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    margin: "0", // p 태그 기본 마진 제거
                                }}
                            >
                                🟢 오픈: {schedules[formattedDate]?.오픈?.map(name => `${name}${isOnVacation(name) ? " 🏖" : ""}`).join(", ") || "없음"}
                            </p>

                            <p
                                style={{
                                    backgroundColor: "#FFF3CD", // 연한 노란색 (미들)
                                    color: "#856404",
                                    borderRadius: "5px",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    margin: "0", // p 태그 기본 마진 제거
                                }}
                            >
                                  🟡 미들: {schedules[formattedDate]?.미들?.map(name => `${name}${isOnVacation(name) ? " 🏖" : ""}`).join(", ") || "없음"}
                            </p>

                            <p
                                style={{
                                    backgroundColor: "#F8D7DA", // 연한 빨간색 (마감)
                                    color: "#721C24",
                                    borderRadius: "5px",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    margin: "0", // p 태그 기본 마진 제거
                                }}
                            >
                                  🔴 마감: {schedules[formattedDate]?.마감?.map(name => `${name}${isOnVacation(name) ? " 🏖" : ""}`).join(", ") || "없음"}
                            </p>
                            {hasVacation && (
                        <p className={styles.vacationNotice}>
                            휴가자 있음 {vacationList.map(v => v.emp_id).join(", ")}
                        </p>
                    )}
                        </span>

                    ) : (
                        <p className={styles.scheduleBox}></p>
                    )}

                    {/* ✅ 마감 아래에 휴가자를 배치 */}

                </div>
            );
        }

        return days;
    };












    if (view === "Schedule") {
        return <Schedule goBack={() => setView("Calendar")} />;
    }

    return (
        <div className={styles.calendar}>
            <div className={styles.calendarChanges}>
                {/* 🔥 주간 버튼 추가 */}
                <span className={styles.weekBtn} onClick={() => setView("Schedule")}>주간</span>
                <span className={styles.monthBtn}>월간</span>
            </div>

            <div className={styles.header}>
                <button onClick={() => changeMonth(-1)}>◀</button>
                <h2>
                    {currentDate.toLocaleString("default", { month: "long" })}{" "}
                    {currentDate.getFullYear()}
                </h2>
                <button onClick={() => changeMonth(1)}>▶</button>
            </div>

            <div className={styles.days}>{renderDays()}</div>

            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3>{selectedDate}</h3>

                        {/* 📌 일정 목록 */}
                        <div className={styles.eventList}>
                            {schedules[selectedDate] ? (
                                <>
                                    <p>🟢 오픈: {schedules[selectedDate].오픈 || "없음"}</p>
                                    <p>🟡 미들: {schedules[selectedDate].미들 || "없음"}</p>
                                    <p>🔴 마감: {schedules[selectedDate].마감 || "없음"}</p>
                                </>
                            ) : (
                                <p>📌 일정 없음</p>
                            )}
                        </div>

                        {/* 📌 휴가 목록 추가 */}
                        {vacations[selectedDate] && vacations[selectedDate].length > 0 ? (
                            <div className={styles.vacationList}>
                                <h4>휴가 일정</h4>
                                <ul>
                                    {vacations[selectedDate].map((vac, index) => (
                                        <li key={index} className={styles.vacationItem}>
                                            {vac.emp_id}: {vac.content}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p>📌 해당 날짜에 휴가 일정 없음</p>
                        )}

                        <button onClick={() => setIsModalOpen(false)} className={styles.closeButton}>닫기</button>
                    </div>
                </div>

            )}
        </div>
    );
};

export default Calendar;

