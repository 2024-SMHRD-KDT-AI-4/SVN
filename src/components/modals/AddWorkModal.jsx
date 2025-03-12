import React, { useState, useEffect } from "react";

const AddWorkModal = ({ isOpen, onClose, onSubmit }) => {
    // const fieldAttributes = {
    //     element01: { htmlFor: "wrkId", name: "wrkId", id: "wrkId", placeholder: "근무번호" },
    //     element02: { htmlFor: "wrkName", name: "wrkName", id: "wrkName", placeholder: "근로명" },
    //     element07: { htmlFor: "wrkDfRule", name: "wrkDfRule", id: "wrkDfRule", placeholder: "소정근로규칙" },
    //     element08: { htmlFor: "wrkMxRule", name: "wrkMxRule", id: "wrkMxRule", placeholder: "최대근로규칙" },
    //     element10: { htmlFor: "wrkDesc", name: "wrkDesc", id: "wrkDesc", placeholder: "비고란" },
    // };

    const [amPmStart, setAmPmStart] = useState("AM");
    const [amPmEnd, setAmPmEnd] = useState("AM");
    const [startHour, setStartHour] = useState(0);
    const [startMinute, setStartMinute] = useState(0);
    const [endHour, setEndHour] = useState(0);
    const [endMinute, setEndMinute] = useState(0);

    const [formData, setFormData] = useState({
        wrkId: "",
        wrkName: "",
        wrkTimeStart: "",
        wrkTimeEnd: "",
        wrkbreakTime: "0",
        wrkDays: "",
        wrkDfRule: "",
        wrkMxRule: "",
        wrkType: "정규직",
        wrkDesc: "",
    });

    const handleSubmit = ()=>{

        console.log("내보낼 폼: ", formData)
        onSubmit(formData);
        setFormData({
            wrkId: "",
            wrkName: "",
            wrkTimeStart: "", // 근무 시작 시간
            wrkTimeEnd: "",    // 근무 종료 시간
            wrkbreakTime: "0",
            wrkDays: "",
            wrkDfRule: "",
            wrkMxRule: "",
            wrkType: "정규직",
            wrkDesc: "",
        });
    };

    const testSubmit = () => {
        const testData = {
            wrkId: "T",
            wrkName: "테스트",
            wrkTimeStart: "09:00", // 근무 시작 시간
            wrkTimeEnd: "18:00",    // 근무 종료 시간
            breakTime: "60",
            wrkDays: "월,화,수,목,금",
            wrkDfRule: 40,
            wrkMxRule: 52,
            wrkType: "정규직",
            wrkDesc: "테스트용"
        };
        setFormData(testData);
        onSubmit(testData);
        setFormData({
            wrkId: "",
            wrkName: "",
            wrkTimeStart: "", // 근무 시작 시간
            wrkTimeEnd: "",    // 근무 종료 시간
            wrkbreakTime: "0",
            wrkDays: "",
            wrkDfRule: "",
            wrkMxRule: "",
            wrkType: "정규직",
            wrkDesc: "",
        });
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        setFormData((prevState) => {
            const selectedDays = prevState.wrkDays ? prevState.wrkDays.split(",") : [];
            const updatedDays = checked
                ? [...selectedDays, value]
                : selectedDays.filter((day) => day !== value);
            return { ...prevState, wrkDays: updatedDays.join(",") };
        });
    };

    useEffect(() => {
        const formatTime = (amPm, hour, minute) => {
            if (amPm === "PM" && hour < 12) hour += 12;
            if (amPm === "AM" && hour === 12) hour = 0;
            return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        };

        const startTime = formatTime(amPmStart, startHour, startMinute);
        const endTime = formatTime(amPmEnd, endHour, endMinute);

        setFormData((prevState) => ({
            ...prevState,
            wrkTimeStart: startTime,
            wrkTimeEnd: endTime,
        }));
    }, [amPmStart, amPmEnd, startHour, startMinute, endHour, endMinute]);

    useEffect(() => {
        const calculateWorkHours = (startTime, endTime, breakTime) => {
            if (!startTime || !endTime) return 0;

            const [startHour, startMinute] = startTime.split(":").map(Number);
            const [endHour, endMinute] = endTime.split(":").map(Number);

            const startTotalMinutes = startHour * 60 + startMinute;
            const endTotalMinutes = endHour * 60 + endMinute;

            let totalWorkMinutes = endTotalMinutes - startTotalMinutes;
            if (totalWorkMinutes < 0) totalWorkMinutes += 24 * 60;

            totalWorkMinutes -= parseInt(breakTime, 10);

            return Math.max(totalWorkMinutes / 60, 0);
        };

        const standardHoursPerDay = calculateWorkHours(
            formData.wrkTimeStart,
            formData.wrkTimeEnd,
            formData.wrkbreakTime || "0"
        );

        const totalDays = formData.wrkDays ? formData.wrkDays.split(",").length : 0;
        const standardHours = standardHoursPerDay * totalDays;
        const maxWorkHours = standardHours >= 15 ? standardHours + 12 : standardHours;

        setFormData((prevState) => ({
            ...prevState,
            wrkDfRule: standardHours.toFixed(1),
            wrkMxRule: maxWorkHours.toFixed(1),
        }));
    }, [formData.wrkDays, formData.wrkTimeStart, formData.wrkTimeEnd, formData.wrkbreakTime]);



    if (!isOpen) return null;

    return (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", width: "400px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <h3>근무 추가</h3>
                <div>
                    <label>근무번호</label>
                    <input type="text" name="wrkId" value={formData.wrkId} onChange={handleChange} />
                </div>
                <div>
                    <label>근무명</label>
                    <input type="text" name="wrkName" value={formData.wrkName} onChange={handleChange} />
                </div>
                <div>
                    <label>근무시간</label>
                    <div>
                        <select value={amPmStart} onChange={(e) => setAmPmStart(e.target.value)}>
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                        <select value={startHour} onChange={(e) => setStartHour(Number(e.target.value))}>
                            {[...Array(12).keys()].map((hour) => (
                                <option key={hour} value={hour}>{hour}</option>
                            ))}
                        </select>
                        <select value={startMinute} onChange={(e) => setStartMinute(Number(e.target.value))}>
                            <option value={0}>00</option>
                            <option value={30}>30</option>
                        </select>
                        ~
                        <select value={amPmEnd} onChange={(e) => setAmPmEnd(e.target.value)}>
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                        <select value={endHour} onChange={(e) => setEndHour(Number(e.target.value))}>
                            {[...Array(12).keys()].map((hour) => (
                                <option key={hour} value={hour}>{hour}</option>
                            ))}
                        </select>
                        <select value={endMinute} onChange={(e) => setEndMinute(Number(e.target.value))}>
                            <option value={0}>00</option>
                            <option value={30}>30</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label>휴식</label>
                    <select name="wrkbreakTime" value={formData.wrkbreakTime || "0"} onChange={handleChange}>
                        <option value="0">0분</option>
                        <option value="30">30분</option>
                        <option value="60">1시간</option>
                        <option value="90">1시간 30분</option>
                        <option value="120">2시간</option>
                    </select>
                </div>
                <div>
                    <label>근무요일</label>
                    {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
                        <label key={day}>
                            <input
                                type="checkbox"
                                value={day}
                                checked={formData.wrkDays.includes(day)}
                                onChange={handleCheckboxChange}
                            />
                            {day}
                        </label>
                    ))}
                </div>
                <div>
                    <label>소정근로규칙</label>
                    <input type="text" name="wrkDfRule" value={formData.wrkDfRule} readOnly />
                </div>
                <div>
                    <label>최대근로규칙</label>
                    <input type="text" name="wrkMxRule" value={formData.wrkMxRule} readOnly />
                </div>
                <div>
                    <label>계약유형</label>
                    <select name="wrkType" value={formData.wrkType || "정규직"} onChange={handleChange}>
                        <option value="정규직">정규직</option>
                        <option value="파트타임">파트타임</option>
                    </select>
                </div>
                <div>
                    <label>비고</label>
                    <textarea name="wrkDesc" value={formData.wrkDesc} onChange={handleChange} />
                </div>
                <button onClick={onClose}>닫기</button>
                <button onClick={testSubmit}>테스트</button>
                <button onClick={handleSubmit}>추가</button>
            </div>
        </div>
    );
};

export default AddWorkModal;
