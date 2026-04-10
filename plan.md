# Todo List App — Implementation Plan

## Tech Stack
- **Frontend**: React (Vite, port 5173), plain CSS
- **Backend**: Node.js + Express (port 4000)
- **Storage**: JSON file (`backend/data/todos.json`)

---

## Project Structure

```
TodoList/
├── backend/
│   ├── server.js           # Express API server
│   ├── data/
│   │   └── todos.json      # Persistent storage
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Root component, state management
│   │   ├── App.css         # Global styles
│   │   ├── components/
│   │   │   ├── TodoList.jsx       # Renders the full list
│   │   │   ├── TodoItem.jsx       # Single todo row (inline edit, complete, delete)
│   │   │   ├── AddTodo.jsx        # Input row for new items
│   │   │   ├── DescriptionPanel.jsx # Right panel, editable description
│   │   │   ├── Filters.jsx        # Hide-completed toggle, date picker, category picker
│   │   │   └── Metrics.jsx        # Active / completed counts
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── plan.md
```

---

## Data Model

Each todo stored in `todos.json` as an array of objects:

```json
{
  "id": "uuid-v4",
  "text": "Work - Fix login bug",
  "category": "work",
  "description": "Free-form text blob...",
  "completed": false,
  "createdAt": "2026-04-10T09:00:00.000Z",
  "completedAt": null
}
```

**Category parsing rule**: If the item text contains a `-`, everything to the left of the *first* hyphen is the category (trimmed, lowercased). If no hyphen, category is `null` (shown under "Uncategorised").

---

## Backend API (Express, port 4000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Return all todos |
| POST | `/api/todos` | Create a new todo |
| PUT | `/api/todos/:id` | Update text, description, completed, category |
| DELETE | `/api/todos/:id` | Delete a todo |

- On every write, serialise the full array back to `todos.json`.
- CORS enabled for `localhost:5173`.

---

## Frontend Features

### 1. Layout
Two-column layout:
- **Left (main)**: filters bar + metrics + todo list + add-item row
- **Right (panel)**: description panel for selected item, empty when nothing is selected

### 2. Todo List
- Items ordered by `createdAt` ascending (oldest first).
- Active items: black text, normal weight.
- Completed items: grey text, strikethrough, remain in their original position.
- Clicking an item selects it (highlights row, loads description panel).

### 3. Add Item
- Text input at the bottom of the list.
- Press Enter or click "Add" to submit.
- Category is parsed automatically from the text on save.

### 4. Inline Edit
- Double-click (or edit icon) on item text to edit in-place.
- Press Enter or click away to save; Escape to cancel.
- Category is re-parsed on save.

### 5. Complete / Delete
- Checkbox on each row toggles completion (sets/clears `completedAt`).
- Trash icon deletes the item.

### 6. Description Panel (right side)
- Shows when an item is selected.
- Editable `<textarea>` — auto-saves on blur.
- Shows the item's full text as a header.
- Empty/blank when nothing is selected.

### 7. Filters Bar
Three controls:

| Control | Behaviour |
|---------|-----------|
| **Hide completed** toggle | When ON, completed items are hidden from the list entirely |
| **Date picker** | Defaults to today; filters the list to items where `createdAt` date matches selected date; clear the date to see all |
| **Category dropdown** | Populated from all distinct categories in the current data; "All" option shows everything; category text is lowercased for comparison |

Filters are applied together (AND logic).

### 8. Metrics
Shown above the list, two counts:

- **Active**: items matching current filters that are not completed
- **Completed**: items matching current filters that are completed

When the date filter is set to today, metrics reflect only today's items. When date filter is cleared, metrics reflect all visible items (after other active filters).

---

## Implementation Steps

### Phase 1 — Backend
1. Initialise `backend/package.json`, install `express`, `cors`, `uuid`.
2. Write `server.js` with all four CRUD endpoints.
3. Seed `todos.json` with an empty array `[]`.

### Phase 2 — Frontend scaffold
4. Scaffold with `npm create vite@latest frontend -- --template react`.
5. Remove boilerplate, set up proxy to `localhost:4000` in `vite.config.js`.

### Phase 3 — Core components
6. `App.jsx` — fetch all todos on mount, hold state, pass down handlers.
7. `TodoList.jsx` + `TodoItem.jsx` — render list, checkbox, delete, inline edit.
8. `AddTodo.jsx` — controlled input, calls POST on submit.
9. `DescriptionPanel.jsx` — textarea, PATCH on blur.

### Phase 4 — Filters & Metrics
10. `Filters.jsx` — hide-completed toggle, date picker (default today), category dropdown.
11. `Metrics.jsx` — derive counts from filtered list.
12. Wire filter state into `App.jsx` and apply all filters before passing list to `TodoList`.

### Phase 5 — Styling
13. Plain CSS: clean minimal style, two-column flex layout, subtle selected-item highlight, strikethrough + grey for completed items.

---

## Category Parsing Logic (shared understanding)

```js
function parseCategory(text) {
  const idx = text.indexOf('-');
  if (idx === -1) return null;
  return text.slice(0, idx).trim().toLowerCase();
}
```

---

## Notes
- No auth, no multi-user.
- `uuid` package used on the backend to generate IDs.
- All dates stored as ISO 8601 UTC strings; date comparison done by comparing `YYYY-MM-DD` substring.
