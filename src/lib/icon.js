
export const trophyIcons = [
    {
        id: 'gold-trophy',
        name: 'Gold Trophy',
        category: 'achievement',
        svgPath: '/icons/gold-trophy.svg' // static 폴더에 SVG 파일 저장
    },
    {
        id: 'computer-trophy-01',
        name: 'Computer Trophy 01',
        category: 'technology',
        svgPath: '/icons/computer-trophy-01.svg'
    },
    {
        id: 'computer-trophy-02',
        name: 'Computer Trophy 02',
        category: 'technology',
        svgPath: '/icons/computer-trophy-02.svg'
    },
    {
        id: 'star-trophy',
        name: 'Star Trophy',
        category: 'achievement',
        svgPath: '/icons/star-trophy.svg'
    },
    {
        id: 'trophy-01',
        name: 'Trophy 01',
        category: 'achievement',
        svgPath: '/icons/trophy-01.svg'
    },
    {
        id: 'trophy-02',
        name: 'Trophy 02',
        category: 'achievement',
        svgPath: '/icons/trophy-02.svg'
    },
    {
        id: 'first-trophy-01',
        name: 'Fisrt Trophy 01',
        category: 'achievement',
        svgPath: '/icons/first-trophy-01.svg'
    },
];

export const emojiIcons = [
    {
        id: 'fire-emoji',
        name: 'Fire Emoji',
        category: 'motivation',
        emoji: '🔥'
    },
    {
        id: 'star-emoji',
        name: 'Star Emoji',
        category: 'achievement',
        emoji: '⭐'
    },
    {
        id: 'computer-emoji',
        name: 'Computer Emoji',
        category: 'technology',
        emoji: '💻'
    },
];


// **1. 카테고리별 필터링**
export function getIconsByCategory(category) {
    return trophyIcons.filter(icon => icon.category === category);
}

// **2. 이름 검색**
export function searchIcons(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    return trophyIcons.filter(icon =>
        icon.name.toLowerCase().includes(lowerKeyword)
    );
}

// **3. ID로 아이콘 찾기**
export function getIconById(id) {
    return trophyIcons.find(icon => icon.id === id) || null;
}

// **4. ID로 아이콘 path 넘기기*
export function getIconPathById(id) {
    return trophyIcons.find(icon => icon.id === id)?.svgPath || null;  //존재하지 않을 경우, null을 반환
}


// **5. 모든 카테고리 가져오기**
export function getAllCategories() {
    return [...new Set(trophyIcons.map(icon => icon.category))];
}
