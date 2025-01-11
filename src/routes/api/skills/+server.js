import { connectToDatabase } from '$lib/db';
import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export async function GET() {
    try {
        console.log('+server.js');
        const db = await connectToDatabase();
        const skills = await db.collection('skills').find({}).toArray(); // 모든 스킬 가져오기
        return new Response(JSON.stringify(skills), { status: 200 });
    } catch (err) {
        console.error('Error fetching skills:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

export async function POST({ request }) {
    try {
        const skillData = await request.json();

        // `time_limits` 배열 안의 시간을 ISODate로 변환
        if (Array.isArray(updatedFields.goals)) {
            updatedFields.goals = updatedFields.goals.map((goal) => {
                    if (item[time_limit] && typeof item[time_limit] === 'string') {
                        return {
                            ...goal,
                            [time_limit]: new Date(goal[time_limit]), // 문자열을 Date 객체로 변환
                        };
                    }
                    return goal; // 변환할 필요가 없는 경우 그대로 반환
                });
        }

        //생성시간과 업데이트 시간을 현재로
        updatedFields.createdAt = new Date();
        updatedFields.updatedAt = new Date();
        
        const db = await connectToDatabase();

        // 데이터 삽입
        const result = await db.collection('skills').insertOne(skillData);

        // 성공 응답 반환
        return json({ message: 'Skill added successfully', insertedId: result.insertedId }, { status: 201 });
    } catch (error) {
        console.error('Error saving skill:', error);

        // 에러 응답 반환
        return json({ error: 'Failed to save skill' }, { status: 500 });
    }
}

export async function PATCH({ request }) {
    try {
        // 클라이언트로부터 업데이트 요청 데이터 수신
        const { id, updatedFields } = await request.json();

        if (!id || !updatedFields) {
            return json({ error: 'Invalid request data' }, { status: 400 });
        }

        // `time_limits` 배열 안의 시간을 ISODate로 변환
        if (Array.isArray(updatedFields.goals)) {
            updatedFields.goals = updatedFields.goals.map((goal) => {
                    if (item[time_limit] && typeof item[time_limit] === 'string') {
                        return {
                            ...goal,
                            [time_limit]: new Date(goal[time_limit]), // 문자열을 Date 객체로 변환
                        };
                    }
                    return goal; // 변환할 필요가 없는 경우 그대로 반환
                });
        }

        //업데이트 시간을 현재로
        updatedFields.updatedAt = new Date();
        


        // MongoDB 연결
        const db = await connectToDatabase();

        // 데이터 업데이트
        const result = await db.collection('skills').updateOne(
            { _id: new ObjectId(id) }, // 업데이트 대상 문서
            { $set: updatedFields } // 업데이트할 필드
        );

        if (result.matchedCount === 0) {
            return json({ error: 'Skill not found' }, { status: 404 });
        }

        // 성공 응답
        return json({ message: 'Skill updated successfully', modifiedCount: result.modifiedCount });
    } catch (error) {
        console.error('Error updating skill:', error);

        // 에러 응답
        return json({ error: 'Failed to update skill' }, { status: 500 });
    }
}

