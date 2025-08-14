import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [letterPositions, setLetterPositions] = useState([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ]);

  const letterRefs = [
    useRef(), useRef(), useRef(), useRef(),
    useRef(), useRef(), useRef()
  ];

  const letters = ['C', 'A', 'R', 'L', 'O', 'T', 'A'];

  const handleMouseMove = (e, letterIndex) => {
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
    setLetterPositions(prev => {
      const newPositions = [...prev];
      newPositions[letterIndex] = { x: 0, y: 0 };
      return newPositions;
    });
  };

  return (
    <div
      className="App"
      onMouseMove={(e) => letters.forEach((_, i) => handleMouseMove(e, i))}
    >
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
