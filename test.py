import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
pkl_path = os.path.join(BASE_DIR, 'face_data', 'face_encodings.pkl')

print("BASE_DIR:", BASE_DIR)
print("PKL_PATH:", pkl_path)
