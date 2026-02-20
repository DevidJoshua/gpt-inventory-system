const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const { rows } = await db.query('SELECT id, sku, name, description, quantity, unit_price, created_at, updated_at FROM items ORDER BY id DESC');
    return res.json({ data: rows });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch items', detail: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, sku, name, description, quantity, unit_price, created_at, updated_at FROM items WHERE id = $1',
      [req.params.id]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: 'Item not found' });
    }

    return res.json({ data: rows[0] });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch item', detail: error.message });
  }
});

router.post('/', async (req, res) => {
  const { sku, name, description = '', quantity = 0, unit_price = 0 } = req.body;

  if (!sku || !name) {
    return res.status(400).json({ error: 'sku and name are required' });
  }

  try {
    const { rows } = await db.query(
      `INSERT INTO items (sku, name, description, quantity, unit_price)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, sku, name, description, quantity, unit_price, created_at, updated_at`,
      [sku, name, description, quantity, unit_price]
    );

    return res.status(201).json({ data: rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'sku already exists' });
    }
    return res.status(500).json({ error: 'Failed to create item', detail: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { sku, name, description, quantity, unit_price } = req.body;

  try {
    const { rows } = await db.query(
      `UPDATE items
       SET sku = COALESCE($1, sku),
           name = COALESCE($2, name),
           description = COALESCE($3, description),
           quantity = COALESCE($4, quantity),
           unit_price = COALESCE($5, unit_price),
           updated_at = NOW()
       WHERE id = $6
       RETURNING id, sku, name, description, quantity, unit_price, created_at, updated_at`,
      [sku, name, description, quantity, unit_price, req.params.id]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: 'Item not found' });
    }

    return res.json({ data: rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'sku already exists' });
    }
    return res.status(500).json({ error: 'Failed to update item', detail: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM items WHERE id = $1', [req.params.id]);

    if (!rowCount) {
      return res.status(404).json({ error: 'Item not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete item', detail: error.message });
  }
});

module.exports = router;
