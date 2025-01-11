export function calculateDDay(targetDateString) {
    //string 타입의 시간을 가져와 현재 날짜와의 D-Day를 계산하여 string으로 반환합니다.
    
    const currentDate = new Date();
    const targetDate = new Date(targetDateString);
    currentDate.setHours(0, 0, 0, 0); // 시간 초기화 (자정 기준)
    targetDate.setHours(0, 0, 0, 0);

    // 두 날짜의 차이를 밀리초 단위로 계산
    const timeDifference = targetDate - currentDate;

    // 밀리초를 일 단위로 변환
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    // D-Day 포맷으로 반환
    if (daysDifference > 0) {
        return `D-${daysDifference}`;
    } else if (daysDifference === 0) {
        return 'D-Day';
    } else {
        return `D+${Math.abs(daysDifference)}`;
    }
}

export function calculateDayDiff(targetDateString) {
    //string 타입의 시간을 가져와 현재 날짜와의 Day 차이를 계산하여 number로 반환합니다.
    
    const currentDate = new Date();
    const targetDate = new Date(targetDateString);
    currentDate.setHours(0, 0, 0, 0); // 시간 초기화 (자정 기준)
    targetDate.setHours(0, 0, 0, 0);

    // 두 날짜의 차이를 밀리초 단위로 계산
    const timeDifference = currentDate - targetDate;

    // 밀리초를 일 단위로 변환
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return daysDifference;
}

export function calculateHourDiffbyendHour(targetDateString, endHour) {
    //string 타입의 시간을 가져와 현재 날짜의 endHour와의 Hour 차이를 계산하여 number로 반환합니다.
    
    const currentDate = new Date();
    const targetDate = new Date(targetDateString);
    currentDate.setHours(endHour, 0, 0, 0); // 시간 초기화 (endHour 기준)
    targetDate.setHours(0, 0, 0, 0);

    // 두 날짜의 차이를 밀리초 단위로 계산
    const timeDifference = currentDate - targetDate;

    // 밀리초를 시간 단위로 변환
    const hoursDifference = Math.ceil(timeDifference / (1000 * 60 * 60));

    return hoursDifference;
}

