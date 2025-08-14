
import React, { useState, useRef } from 'react';
import './App.css';
import BlurText from './BlurText'; // Importa el componente BlurText

function App() {
  // --------------------------
  // 1️⃣ Estado: posición de cada letra
  // --------------------------
  const [letterPositions, setLetterPositions] = useState([
    { x: 0, y: 0 }, // C
    { x: 0, y: 0 }, // A
    { x: 0, y: 0 }, // R
    { x: 0, y: 0 }, // L
    { x: 0, y: 0 }, // O
    { x: 0, y: 0 }, // T
    { x: 0, y: 0 }  // A
  ]);

  // --------------------------
  // 2️⃣ Refs: referencias a cada letra
  // --------------------------
  const letterRefs = [
    useRef(), useRef(), useRef(), useRef(),
    useRef(), useRef(), useRef()
  ];

  // --------------------------
  // 3️⃣ Letras a mostrar
  // --------------------------
  const letters = ['C', 'A', 'R', 'L', 'O', 'T', 'A'];

  // --------------------------
  // 4️⃣ Función: mover letras según el cursor
  // --------------------------
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

  // --------------------------
  // 5️⃣ Función: volver letra a su posición original
  // --------------------------
  const handleMouseLeave = (letterIndex) => {
    setLetterPositions(prev => {
      const newPositions = [...prev];
      newPositions[letterIndex] = { x: 0, y: 0 };
      return newPositions;
    });
  };

  // --------------------------
  // 6️⃣ Callback BlurText
  // --------------------------
  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  // --------------------------
  // 7️⃣ Renderizado
  // --------------------------
  return (
    <div
      className="App"
      onMouseMove={(e) => {
        letters.forEach((_, index) => handleMouseMove(e, index));
      }}
    >
      <div className="word-container">
        {letters.map((letter, index) => (
          <BlurText
            key={index}
            text={letter}                    // Cada letra individual
            delay={index * 150}              // Retardo progresivo para efecto cascada
            animateBy="letters"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="letter"
            ref={letterRefs[index]}           // Referencia para movimiento del cursor
            style={{
              transform: `translate(${letterPositions[index].x}px, ${letterPositions[index].y}px)`,
              transition: 'transform 0.3s ease-out'
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
