import pickle
import os

# 파일 경로
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # 현재 파일이 있는 경로
pkl_path = os.path.join(BASE_DIR, 'face_encodings.pkl')  # 같은 폴더에 있다고 가정

# 파일 읽어서 구조 확인
try:
    with open(pkl_path, 'rb') as f:
        data = pickle.load(f)

    print("✅ 파일 로드 성공!")
    print("파일 데이터 타입:", type(data))  # 딕셔너리인지 리스트인지
    if isinstance(data, dict):
        print("딕셔너리 키 목록:", data.keys())
    elif isinstance(data, list):
        print("리스트 길이:", len(data))
        print("리스트 첫번째 항목 타입:", type(data[0]))
    else:
        print("기타 데이터 타입")

except FileNotFoundError:
    print("[ERROR] 파일을 찾을 수 없습니다.")
except Exception as e:
    print(f"[ERROR] 파일 읽기 실패: {e}")
