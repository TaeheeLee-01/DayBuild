import { connectToDatabase } from '$lib/db.js'; // DB 연결 함수 가져오기
import { json } from '@sveltejs/kit';

export async function load({ params }) {
    // 유저 ID를 기반으로 데이터를 검색합니다.
    const userId = 'user123'; // 검색하려는 유저 ID (테스트용)
    try {
        // MongoDB 연결
        const db = await connectToDatabase();

        // 해당 유저의 데이터를 검색
        const userData = await db.collection('day').findOne({ user: userId });

        if (!userData) {
            // 유저 데이터가 없을 경우 처리
            return ({ error: 'User not found' }, { status: 404 });
        }

        const skills = await db.collection('skills')
            .find({ deactivation_left: { $gt: -1 } }) // 조건: deactivation_left > -1
            .sort({ deactivation_left: 1 })          // 오름차순 정렬
            .limit(2)                                // 상위 2개 제한
            .toArray();
        
        const serializedSkills = skills.map(skill => ({
            ...skill,
            _id: skill._id.toString()
        }));
        // 데이터를 클라이언트로 반환
        console.log(userData);

        const serializedData = {
            ...userData,
            _id: userData._id.toString(), // MongoDB ObjectId를 문자열로 변환
            extra_mission_skills: serializedSkills,
            // skill_id: userData.skill_id.toString()
        };
        return serializedData;
    } catch (error) {
        console.error('Error fetching user data:', error);
        // 에러 발생 시 처리
        return ({ error: 'Failed to fetch user data' }, { status: 500 });
    }
}


// 가장 가까운 deactive list
// 가장 가까운 goals
// 현재 진행중인 breakthough와 그에 대한 쪼개기 내용 -> today라는 컬렉션을 만든 다음에 그 안에 이거랑, 이거 어디 skill 소속인지 등
// Today 전용 퀘스트들