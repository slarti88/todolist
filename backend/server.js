const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;
const DATA_FILE = path.join(__dirname, 'data', 'todos.json');

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

function readTodos() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeTodos(todos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8');
}

function parseCategory(text) {
  const idx = text.indexOf('-');
  if (idx === -1) return null;
  return text.slice(0, idx).trim().toLowerCase();
}

// GET /todo-api/todos
app.get('/todo-api/todos', (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

// POST /todo-api/todos
app.post('/todo-api/todos', (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'text is required' });
  }
  const todos = readTodos();
  const newTodo = {
    id: uuidv4(),
    text: text.trim(),
    category: parseCategory(text.trim()),
    description: '',
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
  todos.push(newTodo);
  writeTodos(todos);
  res.status(201).json(newTodo);
});

// PUT /todo-api/todos/:id
app.put('/todo-api/todos/:id', (req, res) => {
  const { id } = req.params;
  const todos = readTodos();
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  const todo = todos[idx];
  const { text, description, completed, category } = req.body;

  if (text !== undefined) {
    todo.text = text.trim();
    todo.category = parseCategory(todo.text);
  }
  if (category !== undefined) {
    todo.category = category;
  }
  if (description !== undefined) {
    todo.description = description;
  }
  if (completed !== undefined) {
    todo.completed = completed;
    todo.completedAt = completed ? (todo.completedAt || new Date().toISOString()) : null;
  }

  todos[idx] = todo;
  writeTodos(todos);
  res.json(todo);
});

// DELETE /todo-api/todos/:id
app.delete('/todo-api/todos/:id', (req, res) => {
  const { id } = req.params;
  const todos = readTodos();
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  todos.splice(idx, 1);
  writeTodos(todos);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
