import cv2
import face_recognition
import pickle
import os
import sys
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
pkl_path = os.path.join(BASE_DIR, 'face_data', 'face_encodings.pkl')

try:
    with open(pkl_path, 'rb') as f:
        known_faces = pickle.load(f)
except FileNotFoundError:
    print("[ERROR] Encoding file not found")
    exit()

known_face_encodings = []
known_face_ids = []
for emp_id, enc_list in known_faces.items():
    for enc in enc_list:
        known_face_encodings.append(enc)
        known_face_ids.append(emp_id)

print("Encoding file loaded successfully")

cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("[ERROR] Camera open failed")
    exit()

print("Face recognition started (Press ESC to exit)")

recognized = False
recognized_id = None
checked = False
start_time = time.time()

last_recognition_time = 0  # 얼굴 인식 시간 추적 변수 추가

while True:
    ret, frame = cap.read()
    if not ret:
        print("[ERROR] Frame read failed")
        break

    frame = cv2.flip(frame, 1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.5)
        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
        best_match_index = face_distances.argmin()

        accuracy = (1 - face_distances[best_match_index]) * 100
        accuracy_text = f"{accuracy:.2f}%"

        if matches[best_match_index] and accuracy >= 70:
            emp_id = known_face_ids[best_match_index]
            color = (0, 255, 0)
            recognized = True
            recognized_id = emp_id
            text = f"{emp_id} ({accuracy_text})"
            last_recognition_time = time.time()  # 얼굴 인식 시간 업데이트
        else:
            color = (0, 0, 255)
            text = f"Unknown ({accuracy_text})"

        cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
        cv2.putText(frame, text, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

    cv2.imshow('Face Recognition', frame)

    if recognized and time.time() - last_recognition_time >= 3:  # 얼굴을 인식한 후 3초 경과하면 종료
        print(f"Recognized: {recognized_id}")
        break

    if cv2.waitKey(1) & 0xFF == 27:
        print("Unknown")
        break

    if time.time() - start_time >= 20:
        print("시간이 경과하여 프로그램이 자동 종료되었습니다.")
        break

cap.release()
cv2.destroyAllWindows()
