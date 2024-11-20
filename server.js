const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const eventRoutes = require('./routes/eventRoutes');
const nudgeRoutes = require('./routes/nudgeRoutes')

const app = express();

// Middleware
app.use(cors());  // CORS setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uri = 'mongodb://localhost:27017';
const dbName = 'eventsDB';
let db;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1); 
  }
}

app.use((req, res, next) => {
  if (!db) {
    return res.status(500).json({ message: 'Database connection not established' });
  }
  req.db = db; 
  next();
});

// Routes
app.use('/api/v3/app', eventRoutes);
app.use('/api/v3/app', nudgeRoutes);  // Fix path here!

const PORT = 3000;
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
