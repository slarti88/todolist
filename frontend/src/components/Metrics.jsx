export default function Metrics({ todos }) {
  const active = todos.filter(t => !t.completed).length;
  const completed = todos.filter(t => t.completed).length;

  return (
    <div className="metrics-bar">
      <span className="metric active-metric">Active: <strong>{active}</strong></span>
      <span className="metric completed-metric">Completed: <strong>{completed}</strong></span>
    </div>
  );
}
