import TodoItem from './TodoItem';

export default function TodoList({ todos, selectedId, onSelect, onUpdate, onDelete }) {
  if (todos.length === 0) {
    return <div className="todo-empty">No items to show.</div>;
  }
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isSelected={todo.id === selectedId}
          onSelect={() => onSelect(todo.id)}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
