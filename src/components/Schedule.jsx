import React, { useState, useEffect } from "react";
import styles from "../Calendar.module.css";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [notes, setNotes] = useState(() => {
    return JSON.parse(localStorage.getItem("calendarNotes")) || {};
  });

  useEffect(() => {
    localStorage.setItem("calendarNotes", JSON.stringify(notes));
  }, [notes]);

  const daysInMonth = new Date(2025, 3, 0).getDate(); // 3월 기준
  const firstDay = new Date(2025, 2, 1).getDay();

  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  const handleNoteChange = (event) => {
    setNotes({
      ...notes,
      [selectedDate]: event.target.value,
    });
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarChanges}>
        <span className={styles.monthBtn}>월간</span>
        <span className={styles.weekBtn}>주간</span>
      </div>
      <div className={styles.header}>
        <button>◀</button>
        <h2>2025년 3월</h2>
        <button>▶</button>
      </div>
      <div className={styles.daysOfWeek}>
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div className={day === "일" || day === "토" ? styles.test1 : styles.test} key={day}>{day}</div>
        ))}
      </div>
      <div className={styles.days}>
        {Array(firstDay).fill(null).map((_, index) => (
          <div key={`empty-${index}`} className={styles.inactive} />
        ))}
        {[...Array(daysInMonth).keys()].map((day) => (
          <div
            key={day + 1}
            className={`${styles.active} ${selectedDate === day + 1 ? styles.selected : ""}`}
            onClick={() => handleDateClick(day + 1)}
          >
            {day + 1}
          </div>
        ))}
      </div>
      {selectedDate && (
        <div className={styles.noteContainer}>
          <h2>{selectedDate}일 메모</h2>
          <textarea
            className={styles.noteInput}
            rows="3"
            value={notes[selectedDate] || ""}
            onChange={handleNoteChange}
            placeholder="메모를 입력하세요..."
          ></textarea>
        </div>
      )}
    </div>
  );
};

export default Calendar;
