# 출퇴근 얼굴 인식 (MySQL + 출퇴근 사진 저장)

import cv2  # 카메라 사용 및 이미지 저장
import datetime  # 날짜와 시간 관리
import os  # 폴더/파일 경로 관리
import mysql.connector  # MySQL 연결

from db_connect import db, cursor  # DB 연결 모듈 가져오기 (이미 연결 설정 되어 있음)

# ✅ 경로 자동 설정 (Run, 터미널 상관없이 고정)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # 현재 face_recognition 폴더
SAVE_DIR = os.path.join(BASE_DIR, 'att_data')  # 절대 경로로 att_data 폴더

# ✅ 폴더 없으면 자동 생성
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)
    print(f"[폴더 생성 완료] {SAVE_DIR}")

# ✅ 저장 경로 확인 (디버깅용)
print(f"[사진 저장 경로] {SAVE_DIR}")

employee_id = 'E001'  # 테스트용 직원 ID (나중에 자동 인식 시 대체 가능)

cap = cv2.VideoCapture(0)  # 카메라 연결
if not cap.isOpened():
    print("[오류] 카메라 연결 실패")
    exit()

print("[대기 중] Space bar로 촬영, ESC로 종료")

while True:
    ret, frame = cap.read()  # 카메라 프레임 읽기
    if not ret:
        print("[오류] 프레임 수신 실패")
        break

    frame = cv2.flip(frame, 1)  # ✅ 좌우반전 (미러링)
    
    cv2.imshow("Press Space to Capture", frame)  # 화면 출력
    key = cv2.waitKey(1) & 0xFF  # 키보드 입력 감지

    if key == 32:  # Space bar로 사진 촬영
        now = datetime.datetime.now()
        date_str = now.strftime('%y%m%d')
        time_str = now.strftime('%H%M%S')  # ✅ 시분초까지 추가
        datetime_str = now.strftime('%Y-%m-%d %H:%M:%S')

        file_name = f"{date_str}_{employee_id}_{time_str}.jpg"
        save_path = os.path.join(SAVE_DIR, file_name)


        cv2.imwrite(save_path, frame)  # 사진 저장
        print(f"[사진 저장 완료] {save_path}")

        # DB에 기록 (test_table에 저장)
        sql = "INSERT INTO test_table (wo_id, start_time) VALUES (%s, %s)"
        cursor.execute(sql, (employee_id, datetime_str))
        db.commit()
        print(f"[DB 저장 완료] 직원 ID: {employee_id}, 시간: {datetime_str}")

    elif key == 27:  # ESC로 종료
        print("[종료] 프로그램 종료")
        break

cap.release()
cv2.destroyAllWindows()
cursor.close()
db.close()


# Test를 위해 필요한 라이브러리 : pip install opencv-python mysql-connector-python
# 터미널 실행하여 Test 진행 : python face_recog.py
