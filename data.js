let books = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    status: "reading"
  },
  {
    id: 2,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    category: "Programming",
    status: "unread"
  },
  {
    id: 3,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    status: "read"
  }
];

let nextId = 4;

module.exports = { 
  books, 
  getNextId: () => nextId++ 
};