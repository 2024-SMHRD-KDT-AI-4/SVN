import sys
import io
import os
import cv2
import face_recognition
import pickle
import numpy as np

sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8')

image_path = sys.argv[1]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
pkl_path = os.path.join(BASE_DIR, 'face_encodings.pkl')

with open(pkl_path, 'rb') as f:
    known_faces = pickle.load(f)

known_face_encodings = []
known_face_ids = []
for emp_id, enc_list in known_faces.items():
    for enc in enc_list:
        known_face_encodings.append(enc)
        known_face_ids.append(emp_id)

image = cv2.imread(image_path)
rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

face_locations = face_recognition.face_locations(rgb_image)
face_encodings = face_recognition.face_encodings(rgb_image, face_locations)

recognized_id = "Unknown"
accuracy_text = "0.00%"

for face_encoding in face_encodings:
    matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.5)
    face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
    best_match_index = np.argmin(face_distances)
    accuracy = (1 - face_distances[best_match_index]) * 100
    accuracy_text = f"{accuracy:.2f}%"
    if matches[best_match_index] and accuracy >= 70:
        recognized_id = known_face_ids[best_match_index]
        break

print(recognized_id)
print(accuracy_text)
