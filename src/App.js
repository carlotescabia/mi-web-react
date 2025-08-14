import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [letterPositions, setLetterPositions] = useState([
    { x: 0, y: 0 }, // C
    { x: 0, y: 0 }, // A
    { x: 0, y: 0 }, // R
    { x: 0, y: 0 },  // L
    { x: 0, y: 0 }, // O
    { x: 0, y: 0 }, // T
    { x: 0, y: 0 }  // A
  ]);
  
  const [showTodoSection, setShowTodoSection] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  
  const letterRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const todoSectionRef = useRef();
  const letters = ['C','A','R','L','O','T','A'];

  const handleMouseMove = (e, letterIndex) => {
    if (showTodoSection) return; // No mover letras si estamos en la sección todo
    
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
    if (letter === 'C') { // Cambiamos a L porque no hay C en HOLA
      setShowTodoSection(true);
      // Scroll suave a la sección todo
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
        completed: false
      };
      setTasks(prev => [...prev, newTask]);
      setInputValue('');
    }
  };

  const toggleTask = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="App">
      {/* Sección inicial - HOLA */}
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
              <span className="todo-letter">L</span>
              <input
                type="text"
                className="todo-input"
                placeholder="Escribe una tarea y presiona Enter..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleInputSubmit}
                autoFocus
              />
            </div>
            
            <div className="tasks-container">
              {/* Tareas incompletas */}
              {incompleteTasks.length > 0 && (
                <div className="tasks-section">
                  <h3>Por hacer</h3>
                  {incompleteTasks.map(task => (
                    <div key={task.id} className="task-item incomplete">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="task-checkbox"
                      />
                      <span className="task-text">{task.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tareas completadas */}
              {completedTasks.length > 0 && (
                <div className="tasks-section">
                  <h3>Completadas</h3>
                  {completedTasks.map(task => (
                    <div key={task.id} className="task-item completed">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="task-checkbox"
                      />
                      <span className="task-text">{task.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
