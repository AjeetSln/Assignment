const express = require('express');
const multer = require('multer');
const { ObjectId } = require('mongodb');
const Nudge = require('../models/Nudge');

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  const upload = multer({ storage });
  
  // POST: Create a new Nudge
  router.post('/nudge', upload.single('image'), async (req, res) => {
    try {
      const data = req.body;
      const file = req.file;
  
      // Validate Nudge data
      const errors = Nudge.validate(data);
      if (errors) {
        return res.status(400).json({ message: 'Validation failed', errors });
      }
  
      // Create Nudge instance
      const nudge = new Nudge({
        ...data,
        image: file ? file.path : null,
      });
  
      // Insert into database
      const result = await req.db.collection('nudges').insertOne(nudge);
      res.status(201).json({ message: 'Nudge created successfully', nudgeId: result.insertedId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  

// GET: Fetch all Nudges
router.get('/nudges', async (req, res) => {
  try {
    const nudges = await req.db.collection('nudges').find().toArray();
    res.status(200).json(nudges.map(Nudge.fromDB));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET: Fetch a single Nudge by ID
router.get('/nudge/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const nudge = await req.db.collection('nudges').findOne({ _id: new ObjectId(id) });
    if (!nudge) {
      return res.status(404).json({ message: 'Nudge not found' });
    }

    res.status(200).json(Nudge.fromDB(nudge));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// PUT: Update a Nudge by ID
router.put('/nudge/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const file = req.file;

    // Validate Nudge data
    const errors = Nudge.validate(data);
    if (errors) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    // Prepare updated data
    const updatedData = {
      ...data,
      ...(file && { image: file.path }),
    };

    const result = await req.db.collection('nudges').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Nudge not found' });
    }

    res.status(200).json({ message: 'Nudge updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// DELETE: Delete a Nudge by ID
router.delete('/nudge/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await req.db.collection('nudges').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Nudge not found' });
    }

    res.status(200).json({ message: 'Nudge deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
