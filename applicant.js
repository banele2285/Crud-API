const express = require('express');
const db = require('../db/database');

const router = express.Router();

// Create a new applicant
router.post('/', (req, res) => {
  const { name, email } = req.body;
  const query = `INSERT INTO applicants (name, email) VALUES (?, ?)`;

  db.run(query, [name, email], function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.status(201).json({ id: this.lastID, name, email, status: 'Pending' });
  });
});

// Fetch the record of an applicant by id/email
router.get('/:identifier', (req, res) => {
  const { identifier } = req.params;
  const query = `SELECT * FROM applicants WHERE id = ? OR email = ?`;

  db.get(query, [identifier, identifier], (err, row) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Applicant not found' });
    }
    res.json(row);
  });
});

// Update the status of application (Reject/Hired)
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const query = `UPDATE applicants SET status = ? WHERE id = ?`;

  db.run(query, [status, id], function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Applicant not found' });
    }
    res.json({ message: 'Status updated' });
  });
});

// Delete an applicant or applicant profile
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM applicants WHERE id = ?`;

  db.run(query, id, function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Applicant not found' });
    }
    res.json({ message: 'Applicant deleted' });
  });
});

module.exports = router;
