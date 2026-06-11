require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Search = require('./models/Search');
const Reminder = require('./models/Reminder');
const askRoute = require('./routes/ask');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'healthmate_secret_key_123';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/healthmate')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, display_name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, display_name });
    await user.save();
    
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, email: user.email, display_name: user.display_name } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, display_name: user.display_name } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- PROFILE ROUTES ---
app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { age, weight_kg, conditions, display_name } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { age, weight_kg, conditions, display_name }, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- SEARCH ROUTES ---
app.get('/api/searches', authenticateToken, async (req, res) => {
  try {
    const searches = await Search.find({ user_id: req.user.id }).sort({ createdAt: -1 }).limit(10);
    res.json(searches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/searches', authenticateToken, async (req, res) => {
  try {
    const { query, feature, result } = req.body;
    const search = new Search({ user_id: req.user.id, query, feature, result });
    await search.save();
    res.status(201).json(search);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- REMINDER ROUTES ---
app.get('/api/reminders', authenticateToken, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user_id: req.user.id }).sort({ remind_at: 1 });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/reminders', authenticateToken, async (req, res) => {
  try {
    const { title, remind_at } = req.body;
    const reminder = new Reminder({ user_id: req.user.id, title, remind_at });
    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/reminders/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    
    reminder.done = !reminder.done;
    await reminder.save();
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use('/api/ask', authenticateToken, askRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
