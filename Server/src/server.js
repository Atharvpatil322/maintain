// server/src/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('DB connected'))
  .catch(err => console.error('DB connection error:', err));



const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);


// Image routes
const imageRoutes = require('./routes/image');
app.use('/api/images', imageRoutes);

const textRoutes = require('./routes/text');
// Text endpoints
app.use('/api/texts', textRoutes);


const colorRoutes = require('./routes/color'); // import the color routes
// Color endpoints
app.use('/api/colors', colorRoutes);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
