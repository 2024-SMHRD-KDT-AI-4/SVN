import cv2
import face_recognition
import pickle
import numpy as np
import os
import time  # ✅ 추가

with open('face_encodings.pkl', 'rb') as f:
    known_faces = pickle.load(f)

known_face_encodings = []
known_face_ids = []
for emp_id, enc_list in known_faces.items():
    for enc in enc_list:
        known_face_encodings.append(enc)
        known_face_ids.append(emp_id)

cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
if not cap.isOpened():
    print("[❌오류] 카메라 열기 실패")
    exit()

print("[안내] 자동 얼굴 인식 시작 (ESC로 종료)")

recognized_employee_id = None  # 추가!

while True:
    ret, frame = cap.read()
    frame = cv2.flip(frame, 1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.5)
        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
        best_match_index = np.argmin(face_distances)
        accuracy = (1 - face_distances[best_match_index]) * 100

        if matches[best_match_index] and accuracy >= 80:  # ✅ 80% 이상일 때만
            employee_id = known_face_ids[best_match_index]
            accuracy_text = f"{accuracy:.2f}%"
            recognized = True
        else:
            employee_id = "Unknown"
            accuracy_text = f"{accuracy:.2f}%"
            recognized = False

        # 얼굴 박스 및 정확도 표시
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        cv2.putText(frame, f"{employee_id} ({accuracy_text})", (left, top - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

        if recognized:
            print(f"[인식 완료] {employee_id}, 정확도: {accuracy_text}")
            cv2.imshow("Auto Face Recognition", frame)
            cv2.waitKey(3000)  # ✅ 3초 대기
            cap.release()
            cv2.destroyAllWindows()
            print(f"{employee_id} 직원의 인식이 완료되었습니다.")
            exit()

    cv2.imshow("Auto Face Recognition", frame)
    if cv2.waitKey(1) & 0xFF == 27:  # ESC 키로 종료
        print("[종료] 프로그램 종료")
        break

cap.release()
cv2.destroyAllWindows()
