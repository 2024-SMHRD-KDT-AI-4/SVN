const tempData = {
    employees: [
        { emp_id: "241210001", emp_name: "김예은", emp_role: "팀장", emp_group: "백엔드"},
        { emp_id: "241210002", emp_name: "안지운", emp_role: "부팀장", emp_group: "프론트엔드" },
        { emp_id: "241210003", emp_name: "김현웅", emp_role: "사원", emp_group: "프론트엔드" },
        { emp_id: "241210004", emp_name: "전석현", emp_role: "사원", emp_group: "백엔드" },
        { emp_id: "241210005", emp_name: "김민정", emp_role: "사원", emp_group: "백엔드" },

    ],

    groups: [
        { group_id: "B1001", group_name: "팬더팀", group_head: "김예은", group_desc: "백엔드", group_pos: "4라인", group_count: 2 },
        { group_id: "F1001", group_name: "너구리팀", group_head: "안지운", group_desc: "프론트엔드", group_pos: "4라인", group_count: 2 },
        { group_id: "P1001", group_name: "꾀꼬리팀", group_head: "김민정", group_desc: "기획", group_pos: "5라인", group_count: 2 }
    ],

    workSchedules: [
        { work_id: "DE01", work_name: "오픈", work_salary_type: "월급", work_days: "월,화,수,목,금,토,일", work_default_rule: "주 40시간", work_max_rule: "주 52시간", work_type: "정규직", work_desc: "매장관리자" },
        { work_id: "OE01", work_name: "미들", work_salary_type: "월급", work_days: "월,화,수,목,금,토,일", work_default_rule: "주 40시간", work_max_rule: "주 52시간", work_type: "정규직", work_desc: "오픈직원" },
        { work_id: "ME01", work_name: "마감", work_salary_type: "시급", work_days: "월,화,수,목,금,토,일", work_default_rule: "주 24시간", work_max_rule: "주 30시간", work_type: "계약직", work_desc: "청소/재고관리" }
      ]
};

export default tempData;
