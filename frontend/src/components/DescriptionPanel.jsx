import { useState, useEffect } from 'react';

export default function DescriptionPanel({ todo, onUpdate, onClose }) {
  const [desc, setDesc] = useState('');

  useEffect(() => {
    setDesc(todo ? (todo.description || '') : '');
  }, [todo?.id, todo?.description]);

  if (!todo) {
    return (
      <div className="description-panel empty">
        <p>Select a todo to view details.</p>
      </div>
    );
  }

  function handleBlur() {
    if (desc !== (todo.description || '')) {
      onUpdate(todo.id, { description: desc });
    }
  }

  return (
    <div className="description-panel">
      <button className="panel-close-btn" onClick={onClose} aria-label="Close panel">&#8592; Back</button>
      <h2 className="panel-title">{todo.text}</h2>
      {todo.category && (
        <div className="panel-category">Category: {todo.category}</div>
      )}
      <div className="panel-meta">
        Created: {new Date(todo.createdAt).toLocaleString()}
        {todo.completedAt && ` · Completed: ${new Date(todo.completedAt).toLocaleString()}`}
      </div>
      <textarea
        className="panel-textarea"
        placeholder="Add a description…"
        value={desc}
        onChange={e => setDesc(e.target.value)}
        onBlur={handleBlur}
      />
    </div>
  );
}
