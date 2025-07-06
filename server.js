// server.js
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

// MONGODB CONNECTION
const uri = "mongodb+srv://Lanre1507:<Lanre1969>@cluster0.z77corz.mongodb.net/empire?retryWrites=true&w=majority&appName=Cluster0";

// IMPORTANT: if your password contains special characters like @, replace with %40
// For example: Lanre%4069

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

// GET analytics from Mongo
app.get("/api/analytics", async (req, res) => {
  try {
    const data = await client
      .db("empire")
      .collection("analytics")
      .findOne({});
    res.json(data);
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// GET offers from Mongo
app.get("/api/offers", async (req, res) => {
  try {
    const data = await client
      .db("empire")
      .collection("offers")
      .find({})
      .toArray();
    res.json(data);
  } catch (err) {
    console.error("Error fetching offers:", err);
    res.status(500).json({ error: "Failed to fetch offers" });
  }
});

// health check
app.get("/healthz", (req, res) => {
  res.send("OK");
});

// fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// LISTEN
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Empire backend running on port ${PORT}`);
});
