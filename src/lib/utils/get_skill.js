let skills = [
    {
        name : '피아노',
        grade : [4, 2],
        level : 3,
        description : '피아노 스킬입니다.',
        values : [
            '열심히 하기',
            '최선을 다하기',
            '흥미 있는 것을 하기',
            '도전해서 확률 높이기',
        ],
        goals : [
            {
                name : '모든 장, 단조 스케일 miss 없이 1회',
                time_limit : '2024-11-20',
                field : '하농연습'
            },
            {
                name : '모든 장, 단조 스케일 miss 없이 1회',
                time_limit : '2024-11-20',
                field : '하농연습'
            }
        ],
        breakthrough : [
            {
                name : '피아노 학원 등록하기',
                grade : [1, 1],
            }
        ]
        
    },
    {
        name : '인간관계',
        star_grade : [4, 2],
        level : 2,
        skill_class : 'fundamental',
        description : '인간관계 스킬입니다.',
        values : [
            '열심히 하기',
            '최선을 다하기',
            '흥미 있는 것을 하기',
            '도전해서 확률 높이기',
        ],
        goals : [
            {
                name : '친구만들기',
                time_limit : '2024-11-20',
                field : '하농연습'
            },

        ],
        breakthrough : [
            {
                name : '여행 다녀오기',
                grade : [1, 1],
            }
        ],
        training_list : [
            1, 2, 3
        ],
        trophies : [
            1, 2, 3
        ]
        
    },
    { name: '전공', parent: '나', level: 1, details: '커리어 관련 스킬 트리입니다.',
        proficiency : 3,
        deactivation_period : 0,
        precondition : {str : 0, int : 7, con : 4, per : 6},
        training_list : [
            '혁펜하임 강의 공부',
            '전공 필기 복습'],
        progress: [10, 20, 30, 40, 40, 40], // 최근 발전 정도
        achievements: ['2학년 전공공부 복습', 'AI 구현', '혁펜하임 TTT 완강'],
    },

]


export function get_skill(skill_name) {
    //스킬 이름을 받아 스킬 객체를 찾아줍니다. 없을 경우 null을 반환합니다.
    console.log(skill_name);
    const result = skills.find(skill => skill.name === skill_name);

    if (result) {
        console.log('찾은 객체:', result);
        return result;
    } else {
        console.log('조건에 맞는 객체가 없습니다.');
        return null;
    }
} 