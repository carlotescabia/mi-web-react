import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  // --------------------------
  // 1️⃣ Estado: posición de cada letra
  // --------------------------
  // Cada letra tiene una posición x,y que se actualiza cuando el cursor se acerca
  // Inicialmente todas las letras están en {x:0, y:0} (posición original)
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
  // useRef nos permite acceder al elemento DOM de cada letra para calcular su posición
  const letterRefs = [
    useRef(), useRef(), useRef(), useRef(),
    useRef(), useRef(), useRef()
  ];

  // --------------------------
  // 3️⃣ Letras a mostrar
  // --------------------------
  // Cambia este array para modificar el texto que aparece
  const letters = ['C', 'A', 'R', 'L', 'O', 'T', 'A'];

  // --------------------------
  // 4️⃣ Función: mover letras según el cursor
  // --------------------------
  const handleMouseMove = (e, letterIndex) => {
    const letterElement = letterRefs[letterIndex].current;
    if (!letterElement) return; // Si el elemento no existe, salir

    const rect = letterElement.getBoundingClientRect();
    const letterCenterX = rect.left + rect.width / 2;
    const letterCenterY = rect.top + rect.height / 2;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Calcular distancia entre el cursor y el centro de la letra
    const deltaX = mouseX - letterCenterX;
    const deltaY = mouseY - letterCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Si el cursor está cerca (menos de 150px), mover la letra
    if (distance < 150) {
      const force = (150 - distance) / 150; // Más cerca = más fuerza
      const moveX = -deltaX * force * 0.8;  // Mover en dirección opuesta
      const moveY = -deltaY * force * 0.8;

      // Actualiza el estado para que React re-renderice la letra en la nueva posición
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
      newPositions[letterIndex] = { x: 0, y: 0 }; // Posición original
      return newPositions;
    });
  };

  // --------------------------
  // 6️⃣ Renderizado
  // --------------------------
  return (
    <div
      className="App"
      onMouseMove={(e) => {
        // Cada vez que muevo el mouse, reviso todas las letras
        letters.forEach((_, index) => handleMouseMove(e, index));
      }}
    >
      <div className="word-container">
        {letters.map((letter, index) => (
          <span
            key={index}                 // Identificador único para cada letra
            ref={letterRefs[index]}      // Referencia al DOM
            className="letter"           // Clase CSS para estilo
            style={{
              transform: `translate(${letterPositions[index].x}px, ${letterPositions[index].y}px)`, // Posición dinámica
              transition: 'transform 0.3s ease-out' // Animación suave al moverse
            }}
            onMouseLeave={() => handleMouseLeave(index)} // Cuando el cursor se aleja
          >
            {letter} 
          </span>
        ))}
      </div>
    </div>
  );
}

export default App;
