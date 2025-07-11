// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

// MONGODB CONNECTION
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// CONNECT
async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
}
run().catch(console.dir);

// ROUTES

// GET analytics
app.get("/api/analytics", async (req, res) => {
  try {
    const data = await client.db("empire").collection("analytics").findOne({});
    res.json(data);
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// GET offers
app.get("/api/offers", async (req, res) => {
  try {
    const data = await client.db("empire").collection("offers").find({}).toArray();
    res.json(data);
  } catch (err) {
    console.error("Error fetching offers:", err);
    res.status(500).json({ error: "Failed to fetch offers" });
  }
});

// POST offer
app.post("/api/offers", async (req, res) => {
  try {
    const { title, payout, accepted_countries, category } = req.body;
    if (!title || !payout || !accepted_countries || !category) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const result = await client.db("empire").collection("offers").insertOne({
      title,
      payout: parseFloat(payout),
      accepted_countries,
      category,
    });
    res.json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    console.error("Error adding offer:", err);
    res.status(500).json({ error: "Failed to add offer" });
  }
});

// Health check
app.get("/healthz", (req, res) => {
  res.send("OK");
});

// Fallback
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// LISTEN
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Empire backend running on port ${PORT}`);
});
