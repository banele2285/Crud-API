const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./applicantDB.sqlite');

db.serialize(() => {
  db.run(`
    Table For Applicants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      status TEXT CHECK( status IN ('Pending','Hired','Rejected') ) DEFAULT 'Pending'
    )
  `);
});

module.exports = db;
