const express = require('express');
const multer = require('multer');
const { ObjectId } = require('mongodb');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.get('/events', async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    const event = await req.db.collection('events').findOne({ _id: new ObjectId(id) });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/events/list', async (req, res) => {
  try {
    const { type, limit = 5, page = 1 } = req.query;

    const query = type ? { type } : {};
    const options = {
      skip: (page - 1) * parseInt(limit),
      limit: parseInt(limit),
    };

    const events = await req.db.collection('events').find(query, options).toArray();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/events', upload.single('files'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'File upload is required' });
    }

    const event = {
      ...req.body,
      files: file.path,
      attendees: [],
      createdAt: new Date(),
    };

    const result = await req.db.collection('events').insertOne(event);
    res.status(201).json({ message: 'Event created successfully', eventId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/events/:id', upload.single('files'), async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    const updateData = {
      ...req.body,
      ...(file && { files: file.path }),
    };

    const result = await req.db.collection('events').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.delete('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await req.db.collection('events').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
