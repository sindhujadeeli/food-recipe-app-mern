const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipe');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const fileUpload = require('express-fileupload');
app.use(fileUpload());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log(error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipe', recipeRoutes);

module.exports = app;
