const tempDataStore = {
    employees: [
        {
            emp_id: "241210001",
            emp_name: "김예은",
            emp_role: "팀장",
            emp_firstDate: "2024.12.10",
            emp_group: "백엔드",
            emp_birthDate: "2001.05.07",
            emp_phone: "010-0000-0000",
            emp_email: "temp@gmail.com",
            created_at: "2024.12.10"
        },
        {
            emp_id: "241210002",
            emp_name: "안지운",
            emp_role: "부팀장",
            emp_firstDate: "2024.12.10",
            emp_group: "프론트엔드",
            emp_birthDate: "1999.11.23",
            emp_phone: "010-0000-0000",
            emp_email: "temp@gmail.com",
            created_at: "2024.12.10"
        },
        {
            emp_id: "241210003",
            emp_name: "김현웅",
            emp_role: "사원",
            emp_firstDate: "2024.12.10",
            emp_group: "프론트엔드",
            emp_birthDate: "1999.01.20",
            emp_phone: "010-0000-0000",
            emp_email: "temp@gmail.com",
            created_at: "2024.12.10"
        },
        {
            emp_id: "241210004",
            emp_name: "전석현",
            emp_role: "사원",
            emp_firstDate: "2024.12.10",
            emp_group: "백엔드",
            emp_birthDate: "1997.12.26",
            emp_phone: "010-0000-0000",
            emp_email: "temp@gmail.com",
            created_at: "2024.12.10"
        },
        {
            emp_id: "241210005",
            emp_name: "김민정",
            emp_role: "사원",
            emp_firstDate: "2024.12.10",
            emp_group: "백엔드",
            emp_birthDate: "1993.04.21",
            emp_phone: "010-0000-0000",
            emp_email: "temp@gmail.com",
            created_at: "2024.12.10"
        },
        {
            emp_id: "241210006",
            emp_name: "강인오",
            emp_role: "사원",
            emp_firstDate: "2024.12.10",
            emp_group: "프론트엔드",
            emp_birthDate: "1991.02.25",
            emp_phone: "010-0000-0000",
            emp_email: "temp@gmail.com",
            created_at: "2024.12.10"
        }
    ],


    groups: [
        {
            group_id: "B1001",
            group_name: "팬더팀",
            group_head: "김예은",
            group_desc: "백엔드",
            group_pos: "4라인",
            group_count: 2,
        },
        {
            group_id: "F1001",
            group_name: "너구리팀",
            group_head: "안지운",
            group_desc: "프론트엔드",
            group_pos: "4라인",
            group_count: 2,
        },
        {
            group_id: "P1001",
            group_name: "꾀꼬리팀",
            group_head: "김민정",
            group_desc: "기획",
            group_pos: "5라인",
            group_count: 2,
        },
    ],
    works : [
        {
            work_id: "DE01",
            work_name: "오픈",
            work_start: "09:00",
            work_end: "18:00",
            work_break: "60",
            work_days: "월,화,수,목,금",
            work_default_rule: "주 40시간",
            work_max_rule: "주 52시간",
            work_type: "정규직",
            work_desc: "매장관리자",
            created_at: "2025.03.11"
        },
        {
            work_id: "OE01",
            work_name: "오픈",
            work_start: "09:00",
            work_end: "18:00",
            work_break: "60",
            work_days: "월,화,수,목,금",
            work_default_rule: "주 40시간",
            work_max_rule: "주 52시간",
            work_type: "정규직",
            work_desc: "오픈직원",
            created_at: "2025.03.11"
        },
        {
            work_id: "ME01",
            work_name: "미들",
            work_start: "09:00",
            work_end: "18:00",
            work_break: "60",
            work_days: "월,수,금",
            work_default_rule: "주 24시간",
            work_max_rule: "주 30시간",
            work_type: "파트타임",
            work_desc: "청소/재고관리",
            created_at: "2025.03.11"
        },
        {
            work_id: "CE01",
            work_name: "마감",
            work_start: "09:00",
            work_end: "14:00",
            work_break: "60",
            work_days: "목,금",
            work_default_rule: "주 8시간",
            work_max_rule: "주 8시간",
            work_type: "파트타임",
            work_desc: "교육중",
            created_at: "2025.03.11"
        }
    ],
    vacations: [
        {
            req_idx: "1",
            req_type: "휴가",
            req_content: "1111",
            emp_id: "241210001",
            start_date: "2025.03.11",
            end_date: "2025.03.12",
            created_at: "2025.03.11",
            req_status: "N",
            approved_at: "",
            admin_id: ""
        },
        {
            req_idx: "2",
            req_type: "휴가",
            req_content: "집에가고싶어요",
            emp_id: "241210001",
            start_date: "2025.03.11",
            end_date: "2025.03.12",
            created_at: "2025.03.11",
            req_status: "N",
            approved_at: "",
            admin_id: ""
        },
        {
            req_idx: "3",
            req_type: "휴가",
            req_content: "테스트",
            emp_id: "241210001",
            start_date: "2025.03.12",
            end_date: "2025.03.13",
            created_at: "2025.03.11",
            req_status: "N",
            approved_at: "",
            admin_id: ""
        },
    ]
};

export default tempDataStore;
