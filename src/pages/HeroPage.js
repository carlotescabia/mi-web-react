import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroPage = () => {
  const [letterPositions, setLetterPositions] = useState(
    Array(7).fill({ x: 0, y: 0 })
  );
  const letterRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const letters = ['C', 'A', 'R', 'L', 'O', 'T', 'A'];

  const navigate = useNavigate();

  const handleMouseMove = (e, letterIndex) => {
    const letterElement = letterRefs[letterIndex].current;
    if (!letterElement) return;

    const rect = letterElement.getBoundingClientRect();
    const letterCenterX = rect.left + rect.width / 2;
    const letterCenterY = rect.top + rect.height / 2;

    const deltaX = e.clientX - letterCenterX;
    const deltaY = e.clientY - letterCenterY;
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

  const handleLetterClick = (letter) => {
    if (letter === 'C') {
      navigate('/todo'); // redirige a la página Todo
    }
  };

  return (
    <div className="hero-section">
      <div className="word-container" onMouseMove={(e) => {
        letters.forEach((_, index) => handleMouseMove(e, index));
      }}>
        {letters.map((letter, index) => (
          <span
            key={index}
            ref={letterRefs[index]}
            className="letter"
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
  );
};

export default HeroPage;

