const express = require('express');
const connectDB = require('./config/db.js');

const app = express();

connectDB();

app.get('/', (req, res) => res.send('Connected to API'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
