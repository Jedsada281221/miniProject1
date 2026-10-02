const express = require('express');
const cors = require('cors');
const path = require('path');
let { books, getNextId } = require('./data');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// 1. GET /api/books - ดึงรายการทั้งหมด + กรองด้วย query string
app.get('/api/books', (req, res) => {
  const { category, status } = req.query;
  let filteredBooks = [...books];

  if (category) {
    filteredBooks = filteredBooks.filter(
      b => b.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (status) {
    filteredBooks = filteredBooks.filter(
      b => b.status.toLowerCase() === status.toLowerCase()
    );
  }

  res.status(200).json(filteredBooks);
});

// 2. GET /api/books/:id - ดึงรายการเดียว
app.get('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const book = books.find(b => b.id === id);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.status(200).json(book);
});

// 3. POST /api/books - เพิ่มรายการใหม่
app.post('/api/books', (req, res) => {
  const { title, author, category, status } = req.body;

  if (!title || !author || !category) {
    return res.status(400).json({ 
      message: "Missing required fields: title, author, and category are required" 
    });
  }

  const newBook = {
    id: getNextId(),
    title,
    author,
    category,
    status: status || "unread"
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

// 4. PATCH /api/books/:id - แก้ไขรายการ
app.patch('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const bookIndex = books.findIndex(b => b.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  const { title, author, category, status } = req.body;

  if (title !== undefined) books[bookIndex].title = title;
  if (author !== undefined) books[bookIndex].author = author;
  if (category !== undefined) books[bookIndex].category = category;
  if (status !== undefined) books[bookIndex].status = status;

  res.status(200).json(books[bookIndex]);
});

// 5. DELETE /api/books/:id - ลบรายการ
app.delete('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const bookIndex = books.findIndex(b => b.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  books.splice(bookIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});