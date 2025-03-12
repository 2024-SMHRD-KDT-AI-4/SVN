import os
import face_recognition
import pickle
from PIL import Image
import numpy as np
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'face_data')

known_faces = {}

for file_name in os.listdir(DATA_DIR):
    if file_name.endswith(('.jpg', '.png')):
        match = re.match(r'(E_\d{3}|L_\d{3})', file_name)
        if match:
            employee_id = match.group(1)
        else:
            print(f"[경고] 파일명에서 ID 추출 실패: {file_name}")
            continue

        file_path = os.path.join(DATA_DIR, file_name)
        image = Image.open(file_path).convert('RGB')
        image_np = np.array(image)

        encodings = face_recognition.face_encodings(image_np)
        
        if encodings:
            if employee_id not in known_faces:
                known_faces[employee_id] = []
            known_faces[employee_id].append(encodings[0])
            print(f"[로딩 완료] {employee_id}: {file_name}")
        else:
            print(f"[경고] 얼굴 인식 실패: {file_name}")

# ✅ 인코딩 데이터 저장 (pickle)
with open('face_encodings.pkl', 'wb') as f:
    pickle.dump(known_faces, f)

print("[인코딩 저장 완료] face_encodings.pkl")
