import React, { useState, useEffect, useRef } from 'react';
import TaskItem from '../components/TaskItem';
import { GOOGLE_SHEETS_CONFIG } from '../config';

const TodoPage = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const todoSectionRef = useRef();

  // Funciones Google Sheets (las tuyas, idénticas)
  const readFromGoogleSheets = async () => { /* tu código */ };
  const writeToGoogleSheets = async (tasks) => { /* tu código */ };

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      const sheetsTasks = await readFromGoogleSheets();
      if (sheetsTasks.length > 0) {
        setTasks(sheetsTasks);
      } else {
        const savedTasks = localStorage.getItem('carlota-tasks');
        if (savedTasks) setTasks(JSON.parse(savedTasks));
      }
      setIsLoading(false);
    };
    loadTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('carlota-tasks', JSON.stringify(tasks));
      writeToGoogleSheets(tasks);
    }
  }, [tasks]);

  // Funciones de interacción (añadir, eliminar, editar, cambiar estado)
  const handleInputSubmit = (e) => { /* tu código */ };
  const changeTaskStatus = (taskId, newStatus) => { /* tu código */ };
  const deleteTask = (taskId) => { /* tu código */ };
  const startEditing = (task) => { /* tu código */ };
  const saveEdit = (taskId) => { /* tu código */ };
  const cancelEdit = () => { /* tu código */ };

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const ongoingTasks = tasks.filter(t => t.status === 'ongoing');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="todo-section" ref={todoSectionRef}>
      <div className="todo-container">
        <div className="todo-header">
          <span className="todo-letter">C</span>
          <h1 className="todo-title">osas por hacer</h1>
          {isLoading && <div className="loading">🔄 Sincronizando...</div>}
        </div>

        <input
          type="text"
          className="todo-input"
          placeholder="Escribe una tarea y presiona Enter..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleInputSubmit}
          autoFocus
        />

        <div className="tasks-container">
          <div className="tasks-section">
            <h3>Por hacer ({todoTasks.length})</h3>
            {todoTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                editingTask={editingTask}
                editValue={editValue}
                setEditValue={setEditValue}
                onStatusChange={changeTaskStatus}
                onDelete={deleteTask}
                onStartEdit={startEditing}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
              />
            ))}
          </div>

          <div className="tasks-section">
            <h3>En proceso ({ongoingTasks.length})</h3>
            {ongoingTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                editingTask={editingTask}
                editValue={editValue}
                setEditValue={setEditValue}
                onStatusChange={changeTaskStatus}
                onDelete={deleteTask}
                onStartEdit={startEditing}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
              />
            ))}
          </div>

          <div className="tasks-section">
            <h3>Completadas ({doneTasks.length})</h3>
            {doneTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                editingTask={editingTask}
                editValue={editValue}
                setEditValue={setEditValue}
                onStatusChange={changeTaskStatus}
                onDelete={deleteTask}
                onStartEdit={startEditing}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoPage;

