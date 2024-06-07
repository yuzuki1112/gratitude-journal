const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// データベース設定
let db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db.run("CREATE TABLE notes (id INTEGER PRIMARY KEY, content TEXT)");
});

// ノートを保存するAPI
app.post('/api/notes', (req, res) => {
    const content = req.body.content;
    db.run("INSERT INTO notes (content) VALUES (?)", [content], function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(201).json({ id: this.lastID });
    });
});

// ノートを取得するAPI
app.get('/api/notes', (req, res) => {
    db.all("SELECT * FROM notes", [], (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json(rows);
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
