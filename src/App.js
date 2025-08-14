import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [letterPositions, setLetterPositions] = useState([
    { x: 0, y: 0 }, // C
    { x: 0, y: 0 }, // A
    { x: 0, y: 0 }, // R
    { x: 0, y: 0 }  // L
    { x: 0, y: 0 }, // O
    { x: 0, y: 0 }, // T
    { x: 0, y: 0 }  //A
  ]);
  
  const letterRefs = [useRef(), useRef(), useRef(), useRef()];
  const letters = ['C', 'A', 'R', 'L', 'O', 'T', 'A'];

  const handleMouseMove = (e, letterIndex) => {
    const letterElement = letterRefs[letterIndex].current;
    if (!letterElement) return;

    const rect = letterElement.getBoundingClientRect();
    const letterCenterX = rect.left + rect.width / 2;
    const letterCenterY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calcular distancia del cursor al centro de la letra
    const deltaX = mouseX - letterCenterX;
    const deltaY = mouseY - letterCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Si el cursor está cerca (menos de 150px), mover la letra
    if (distance < 150) {
      const force = (150 - distance) / 250; // Fuerza inversamente proporcional a la distancia
      const moveX = -deltaX * force * 1.4; // Mover en dirección opuesta al cursor
      const moveY = -deltaY * force * 1.0;
      
      setLetterPositions(prev => {
        const newPositions = [...prev];
        newPositions[letterIndex] = { x: moveX, y: moveY };
        return newPositions;
      });
    }
  };

  const handleMouseLeave = (letterIndex) => {
    // Volver a la posición original cuando el cursor se aleje
    setLetterPositions(prev => {
      const newPositions = [...prev];
      newPositions[letterIndex] = { x: 0, y: 0 };
      return newPositions;
    });
  };

  return (
    <div className="App" onMouseMove={(e) => {
      // Revisar todas las letras en cada movimiento del mouse
      letters.forEach((_, index) => handleMouseMove(e, index));
    }}>
      <div className="word-container">
        {letters.map((letter, index) => (
          <span
            key={index}
            ref={letterRefs[index]}
            className="letter"
            style={{
              transform: `translate(${letterPositions[index].x}px, ${letterPositions[index].y}px)`,
              transition: 'transform 0.3s ease-out'
            }}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}

export default App;
