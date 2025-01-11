const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 3000;

// 노션 API 설정
const NOTION_API_KEY = "ntn_u20493431948G2EYtLZYohSiFioU7YgZCxiSiTm7RI7cnP"; // 발급받은 통합 토큰
const DATABASE_ID = "your_database_id"; // 노션 데이터베이스 ID
const NOTION_API_URL = `https://api.notion.com/v1/databases/${DATABASE_ID}/query`;

const headers = {
  Authorization: `Bearer ${NOTION_API_KEY}`,
  "Content-Type": "application/json",
  "Notion-Version": "2022-06-28",
};

// 노션 데이터베이스에서 데이터 가져오기
app.get("/api/notion-data", async (req, res) => {
  try {
    const response = await axios.post(NOTION_API_URL, {}, { headers });
    const results = response.data.results;

    // 필요한 형태로 데이터 파싱
    const data = results.map((item) => ({
      상태: item.properties["상태"]?.select?.name || "",
      이름: item.properties["이름"]?.url || "",
      마감일: item.properties["마감일"]?.formula?.string || "",
      비율: item.properties["비율"]?.number ? `${item.properties["비율"].number}%` : "",
      진행상황: item.properties["진행상황"]?.number || 0,
    }));

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching data from Notion",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});