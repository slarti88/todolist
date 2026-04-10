import { useState } from 'react';

export default function AddTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  }

  return (
    <form className="add-todo-form" onSubmit={handleSubmit}>
      <input
        className="add-todo-input"
        type="text"
        placeholder="Add a new todo… (prefix with 'Category - ' to categorise)"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button className="add-todo-btn" type="submit">Add</button>
    </form>
  );
}
