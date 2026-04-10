export default function Filters({
  hideCompleted,
  onHideCompletedChange,
  dateFilter,
  onDateFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
}) {
  return (
    <div className="filters-bar">
      <label className="filter-toggle">
        <input
          type="checkbox"
          checked={hideCompleted}
          onChange={e => onHideCompletedChange(e.target.checked)}
        />
        Hide completed
      </label>

      <label className="filter-date">
        Date:
        <input
          type="date"
          value={dateFilter}
          onChange={e => onDateFilterChange(e.target.value)}
        />
        {dateFilter && (
          <button className="clear-btn" onClick={() => onDateFilterChange('')}>✕</button>
        )}
      </label>

      <label className="filter-category">
        Category:
        <select
          value={categoryFilter}
          onChange={e => onCategoryFilterChange(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All' : cat}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
