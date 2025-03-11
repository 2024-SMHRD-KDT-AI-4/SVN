import { React, useState } from "react";
import styles from "../Calendar.module.css";
import Schedule from './Schedule';


const Calendar = () => { // 현 컴포넌트의 함수실행
    const [currentDate, setCurrentDate] = useState(new Date()); //  오늘의 날짜를 담을 State 변수
    // %주의% new Date() : Date라는 클래스를 이용해서 생성한 인스턴스(인스턴스 명 : currentDate)
    const [view, setView] = useState("Calendar");

    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
    const [selectedDate, setSelectedDate] = useState(null); // 선택한 날짜 저장
    const [events, setEvents] = useState({}); // 날짜별 이벤트 저장
    const [newEvent, setNewEvent] = useState(""); // 새 이벤트 입력 값



    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; //1주일(7일)을 담은 리스트 상수(const) 변수

    const getDaysInMonth = (year, month) => {  // year, month 파라미터(매개변수)들을 가지고 있는 함수
        return new Date(year, month + 1, 0).getDate(); // getdate()함수를 반환 -> 당연히 해당 getdate() 함수는 숫자형 값을 반환 -> 즉 숫자형 값을 반환
    };

    const changeMonth = (offset) => { // 달력의 월단위 변경을 위한 함수(버튼 이벤트에 등록). offset은 1,-1 -> 버튼으로 월 변경을 생각할 것
        const newDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + offset,
            1
        ); // newDate는 지역변수로써 원하는 월을 담는 변수
        setCurrentDate(newDate); // 원하는 변수를 훅메서드를 이용해서 state 변수에 수정하고 업데이트가 진행되며 화면 갱신
    };

    const checking = (number) => {
        let income = number;
        income = income === 0 ? 7 : income; // 결과를 재할당
        return income; // 반환
    };

    const addEvent = () => {
        if (!newEvent.trim()) return; // 빈 값 방지

        setEvents((prevEvents) => ({
            ...prevEvents,
            [selectedDate]: Array.isArray(prevEvents[selectedDate]) // 기존에 배열인지 확인
                ? [...prevEvents[selectedDate], newEvent] // 배열이면 기존 이벤트에 추가
                : [newEvent], // 배열이 아니면 새 배열 생성
        }));

        setNewEvent(""); // 입력 필드 초기화
        setIsModalOpen(false); // 모달 닫기
    };

    const deleteEvent = (date, index) => {
        setEvents((prevEvents) => {
            const updatedEvents = { ...prevEvents };
            updatedEvents[date] = updatedEvents[date].filter((_, i) => i !== index);

            // 만약 해당 날짜의 모든 이벤트가 삭제되면 빈 배열 대신 키 자체를 삭제
            if (updatedEvents[date].length === 0) {
                delete updatedEvents[date];
            }

            return updatedEvents;
        });
    };


    const renderDays = () => { // 실질적인 캘린더의 전체적 표시와 배치를 맡는 함수, day라는 리스트를 return(반환)
        const year = currentDate.getFullYear(); // 오늘 날짜 기준의 년
        const month = currentDate.getMonth(); // 오늘 날짜 기준의 월

        //console.log('해당월 : ' + (month + 1) + '월')

        const daysInPreMonth = getDaysInMonth(year, month - 1)
        //console.log('이전 월의 날짜 갯수 : ', daysInPreMonth)
        const daysInMonth = getDaysInMonth(year, month); // 위의 연도와 월을 담은 변수를 사용해서 당월이 최대로 가지는 월수를 담은 배열
        // (예시 1월이면 length(길이) : 31, 2월이면 length(길이) : 28)

        const firstDay = checking(new Date(year, month, 1).getDay()); // 위의 연도와 월을 담은 변수를 사용해서 당월의 1일의 요일을 담는 변수
        // 2월 기준 1일은 토요일임으로 6을 담음
        const days = []; // 반환할 리스트 변수를 선언. 현재는 비어있음

        for (let pre = 0; pre < firstDay; pre++) { // firstDay는 2월을 기준으로 6. 반복문은 6번 수행됨
            //console.log(styles.inactive) 항상 로그를 찍어 문제를 찾아서 해결해야합니다.(주석처리해둘 것)
            days.push( // push 함수를 이용해서 리스트에 할당 -> 
                <div key={`pre-empty-${pre}`} className={styles.inactive}>
                    {daysInPreMonth - firstDay + (pre + 1)}
                </div>
            );
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const formattedDate = `${year}-${month + 1}-${day}`; // YYYY-M-D 형식
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
                    <span className={styles.eventsContainer}>
                        {/* ✅ 5개까지만 일정 표시 */}
                        {Array.isArray(events[formattedDate]) &&
                            events[formattedDate].slice(0, 5).map((event, index) => (
                                <span key={index} className={styles.event} title={event}>{event}</span>
                            ))
                        }

                        {/* ✅ '... 외 n개'를 항상 가장 아래로 */}
                        {events[formattedDate] && events[formattedDate].length > 5 && (
                            <span className={styles.moreEvents}>
                                ... 외 {events[formattedDate].length - 5}개
                            </span>
                        )}
                    </span>
                </div>
            );
        }

        const other = days.length
        //console.log(other)
        for (let j = (other + 1); j < 43; j++) {
            days.push( // push 함수를 이용해서 리스트에 할당 -> 
                <div key={`post-empty-${j}`} className={styles.inactive}>
                    {j - other}
                </div>
            );
        }
        //console.log(days.length)
        return days;
    };

    // 📌 🔥 조건부 렌더링 추가 (주간 버튼 클릭 시 `Schedule` 렌더링)
    if (view === "Schedule") {
        return <Schedule goBack={() => setView("Calendar")} />;
    }

    return (
        <div className={styles.calendar}>
            <div className={styles.calendarChanges}>
                
                {/* 🔥 onClick 이벤트 추가 (주간 버튼 클릭 시 Schedule로 전환) */}
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
            <div className={styles.daysOfWeek}>
                {daysOfWeek.map((day) => (

                    day === "Sun" || day === "Sat" ? <div className={styles.test1} key={day}>{day}</div>
                        : <div className={styles.test} key={day}>{day}</div>
                ))}
            </div>
            <div className={styles.days}>{renderDays()}</div>
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3>{selectedDate}</h3>
                        <div className={styles.eventList}>
                            {events[selectedDate] && events[selectedDate].length > 0 ? (
                                events[selectedDate].map((event, index) => (
                                    <div key={index} className={styles.eventItem}>
                                        <p className={styles.eventText}>{event}</p>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => deleteEvent(selectedDate, index)}
                                        >
                                            ❌
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p>저장된 이벤트가 없습니다.</p>
                            )}
                        </div>
                        <input
                            type="text"
                            value={newEvent}
                            onChange={(e) => setNewEvent(e.target.value)}
                            placeholder="새 이벤트 추가"
                        />
                        <button onClick={addEvent} className={styles.addButton}>추가</button>
                        <button onClick={() => setIsModalOpen(false)} className={styles.closeButton}>닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
