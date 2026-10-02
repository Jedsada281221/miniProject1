const API_URL = '/api/books';

const bookList = document.getElementById('bookList');
const addBookForm = document.getElementById('addBookForm');
const filterStatus = document.getElementById('filterStatus');

document.addEventListener('DOMContentLoaded', fetchBooks);
filterStatus.addEventListener('change', fetchBooks);

// GET: ดึงรายการหนังสือ
async function fetchBooks() {
  const statusFilter = filterStatus.value;
  let url = API_URL;
  if (statusFilter) {
    url += `?status=${encodeURIComponent(statusFilter)}`;
  }

  try {
    const response = await fetch(url);
    const books = await response.json();
    renderBooks(books);
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}

function renderBooks(books) {
  bookList.innerHTML = '';
  if (books.length === 0) {
    bookList.innerHTML = '<p>ไม่พบรายการหนังสือ</p>';
    return;
  }

  books.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <div class="book-info">
        <h3>${escapeHtml(book.title)}</h3>
        <p>ผู้แต่ง: ${escapeHtml(book.author)} | หมวดหมู่: ${escapeHtml(book.category)}</p>
        <span class="badge badge-${book.status}">${getStatusLabel(book.status)}</span>
      </div>
      <div class="actions">
        <button class="btn btn-edit" onclick="toggleStatus(${book.id}, '${book.status}')">เปลี่ยนสถานะ</button>
        <button class="btn btn-danger" onclick="deleteBook(${book.id})">ลบ</button>
      </div>
    `;
    bookList.appendChild(card);
  });
}

// POST: เพิ่มหนังสือ
addBookForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const newBook = {
    title: document.getElementById('title').value,
    author: document.getElementById('author').value,
    category: document.getElementById('category').value,
    status: document.getElementById('status').value
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook)
    });

    if (response.ok) {
      addBookForm.reset();
      fetchBooks();
    } else {
      const errData = await response.json();
      alert(`ข้อผิดพลาด (${response.status}): ${errData.message}`);
    }
  } catch (error) {
    console.error('Error adding book:', error);
  }
});

// PATCH: แก้ไขสถานะ
async function toggleStatus(id, currentStatus) {
  const nextStatusMap = {
    'unread': 'reading',
    'reading': 'read',
    'read': 'unread'
  };
  const updatedStatus = nextStatusMap[currentStatus];

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: updatedStatus })
    });

    if (response.ok) {
      fetchBooks();
    }
  } catch (error) {
    console.error('Error updating status:', error);
  }
}

// DELETE: ลบรายการ
async function deleteBook(id) {
  if (!confirm('คุณต้องการลบหนังสือเล่มนี้ใช่หรือไม่?')) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (response.status === 204) {
      fetchBooks();
    }
  } catch (error) {
    console.error('Error deleting book:', error);
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'unread': return 'ยังไม่อ่าน';
    case 'reading': return 'กำลังอ่าน';
    case 'read': return 'อ่านแล้ว';
    default: return status;
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}