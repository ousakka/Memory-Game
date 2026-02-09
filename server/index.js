import express from "express";
import knex from "knex";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to the database
const dbFilePath = path.join(__dirname, "cards.sqlite3.s"); 
const db = knex({
  client: "sqlite3",
  connection: {
    filename: dbFilePath,
  },
  useNullAsDefault: true,
});

// Test the server
app.get("/", (req, res) => {
  res.send("Server is working!");
});


app.get("/cards", async (req, res) => {
  try {
    const cards = await db("cards").select("*"); 
    res.json(cards);
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ error: "Database error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});