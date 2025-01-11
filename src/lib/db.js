import { MongoClient } from 'mongodb';
import 'dotenv/config'; // dotenv를 로드

const uri = process.env.MONGODB_URI; // 환경변수에서 URI 가져오기
const client = new MongoClient(uri);
let db;

export async function connectToDatabase() {
    if (!db) {
        await client.connect();
        db = client.db('skilltree'); // 데이터베이스 이름
        console.log('Connected to MongoDB');
    }
    return db;
}

