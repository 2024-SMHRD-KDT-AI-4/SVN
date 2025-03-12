import face_recognition
import cv2
import mysql.connector
import json
import datetime
import csv
import os

# 📌 MySQL 연결 설정
db = mysql.connector.connect(
    host="project-db-cgi.smhrd.com",
    port=3307,
    user="cgi_24K_AI4_p2_3",
    password="smhrd3",
    database="cgi_24K_AI4_p2_3"
)
cursor = db.cursor()

LOG_FILE = "attendance_log.csv"  # ✅ CSV 파일 경로

def load_known_faces():
    """MySQL에서 등록된 직원 얼굴 데이터를 불러오는 함수"""
    
    cursor.execute("SELECT id, name, face_encoding FROM employees")
    rows = cursor.fetchall()
    known_faces = {}

    for row in rows:
        employee_id, name, encoding_json = row
        encoding = json.loads(encoding_json)  # JSON 문자열을 리스트로 변환
        known_faces[name] = (employee_id, encoding)

    return known_faces

def log_attendance(employee_id, name):
    """출퇴근 기록을 MySQL 및 CSV 파일에 저장하는 함수"""
    
    now = datetime.datetime.now()
    log_entry = [employee_id, name, now.strftime("%Y-%m-%d %H:%M:%S")]

    # 📌 MySQL에 출퇴근 기록 저장
    sql = "INSERT INTO attendance (employee_id, timestamp) VALUES (%s, %s)"
    cursor.execute(sql, (employee_id, now))
    db.commit()
    print(f"✅ 출퇴근 기록 저장 완료! 직원 ID: {employee_id}, 이름: {name}, 시간: {now}")

    # 📌 CSV 파일이 없으면 헤더 추가
    if not os.path.exists(LOG_FILE):
        with open(LOG_FILE, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["직원 ID", "이름", "출퇴근 시간"])  # ✅ 헤더 추가

    # 📌 출퇴근 기록을 CSV 파일에 추가
    with open(LOG_FILE, "a", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(log_entry)

def recognize_face():
    """실시간으로 웹캠에서 얼굴을 인식하고 출퇴근을 기록하는 함수"""
    
    employees = load_known_faces()

    if not employees:
        print("❌ 등록된 직원이 없습니다! 먼저 `register_face.py`를 실행하세요.")
        return

    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    print("📸 얼굴을 인식하는 중...")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ 카메라 오류!")
            break

        rgb_frame = frame[:, :, ::-1]  # OpenCV는 BGR, face_recognition은 RGB 사용
        face_locations = face_recognition.face_locations(rgb_frame)  # 얼굴 감지
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)  # 얼굴 특징 추출

        for face_encoding, (top, right, bottom, left) in zip(face_encodings, face_locations):
            name = "Unknown"
            employee_id = None

            for emp_name, (emp_id, known_encoding) in employees.items():
                match = face_recognition.compare_faces([known_encoding], face_encoding, tolerance=0.5)
                if True in match:
                    name = emp_name
                    employee_id = emp_id
                    log_attendance(employee_id, name)  # ✅ 출퇴근 기록 저장 (MySQL + CSV)
                    break

            # 얼굴 인식 결과를 화면에 표시
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
            cv2.putText(frame, name, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

        cv2.imshow("Attendance System", frame)

        # ESC 키(27)를 누르면 종료
        if cv2.waitKey(1) & 0xFF == 27:
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    recognize_face()

cursor.close()
db.close()

# 실행방법 : python face_recognition.py