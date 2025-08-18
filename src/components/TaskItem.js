import React from 'react';

function TaskItem({ 
  task, editingTask, editValue, setEditValue,
  onStatusChange, onDelete, onStartEdit, onSaveEdit, onCancelEdit 
}) {
  const isEditing = editingTask === task.id;

  return (
    <div className={`task-item ${task.status}`}>
      <div className="task-content">
        {isEditing ? (
          <input
            type="text"
            className="task-edit-input"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') onSaveEdit(task.id);
              if (e.key === 'Escape') onCancelEdit();
            }}
            onBlur={() => onSaveEdit(task.id)}
            autoFocus
          />
        ) : (
          <span 
            className="task-text" 
            onDoubleClick={() => onStartEdit(task)}
            title="Doble click para editar"
          >
            {task.text}
          </span>
        )}
      </div>
      
      <div className="task-actions">
        <select 
          className="status-select"
          value={task.status} 
          onChange={(e) => onStatusChange(task.id, e.target.value)}
        >
          <option value="todo">Por hacer</option>
          <option value="ongoing">En proceso</option>
          <option value="done">Completada</option>
        </select>
        
        <button 
          className="delete-btn"
          onClick={() => onDelete(task.id)}
          title="Eliminar tarea"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default TaskItem;

