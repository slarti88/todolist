import { useState, useRef, useEffect } from 'react';

export default function TodoItem({ todo, isSelected, onSelect, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  function startEdit(e) {
    e.stopPropagation();
    setEditText(todo.text);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setEditText(todo.text);
  }

  function commitEdit() {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text) {
      onUpdate(todo.id, { text: trimmed });
    }
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') cancelEdit();
  }

  function toggleComplete(e) {
    e.stopPropagation();
    onUpdate(todo.id, { completed: !todo.completed });
  }

  function handleDelete(e) {
    e.stopPropagation();
    onDelete(todo.id);
  }

  return (
    <li
      className={`todo-item${isSelected ? ' selected' : ''}${todo.completed ? ' completed' : ''}`}
      onClick={onSelect}
    >
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={toggleComplete}
        onClick={e => e.stopPropagation()}
      />
      {editing ? (
        <input
          ref={inputRef}
          className="todo-edit-input"
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          onClick={e => e.stopPropagation()}
        />
      ) : (
        <span className="todo-text" onDoubleClick={startEdit}>
          {todo.text}
        </span>
      )}
      <div className="todo-actions">
        {!editing && (
          <button className="icon-btn edit-btn" title="Edit" onClick={startEdit}>
            ✏️
          </button>
        )}
        <button className="icon-btn delete-btn" title="Delete" onClick={handleDelete}>
          🗑️
        </button>
      </div>
    </li>
  );
}
