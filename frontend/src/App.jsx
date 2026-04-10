import { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import DescriptionPanel from './components/DescriptionPanel';
import Filters from './components/Filters';
import Metrics from './components/Metrics';
import './App.css';

const today = () => new Date().toISOString().slice(0, 10);

export default function App() {
  const [todos, setTodos] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [dateFilter, setDateFilter] = useState(today());
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetch('/api/todos')
      .then(r => r.json())
      .then(data => setTodos(data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))));
  }, []);

  const selectedTodo = todos.find(t => t.id === selectedId) || null;

  const categories = ['all', ...Array.from(new Set(todos.map(t => t.category).filter(Boolean))).sort()];

  const filteredTodos = todos.filter(todo => {
    if (hideCompleted && todo.completed) return false;
    if (dateFilter && todo.createdAt.slice(0, 10) !== dateFilter) return false;
    if (categoryFilter !== 'all' && (todo.category || null) !== categoryFilter) return false;
    return true;
  });

  async function handleAdd(text) {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const newTodo = await res.json();
    setTodos(prev => [...prev, newTodo]);
  }

  async function handleUpdate(id, changes) {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
    });
    const updated = await res.json();
    setTodos(prev => prev.map(t => t.id === id ? updated : t));
    return updated;
  }

  async function handleDelete(id) {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    setTodos(prev => prev.filter(t => t.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  return (
    <div className="app-layout">
      <div className="main-column">
        <h1 className="app-title">Todo List</h1>
        <Filters
          hideCompleted={hideCompleted}
          onHideCompletedChange={setHideCompleted}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          categories={categories}
        />
        <Metrics todos={filteredTodos} />
        <TodoList
          todos={filteredTodos}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
        <AddTodo onAdd={handleAdd} />
      </div>
      <div className="panel-column">
        <DescriptionPanel todo={selectedTodo} onUpdate={handleUpdate} />
      </div>
    </div>
  );
}
