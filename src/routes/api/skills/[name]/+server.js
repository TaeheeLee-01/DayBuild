import { connectToDatabase } from '$lib/db'; // DB 연결 유틸리티

export async function GET({ params }) {
    // URL 파라미터에서 스킬 이름 추출
    // URL 디코딩을 위해 decodeURIComponent 사용
    const name = await decodeURIComponent(params.name); // URL 디코딩
    console.log('Decoded name:', name);
    console.log('+params.js');
    
    // DB에서 스킬 검색
    const db = await connectToDatabase();
    const skill = await db.collection('skills').findOne({ name });

    if (!skill) {
        return new Response(JSON.stringify({ error: 'Skill not found in db' }), { status: 404 });
    }

    return new Response(JSON.stringify(skill), { status: 200 });
}
