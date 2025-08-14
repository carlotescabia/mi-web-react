import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { GOOGLE_SHEETS_CONFIG } from './config';

function App() {
  const [letterPositions, setLetterPositions] = useState(
    Array(7).fill({ x: 0, y: 0 }) // 7 letras para CARLOTA
  );
  
  const [showTodoSection, setShowTodoSection] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const letterRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const todoSectionRef = useRef();
  const letters = ['C', 'A', 'R', 'L', 'O', 'T', 'A'];

  // 🔥 FUNCIONES DE GOOGLE SHEETS
  const readFromGoogleSheets = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.RANGE}?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.values && data.values.length > 1) {
        return data.values.slice(1).map((row, index) => ({
          id: parseInt(row[0]) || Date.now() + index,
          text: row[1] || '',
          status: row[2] || 'todo',
          date: row[3] || new Date().toISOString()
        }));
      }
      return [];
    } catch (error) {
      console.error('Error reading from Google Sheets:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const writeToGoogleSheets = async (tasks) => {
    try {
      const values = [
        ['ID', 'Texto', 'Estado', 'Fecha'],
        ...tasks.map(task => [
          task.id,
          task.text,
          task.status,
          task.date || new Date().toISOString()
        ])
      ];

      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.RANGE}?valueInputOption=RAW&key=${GOOGLE_SHEETS_CONFIG.API_KEY}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ values })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('✅ Datos guardados en Google Sheets');
      return true;
    } catch (error) {
      console.error('❌ Error escribiendo a Google Sheets:', error);
      return false;
    }
  };

  // 🔥 USEEFFECTS - AQUÍ ESTÁN UBICADOS
  // Cargar tareas al iniciar (Google Sheets primero, luego localStorage)
  useEffect(() => {
    const loadTasks = async () => {
      console.log('🔄 Cargando tareas...');
      
      // Intentar cargar desde Google Sheets
      const sheetsTasks = await readFromGoogleSheets();
      
      if (sheetsTasks.length > 0) {
        console.log('✅ Tareas cargadas desde Google Sheets:', sheetsTasks.length);
        setTasks(sheetsTasks);
      } else {
        // Fallback a localStorage
        const savedTasks = localStorage.getItem('carlota-tasks');
        if (savedTasks) {
          const localTasks = JSON.parse(savedTasks);
          console.log('📱 Tareas cargadas desde localStorage:', localTasks.length);
          setTasks(localTasks);
        }
      }
    };
    
    loadTasks();
  }, []); // Se ejecuta una sola vez al cargar

  // Guardar tareas cuando cambien (localStorage + Google Sheets)
  useEffect(() => {
    if (tasks.length > 0) {
      // Guardar en localStorage (inmediato)
      localStorage.setItem('carlota-tasks', JSON.stringify(tasks));
      
      // Sincronizar con Google Sheets (en background)
      writeToGoogleSheets(tasks);
    }
  }, [tasks]); // Se ejecuta cada vez que cambia 'tasks'

  // 🔥 FUNCIONES DE INTERACCIÓN
  const handleMouseMove = (e, letterIndex) => {
    if (showTodoSection) return;
    
    const letterElement = letterRefs[letterIndex].current;
    if (!letterElement) return;

    const rect = letterElement.getBoundingClientRect();
    const letterCenterX = rect.left + rect.width / 2;
    const letterCenterY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const deltaX = mouseX - letterCenterX;
    const deltaY = mouseY - letterCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance < 150) {
      const force = (150 - distance) / 150;
      const moveX = -deltaX * force * 0.8;
      const moveY = -deltaY * force * 0.8;
      
      setLetterPositions(prev => {
        const newPositions = [...prev];
        newPositions[letterIndex] = { x: moveX, y: moveY };
        return newPositions;
      });
    }
  };

  const handleMouseLeave = (letterIndex) => {
    if (showTodoSection) return;
    
    setLetterPositions(prev => {
      const newPositions = [...prev];
      newPositions[letterIndex] = { x: 0, y: 0 };
      return newPositions;
    });
  };

  const handleLetterClick = (letter) => {
    if (letter === 'C') {
      setShowTodoSection(true);
      setTimeout(() => {
        todoSectionRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  const handleInputSubmit = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const newTask = {
        id: Date.now(),
        text: inputValue.trim(),
        status: 'todo',
        date: new Date().toISOString()
      };
      setTasks(prev => [...prev, newTask]);
      setInputValue('');
    }
  };

  const changeTaskStatus = (taskId, newStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, date: new Date().toISOString() }
        : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditValue(task.text);
  };

  const saveEdit = (taskId) => {
    if (editValue.trim()) {
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, text: editValue.trim(), date: new Date().toISOString() }
          : task
      ));
    }
    setEditingTask(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditValue('');
  };

  // Filtrar tareas por estado
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const ongoingTasks = tasks.filter(task => task.status === 'ongoing');
  const doneTasks = tasks.filter(task => task.status === 'done');

  return (
    <div className="App">
      {/* Sección inicial - CARLOTA */}
      <div className={`hero-section ${showTodoSection ? 'with-todo' : ''}`}>
        <div className="word-container" onMouseMove={(e) => {
          letters.forEach((_, index) => handleMouseMove(e, index));
        }}>
          {letters.map((letter, index) => (
            <span
              key={index}
              ref={letterRefs[index]}
              className={`letter ${showTodoSection && letter === 'C' ? 'active-letter' : ''}`}
              style={{
                transform: `translate(${letterPositions[index].x}px, ${letterPositions[index].y}px)`,
                transition: 'transform 0.3s ease-out, color 0.5s ease'
              }}
              onMouseLeave={() => handleMouseLeave(index)}
              onClick={() => handleLetterClick(letter)}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>

      {/* Sección Todo List */}
      {showTodoSection && (
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
              {/* Tareas Por Hacer */}
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

              {/* Tareas En Proceso */}
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

              {/* Tareas Completadas */}
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
      )}
    </div>
  );
}

// Componente para cada tarea individual
function TaskItem({ 
  task, 
  editingTask, 
  editValue, 
  setEditValue,
  onStatusChange, 
  onDelete, 
  onStartEdit, 
  onSaveEdit, 
  onCancelEdit 
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

export default App;
