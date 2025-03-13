import React from 'react';
import axios from 'axios';

const AttAlert = () => {
  
  // 버튼 클릭 시 실행되는 함수
  const handleFaceCheck = async () => {
    try {
      const res = await axios.post('/alert/face-check');  // 서버의 alertRouter와 연결

      // 성공 여부 체크
      if (res.data.success) {
        const empId = res.data.wo_id;

        // ✅ 현재 시간 구하기 (프론트에서 실시간 시간 생성)
        const now = new Date();
        const formattedTime = now.toLocaleString();  // "YYYY-MM-DD 오전/오후 HH:MM:SS"

        // ✅ 인식 성공 alert
        alert(`${empId}님 얼굴 인식 시간은 ${formattedTime} 입니다.`);
        
        // 추후 DB 저장을 위한 자리 (미완성)
        // await axios.post('/attendance/record', { empId, time: formattedTime });

      } else {
        // ❌ 미등록 사용자 등 실패 시
        alert(`인식 실패: ${res.data.message}`);
      }

    } catch (error) {
      // ⚙️ 서버 오류
      alert(`서버 오류: ${error.response?.data?.message || '알 수 없는 오류'}`);
    }
  };

  return (
    <div>
      <h3>출근 얼굴 인식</h3>
      <button onClick={handleFaceCheck}>얼굴 인식</button>
    </div>
  );
};

export default AttAlert;
