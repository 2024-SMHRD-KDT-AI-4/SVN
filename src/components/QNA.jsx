import React, { useState } from 'react';

// 더미 Q&A 데이터
const qnaData = [
  { question: "스케줄 자동화 시스템이란 무엇인가요?", answer:"스케줄 자동화 시스템은 미리 설정한 주기나 시간에 따라 특정 작업을 자동으로 실행하는 시스템입니다. 예를 들어, 매일 정해진 시간에 질문을 시스템에 자동으로 추가하거나, 주기적으로 Q&A 시스템을 점검하고, 리포트를 자동으로 생성하는 등의 작업을 할 수 있습니다." },
  { question: "시스템에서 자동화가 필요한 이유는 무엇인가요?", answer: "시간 절약: 관리자가 매번 수동으로 작업할 필요 없이 시스템이 자동으로 반복 작업을 처리할 수 있습니다."},
  {question: "시스템에서 자동화가 필요한 이유는 무엇인가요?", answer : "정기적 관리: 예를 들어, 매일/매주/매월 정기적으로 Q&A 업데이트, 백업, 리포트 생성을 할 수 있습니다."},
{ question: "시스템에서 자동화가 필요한 이유는 무엇인가요?", answer :  "알림 및 업데이트: 사용자에게 새로운 답변이나 중요 공지사항을 자동으로 알릴 수 있습니다." },
{ question: "시스템에서 자동화 외에 추가로 고려해야 할 점은 무엇인가요?", answer:"보안: 자동화된 시스템이 잘못된 데이터를 처리하거나 악용되지 않도록 보안에 신경을 써야 합니다."}
];

return (
  <div>
    <h1>Q&A 검색</h1>
    
    {/* 검색 입력 필드 */}
    <input
      type="text"
      placeholder="검색어를 입력하세요..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}  // 검색어 상태 업데이트
    />
    
    {/* 검색 결과 */}
    <ul>
      {filteredQna.length > 0 ? (
        filteredQna.map((item, index) => (
          <li key={index}>
            <strong>질문:</strong> {item.question}<br />
            <strong>답변:</strong> {item.answer}
          </li>
        ))
      ) : (
        <li>검색 결과가 없습니다.</li>
      )}
    </ul>

    {/* 검색어 상태 표시 */}
    <div>
      <h2>현재 검색어: <strong>{searchTerm}</strong></h2>
    </div>
  </div>
);


export default QnaSearch;

  