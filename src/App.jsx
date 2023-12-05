import React, { useEffect, useState } from 'react';
import './App.css';

// Particle component
const Particle = ({ x, y, velocityX, velocityY }) => {
  const [position, setPosition] = useState({ x, y });
  const [velocity, setVelocity] = useState({ velocityX, velocityY });

  useEffect(() => {
    const updatePosition = () => {
      setPosition((prevPosition) => ({
        x: prevPosition.x + velocity.velocityX,
        y: prevPosition.y + velocity.velocityY,
      }));
    };

    const updateVelocity = () => {
      setVelocity((prevVelocity) => ({
        velocityX: prevVelocity.velocityX,
        velocityY: prevVelocity.velocityY + 0.02
      }));
    };

    const handleBounce = () => {
      if (position.x < 0) {
        setVelocity((prevVelocity) => ({ ...prevVelocity, velocityX: Math.abs(prevVelocity.velocityX) }));
      }
      if (position.x > window.innerWidth-10) {
        setVelocity((prevVelocity) => ({ ...prevVelocity, velocityX: -Math.abs(prevVelocity.velocityX) }));
      }
      if (position.y < 0) {
        setVelocity((prevVelocity) => ({ ...prevVelocity, velocityY: Math.abs(prevVelocity.velocityY) }));
      }
      if (position.y > window.innerHeight-10) {
        setVelocity((prevVelocity) => ({ ...prevVelocity, velocityY: -Math.abs(prevVelocity.velocityY) }));
      }
    };

    const animationId = requestAnimationFrame(() => {
      updatePosition();
      updateVelocity();
      handleBounce();
    });

    return () => cancelAnimationFrame(animationId);
  }, [position, velocity]);

  return (
    <div
      className="particle"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    ></div>
  );
};

// Function to generate a random number within a range
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomVelocity() {
  return getRandomNumber(-2, 2); // Adjust the velocity range as needed
}

// Function to generate a random position
function getRandomPosition() {
  const x = getRandomNumber(0, window.innerWidth);
  const y = getRandomNumber(0, window.innerHeight);
  return { x, y };
}

// Function to generate an array of random particles
const getRandomParticleArray = (numParticles) => {
  const particleArray = [];

  for (let i = 0; i < numParticles; i++) {
    const position = getRandomPosition();
    const velocityX = getRandomVelocity();
    const velocityY = getRandomVelocity();
    particleArray.push(<Particle key={i} x={position.x} y={position.y} velocityX={velocityX} velocityY={velocityY} />);
  }

  return particleArray;
};

// Background component using the particle array
const Background = () => {
  const particleArray = getRandomParticleArray(100); // Adjust the number of particles

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {particleArray}
    </div>
  );
};

// App component
const App = () => (
  <div style={{ position: 'relative' }}>
    <h1 className="header">{}
      THE BALL PIT
    </h1>
    <Background />
  </div>
);

export default App;