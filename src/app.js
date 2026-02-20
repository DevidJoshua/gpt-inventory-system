const express = require('express');
const cors = require('cors');
const path = require('path');
const itemsRouter = require('./routes/items');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1/items', itemsRouter);

module.exports = app;
