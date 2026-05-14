const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

let db;

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ MongoDB Connected");

    db = client.db("myDatabase");
  } catch (err) {
    console.log("❌ MongoDB Error:", err);
  }
}

module.exports = { connectDB };
