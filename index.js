const express = require("express");
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
console.log("Connected to MongoDB!");

// MongoDB URI and client initialization
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.Password}@cluster0.llmshgh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect to MongoDB once and reuse the connection
async function run() {
  try {
    await client.connect();

    const database = client.db('TourismDB');
    const spotsCollection = database.collection('TouristSpots');
    app.get('/allSpot', async (req, res) => {
      try {
        const cursor = spotsCollection.find();
        console.log(cursor);
        const result = await cursor.toArray(); // .toArray() should return an array
        console.log(result); // Log the result to check if it's an array
        res.send(result);
      } catch (error) {
        console.error("Error fetching spots:", error);
        res.status(500).send({ error: "Failed to fetch spots" });
      }
    });
    // Add a new tourist spot
    app.post('/add_tourist_spot', async (req, res) => {
      const newTouristSpot = req.body;
      console.log("New Tourist Spot:", newTouristSpot);

      try {
        const result = await spotsCollection.insertOne(newTouristSpot);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error adding tourist spot:", error);
        res.status(500).send({ error: "Failed to add tourist spot" });
      }
    });

    app.get('/', (req, res) => {
      res.send('Tourism is going on');
    });

    app.listen(port, () => {
      console.log(`Tourism server is running on port ${port}`);
    });

  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

run().catch(console.dir);
