import sys
import io

# ====== stdout을 UTF-8로 재설정 (한글 깨짐 방지) ======
sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8')

import cv2
import face_recognition
import pickle
import numpy as np
import os
import time  # ✅ 추가

# === 1) pkl 파일 절대 경로로 읽어오기 ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
pkl_path = os.path.join(BASE_DIR, 'face_encodings.pkl')

try:
    with open(pkl_path, 'rb') as f:
        known_faces = pickle.load(f)
except FileNotFoundError:
    print("[❌오류] face_encodings.pkl 파일을 찾을 수 없습니다.")
    exit()

# === 2) 인코딩/ID 리스트 구성 ===
known_face_encodings = []
known_face_ids = []
for emp_id, enc_list in known_faces.items():
    for enc in enc_list:
        known_face_encodings.append(enc)
        known_face_ids.append(emp_id)

# === 3) 카메라 열기 ===
cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
if not cap.isOpened():
    print("[❌오류] 카메라 열기 실패")
    exit()

print("[안내] 자동 얼굴 인식 시작 (ESC로 종료)")

while True:
    ret, frame = cap.read()
    if not ret:
        print("[❌오류] 프레임 읽기 실패")
        break

    frame = cv2.flip(frame, 1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        # === 4) 얼굴 비교 ===
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.5)
        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
        best_match_index = np.argmin(face_distances)
        accuracy = (1 - face_distances[best_match_index]) * 100
        accuracy_text = f"{accuracy:.2f}%"

        # 인식/미인식 판단
        if matches[best_match_index] and accuracy >= 70:
            employee_id = known_face_ids[best_match_index]
            recognized = True
        else:
            employee_id = "Unknown"
            recognized = False

        # === 5) 디버그용: 프레임에 텍스트, 박스 그리기 ===
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        cv2.putText(frame, f"{employee_id} ({accuracy_text})", (left, top - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

        # === 6) 인식 성공 시, 결과 출력 후 종료 ===
        if recognized:
            print(f"[인식 완료] {employee_id}, 정확도: {accuracy_text}")
            cv2.imshow("Auto Face Recognition", frame)
            cv2.waitKey(3000)  # 3초 대기 (화면 확인)

            cap.release()
            cv2.destroyAllWindows()
            print(f"{employee_id} 직원의 인식이 완료되었습니다.")

            # Node.js가 이 ID값을 파싱할 수 있도록 추가 print
            print(employee_id)  
            exit()

    cv2.imshow("Auto Face Recognition", frame)
    if cv2.waitKey(1) & 0xFF == 27:  # ESC 키로 종료
        print("[종료] 프로그램 종료")
        break

cap.release()
cv2.destroyAllWindows()
