import React, { useState } from 'react';

const DeleteWorkerModal = ({ isOpen, onClose, onSubmit }) => {
    const handleConfirm = () => {
        onSubmit(true); // 삭제 확정
        onClose(); // 모달 닫기
    };

    const handleCancel = () => {
        onSubmit(false); // 삭제 취소
        onClose(); // 모달 닫기
    };

    // 모달이 닫힌 상태면 아무것도 렌더링하지 않음
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "10px",
                    width: "400px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}
            >
                <h3>직원 삭제하기</h3>
                <p>선택한 직원을 삭제하시겠습니까?</p>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "10px",
                    }}
                >
                    <button onClick={handleCancel} style={{ padding: "5px 10px" }}>
                        취소
                    </button>
                    <button onClick={handleConfirm} style={{ padding: "5px 10px" }}>
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteWorkerModal;
