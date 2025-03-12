import cv2
import face_recognition
import pickle
import numpy as np
import sys
import os

# ====== 1) pkl 파일 절대 경로로 읽어오기 ======
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
pkl_path = os.path.join(BASE_DIR, 'face_encodings.pkl')

try:
    with open(pkl_path, 'rb') as f:
        known_faces = pickle.load(f)
except FileNotFoundError:
    print("[ERROR] face_encodings.pkl not found.")
    exit()

# ====== 2) 인코딩/ID 리스트 구성 ======
known_face_encodings = []
known_face_ids = []
for emp_id, enc_list in known_faces.items():
    for enc in enc_list:
        known_face_encodings.append(enc)
        known_face_ids.append(emp_id)

# ====== 3) 카메라 열기 ======
cap = cv2.VideoCapture(0)  # 기본 카메라
# cap = cv2.VideoCapture(1)  # 외장캠 사용 시 주석 해제

if not cap.isOpened():
    print("[ERROR] Camera failed to open.")
    exit()

print("[INFO] Auto face recognition started. (ESC to exit)")

# ====== 4) 메인 루프 ======
while True:
    ret, frame = cap.read()
    if not ret:
        print("[ERROR] Failed to read frame.")
        break

    frame = cv2.flip(frame, 1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        # ====== 5) 얼굴 비교 ======
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.5)
        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
        best_match_index = np.argmin(face_distances)
        accuracy = (1 - face_distances[best_match_index]) * 100
        accuracy_text = f"{accuracy:.2f}%"

        # ====== 6) 인식 여부 판단 ======
        if matches[best_match_index] and accuracy >= 70:
            employee_id = known_face_ids[best_match_index]
            recognized = True
        else:
            employee_id = "Unknown"
            recognized = False

        # ====== 7) 디버깅용 박스 및 텍스트 표시 ======
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        cv2.putText(frame, f"{employee_id} ({accuracy_text})", (left, top - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

        # ====== 8) 인식 성공 시 처리 ======
        if recognized:
            print(f"[RECOGNIZED] ID: {employee_id}, ACCURACY: {accuracy_text}")
            cv2.imshow("Auto Face Recognition", frame)
            cv2.waitKey(3000)  # 3초 대기 (확인용)

            cap.release()
            cv2.destroyAllWindows()
            print(f"[COMPLETE] Recognition done for ID: {employee_id}")

            # Node.js 연동 위해 ID만 깔끔하게 출력
            print(employee_id)
            exit()

    # ====== 9) 실시간 화면 표시 ======
    cv2.imshow("Auto Face Recognition", frame)
    if cv2.waitKey(1) & 0xFF == 27:  # ESC로 종료
        print("[EXIT] Program terminated by user.")
        break

# ====== 10) 자원 해제 ======
cap.release()
cv2.destroyAllWindows()
